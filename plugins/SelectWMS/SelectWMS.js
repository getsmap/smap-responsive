L.Control.SelectWMS = L.Control.extend({
	options: {
		wmsVersion: "1.3",
		outputFormat: "GML2",
		srs: "EPSG:4326",
		info_format: "text/plain",
		featureCount: 1,
		buffer: 5,
		onSuccess: function(props, other) {
			if (props && $.isEmptyObject(props) === false) {
				other.map.fire("selected", {
					properties: props,
					latLng: other.latLng
				});				
			}
		},
		onError: function() {
			
		}
	},
	
	_layers: [],

	initialize: function(options) {
		L.setOptions(this, options);
	},

	onAdd: function(map) {
		this.map = map;
		
		this._bindEvents();
		
		this._container = L.DomUtil.create('div', 'leaflet-control-selectwms'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		return this._container;
	},

	onRemove: function(map) {
		// Do everything "opposite" of onAdd � e.g. unbind events and destroy things
		// map.off('layeradd', this._onLayerAdd).off('layerremove', this._onLayerRemove);
		
		this._unbindEvents();
	},
	
	_bindEvents: function() {
		var self = this;
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
	
	onMapClick: function(e) {
		this.latLng = null;
		if (this.xhr) {
			this.xhr.abort();
		}
		var layers = this._layers;
		if (!layers.length) {
			return;
		}
		var latLng = e.latlng;
		var layerNames = [];
		$.each(layers, function(i, layer) {
			layerNames.push(layer.options.layers);
		});
//		var bounds = L.latLngBounds(southWest, northEast);
		var params = this._makeParams({
				layers: layerNames.join(","),
				version: this.options.wmsVersion || layers[0]._wmsVersion,   // this.options.wmsVersion || 
				info_format: this.options.info_format,
				latLng: latLng
		});
//		params.latLng = latLng;
		this.latLng = latLng;
		this.request(layers[0]._url, params, {
			onSuccess: this.options.onSuccess,
			onError: function() {}
		});
		
	},
	
	_layerShouldBeAdded: function(layer) {
		var isWmsLayer = layer._wmsVersion ? true : false;
		if (layer.options.selectable && layer.options.selectable === true
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
				x: px.x,
				y: px.y,
				buffer: this.options.buffer,
				width: this.map.getSize().x,
				height: this.map.getSize().y,
				srs: this.options.srs || "EPSG:4326",
				exceptions: "application%2Fvnd.ogc.se_xml"
		};
		return params;
	},
	
	request: function(url, params, options) {
		params = params || {};
		options = options || {};
		
		var proxy = this.proxy || L.Control.SelectWMS.proxy;
		
		this.xhr = $.ajax({
			url: (proxy ? proxy + encodeURIComponent(url) : url),
			data: params,
			type: "POST",
			dataType: "text",
			context: this,
			success: function(resp, textStatus, jqXHR) {
				var out = {},
					dict = {},
					rows = resp.split("\n"),
					row, t, val, nbr, featureType;
				
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
					val = $.trim(t[1]);
					
					// Convert string to number if possible
					try {
						nbr = parseFloat(val);
					}
					catch (e) {}
					if (nbr && nbr !== NaN) {
						val = nbr;
					}
					dict[ $.trim(t[0]) ] = val;
				}
				if (featureType && out[featureType] && $.isEmptyObject(dict) === false) {
					// Store the old result and create a new dict
					out[featureType].push($.extend({}, dict));
				}
				console.log(out);
				options.onSuccess(out, {
					latLng: this.latLng,
					map: this.map,
					context: this
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