L.Control.SelectWMS = L.Control.extend({
	options: {
		wmsVersion: "1.3.0",
		outputFormat: "GML2",
		info_format: "text/plain",
		maxFeatures: 20,
		buffer: 5,
		useProxy: false
	},
	
	_layers: [],
	_selectedFeatures: [],

	initialize: function(options) {
		L.setOptions(this, options);
	},

	onAdd: function(map) {
		this.map = map;
		
		this._bindEvents();
		
		this._container = L.DomUtil.create('div', 'leaflet-control-selectwms'); // second parameter is class name
		$(this._container).css("display", "none");
		
		L.DomEvent.disableClickPropagation(this._container);
		return this._container;
	},

	onRemove: function(map) {
		// Do everything "opposite" of onAdd – e.g. unbind events and destroy things
		// map.off('layeradd', this._onLayerAdd).off('layerremove', this._onLayerRemove);
		
		this._unbindEvents();
	},

	onSuccess: function(responses) {
		responses = responses || [];

		var resp;
		var fs, f, t, o, geodata, other, params;
		for (var ii=0,lenii=responses.length; ii<lenii; ii++) {
			resp = responses[ii];
			geodata = resp[0];
			other = resp[1];
			params = other.params;
			fs = geodata.features;
			if (geodata) {
				if (geodata.features) {
					// This is vector data
					var fs = geodata.features,
						f, t, o;
					if (!fs.length) {
						return false;
					}
					for (var i=0,len=fs.length; i<len; i++) {
						f = fs[i];
						f.latLng = other.latLng;
						t = smap.cmd.getLayerConfigBy("options.layers", params.layers) || smap.cmd.getLayerConfigBy("options.selectOptions.layers", params.layers);
						if (!t) {
							// Find out which layer this feature belongs to by using the id
							if (f.id) {
								var lName = f.id.split(".")[0];
								if (params.layers.search(lName) > -1) {
									var arr = params.layers.split(",");
									for (var j=0,lenj=arr.length; j<lenj; j++) {
										if (arr[j].search(lName) > -1) {
											var layers = arr[j];
											t = smap.cmd.getLayerConfigBy("options.layers", layers) || smap.cmd.getLayerConfigBy("options.selectOptions.layers", layers);
										}
									}
								}

							}
						}
						o = t.options;
						if (o.selectOptions && o.selectOptions.srs && o.selectOptions.srs !== "EPSG:4326") {
							// Project into wgs84 coords
							utils.projectFeature(f, o.selectOptions.srs, {
								// reverseAxis: true
							});
						}
						f.options = $.extend({}, o);
					}
					this._selectedFeatures = this._selectedFeatures.concat(fs);
				}
				else {
					var latLng = other.latLng;
					var ps, p;
					for (var typishName in geodata) {
						ps = geodata[typishName];
						var valArr = typishName.split(":");
						var val = valArr[valArr.length-1];
						var t = smap.cmd.getLayerConfigBy("layers", val, {inText: true});
						if (!t || !t.options || !t.options.layerId) {
							continue;
						}
						var layerId = t.options.layerId;
						for (var i=0,len=ps.length; i<len; i++) {
							p = ps[i];
							
							// Create a pseudo feature based on properties and latLng
							var f = {
								geometry: {coordinates: [latLng.lng, latLng.lat]},
								latLng: latLng,
								properties: p,
								layerId: layerId,
								options: t.options
							};
							
							if (p && $.isEmptyObject(p) === false) {
								this._selectedFeatures.push(f);
							}
						}
					}
				}
			}
		}

		// Finally! Trigger select – if we have anything to select that means...
		if (this._selectedFeatures.length) {
			this.map.fire("selected", {
				layer: this,
				feature: this._selectedFeatures.length ? this._selectedFeatures[0] : null, // TODO Need this parameter?
				selectedFeatures: this._selectedFeatures
			});
		}

	},
	
	_applyParam: function(sel) {
		var layer, layerId, theItem, xyArr, latLng,
			obj = JSON.parse(decodeURIComponent( sel ));
		
		for (layerId in obj) {
			theItem = obj[layerId];
			if (theItem["xy"]) {
				layer = smap.core.layerInst.showLayer(layerId);
				
				xyArr = theItem["xy"][0]; 
				latLng = L.latLng(xyArr[1], xyArr[0]); // val is lat, key is lon
				
				this.onMapClick({
					latlng: latLng,
					_layers: [layer]
				});
			}
		}
		
	},
	
	_bindEvents: function() {
		var self = this;
//		smap.event.on("smap.core.createparams", function(e, p) {
//			if (self._selectedFeatures.length) {
//				p.SEL = self._selectedFeatures[0].join(":");				
//			}
//		});
		smap.event.on("smap.core.applyparams", function(e, p) {
			if (p.SEL) {
				self._applyParam( decodeURIComponent(p.SEL) );				
			}
		});
		
		this.map
			.on("layeradd", this.onLayerAdd, this)
			.on("layerremove", this.onLayerRemove, this)
			.on("click", this.onMapClick, this)
			.on("dblclick", this.onMapDblClick, this);
	},
	_unbindEvents: function() {
		this.map
			.off("layeradd", this.onLayerAdd, this)
			.off("layerremove", this.onLayerRemove, this)
			.off("click", this.onMapClick, this)
			.off("dblclick", this.onMapDblClick, this);
	},
	
	onLayerAdd: function(e) {
		var layer = e.layer;
		if (this._layerShouldBeAdded(layer) === true) {
			// Add the layer to the selectable layers array
			this._layers.push(layer);
		}
	},
	
	onLayerRemove: function(e) {
		var layer = e.layer;
		var index = this._hasLayer(layer);
		if (index !== false) {
			// Remove the layer from the selectable layers array
			this._layers.splice(index, 1);
		}
	},
	
	onMapDblClick: function(e) {
		// Cancel getfeatureinfo request and stop popup from being shown on map
		// by setting _dblclickWasRegistered to true.
		this._dblclickWasRegistered = true;
		if (this.xhr) {
			this.xhr.abort();
		}
		setTimeout($.proxy(function() {
			// Revert in case no click
			this._dblclickWasRegistered = false;
		}, this), 400);
	},

	/**
	 * Prepare and execute the WMS GetFeatureInfo request.
	 * @param e {Object}
	 * 		- latlng {L.LatLng}
	 * 
	 * @returns {void}
	 */
	onMapClick: function(e) {
		
		// Reset properties
		this._selectedFeatures = [];
		var latLng = e.latlng;
		
		if (this.xhr) {
			this.xhr.abort();
		}
		var layers = e._layers || this._layers;
		if (!layers.length) {
			return;
		}
		var layerNames = [];
		var self = this;
		var t, url, URL,
			ts = {},
			needsOwnRequest,
			o,
			layersToRequest = 0;
		$.each(layers, function(i, layer) {
			o = layer.options || {};
			url = layer._url || layer._wmsUrl;  // _wmsUrl for L.NonTiledLayer.WMS
			URL = url.toUpperCase();
			if (ts[URL]) {
				var exSel = ts[URL].selectOptions || {};
				var sel = o.selectOptions || {};
				var exInfoFormat = exSel.info_format || self.options.info_format;
				needsOwnRequest = (exInfoFormat && sel.info_format && exInfoFormat !== sel.info_format);
				if (needsOwnRequest) {
					URL += "_1"; // Make key unique
				}
			}

			// Evaluate again (the URL might have been modified to allow for unique request)
			if (!ts[URL]) {
				ts[URL] = {
					layerNames: [],
					url: url,
					wmsVersion: layer._wmsVersion,
					layerId: o.layerId,
					selectOptions: o.selectOptions || {}
				};
				layersToRequest += 1;
			}
			if (o.selectOptions && o.selectOptions.layers) {
				ts[URL].layerNames.push(o.selectOptions.layers);
			}
			else {
				ts[URL].layerNames.push(o.layers);
			}
		});

		var params;
		setTimeout($.proxy(function() {
			if (this._dblclickWasRegistered === true) {
				console.log("NOT requesting");
			}
			else {
				var responses = [];
				for (var URL in ts) {
					t = ts[URL];
					// t.selectOptions = t.selectOptions || {};
					params = this._makeParams({
						layers: t.layerNames.join(","),
						version: t._wmsVersion || this.options.wmsVersion, 
						info_format: t.selectOptions.info_format || this.options.info_format,
						latLng: latLng,
						srs: t.selectOptions.srs || "EPSG:4326"
					}, t.selectOptions);
					if (params.info_format === "text/plain") {
						params.version = "1.1.1";
					}			
					var onSuccess = this.onSuccess;
					console.log("requesting");
					this.request(
						t.selectOptions.url || t.url, params, {
							onSuccess: function(geodata, other) {
								layersToRequest -= 1;
								responses.push([geodata, other]);
								if (layersToRequest <= 0) {
									onSuccess.call(this, responses);
								}
							},
							onError: function() {
								layersToRequest -= 1;
							},
							layerId: t.layerId,
							latLng: latLng
					});
				}
			}
		}, this), 100);

	},
	
	_layerShouldBeAdded: function(layer) {
		var isWmsLayer = layer.wmsParams ? true : false;  // layer._wmsVersion
		if (layer.options && layer.options.selectable && layer.options.selectable === true
				&& this._hasLayer(layer) === false
				&& isWmsLayer === true) {
			return true;
		}
		return false;
	},
	
	_hasLayer: function(layer) {
		var layers = this._layers;
		for (var i=0,len=layers.length; i<len; i++) {
			if (layer === layers[i]) {
				return i;
			}
		}
		return false;
	},
	
	_makeParams: function(overrideParams, options) {
		options = options || {};
		
		var px = this.map.latLngToContainerPoint(overrideParams.latLng);
		var b = this.map.getBounds();
		var bboxString = b.toBBoxString();
		if (options.srs && overrideParams.srs !== "EPSG:4326") {
			// Project bounds to new projection (seems like the WMS GetFeatureInfo 
			// cannot handle WGS84 when native projection is something else.
			var sw = b.getSouthWest(),
				ne = b.getNorthEast();
			sw = utils.projectLatLng(sw, "EPSG:4326", overrideParams.srs, false, false);
			ne = utils.projectLatLng(ne, "EPSG:4326", overrideParams.srs, false, false);
			b = L.latLngBounds(sw, ne);
			bboxString = b.toBBoxString();
		}
		if (options.reverseAxisBbox) {
			var bboxArr = bboxString.split(",");
			bboxString = [bboxArr[1], bboxArr[0], bboxArr[3], bboxArr[2]].join(",");
		}

		

		var params = $.extend({}, {
				service: "WMS",
				request: "GetFeatureInfo",
				version: this.options.version,
				bbox: bboxString,
				layers: null,
				styles: "",
				typename: overrideParams.layers,
				query_layers: overrideParams.layers,
				info_format: overrideParams.info_format,
				feature_count: this.options.maxFeatures,
				x: utils.round(px.x),
				y: utils.round(px.y),
				buffer: this.options.buffer,
				width: utils.round(this.map.getSize().x),
				height: utils.round(this.map.getSize().y),
				srs: "EPSG:4326",
				exceptions: "application%2Fvnd.ogc.se_xml"
		}, overrideParams);
		delete params.latLng;
		return params;
	},
	
	
	_parseText: function(resp) {
		var out = {},
			dict = {},
			row, t, val, nbr, featureType,
			rows = resp.split("\n");
		
		for (var i=0,len=rows.length; i<len; i++) {
			row = rows[i];
			if ( $.trim(row).length === 0 ) {
				// If empty row - continue to next row. Solves bug: https://github.com/getsmap/smap-responsive/issues/123 
				continue;
			}
			if (row.search("=") === -1) {
				var index = row.search(/'/);
				if (index > -1) {
					row = row.substring(index+1);
					index = row.search(/'/);
					if (featureType && out[featureType] && $.isEmptyObject(dict) === false) {
						// Store the old result and create a new dict
						out[featureType].push($.extend({}, dict));
						dict = {};
					}
					featureType = row.substring(0, index);
					if (!out[featureType]) {
						out[featureType] = [];
					}
					continue;
				}
				else {
					if (featureType && out[featureType] && $.isEmptyObject(dict) === false) {
						out[featureType].push($.extend({}, dict));
						dict = {};
					}
					continue;
				}
			}
			t = row.split("=");
			if (t.length > 2) {
				// There were some "=" in the value – join again.
				var tempArr = t.slice(1);
				val = tempArr.join("=");
			}
			else {
				val = t[1];
			}
			val = $.trim(val);
			
			var onlyNumbers = /^[0-9.]+$/.test(val);
			var s = val.split(".");
			var commaIsOk = s.length <= 2 && s[0].length > 0 && (s.length === 1 || s.length === 2 && s[1].length > 0);
			if ( onlyNumbers === true && commaIsOk) {
				// Convert string to number if possible
				try {
					switch(s.length) {
					case 1:
						nbr = parseInt(val);						
						break;
					case 2:
						nbr = parseFloat(val);						
						break;
					}
				}
				catch (e) {}
				if (nbr && isNaN(nbr) === false) {
					val = nbr;
				}
			}
			dict[ $.trim(t[0]) ] = val;
		}
		if (featureType && out[featureType] && $.isEmptyObject(dict) === false) {
			// Store the old result and create a new dict
			out[featureType].push($.extend({}, dict));
		}
		return out;
	},
	
	request: function(url, params, options) {
		params = params || {};
		options = options || {};
		
		url = this.options.useProxy ? smap.config.ws.proxy + encodeURIComponent(url) : url;
		
		this.xhr = $.ajax({
			url: url,
			data: params,
			type: "GET",
			dataType: "text",
			context: this,
			success: function(resp, textStatus, jqXHR) {
				var out;
				var info_format = params.info_format;
				if (info_format === "text/plain") {
					out = this._parseText(resp);
				}
				else if (info_format === "application/json") {
					out = JSON.parse(resp);
				}
				else {
					console.log("Info format: "+info_format+" not yet supported.");
					return false;
				}
				options.onSuccess.call(this, out, {
					latLng: options.latLng,
					map: this.map,
					context: this,
					params: params
				});
				
			},
			error: options.onError
			// complete: function() {}
		});
		
	},
	
	
	CLASS_NAME: "L.Control.SelectWMS"
});


// Do something when the map initializes (example taken from Leaflet attribution control)

//L.Map.addInitHook(function () {
//	if (this.options.attributionControl) {
//		this.attributionControl = (new L.Control.SelectWMS()).addTo(this);
//	}
//});


/*
 * This code just makes removes the need for
 * using "new" when instantiating the class. It
 * is a Leaflet convention and should be there.
 */
L.control.selectWMS = function (options) {
	return new L.Control.SelectWMS(options);
};