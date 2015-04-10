/*
	Leaflet.print, implements the Mapfish print protocol allowing a Leaflet map to be printed using either the Mapfish or GeoServer print module.
	(c) 2013, Adam Ratcliffe, GeoSmart Maps Limited
*/

L.print = L.print || {};

L.print.Provider = L.Class.extend({

	includes: L.Mixin.Events,

	statics: {
		MAX_RESOLUTION: 156543.03390625,
		MAX_EXTENT: [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
		SRS: 'EPSG:3857',
		INCHES_PER_METER: 39.3701, //*1.77,
		DPI: 170, //72,
		UNITS: 'm'
	},

	options: {
		autoLoad: false,
		autoOpen: true,
		// outputFormat: 'pdf',
		// outputFilename: 'leaflet-map',
		method: 'POST',
		rotation: 0,
		customParams: {},
		legends: false
	},

	initialize: function (options) {
		if (L.version <= '0.5.1') {
			throw 'Leaflet.print requires Leaflet 0.6.0+. Download latest from https://github.com/Leaflet/Leaflet/';
		}

		var context;

		options = L.setOptions(this, options);

		if (options.map) {
			this.setMap(options.map);
		}

		if (options.capabilities) {
			this._capabilities = options.capabilities;
		} else if (this.options.autoLoad) {
			this.loadCapabilities();
		}

		if (options.listeners) {
			if (options.listeners.context) {
				context = options.listeners.context;
				delete options.listeners.context;
			}
			this.addEventListener(options.listeners, context);
		}
	},

	loadCapabilities: function () {
		if (!this.options.url) {
			return;
		}

		var url = this.options.url;

		if (url.length && url.charAt(url.length-1) === "/") {
			url = url.substring(0, url.length-1);
		}

		url = url + '/info.json';
		if (this.options.proxy) {
			url = this.options.proxy + url;
		}

		return $.ajax({
			type: 'GET',
			dataType: 'json',
			url: url,
			context: this,
			success: L.Util.bind(this.onCapabilitiesLoad, this),
			error: function(a, b, c) {
				this.fire("oncapabilitiesloaderror", {text: b});
			}
		});
	},

	/**
	 * Web Mercator's scale is only valid for distance calculation
	 * at the equator. Therefore, we need to correct based on our
	 * latitude.
	 * @return {Integer} The corrected scale – i.e. where you can measure 
	 * on the print-out and multiply by the scale to get the real-world 
	 * distance value – well, that's what I thought a scale was for...)
	 */
	_getMercatorScaleForLat: function() {
		var lat = this._map.getCenter().lat;
		var scale = this._getScale()
		var coeff = 1 / Math.cos(lat*Math.PI/180);
		scale = parseInt(Math.round(scale / coeff)); // modify scale for our latitude
		return scale;
	},

	_getPxScaleDist: function(realM) {
		// Find a suitable width of the home-brewed scale bar.
		var scale = this._getMercatorScaleForLat();
		function calcPxsInMap(realWorldMeters) {
			var paperWidthPx = 595,
				paperWidthM = 0.21;
			var pxsInMap = paperWidthPx / paperWidthM * realWorldMeters / scale;
			return pxsInMap;
		}

		var pxsInMap = 0,
			m = 10,
			c;
		while ( 100 > pxsInMap && !(pxsInMap > 300))  {
			c = Math.pow(10, m.toString().length-1);
			m += c;
			pxsInMap = calcPxsInMap(m);
		}
		return {m: m, px: pxsInMap};
	},

	print: function (options) {
		options = L.extend(L.extend({}, this.options), options);

		if (!options.layout || !options.dpi) {
			throw 'Must provide a layout name and dpi value to print';
		}

		this.fire('beforeprint', {
			provider: this,
			map: this._map
		});

		// var pxDist = this._getPxScaleDist();

		var jsonData = JSON.stringify(L.extend({
			units: L.print.Provider.UNITS,
			srs: L.print.Provider.SRS,
			layout: options.layout,
			dpi: options.dpi,
			// outputFormat: options.outputFormat,
			comment: options.comment,
			mapTitle: options.mapTitle,
			displayscale: options.displayscale ? options.displayscale + this._getMercatorScaleForLat() : this._getMercatorScaleForLat(),
			// outputFilename: options.outputFilename,
			layers: this._encodeLayers(this._map),
			pages: [{
				center: this._projectCoords(L.print.Provider.SRS, this._map.getCenter()),
				scale: this._getScale(),
				rotation: options.rotation,
				copy: options.copy
			}],
			legends: options.legends
		}, this.options.customParams,options.customParams,this._makeLegends(this._map))),
			url;

		if (options.method === 'GET') {
			url = this._capabilities.printURL + '?spec=' + encodeURIComponent(jsonData);

			if (options.proxy) {
				url = options.proxy + encodeURIComponent(url);
			}

			window.open(url);

			this.fire('print', {
				provider: this,
				map: this._map
			});
		} else {
			url = this._capabilities.createURL;

			if (options.proxy) {
				url = options.proxy + url;
			}

			if (this._xhr) {
				this._xhr.abort();
			}
			this.fire('print', {
				provider: this,
				map: this._map
			});
			this._xhr = $.ajax({
				type: 'POST',
				contentType: 'application/json; charset=UTF-8',
				processData: false,
				dataType: 'json',
				url: url,
				data: jsonData,
				success: L.Util.bind(this.onPrintSuccess, this),
				error: L.Util.bind(this.onPrintError, this)
			});
		}

		// Remove temporary added layers and again add removed layers
		var lay;
		for (var i=0,len=this._tempAddedLayers.length; i<len; i++) {
			lay = this._tempAddedLayers[i];
			this._map.removeLayer(lay);
		}

		// while (this._tempAddedLayers.length) {
		// 	this._map.removeLayer(this._tempAddedLayers.pop());
		// }
		// while (this._tempRemovedLayers.length) {
		// 	this._map.addLayer(this._tempRemovedLayers.pop());
		// }
		this._tempRemovedLayers = [];
		this._tempAddedLayers = [];

	},

	getCapabilities: function () {
		return this._capabilities;
	},

	setMap: function (map) {
		this._map = map;
	},

	setDpi: function (dpi) {
		var oldDpi = this.options.dpi;

		if (oldDpi !== dpi) {
			this.options.dpi = dpi;
			this.fire('dpichange', {
				provider: this,
				dpi: dpi
			});
		}
	},

	setLayout: function (name) {
		var oldName = this.options.layout;

		if (oldName !== name) {
			this.options.layout = name;
			this.fire('layoutchange', {
				provider: this,
				layout: name
			});
		}
	},

	setRotation: function (rotation) {
		var oldRotation = this.options.rotation;

		if (oldRotation !== this.options.rotation) {
			this.options.rotation = rotation;
			this.fire('rotationchange', {
				provider: this,
				rotation: rotation
			});
		}
	},

	_getLayers: function (map) {
		var markers = [],
			vectors = [],
			tiles = [],
			imageOverlays = [],
			imageNodes,
			pathNodes,
			id;

		this._tempRemovedLayers = [];
		this._tempAddedLayers = [];

		for (id in map._layers) {
			if (map._layers.hasOwnProperty(id)) {
				if (!map._layers.hasOwnProperty(id)) { continue; }
				var lyr = map._layers[id];
				if (lyr.options && lyr.options.printLayer) {
					// Temporary replace the layer with the printLayer (add back after print)
					var t = $.extend(true, {}, lyr.options.printLayer);
					var layerClass = eval(t.init);
					this._tempRemovedLayers.push(lyr);
					lyr = null;
					delete lyr;


					var lyr = new layerClass(t.url, t.options);
					map.addLayer(lyr);
					var pOptions = lyr.wmsParams;
					// if (t.url && t.url.search("arcgis/services") > -1) {
					// Bug fix: #156 printing some arcgis layers. Solved by removing irrelvant attributes (which will otherwise go to the request)
					var arr = ["service", "request", "version", "layers", "styles", "format", "width", "height", "bbox",
										"angle", "buffer", "cql_filter", "env", "featureid", "filter", "format_options", "maxfeatures", "namespace",
										"palette", "propertyname", "tiled", "tilesorigin", "scalemethod",
										"srs", "map_resolution"]; // "transparent" - creates a problem with arcgis layers
					var newOptions = {};
					var kLow;
					for (var k in pOptions) {
						kLow = k.toLowerCase();
						if ( $.inArray(kLow, arr) > -1 ) {
							newOptions[kLow] = pOptions[k];
						}
					}
					pOptions = newOptions;
					// pOptions = _.pick(newOptions, arr);

					// lyr.setZIndex(150);
					if (lyr.options.printParams) {
						// Allow overriding params
						$.extend(pOptions, lyr.options.printParams);
					}
					// Assign cleaned parameters to the layer
					lyr.wmsParams = $.extend(true, {}, pOptions);
					
					// }
					this._tempAddedLayers.push(lyr);
				}

				if ( lyr._container && (lyr instanceof L.TileLayer.WMS || lyr instanceof L.TileLayer)) {
					tiles.push(lyr);
				} else if (lyr instanceof L.ImageOverlay) {
					imageOverlays.push(lyr);
				} else if (lyr instanceof L.Marker) {
					markers.push(lyr);
				} else if (lyr instanceof L.Path && lyr.toGeoJSON) {
					vectors.push(lyr);
				}
			}
		}
		// Remove layers which have a print layer. We must do it after the for-loop
		// or the for-loop will be messed up (leaving out some layers).
		var lay, layId;
		for (var i=0,len=this._tempRemovedLayers.length; i<len; i++) {
			lay = this._tempRemovedLayers[i];
			map.addLayer(lay);
		}

		markers.sort(function (a, b) {
			return a._icon.style.zIndex - b._icon.style.zIndex;
		});

		function getZIndexFromMarker(marker) {
			// Don't know which style is correct. Seems like the 
			// latter works but in original was zIndex.
			return parseInt( marker._icon.style.zIndex || marker._icon.style["z-index"] );
		}

		var i;
		// Layers with equal zIndexes can cause problems with mapfish print
		for(i = 1;i<markers.length;i++){
			var z0 = getZIndexFromMarker(markers[i]);
			var z1 = getZIndexFromMarker(markers[i - 1]) + 1;
			if(z0 <= z1) {
				markers[i]._icon.style.zIndex = z1;
				markers[i]._icon.style["z-index"] = z1;
			}
		}

		tiles.sort(function (a, b) {
			return a._container.style.zIndex - b._container.style.zIndex;
		});

		// Layers with equal zIndexes can cause problems with mapfish print
		for(i = 1;i<tiles.length;i++){
			if(tiles[i]._container.style.zIndex <= tiles[i - 1]._container.style.zIndex){
				tiles[i]._container.style.zIndex = tiles[i - 1]._container.style.zIndex + 1;
			}
		}

		imageNodes = [].slice.call(this, map._panes.overlayPane.childNodes);
		imageOverlays.sort(function (a, b) {
			return $.inArray(a._image, imageNodes) - $.inArray(b._image, imageNodes);
		});

		if (map._pathRoot) {
			pathNodes = [].slice.call(this, map._pathRoot.childNodes);
			vectors.sort(function (a, b) {
				return $.inArray(a._container, pathNodes) - $.inArray(b._container, pathNodes);
			});
		}

		return tiles.concat(vectors).concat(imageOverlays).concat(markers);
	},

	_getScale: function () {
		var map = this._map,
			bounds = map.getBounds(),
			inchesKm = L.print.Provider.INCHES_PER_METER * 1000,
			scales = this._capabilities.scales,
			sw = bounds.getSouthWest(),
			ne = bounds.getNorthEast(),
			halfLat = (sw.lat + ne.lat) / 2,
			midLeft = L.latLng(halfLat, sw.lng),
			midRight = L.latLng(halfLat, ne.lng),
			mwidth = midLeft.distanceTo(midRight),
			pxwidth = map.getSize().x,
			kmPx = mwidth / pxwidth / 1000,
			mscale = (kmPx || 0.000001) * inchesKm * L.print.Provider.DPI,
			closest = Number.POSITIVE_INFINITY,
			i = scales.length,
			diff,
			scale;
		while (i--) {
			diff = Math.abs(mscale - scales[i].value);
			if (diff < closest) {
				closest = diff;
				scale = parseInt(scales[i].value, 10);
			}
		}
		return scale;
	},

	_getLayoutByName: function (name) {
		var layout, i, l;

		for (i = 0, l = this._capabilities.layouts.length; i < l; i++) {
			if (this._capabilities.layouts[i].name === name) {
				layout = this._capabilities.layouts[i];
				break;
			}
		}
		return layout;
	},

	_encodeLayers: function (map) {
		var enc = [],
			vectors = [],
			layer,
			i;

		var layers = this._getLayers(map);
		for (i = 0; i < layers.length; i++) {
			layer = layers[i];
			if (layer instanceof L.TileLayer.WMS) {
				enc.push(this._encoders.layers.tilelayerwms.call(this, layer));
			} else if (layer instanceof L.mapbox.TileLayer){
				enc.push(this._encoders.layers.tilelayermapbox.call(this,layer));
			} else if (layer instanceof L.TileLayer) {
				if (layer.options.tms) {
					enc.push(this._encoders.layers.TMS.call(this, layer));
				}
				else {
					enc.push(this._encoders.layers.tilelayer.call(this, layer));
				}
			} else if (layer instanceof L.ImageOverlay) {
				enc.push(this._encoders.layers.image.call(this, layer));
			} else if (layer instanceof L.Marker || (layer instanceof L.Path && layer.toGeoJSON)) {
				if (!layer.options._noprint) {
					// Don't include features with noprint
					vectors.push(layer);
				}
			}
		}
		if (vectors.length) {
			enc.push(this._encoders.layers.vector.call(this, vectors));
		}
		return enc;
	},

	_makeLegends: function(map,options){
		if(!this.options.legends){
			return [];
		}

		var legends = [],legendReq,singlelayers,url,i;

		var layers = this._getLayers(map);
		var layer,oneLegend;
		for (i = 0; i < layers.length; i++) {
			layer = layers[i];
			if (layer instanceof L.TileLayer.WMS) {

				oneLegend = {
					name: layer.options.title || layer.wmsParams.layers,
					classes: []
				};

				// defaults
				legendReq = {
					'SERVICE'	 : 'WMS',
					'LAYER'	   : layer.wmsParams.layers,
					'REQUEST'	 : 'GetLegendGraphic',
					'VERSION'	 : layer.wmsParams.version,
					'FORMAT'	  : layer.wmsParams.format,
					'STYLE'	   : layer.wmsParams.styles,
					'WIDTH'	   : 15,
					'HEIGHT'	  : 15
				};

				legendReq = L.extend(legendReq,options);
				url = L.Util.template(layer._url);

				singlelayers = layer.wmsParams.layers.split(',');

				// If a WMS layer doesn't have multiple server layers, only show one graphic
				if(singlelayers.length === 1){
					oneLegend.icons = [this._getAbsoluteUrl(url + L.Util.getParamString(legendReq, url, true))];
				}else{
					for(i = 0;i<singlelayers.length;i++){
						legendReq.LAYER = singlelayers[i];
						oneLegend.classes.push({
							name:singlelayers[i],
							icons:[this._getAbsoluteUrl(url + L.Util.getParamString(legendReq, url, true))]
						});
					}
				}

				legends.push(oneLegend);
			}
		}

		return {legends:legends};
	},

	_encoders: {
		layers: {
			httprequest: function (layer) {
				var baseUrl = layer._url;

				if (baseUrl.indexOf('{s}') !== -1) {
					baseUrl = baseUrl.replace('{s}', layer.options.subdomains[0]);
				}
				baseUrl = this._getAbsoluteUrl(baseUrl);

				return {
					baseURL: baseUrl,
					opacity: layer.options.opacity
				};
			},
			TMS: function(layer) {
				var enc = this._encoders.layers.tilelayer.call(this, layer);
				return $.extend(enc, {
					type : 'TMS',
					format : enc.extension,
					layer: layer.options.layer
				});
			},
			tilelayer: function (layer) {
				var enc = this._encoders.layers.httprequest.call(this, layer),
					baseUrl = layer.options.baseUrl || layer._url.substring(0, layer._url.indexOf('{z}') > 0 ? layer._url.indexOf('{z}') : layer._url.length),
					resolutions = [],
					zoom;

				// If using multiple subdomains, replace the subdomain placeholder
				if (baseUrl.indexOf('{s}') !== -1) {
					baseUrl = baseUrl.replace('{s}', layer.options.subdomains[0]);
				}

				for (zoom = 0; zoom <= layer.options.maxZoom; ++zoom) {
					resolutions.push(L.print.Provider.MAX_RESOLUTION / Math.pow(2, zoom));
				}

				var ext = layer._url.split(".");
				ext = ext.length > 1 ? ext[ext.length-1].toLowerCase() : null;
				if (ext.search(/[^a-zA-Z0-9]/) > -1) {
					// No extension provided
					ext = "";
				}

				return L.extend(enc, {
					// XYZ layer type would be a better fit but is not supported in mapfish plugin for GeoServer
					// See https://github.com/mapfish/mapfish-print/pull/38
					type: 'OSM',
					baseURL: baseUrl,
					extension: ext || 'png',
					tileSize: [layer.options.tileSize, layer.options.tileSize],
					maxExtent: L.print.Provider.MAX_EXTENT,
					resolutions: resolutions,
					singleTile: false
				});
			},
			tilelayerwms: function (layer) {
				var enc = this._encoders.layers.httprequest.call(this, layer),
					layerOpts = layer.options,
					p;

				L.extend(enc, {
					type: 'WMS',
					layers: [layerOpts.layers].join(',').split(',').filter(function(x){return x !== "";}), //filter out empty strings from the array
					format: layerOpts.format,
					styles: [layerOpts.styles].join(',').split(',').filter(function(x){return x !== "";}),
					singleTile: true
				});

				for (p in layer.wmsParams) {
					if (layer.wmsParams.hasOwnProperty(p)) {
						if ('detectretina,format,height,layers,request,service,srs,styles,version,width'.indexOf(p.toLowerCase()) === -1) {
							if (!enc.customParams) {
								enc.customParams = {};
							}
							enc.customParams[p] = layer.wmsParams[p];
						}
					}
				}
				return enc;
			},
			tilelayermapbox: function(layer) {
				var resolutions = [], zoom;

				for (zoom = 0; zoom <= layer.options.maxZoom; ++zoom) {
					resolutions.push(L.print.Provider.MAX_RESOLUTION / Math.pow(2, zoom));
				}

				return {
					// XYZ layer type would be a better fit but is not supported in mapfish plugin for GeoServer
					// See https://github.com/mapfish/mapfish-print/pull/38
					type: 'OSM',
					baseURL: layer.options.tiles[0].substring(0,layer.options.tiles[0].indexOf('{z}')),
					opacity:layer.options.opacity,
					extension: 'png',
					tileSize: [layer.options.tileSize, layer.options.tileSize],
					maxExtent: L.print.Provider.MAX_EXTENT,
					resolutions: resolutions,
					singleTile: false
				};
			},
			image: function (layer) {
				return {
					type: 'Image',
					opacity: layer.options.opacity,
					name: 'image',
					baseURL: this._getAbsoluteUrl(layer._url),
					extent: this._projectBounds(L.print.Provider.SRS, layer._bounds)
				};
			},
			vector: function (features) {
				var encFeatures = [],
					encStyles = {},
					opacity,
					feature,
					style,
					dictKey,
					dictItem = {},
					styleDict = {},
					styleName,
					nextId = 1,
					featureGeoJson,
					i, l;

				for (i = 0, l = features.length; i < l; i++) {
					feature = features[i];

					if (feature instanceof L.Marker && !feature.options.label) {
						var icon = feature.options.icon;
						if (!icon.options.iconSize) {
							icon.options.iconSize = [0, 0];
						}
						if (!icon.options.iconAnchor) {
							icon.options.iconAnchor = [0, 0];
						}
						var iconUrl = icon.options.iconUrl || L.Icon.Default.imagePath + '/marker-icon.png',
							iconSize = L.Util.isArray(icon.options.iconSize) ? new L.Point(icon.options.iconSize[0], icon.options.iconSize[1]) : icon.options.iconSize,
							iconAnchor = L.Util.isArray(icon.options.iconAnchor) ? new L.Point(icon.options.iconAnchor[0], icon.options.iconAnchor[1]) : icon.options.iconAnchor,
							scaleFactor = (this.options.dpi / L.print.Provider.DPI);

						style = {
							externalGraphic: this._getAbsoluteUrl(iconUrl),
							graphicWidth: (iconSize.x / scaleFactor),
							graphicHeight: (iconSize.y / scaleFactor),
							graphicXOffset: (-iconAnchor.x / scaleFactor),
							graphicYOffset: (-iconAnchor.y / scaleFactor)
						};
					} else {
						style = this._extractFeatureStyle(feature);
					}

					dictKey = JSON.stringify(style);
					dictItem = styleDict[dictKey];
					if (dictItem) {
						styleName = dictItem;
					} else {
						styleDict[dictKey] = styleName = nextId++;
						encStyles[styleName] = style;
					}

					featureGeoJson = (feature instanceof L.Circle) ? this._circleGeoJSON(feature) : feature.toGeoJSON();
					featureGeoJson.geometry.coordinates = this._projectCoords(L.print.Provider.SRS, featureGeoJson.geometry.coordinates);
					featureGeoJson.properties._leaflet_style = styleName;

					// All markers will use the same opacity as the first marker found
					if (opacity === null) {
						opacity = feature.options.opacity || 1.0;
					}

					encFeatures.push(featureGeoJson);
				}

				return {
					type: 'Vector',
					styles: encStyles,
					opacity: opacity,
					styleProperty: '_leaflet_style',
					geoJson: {
						type: 'FeatureCollection',
						features: encFeatures
					}
				};
			}
		}
	},

	_circleGeoJSON: function (circle) {
		var projection = circle._map.options.crs.projection;
		var earthRadius = 1, i;

		if (projection === L.Projection.SphericalMercator) {
			earthRadius = 6378137;
		} else if (projection === L.Projection.Mercator) {
			earthRadius = projection.R_MAJOR;
		}
		var cnt = projection.project(circle.getLatLng());
		var scale = 1.0 / Math.cos(circle.getLatLng().lat * Math.PI / 180.0);
		var points = [];
		for (i = 0; i < 64; i++) {
			var radian = i * 2.0 * Math.PI / 64.0;
			var shift = L.point(Math.cos(radian), Math.sin(radian));
			points.push(projection.unproject(cnt.add(shift.multiplyBy(circle.getRadius() * scale / earthRadius))));
		}
		return L.polygon(points).toGeoJSON();
	},

	_extractFeatureStyle: function (feature) {
		var options = feature.options;

		// From smap4 (working)
		// cursor: "pointer"
		// fillColor: "#ff5b00"
		// fillOpacity: 0.3
		// graphicName: "square"
		// pointRadius: 6
		// strokeColor: "#ff5b00"
		// strokeOpacity: 1
		// strokeWidth: 4


		if (options.radius) {
			options.strokeWidth = options.radius;
			options.strokeColor = options.fillColor;
		}


		var style = {
			stroke: options.stroke,
			strokeColor: options.color,
			strokeWidth: options.weight,
			strokeOpacity: options.opacity,
			strokeLinecap: 'round',
			pointRadius: options.radius,
			fill: options.fill,
			fillColor: options.fillColor,
			fillOpacity: options.fillOpacity,
			graphicZIndex: options.zIndex,
			graphicWidth: options.graphicWidth,
			graphicHeight: options.graphicHeight,
			label: options.label,
			name: "The layer name"
		};

		// Convert all null values to undefined (otherwise Mapfish Print error)
		var key, val,
			out = {};
		for (key in style) {
			val = style[key];
			if (val === null) {
				val = undefined;
			}
			out[key] = val;
		}
		return out;


		// cursor: "pointer"
		// fillColor: "#00FFFF"
		// fillOpacity: 0.3
		// graphicName: "circle"
		// graphicZIndex: 499
		// pointRadius: 6
		// strokeColor: "#00FFFF"
		// strokeOpacity: 1
		// strokeWidth: 4
	},

	_getAbsoluteUrl: function (url) {
		var a;

		if (L.Browser.ie) {
			a = document.createElement('a');
			a.style.display = 'none';
			document.body.appendChild(a);
			a.href = url;
			document.body.removeChild(a);
		} else {
			a = document.createElement('a');
			a.href = url;
		}
		return a.href;
	},

	_projectBounds: function (crs, bounds) {
		var sw = bounds.getSouthWest(),
			ne = bounds.getNorthEast();

		return this._projectCoords(crs, sw).concat(this._projectCoords(crs, ne));
	},

	_projectCoords: function (crs, coords) {
		var crsKey = crs.toUpperCase().replace(':', ''),
			crsClass = L.CRS[crsKey];

		if (!crsClass) {
			throw 'Unsupported coordinate reference system: ' + crs;
		}

		return this._project(crsClass, coords);
	},

	_project: function (crsClass, coords) {
		var projected,
			pt,
			i, l;

		if (typeof coords[0] === 'number') {
			coords = new L.LatLng(coords[1], coords[0]);
		}

		if (coords instanceof L.LatLng) {
			pt = crsClass.project(coords);
			return [pt.x, pt.y];
		} else {
			projected = [];
			for (i = 0, l = coords.length; i < l; i++) {
				projected.push(this._project(crsClass, coords[i]));
			}
			return projected;
		}
	},

	// --------------------------------------------------
	// Event handlers
	// --------------------------------------------------

	onCapabilitiesLoad: function (response) {
		this._capabilities = response;

		if (!this.options.layout) {
			this.options.layout = this._capabilities.layouts[0].name;
		}

		if (!this.options.dpi) {
			this.options.dpi = this._capabilities.dpis[0].value;
		}

		this.fire('capabilitiesload', {
			provider: this,
			capabilities: this._capabilities
		});
	},

	onPrintSuccess: function (response) {
		var url = response.getURL + (L.Browser.ie ? '?inline=true' : '');

		if (this.options.autoOpen) {
			if (L.Browser.ie) {
				window.open(url);
			} else {
				window.location.href = url;
			}
		}

		this._xhr = null;

		this.fire('printsuccess', {
			provider: this,
			response: response
		});
	},

	onPrintError: function (jqXHR) {
		this._xhr = null;

		this.fire('printexception', {
			provider: this,
			response: jqXHR
		});
	}
});

L.print.provider = function (options) {
	return new L.print.Provider(options);
};

