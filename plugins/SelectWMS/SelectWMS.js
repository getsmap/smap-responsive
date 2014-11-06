L.Control.SelectWMS = L.Control.extend({
	options: {
		wmsVersion: "1.3",
		outputFormat: "GML2",
		srs: "EPSG:4326",
		info_format: "text/plain",
		featureCount: 3,
		buffer: 5,
		useProxy: false,
		onSuccess: function(props, other) {
			var self = other.context;
			
			var latLng = other.latLng;

			for (var typishName in props) {
				var p = props[typishName][0];

				// Fetch layerId
				var valArr = typishName.split(":");
				var val = valArr[valArr.length-1];
				var t = smap.cmd.getLayerConfigBy("layers", val, {inText: true});
				if (!t || !t.options || !t.options.layerId) {
					continue;
				}
				var layerId = t.options.layerId;
				
				// Create a pseudo feature based on properties and latLng
				var f = {
					geometry: {coordinates: [latLng.lng, latLng.lat]},
					latLng: latLng,
					properties: p,
					layerId: layerId,
					options: t.options
				};
				
				if (p && $.isEmptyObject(p) === false) {
					self._selectedFeatures.push(f);
					// self._selectedFeatures.push([layerId, other.latLng.lng, other.latLng.lat]);
				}
			}
			if (self._selectedFeatures.length) {
				other.map.fire("selected", {
					layer: self,
					feature: self._selectedFeatures.length ? self._selectedFeatures[0] : null,
					// latLng: latLng,
					selectedFeatures: self._selectedFeatures
				});
			}
		},
		onError: function() {
			
		}
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
			.on("click", this.onMapClick, this);
	},
	_unbindEvents: function() {
		this.map
			.off("layeradd", this.onLayerAdd, this)
			.off("layerremove", this.onLayerRemove, this)
			.off("click", this.onMapClick, this);
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
		
		var t, url, URL,
			ts = {};
		$.each(layers, function(i, layer) {
			url = layer._url || layer._wmsUrl;  // _wmsUrl for L.NonTiledLayer.WMS
			URL = url.toUpperCase();
			if (!ts[URL]) {
				ts[URL] = {
					layerNames: [],
					url: url,
					wmsVersion: layer._wmsVersion,
					layerId: layer.options.layerId
				};
			}
			//ts[URL].layerNames.push(layer.options.layers);
			if(layer.options.selectLayers){
				//ts[URL].selectLayerNames.push(layer.options.selectLayers);
				ts[URL].layerNames.push(layer.options.selectLayers);
				}
			else{
				ts[URL].layerNames.push(layer.options.layers);
				}
		});

		var params;
		for (var URL in ts) {
			t = ts[URL];
			params = this._makeParams({
				layers: t.layerNames.join(","),
				version: t._wmsVersion || this.options.wmsVersion, 
				info_format: this.options.info_format,
				latLng: latLng
			});
			this.request(t.url, params, {
				onSuccess: this.options.onSuccess,
				onError: function() {},
				layerId: t.layerId,
				latLng: latLng
			});		
		}
		
		
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
	
	_makeParams: function(options) {
		options = options || {};
		
		
		var px = this.map.latLngToContainerPoint(options.latLng);
		
		var b = this.map.getBounds();
		var params = {
				service: "WMS",
				request: "GetFeatureInfo",
				version: "1.1.1", //options.version,
				bbox: b.toBBoxString(), //b.getSouth() +","+ b.getWest() +","+ b.getNorth() +","+ b.getEast(),
				layers: options.layers,
//				typename: options.layers,
				query_layers: options.layers,
				info_format: options.info_format,
				format: "image/png",
				feature_count: this.options.featureCount,
				x: utils.round(px.x),
				y: utils.round(px.y),
				buffer: this.options.buffer,
				width: utils.round(this.map.getSize().x),
				height: utils.round(this.map.getSize().y),
				srs: this.options.srs || "EPSG:4326",
				exceptions: "application%2Fvnd.ogc.se_xml"
		};
		return params;
	},
	
	
	_parseText: function(resp) {
		var out = {},
			dict = {},
			row, t, val, nbr, featureType,
			rows = resp.split("\n");
		
		for (var i=0,len=rows.length; i<len; i++) {
			row = rows[i];
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
			type: "POST",
			dataType: "text",
			context: this,
			success: function(resp, textStatus, jqXHR) {
				var out = this._parseText(resp);
				options.onSuccess(out, {
					latLng: options.latLng,
					map: this.map,
					context: this,
					params: params
				});
				
			},
			error: function() {
				options.onError();
			},
			complete: function() {
//				this.xhr = null;
			}
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