L.GeoJSON.WFS2 = L.GeoJSON.extend({
	
	CLASS_NAME: "L.GeoJSON.WFS2",
	
	options: {
		uniqueAttr: ""
	},
	
	initialize: function(serviceUrl, options) {
		options = options || {};
		
		var featureType = options.featureType; // required
		
		L.GeoJSON.prototype.initialize.call(this, null, options);
		
		// JL: Added proxy here.
		if (options.proxy || L.GeoJSON.WFS2.proxy) {
			this.proxy = options.proxy || L.GeoJSON.WFS2.proxy || null;
		}
		
		var wfsVersion = options.wfsVersion || "1.1.0";
		this.getFeatureUrl = serviceUrl;   //+ "?request=GetFeature&outputformat=json&version=" + wfsVersion + "&typeName=" + featureType;
		
		this.params = {
				typeName: featureType,
				service: "WFS",
				version: wfsVersion,
				request: "GetFeature",
				srsName: "EPSG:4326",
				format: "text/geojson",
				maxFeatures: 10000,
				outputFormat: "json"
		};
		
//		if (options.filter && options.filter instanceof DateFilter) { this.getFeatureUrl += "&CQL_FILTER=" + options.filter.cql; }
		
		
		this.on("featureparse", function(e) {
			if (e.geometryType != 'Point' && e.geometryType != 'MultiPoint') {
				if (options.style) {
					e.layer._originalStyle = options.style;
					e.layer.setStyle(options.style);
				} else if (options.filteredStyles) {
					var fld = options.filteredStyles.propName;
					var itemVal = e.properties[fld];
					var style = L.Util.extend({}, options.filteredStyles['default'], options.filteredStyles.styles[itemVal]); 
					e.layer._originalStyle = style;
					e.layer.setStyle(style);
				}
			}
			if (options.popupObj && options.popupOptions) {
				e.layer.on("click", function(evt) {
					e.layer._map.openPopup(options.popupObj.generatePopup(e, options.popupOptions));
					if (options.popupFn) { options.popupFn(e); }
				});			
			}
			else if (options.popupFld && e.properties.hasOwnProperty(options.popupFld)) {
				e.layer.bindPopup(e.properties[options.popupFld], { maxWidth: 600 });
			}
			if (options.hoverObj || options.hoverFld) {
				e.layer.on("mouseover", function(evt) {
					hoverContent = options.hoverObj ? options.hoverObj.generateContent(e) : e.properties[options.hoverFld] || "Invalid field name" ;
					hoverPoint = e.layer._map.latLngToContainerPoint(evt.target._latlng);
					e.layer._hoverControl = new L.Control.Hover(hoverPoint, hoverContent);
					e.layer._map.addControl(e.layer._hoverControl);	
				});
				e.layer.on("mouseout", function(evt) {
					e.layer._map.removeControl(e.layer._hoverControl);
				});
			}
			if (options.hoverColor) {
				e.layer.on("mouseover", function(evt) {
					var hoverStyle = L.Util.extend({}, e.layer._originalStyle, { stroke: true, color: options.hoverColor, weight: 3 });
					e.layer.setStyle(hoverStyle);
				});
				e.layer.on("mouseout", function(evt) {
					e.layer.setStyle(e.layer._originalStyle);
				});
			}
			if (e.layer instanceof L.Marker.AttributeFilter) { e.layer.setIcon(e); }
		});
	},
	
	onAdd: function(map) {
		L.LayerGroup.prototype.onAdd.call(this, map);
		
		this._refresh();
		this._bindEvents(map);
	},
	
	_bindEvents: function(map) {
		map.on("dragend", function() {
			self._refresh();
		});

		// Only refresh is last zoom was higher than current (i.e. map zoomed out)
		var self = this;
		var prevZoom = map.getZoom();
		map.on("zoomend", function() {
			if (prevZoom > map.getZoom()) {
				self._refresh();
			}
			prevZoom = map.getZoom();
		});
	},
	
	/**
	 * Keeps track of if a feature has been added or not
	 * by storing its unique id: feature.id.
	 */
	_featureIndexes: [],
	
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
		    uniqueAttr = this.options.uniqueAttr;
		
		if (features) {
			var featureIndexes = this._featureIndexes,
				addData = this.addData;
			for (i=0, len=features.length; i<len; i++) {
				// Only add this if geometry or geometries are set and not null
				feature = features[i];
				var uniqueVal = "";
				if (uniqueAttr) {
					var uniqueAttrArr = this.options.uniqueAttr.split(","),
						props = feature.properties;
					$.each(uniqueAttrArr, function(i, val) {
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
				else {
					console.log("Already added: "+uniqueVal);
				}
			}
			return this;
		}

		var options = this.options;
		if (options.filter && !options.filter(geojson)) { return; }
		var layer = L.GeoJSON.geometryToLayer(geojson, options.pointToLayer, options.coordsToLatLng, options);
		layer.feature = L.GeoJSON.asFeature(geojson);
		layer.defaultOptions = layer.options;
		this.resetStyle(layer);
		if (options.onEachFeature) {
			options.onEachFeature(geojson, layer);
		}
		return this.addLayer(layer);
	},
	
	_refresh: function(force) {
		force = force || false;
		
		if (force === true) {
			// Also reload features already added.
			this._featureIndexes = [];
		}
		
		var self = this;
		if (!this._map) {
			return false;
		}
		var bounds = this._map.getBounds();
		this.getFeature(bounds, function() {
			if (self.options.uniqueAttr === null) {
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
    	
    	var sw = proj4(fromEpsg, toEpsg, [bounds.getWest(), bounds.getSouth()]),
    		se = proj4(fromEpsg, toEpsg, [bounds.getEast(), bounds.getSouth()]),
    		ne = proj4(fromEpsg, toEpsg, [bounds.getEast(), bounds.getNorth()]),
    		nw = proj4(fromEpsg, toEpsg, [bounds.getWest(), bounds.getNorth()]);

        var left   = Math.min(sw[0], se[0]),
        	bottom = Math.min(sw[1], se[1]),
        	right  = Math.max(nw[0], ne[0]),
        	top    = Math.max(nw[1], ne[1]);
        
        bounds = L.latLngBounds(L.latLng(bottom, left), L.latLng(top, right));
        return bounds;
    },
	
	getFeature: function(bounds, callback) {
		if (bounds && !this.params.filter) {
			// Make a filter so that we only fetch features within current viewport.
			// Don't use bbox if filter is specified (wfs does not support a combination)
			
			if (this.options.inputCrs) {
				bounds = this._projectBounds(bounds, "EPSG:4326", this.options.inputCrs);
				this.params.srsName = this.options.inputCrs;
			}
			this.params.bbox = this._boundsToBbox(bounds, this.options.reverseAxis);
		}
		
		var url = this.proxy ? this.proxy + encodeURIComponent(this.getFeatureUrl) : this.getFeatureUrl;
		$.ajax({
			url: url,
			type: "POST",
			data: this.params,
			context: this,
			success: function(response) {
				if (response.type && response.type == "FeatureCollection") {
					this.jsonData = response;
					this.toGeographicCoords(this.options.inputCrs || "EPSG:3857");
					callback();
					this.fire("load", {layer: this});
				}				
			},
			dataType: "json"
		});
	},
	
	swapCoords: function(coords) {
		coords = [coords[1], coords[0]];
		return coords;
	},
	
	toGeographicCoords: function(inputCrs) {
		function projectPoint(coordinates /*[easting, northing]*/, inputCrs) {
			var source = inputCrs || "EPSG:3857",
				dest = "EPSG:4326",
				x = coordinates[0], 
				y = coordinates[1];
			return proj4(source, dest, [x, y]); // [easting, northing]
		};
		
		var coords, coordsArr, projectedCoords, i, p, geom,
			features = this.jsonData.features || [];
		for (i=0,len=features.length; i<len; i++) {
			geom = features[i].geometry;
			switch (geom.type) {
				case "Point":
					coords = geom.coordinates;
					if (!this.options.reverseAxis) {
						coords = this.swapCoords(coords);
					}
					projectedCoords = projectPoint(coords, inputCrs);
					geom.coordinates = projectedCoords;
					break;
				case "MultiPoint":
					for (p=0, len2=geom.coordinates.length; p<len2; p++) {
						coords = geom.coordinates[p];
//						if (this.options.reverseAxis) {
//							coords = this.swapCoords(coords);
//						}
						projectedCoords = projectPoint(coords, inputCrs);
						features[i].geometry.coordinates[p] = projectedCoords;
					}
					break;
				case "MultiLineString":
					coordsArr = [];
					var pp, ii,
						newCoords = [];
					for (p=0, len2=geom.coordinates.length; p<len2; p++) {
						coordsArr = geom.coordinates[p];
						for (pp=0, len3=coordsArr.length; pp<len3; pp++) {
							coords = coordsArr[pp];
							if (!this.options.reverseAxis) {
								coords = this.swapCoords( coords );								
							}
							projectedCoords = projectPoint(coords, inputCrs);
							coordsArr[pp] = projectedCoords;
						}
						geom.coordinates[p] = coordsArr; // needed?
					}
					break;
				case "MultiPolygon":
					coordsArr = geom.coordinates[0][0];
					for (p=0, lenP=coordsArr.length; p<lenP; p++) {
						coords = coordsArr[p];
						if (!this.options.reverseAxis) {
							coords = this.swapCoords( coords );								
						}
						projectedCoords = projectPoint(coords, inputCrs);
						coordsArr[p] = projectedCoords;
					}
					geom.coordinates[0][0] = coordsArr; // needed?
					
					break;
			}
		}
	}
});