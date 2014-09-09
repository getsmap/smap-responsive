smap.core.Layer = L.Class.extend({
	
	options: {
		defaultStyle: {
			color: '#00F',
			fillColor: "#00F",
			opacity: 1,
			fillOpacity: 0.3,
			radius: 8,
			weight: 1
		},
		selectStyle: {
			weight: 5,
	        color: '#00DDFF',
	        dashArray: '',
	        fillOpacity: .8,
	        strokeOpacity: 1
		}
	},
	
	_layers: {},
	
	_bindEvents: function() {
		var self = this;
		var map = this.map;
		
		this._onLayerAdd = this._onLayerAdd || $.proxy(this.onLayerAdd, this);
		this._onLayerRemove = this._onLayerRemove || $.proxy(this.onLayerRemove, this);
		map.on("layeradd", this._onLayerAdd);
		map.on("layerremove", this._onLayerRemove);
		
		smap.event.on("smap.core.applyparams", $.proxy(function(e, p) {
			var tBL;
			if (p.BL) {
				tBL = smap.cmd.getLayerConfig( p.BL );
			}
			else {
				tBL = smap.config.bl[0];
			}
			if (tBL && tBL.options) {
				tBL.options.isBaseLayer = true;
				map.addLayer(this._createLayer(tBL));
			}
			if (p.OL) {
				var t, i;
				var ol = p.OL instanceof Array ? p.OL : p.OL.split(",");
				for (i=0,len=ol.length; i<len; i++) {
					this._addLayerWithConfig( smap.cmd.getLayerConfig(ol[i]) );
				}
			}
			
		}, this));
		
	},
	
	initialize: function(map) {
		this.map = map;
		this._bindEvents();
	},
	
	addOverlays: function(arr) {
		this._addLayers(arr);
	},
	
	_addLayers: function(arr) {
		arr = arr || [];
		
		var i, t, layer;
		for (i=0,len=arr.length; i<len; i++) {
			t = arr[i];
			this._addLayerWithConfig(t);
		}
	},
	
	_addLayerWithConfig: function(t) {
		if (!t || !t.options) {
			return false;
		}
		var layer = this._createLayer(t);
		if (!layer) {
			return false;
		}
//		return this._addLayer(layer);
		this.map.addLayer(layer);
		return layer;
	},
	
	onLayerAdd: function(e) {
		var layer = e.layer;
		if (!layer.options || !layer.options.layerId || layer.feature || !(layer._tileContainer || layer._layers)) {
			return;
		}
		var layerId = layer.options.layerId;
		this._layers[layerId] = layer; // Store in object so we can fetch it when needed.
		if (layer._layers) {
			this._wfsLayers.push(layer);
		}
	},

	onLayerRemove: function(e) {
		var layer = e.layer;
		if (layer._layers) {
			this._wfsLayers.splice(layer, 1);
		}	
	},
	
	_getLayer: function(layerId) {
		return this._layers[layerId] || null;
	},
	
	
	/**
	 * Used for resetting style on map click – to avoid binding
	 * multiple listeners for map click event.
	 */
	_wfsLayers: [],
	
	_createLayer: function(t) {
		var layerAlreadyAdded = this._getLayer(t.options.layerId);
		if (layerAlreadyAdded) {
			return layerAlreadyAdded; // Return the already created layer
		}

		var init = eval(t.init);
		
		/**
		 * Avoid baselayers appearing on top of overlays.
		 */
		if (t.options.isBaseLayer) {
			t.options.zIndex = t.options.zIndex || 0;
		}
		else {
			t.options.zIndex = t.options.zIndex || 10;
		}
		var layer;
		if (t.params) {
			// Apply any number of params to the class.
			// layer = new (init.prototype.bind.apply(this, t.params));
			// layer = new init(t.param1);
			layer = Object.create(init.prototype);
			init.apply(layer, t.params);
		}
		else {
			if (!t.url) {
				// Some layers only use options.
				layer = new init(t.options);	
			}
			else {
				layer = new init(t.url, t.options);
			}
		}
		
		var self = this;
		if (layer._layers) {
			layer.options.style = layer.options.style || $.extend({}, self.options.defaultStyle);
			layer.on("load", function(e) {
				smap.cmd.loading(false);
			});
			// Listen to these "home-made" events added to our own L.GeoJSON.WFS layer class.
			layer.on("loadcancel loaderror", function(e) {
				smap.cmd.loading(false);
			});
		}
		else {
			layer.on("load", function(e) {
				smap.cmd.loading(false);
			});
		}
		layer.on("loading", function(e) {
			smap.cmd.loading(true);
		});
		
		return layer;
	},
	
	/**
	 * Show layer.
	 * @param  {Object | String} layerId   Either the layerId or a configuration object
	 * @return {L.Layer}
	 */
	showLayer: function(layerId) {
		var t = layerId instanceof Object ? layerId : smap.cmd.getLayerConfig(layerId);
		var layer = this._getLayer(layerId);
		if (!layer) {
			layer = this._createLayer(t);
		}
		if (this.map.hasLayer(layer) === false) {
			this.map.addLayer(layer);
		}
		return layer;
	},
	
	hideLayer: function(layerId) {
		// Just remove the layer from the map (still keep it in the ass. array).
		var layer = this._getLayer(layerId);
		if (layer.fire) {
			layer.fire("loadcancel", {layer: this});
		}
		this.map.removeLayer(layer);
	},
	
	CLASS_NAME: "smap.core.Layer"
});