L.GeoJSON.Custom = L.GeoJSON.extend({
	
	CLASS_NAME: "L.GeoJSON.Custom",
	
	options: {
		params: {},
		style: {},
		inputCrs: "EPSG:4326",
		pointToLayer: function (feature, latlng) {
			return L.circleMarker(latlng, this.style);
		}
	},
	
	initialize: function(serviceUrl, options) {
		options = options || {};
		
		L.GeoJSON.prototype.initialize.call(this, null, options);
//		$.each(options.params, function(param){
//			var tempString = "&" + param + "=" + options.params[param];
//			serviceUrl += tempString;
//		});
		serviceUrl += $.param(options.params);
		this.serviceUrl = serviceUrl;
		
		var self = this;
		this.getFeature(function() {
			var layer = self.addData(self.jsonData);
		});
		
	},
	
	//onAdd: function(map) {
	//	L.LayerGroup.prototype.onAdd.call(this, map);
	//},
    
    /*_projectBounds: function(bounds, fromEpsg, toEpsg) {
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
    },*/
	
	getFeature: function(callback) {
		var url = this.proxy ? this.proxy + encodeURIComponent(this.serviceUrl) : this.serviceUrl;
		this.fire("loading", {layer: this});
		if (this.xhr) {
			this.xhr.abort();
			this.xhr = null;
		}
		this.xhr = $.ajax({
			url: url,
			type: "POST",
			data: this.options.params,
			context: this,
			success: function(response) {
				if (response.type && response.type == "FeatureCollection") {
					this.jsonData = response;
					if (this.options.inputCrs !== "EPSG:4326") {
						this.toGeographicCoords(this.options.inputCrs);
					}
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
			var source = inputCrs || "EPSG:4326",
				dest = "EPSG:4326",
				x = coordinates[0], 
				y = coordinates[1];
			return window.proj4(source, dest, [x, y]); // [easting, northing]
		};
		
		var coords, coordsArr, projectedCoords, i, p, geom,
			features = this.jsonData.features || [];
		for (i=0,len=features.length; i<len; i++) {
			geom = features[i].geometry;
			switch (geom.type) {
				case "Point":
					coords = geom.coordinates;
					if (this.options.reverseAxis) {
						coords = this.swapCoords(coords);
					}
					projectedCoords = projectPoint(coords, inputCrs);
					geom.coordinates = projectedCoords;
					break;
				case "MultiPoint":
					for (p=0, len2=geom.coordinates.length; p<len2; p++) {
						coords = geom.coordinates[p];
						if (this.options.reverseAxis) {
							coords = this.swapCoords(coords);
						}
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
							if (this.options.reverseAxis) {
								coords = this.swapCoords( coords );								
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
						if (this.options.reverseAxis) {
							coords = this.swapCoords( coords );								
						}
						projectedCoords = projectPoint(coords, inputCrs);
						coordsArr[p] = projectedCoords;
					}
					
					break;
				case "MultiPolygon":
					coordsArr = geom.coordinates[0][0];
					for (p=0, lenP=coordsArr.length; p<lenP; p++) {
						coords = coordsArr[p];
						if (this.options.reverseAxis) {
							coords = this.swapCoords( coords );								
						}
						projectedCoords = projectPoint(coords, inputCrs);
						coordsArr[p] = projectedCoords;
					}
//					geom.coordinates[0][0] = coordsArr; // needed?
					break;
			}
		}
	}
});