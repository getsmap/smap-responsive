smap.core.Param = L.Class.extend({
	
	initialize: function(map) {
		this.map = map;

		$(window).on("hashchange", function(e) {
			smap.event.trigger("hashchange", e);
		});
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