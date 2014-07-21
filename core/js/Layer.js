smap.core.Layer = L.Class.extend({
	
	options: {
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
		
		map.on("layeradd", $.proxy(this.onLayerAdd, this));
		
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
		var layerAlreadyAdded = this._getLayer(t.options.layerId);
		if (layerAlreadyAdded) {
			return false;
		}
		var layer = this._createLayer(t);
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
		
		var layer = new init(t.url, t.options);
		
		var self = this;
		if (layer._layers) {
//			if (!t.options.style) {
//				var style = {
//						weight: 2,
//				        opacity: 1,
//				        color: '#fff',
//				        dashArray: '3',
//				        fillOpacity: 0.7
//					};
//				layer.setStyle(style);
//				layer.options.style = style;
//			}
			layer.on("load", function(e) {
				smap.cmd.loading(false);
			});
			// Listen to these "home-made" events added to our own L.GeoJSON.WFS layer class.
			layer.on("loadcancel loaderror", function(e) {
				smap.cmd.loading(false);
			});
			this._wfsLayers.push(layer);
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
	
	showLayer: function(layerId) {
		var t = smap.cmd.getLayerConfig(layerId);
		var layer = this._getLayer(layerId);
		if (!layer) {
			layer = this._createLayer(t);
		}
		if (this.map.hasLayer(layer) === false) {
			this.map.addLayer(layer);			
		}
//		For next version, try this.
//		if (layer.options.zIndex && layer.setZIndex) {
//			if (layer._layers) {
//				layer.on("load", function() {
//					this.setZIndex(this.options.zIndex);
//				});
//			}
//			else {
//				layer.setZIndex(layer.options.zIndex);				
//			}
//		}
		return layer;
	},
	
	hideLayer: function(layerId) {
		// Just remove the layer from the map (still keep it in the ass. array).
		var layer = this._getLayer(layerId);
		layer.fire("loadcancel", {layer: this});
		this.map.removeLayer(layer);
	},
	
	CLASS_NAME: "smap.core.Layer"
});