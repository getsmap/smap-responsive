smap.core.Param = L.Class.extend({
	
	initialize: function(map) {
		this.map = map;

		$(window).on("hashchange", (function(e) {
			var p = this._getHashAsObject();
			p._originalEvent = e;
			smap.event.trigger("hashchange", p);
		}).bind(this)  );
		smap.event.on("hashchange", this._onHashChange.bind(this));
	},
	
	_lang: {
		"sv": {
			remove: "Ta bort"
		},
		"en": {
			remove: "Remove"
		}
	},
	
	_setLang: function() {
		langCode = smap.config.langCode;
		if (this._lang) {
			this.lang = this._lang ? this._lang[langCode] : null;
		}
	},

	
	getParams: function() {
		var paramsObject = this._cachedParams || null;
		if (!paramsObject) {
			// Create the params
			paramsObject = this.getWebParamsAsObject();
			if (smap.config) {
				// Only cache params if no params were used in the config
				configParams = smap.config.params || {};
				paramsObject = $.extend({}, utils.objectToUpperCase(configParams), paramsObject);
				this._cachedParams = paramsObject;
			}
		}
		return paramsObject;
	},

	_getHashAsObject: function(hash) {
		hash = hash || location.hash.substring(1);

		var p = utils.paramsStringToObject(hash, true);
		return p;
	},

	/**
	 * Get the original web params, totally unmodified, as object.
	 * @return {Object} The params as an object
	 */
	getWebParamsAsObject: function(sep) {
		sep = sep || "?";
		var p = location.href.split(sep);
		var pString = p.length > 1 ? p[1] : "";
		paramsObject = utils.paramsStringToObject(pString, true);
		return paramsObject;
	},

	getHashParamsAsObject: function() {
		return this.getWebParamsAsObject("#");
	},
	
	createParamsAsObject: function() {
		var c = this.map.getCenter(),
			bl, layer;
		
		var layers = this.map._layers,
			layerId,
			ols = [];
		for (var lid in layers) {
			layer = layers[lid];
			if (!layer || !layer.options || !layer.options.layerId) {
				continue;
			}
			layerId = layer.options.layerId;
			
			if (layer.options.isBaseLayer) {
				bl = layerId;
			}
			else {
				if ($.inArray(layer.options.layerId, ols) === -1) {
					ols.push(layerId);					
				}
			}
		}
		
		var p = {
				zoom: this.map.getZoom(),
				center: [utils.round(c.lng, 5), utils.round(c.lat, 5)],
				ol: ols,
				bl: bl
		};
		if (smap.config.configName) {
			p.config = smap.config.configName;
		}
		
		smap.event.trigger("smap.core.createparams", p);
		
		// Remove all undefined or null values
//		$.map(p, function(i, val) {
//			
//		});
		
		return p;
	},
	
	createParams: function(addRoot) {
		addRoot = addRoot || false; // addRoot can also be a string which will then be used instead of location.href
		
		var p = this.createParamsAsObject();
		
		var pString = "",
			val;
		for (var key in p) {
			val = p[key];
			if (val instanceof Array) {
				if (!val.length) {
					continue;
				}
				val = val.join(",");
			}
			pString += "&" + key + "=" + val;
		}
		pString = pString.substring(1); // remove & 
		if (addRoot) {
			var root = "";
			if (addRoot === true) {
				root = document.URL.split("?")[0] + "?";
			}
			else if (typeof(addRoot) === "string") {
				root = addRoot;
			}
			pString = root + pString;
		}
		return pString;
	},

	_loadGeoJson: function(url, doClustering, zoomToExtent) {
		// Allows map caller to add external GeoJSON data using a parameter

		doClustering = doClustering === false ? false : true;
		zoomToExtent = zoomToExtent || false;

		var layer = this._geoJsonLayer,
			cluster = this._cluster;


		if (cluster) {
			cluster.clearLayers();
		}
		if (layer) {
			layer.clearLayers();
			layer._featureIndexes = [];
			layer.getFeatureUrl = url;
		}
		if (!layer) {
			// Create a layer
			var layerConfig = {
					url: url,
					init: "L.GeoJSON.WFS",
					options: {
						layerId: L.stamp(this),
						displayName: "External data",
						xhrType: "GET",
						attribution: "",
						inputCrs: "EPSG:4326",
						uniqueKey: "id", // Important! This must be set
						selectable: true,
						reverseAxis: false,
						reverseAxisBbox: false,
						showInLayerSwitcher: true,
						geomType: "POINT",
						includeParams: ["bbox"],
						separator: "&",
						noParams: false, // set to true if u don't want to request service again on drag and zoom
						popup: '*',
						style: {
							icon: L.AwesomeMarkers.icon({icon: "circle", markerColor: 'blue', prefix: "fa"})
						}
					}
			};

			// Allow overriding layer options through an smap option.
			layerConfig.options = $.extend(true, layerConfig.options, smap.core.mainConfig.smapOptions.externalJsonOptions);

			// Let the plugins have the last word if they want to override something
			smap.event.trigger("smap.core.createjsonlayer", layerConfig.options);
			layer = smap.core.layerInst._createLayer(layerConfig);
			this._geoJsonLayer = layer;
		}


		// smap.event.trigger("smap.core.beforeaddjsonlayer", layer);

		if (doClustering) {
			if (!cluster) {
				cluster = L.markerClusterGroup();
				this._cluster = cluster;
				this.map.addLayer(cluster);
				
				function refreshLayer() {
					if (this._prevZoom && this._prevZoom < this.map.getZoom()) {
						this._prevZoom = this.map.getZoom();
						return;
					}
					this._prevZoom = this.map.getZoom();
					layer._map = smap.map;
					layer._refresh();
					delete layer._map;
				}
				function onLoad(e) {
					e.target.eachLayer(function(lay) {
						cluster.addLayer(lay);
					});
				}
				this.map.fire("layeradd", {layer: layer, target: layer}); // Enables select and other core functionality
				layer.on("load", onLoad.bind(this));
				this.map.on("zoomend dragend", refreshLayer.bind(this));
			}
			refreshLayer.call(this);
		}
		else {
			this.map.addLayer(layer);
			layer._refresh();
		}
		if (zoomToExtent === true) {
			function funcZoomToExtent(e) {
				var b = e.target.getBounds();
				this.map.fitBounds(b);
			}
			layer.on("load", funcZoomToExtent.bind(this));

		}

		smap.event.trigger("smap.core.addedjsonlayer", [layer, cluster]);
		
	},

	_onHashChange: function(e, p) {
		if (p.GEOJSON) {
			var pGeoJson = p.GEOJSON instanceof Array ? p.GEOJSON : p.GEOJSON.split(",");
			var url = decodeURIComponent(pGeoJson[0]);
			var noClustering = pGeoJson.length > 1 ? (pGeoJson[1].toString().toUpperCase() === "TRUE" ? true : false) : false;
			var zoomToExtent = pGeoJson.length > 2 ? (pGeoJson[2].toString().toUpperCase() === "TRUE" ? true : false) : false;
			this._loadGeoJson(url, !noClustering, zoomToExtent);
		}
	},
	
	applyParams: function(p) {
		p = p || {};
		
		var self = this;
		
		smap.event.trigger("smap.core.beforeapplyparams", p);
		this._setLang();
		
		var zoom = p.ZOOM ? parseInt(p.ZOOM) : 0,
			center = p.CENTER ? L.latLng([parseFloat(p.CENTER[1]), parseFloat(p.CENTER[0])]) : null;
		
		if (!zoom && zoom !== 0) {
			zoom = this.map.options.minZoom || 0;
		}
		if (center) {
			if (p.CENTER.length > 2) {
				var epsgFrom = "EPSG:"+p.CENTER[2];
				var newCenterArr = utils.projectPoint(p.CENTER[0], p.CENTER[1], epsgFrom, "EPSG:4326");
				center = L.latLng(newCenterArr[1], newCenterArr[0]);
			}
			this.map.setView(center, zoom, {animate: false});
		}
		else {
			this.map.fitWorld();
		}

		if (p.XY) {
			/*
			 * e.g. xy=13.0,55.0,A%popup%20text (third parameter is optional)
			 */
			var orgParams = this.getWebParamsAsObject(),
				north = parseFloat(p.XY[1]),
				east = parseFloat(p.XY[0]),
				html = null;
			if (p.XY.length > 2) {
				var thirdParam = p.XY[2];
				html = '<p>'+thirdParam+'</p><button class="btn btn-default smap-core-btn-popup">'+this.lang.remove+'</button>';
				if (p.XY.length > 3) {
					var fourthParam = p.XY[3];
					if (/^EPSG:/.test(fourthParam) != true) {
						// Add "EPSG:" if only number was added
						fourthParam = "EPSG:"+fourthParam;
					}
					var coordsArr = utils.projectPoint(east, north, fourthParam, "EPSG:4326");
					east = coordsArr[0];
					north = coordsArr[1];
				}
			}
			var marker = L.marker([north, east]);
			this.map.addLayer(marker);
			if (!orgParams.CENTER) {
				// Center around marker
				this.map.setView(marker.getLatLng(), orgParams.ZOOM || 16, {animate: false});
			}
			if (html) {
				function onPopupOpen() {
					$(".smap-core-btn-popup").on("click", function() {
						self.map.removeLayer(marker);
						return false;
					});
				}
				this.map.off("popupopen", onPopupOpen).on("popupopen", onPopupOpen);
				marker.bindPopup(html).openPopup();
			}
		}
		var hash = paramsObject._hash = this._getHashAsObject();
		if (hash) {
			this._onHashChange(null, hash);
		}
		
		smap.event.trigger("smap.core.applyparams", p);
	},	
		
//		var selArr = sel instanceof Array ? sel : sel.split(",");
//		var selItem = selArr[0];
//		var itemArr = selItem.split(":"); // We support only one selected feature at this time
//		var layerId = itemArr[0],
//			lng = parseFloat(itemArr[1]);
//			lat = parseFloat(itemArr[2]);
//		var layer = smap.core.layerInst.showLayer(layerId),
//			cPoint = this.map.latLngToContainerPoint(L.latLng(lat, lng));
//		
//		layer.on("load", function() {
//			var clickEvent= document.createEvent('MouseEvents');
//			clickEvent.initMouseEvent(
//				'click', true, true, window, 0,
//				0, 0, cPoint.x, cPoint.y, false, false,
//				false, false, 0, null
//			);
//			document.elementFromPoint(cPoint.x, cPoint.y).dispatchEvent(clickEvent);
//		});
			
	CLASS_NAME: "smap.core.Param"
		
});