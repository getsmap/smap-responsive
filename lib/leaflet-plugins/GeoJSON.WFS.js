L.GeoJSON.WFS = L.GeoJSON.extend({
	
	CLASS_NAME: "L.GeoJSON.WFS",
	 
	options: {
		uniqueKey: "",
		noBindZoom: false,
		noBindDrag: false,
		xhrType: "POST",
		params: {
			typeName: null, // required
			service: "WFS",
			version: "1.1.0",
			request: "GetFeature",
			srsName: "EPSG:4326",
			format: "text/geojson",
			maxFeatures: 10000,
			outputFormat: "json"
		},
		selectStyle: {
			weight: 5,
	        color: '#00FFFF',
	        opacity: 1
		}
	},
	
	/**
	 * Keeps track of if a feature has been added or not
	 * by storing its unique id: feature.id.
	 */
	_featureIndexes: [],
	
	initialize: function(serviceUrl, options) {
		options = options || {};
		
		options = $.extend(true, {}, this.options, options);
		
		L.GeoJSON.prototype.initialize.call(this, null, options);
		
		// if (options.proxy || L.GeoJSON.WFS.proxy) {
		// 	this.proxy = options.proxy || L.GeoJSON.WFS.proxy || null;
		// }
		this._featureIndexes = [];
		this.getFeatureUrl = serviceUrl;
	},
	
	onAdd: function(map) {
		L.LayerGroup.prototype.onAdd.call(this, map);
		
		this._refresh();
		this._bindEvents(map);
	},
	
	onRemove: function(map) {
		if (this.xhr) {
			this.xhr.abort();
			this.xhr = null;
			this.fire("loadcancel", {layer: this});
		}
		this._unbindEvents(map);
		L.GeoJSON.prototype.onRemove.call(this, map);
	},
	
	_onZoomEnd: function() {
		if (this._prevZoom > this._map.getZoom()) {
			this._refresh();
		}
		this._prevZoom = this._map.getZoom();
	},
	
	_bindEvents: function(map) {
		var self = this;
		
		this.__refresh = this.__refresh || $.proxy(this._refresh, this);
		this.__onZoomEnd = this.__onZoomEnd || $.proxy(this._onZoomEnd, this);
		
		if (!this.options.noBindDrag) {
			map.on("dragend", this.__refresh);
		}

		// Only refresh is last zoom was higher than current (i.e. map zoomed out)
		if (!this.options.noBindZoom) {
			var self = this;
			this._prevZoom = map.getZoom();
			map.on("zoomend", this.__onZoomEnd);
		}
	},
	
	_unbindEvents: function(map) {
		map.off("dragend", this.__refresh);
		map.off("zoomend", this.__onZoomEnd);
	},
	
	
	/**
	 * Overriding method so that features are added only if they are 
	 * not already added. An array keeps track of the ids to know
	 * if a feature has already been added.
	 *  
	 * @param geojson
	 * @returns
	 */
	addData: function (geojson) {
		var features = L.Util.isArray(geojson) ? geojson : geojson.features,
		    i, len, feature, fid,
		    uniqueKey = this.options.uniqueKey;
		if (features) {
			var featureIndexes = this._featureIndexes,
				addData = this.addData;
			for (i=0, len=features.length; i<len; i++) {
				// Only add this if geometry or geometries are set and not null
				feature = features[i];
				var uniqueVal = "";
				if (uniqueKey) {
					uniqueKeyArr = uniqueKey.split(";");
					var props = feature.properties;
					$.each(uniqueKeyArr, function(i, val) {
						uniqueVal += (""+props[val]);
					});
				}
				else {
					uniqueVal = feature.id;
				}
				if ((feature.geometries || feature.geometry || feature.features || feature.coordinates)
						&& $.inArray(uniqueVal, featureIndexes) === -1 && this) {
					addData.call(this, feature);
					featureIndexes.push(uniqueVal);
				}
			}
			return this;
		}

		var options = this.options;
//		if (options.filter && !options.filter(geojson)) { return; }
		
		var isPointLayer = !options.pointToLayer && geojson.geometry && (geojson.geometry.type === "MultiPoint" || geojson.geometry.type === "Point");
		if (isPointLayer && !options.pointToLayer && options.style) {
			var func;
			if (options.style.icon) {
				// Create a marker with an icon with given options
				func = function(feature, latLng) {
					return L.marker(latLng, {
	     				icon: L.icon(options.style.icon)
	     			});
				}
			}
			else {
				func = function(feature, latLng) {
					return L.circleMarker(latLng, options.style);
				};
			}
			options.pointToLayer = func;
	    }
		
		var layer = L.GeoJSON.geometryToLayer(geojson, options.pointToLayer, options.coordsToLatLng, options);
		layer.feature = L.GeoJSON.asFeature(geojson);
		layer.defaultOptions = layer.options;
		this.resetStyle(layer);
		if (options.onEachFeature) {
			options.onEachFeature(geojson, layer);
		}
		return this.addLayer(layer);
	},
	
	/**
	 * Manually request features (with some extra options).
	 * @param  {Object} options
	 *         @property {Boolean} [force] Request new features even if they have already loaded.
	 *                                   This implies clearing the layer before adding new features.
	 *         @property {Boolean | L.LatLngBounds} [bounds]
	 *                              	Set custom bounds to refresh within. Or set to null/false for 
	 *                              	not restricting request to any bounds (loading all features).
	 * @return {void}
	 */
	_refresh: function(options) {
		options = options || {};

		var force = options.force;
		
		
		if (force === true) {
			// Also reload features already added.
			this._featureIndexes = [];
		}
		
		var self = this;
		if (!this._map) {
			return false;
		}
		var bounds = null;
		if (!(options.bounds === null || options.bounds === false)) {
			bounds = options.bounds || this._map.getBounds();
		}
		this.getFeature(bounds, function() {
			if (self.options.uniqueKey === null) {
				self.clearLayers();
			}
			self.addData(self.jsonData);
		});
	},
	
	/**
	 * Code borrowed from OpenLayers 2.13.1
	 * @param bounds {Leaflet bounds}
	 * @param reverseAxisOrder {Boolean}
	 * @returns {String}
	 */
	_boundsToBbox: function(bounds, reverseAxisOrder) {
    	var decimal = 6; 
        var mult = Math.pow(10, decimal);
        var xmin = Math.round(bounds.getWest() * mult) / mult;
        var ymin = Math.round(bounds.getSouth() * mult) / mult;
        var xmax = Math.round(bounds.getEast() * mult) / mult;
        var ymax = Math.round(bounds.getNorth() * mult) / mult;
        if (reverseAxisOrder === true) {
            return ymin + "," + xmin + "," + ymax + "," + xmax;
        } else {
            return xmin + "," + ymin + "," + xmax + "," + ymax;
        }
    },
    
    _projectBounds: function(bounds, fromEpsg, toEpsg) {
    	this.centerLonLat = null;
    	
    	var sw = window.proj4(fromEpsg, toEpsg, [bounds.getWest(), bounds.getSouth()]),
    		se = window.proj4(fromEpsg, toEpsg, [bounds.getEast(), bounds.getSouth()]),
    		ne = window.proj4(fromEpsg, toEpsg, [bounds.getEast(), bounds.getNorth()]),
    		nw = window.proj4(fromEpsg, toEpsg, [bounds.getWest(), bounds.getNorth()]);

        var left   = Math.min(sw[0], se[0]),
        	bottom = Math.min(sw[1], se[1]),
        	right  = Math.max(nw[0], ne[0]),
        	top    = Math.max(nw[1], ne[1]);
        
        bounds = L.latLngBounds(L.latLng(bottom, left), L.latLng(top, right));
        return bounds;
    },
	
	getFeature: function(bounds, callback) {
		var proxy = this.options.proxy || null;
		if (bounds && !this.options.params.filter) {
			// Make a filter so that we only fetch features within current viewport.
			// Don't use bbox if filter is specified (wfs does not support a combination)
			var reverseBbox = this.options.hasOwnProperty("reverseAxisBbox") ? this.options.reverseAxisBbox : this.options.reverseAxis;
			if (this.options.inputCrs) {
				if (this.options.inputCrs.toUpperCase() !== "EPSG:4326") {
					bounds = this._projectBounds(bounds, "EPSG:4326", this.options.inputCrs);
				}
				this.options.params.srsName = this.options.inputCrs;
			}
			this.options.params.bbox = this._boundsToBbox(bounds, reverseBbox);
		}
		var url,
			params = null;
		if (this.options.xhrType === "GET") {
			url = this.getFeatureUrl + "?" + $.param(this.options.params);
			url = this.proxy ? this.proxy + encodeURIComponent(url) : url;
			params = null;
		}
		else {
			// POST
			url = proxy ? proxy + encodeURIComponent(this.getFeatureUrl) : this.getFeatureUrl;
			params = this.options.params;
		}
		
		if (this.xhr) {
			this.xhr.abort();
			this.xhr = null;
		}
		this.fire("loading", {layer: this});
		this.xhr = $.ajax({
			url: url,
			type: this.options.xhrType,
			data: params,
			context: this,
			success: function(response) {
				this.onGetFeatureSuccess(response, callback);
			},
			error: this.onGetFeatureError,
			dataType: "json"
		});
	},

	/**
	 * The function must be called with context <this> (this class instance).
	 * @param  {[type]} response [description]
	 * @return {[type]}          [description]
	 */
	onGetFeatureSuccess: function(response, callback) {
		if (response.type && response.type == "FeatureCollection") {
			this.jsonData = response;
			this.toGeographicCoords(this.options.inputCrs || "EPSG:4326");
			callback();
			this.fire("load", {layer: this});
		}
	},

	onGetFeatureError: function(e) {
		this.fire("loaderror", {layer: this});
	},
	
	swapCoords: function(coords) {
		coords = [coords[1], coords[0]];
		return coords;
	},
	
	toGeographicCoords: function(inputCrs) {
		function projectPoint(coordinates /*[easting, northing]*/, inputCrs) {
			var source = inputCrs || "EPSG:4326",
				dest = "EPSG:4326",
				x = coordinates[0],
				y = coordinates[1];
			if (source == dest) {
				return coordinates;
			}
			return window.proj4(source, dest, [x, y]); // [easting, northing]
		};
		
		var coords, coordsArr, projectedCoords, i, p, geom,
			features = this.jsonData.features || [];
		var options = this.options;
		for (i=0,len=features.length; i<len; i++) {
			geom = features[i].geometry;
			switch (geom.type) {
				case "Point":
					coords = geom.coordinates;
					if (options.reverseAxis) {
						coords = this.swapCoords(coords);
					}
					projectedCoords = projectPoint(coords, inputCrs);
					geom.coordinates = projectedCoords;
					break;
				case "MultiPoint":
					for (p=0, len2=geom.coordinates.length; p<len2; p++) {
						coords = geom.coordinates[p];
						if (options.reverseAxis) {
							coords = this.swapCoords(coords);
						}
						projectedCoords = projectPoint(coords, inputCrs);
						// features[i].geometry.coordinates[p] = projectedCoords;
					}
					break;
				case "LineString":
					// TODO Not yet tested
					coordsArr = geom.coordinates[0];
					for (p=0, lenP=coordsArr.length; p<lenP; p++) {
						coords = coordsArr[p];
						if (options.reverseAxis) {
							coords = this.swapCoords( coords );
						}
						projectedCoords = projectPoint(coords, inputCrs);
						coordsArr[p] = projectedCoords;
					}
					break;
				case "MultiLineString":
					coordsArr = [];
					var pp, len2, len3;
					for (p=0, len2=geom.coordinates.length; p<len2; p++) {
						coordsArr = geom.coordinates[p];
						for (pp=0, len3=coordsArr.length; pp<len3; pp++) {
							coords = coordsArr[pp];
							if (options.reverseAxis) {
								coords = swapCoords( coords );
							}
							projectedCoords = projectPoint(coords, inputCrs);
							coordsArr[pp] = projectedCoords;
						}
						geom.coordinates[p] = coordsArr; // needed?
					}
					break;
				case "Polygon":
					coordsArr = geom.coordinates[0];
					for (p=0, lenP=coordsArr.length; p<lenP; p++) {
						coords = coordsArr[p];
						if (options.reverseAxis) {
							coords = this.swapCoords( coords );
						}
						projectedCoords = projectPoint(coords, inputCrs);
						coordsArr[p] = projectedCoords;
					}
					break;
				case "MultiPolygon":
					coordsArr = [];
					var pp, ppp, len2, len3, len4, coordsArr2;
					for (p=0, len2=geom.coordinates.length; p<len2; p++) {
						coordsArr = geom.coordinates[p];
						for (pp=0, len3=coordsArr.length; pp<len3; pp++) {
							coordsArr2 = coordsArr[pp];
							for (ppp=0, len4=coordsArr2.length; ppp<len4; ppp++) {
								coords = coordsArr2[ppp];
								if (options.reverseAxis) {
									coords = swapCoords( coords );
								}
								projectedCoords = projectPoint(coords, inputCrs);
								coordsArr2[ppp] = projectedCoords;
							}
						}
					}
					break;
			}
		}
	}
});
