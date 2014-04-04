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
	
	initialize: function(map) {
		this.map = map;
		
		var self = this;
		smap.event.on("smap.core.applyparams", function(e, obj) {
			var p = obj.params,
				tBL;
			if (p.BL) {
				tBL = smap.cmd.getLayerConfig( p.BL );
			}
			else {
				tBL = smap.config.bl[0];
			}
			tBL.options.isBaseLayer = true;
			self._addLayer( self._createLayer(tBL) );

			if (p.OL) {
				var t, i;
				var ol = p.OL instanceof Array ? p.OL : p.OL.split(",");
				for (i=0,len=ol.length; i<len; i++) {
					t = smap.cmd.getLayerConfig( ol[i] );
					if (!t || !t.init) {
						continue;
					}
					self._addLayer( self._createLayer(t) );
				}
			}
		});
		
		
		
		this.map.on("click", function() {
			// On "click out" – unselect all features (applies to WFS-layers).
			var arr = self._wfsLayers;
			for (var i=0,len=arr.length; i<len; i++) {
				self._resetStyle( arr[i] );
			}
		});
		
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
		var layer = this._createLayer(t);
		return this._addLayer(layer);
	},
	
	/**
	 * Add a layer to the map through the smap framework's core. The advantage of
	 * doing this is that it listens to load events (so they connect to onloading)
	 * and you can use these methods:
	 * - smap.cmd.getLayer()
	 * 
	 * Note! The layer to be added must have a layerId (layer.options.layerId)
	 * Note 2! If the layer is removed – it must be done through this._removeLayer
	 * @param layer {Leaflet layer} with a (unique) layerId
	 */
	_addLayer: function(layer) {
		var layerId = layer.options.layerId;
		if (this.map.hasLayer(layerId)) {
			console.log("Layer with "+layerId+" is already added to the map. Not added again.");
			return false;
		}
		this._layers[layerId] = layer;
		this.map.addLayer(layer);
		return layer;
	},
	
	_getLayer: function(layerId) {
		return this._layers[layerId];
	},
	
	_removeLayer: function(layerId) {
		var layer = this._layers[layerId];
		if (this.map.hasLayer(layer)) {
			this.map.removeLayer( layer );
			delete this._layers[layerId];
			layer = null;
			return true;
		}
		return false;
	},
	
	_setSelectStyle: function(e) {
		var layer = e.target;

		if (layer.setStyle) {
			layer.setStyle(this.options.selectStyle);			
		}

	    if (layer.bringToFront && !L.Browser.ie && !L.Browser.opera) {
	    	layer.bringToFront();
	    }
	},
	
	_resetStyle: function(layer) {
		layer.eachLayer(function(lay) {
			layer.resetStyle(lay);
		});
//		layer.options.style = layer.options.style;
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
		if (layer.CLASS_NAME && layer.CLASS_NAME === "L.GeoJSON.WFS") {
			if (!t.options.style) {
				var style = {
						weight: 2,
				        opacity: 1,
				        color: '#fff',
				        dashArray: '3',
				        fillOpacity: 0.7
					};
				layer.setStyle(style);
				layer.options.style = style;
			}
			layer.on("load", function(e) {
				var html;
				layer.eachLayer(function(f) {
					if (!f._popup && f.feature) {
						html = utils.extractToHtml(layer.options.popup, f.feature.properties);
						
						// Do not use autoPan because this will set center around the popup
						// when panning the map, making it impossible to pan away from the popup.
						f.bindPopup(html, {autoPan: false});
						if (f._popup) {
							f._popup.options.autoPanPaddingTopLeft = [0, 50];							
						}
						f.on("click", $.proxy(function(e) {
							self._resetStyle(layer);
							self._setSelectStyle(e);
						}, self));
					}
				});
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
		this._addLayer(layer);
		return layer;
	},
	
	hideLayer: function(layerId) {
		// Just remove the layer from the map (still keep it in the ass. array).
		var layer = this._getLayer(layerId);
		this.map.removeLayer(layer);
	},
	
	CLASS_NAME: "smap.core.Layer"
});