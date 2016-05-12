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
		
		// Leaflet bug with events? The context is not working the way it should: http://leafletjs.com/reference.html#events-addeventlistener
		// map.on("layeradd", this.onLayerAdd, this);
		// map.on("layerremove", this.onLayerRemove, this);

		this._onLayerAdd = this._onLayerAdd || $.proxy(this.onLayerAdd, this);
		this._onLayerRemove = this._onLayerRemove || $.proxy(this.onLayerRemove, this);
		map.on("layeradd", this._onLayerAdd);
		map.on("layerremove", this._onLayerRemove);
		
		smap.event.on("smap.core.applyparams", (function(e, p) {
			var tBL;
			if (p.BL) {
				tBL = smap.cmd.getLayerConfig( p.BL );
			}
			tBL = tBL || smap.config.bl[0]; // Use first bl as baselayer if no config exists for given bl

			if (tBL && tBL.options) {
				tBL.options.isBaseLayer = true;
				map.addLayer(this._createLayer(tBL));
			}

			if (p.OL) {
				var t, i, len;
				var ol = p.OL instanceof Array ? p.OL : p.OL.split(",");
				for (i=0,len=ol.length; i<len; i++) {
					this._addLayerWithConfig( smap.cmd.getLayerConfig(ol[i]) );
				}
			}	
		}).bind(this));
		
	},
	
	initialize: function(map) {
		this.map = map;
		this._bindEvents();
		// Allow double-click to be registered before click on vector features
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

		var cont = t.options.parentLayerId ? this._getLayer(t.options.parentLayerId) || this.map : this.map;
		cont.addLayer(layer);
		return layer;
	},
	
	onLayerAdd: function(e) {
		var layer = e.layer;

		// if (layer._layers && layer.on) {
		// 	this._zoomIn = this._zoomIn || $.proxy(function(e) {
		// 		// e.target._map._onDoubleClick(e);
		// 		e.target._map.fire("dblclick", e);
		// 	}, this);

		// }
		// Note! layer.options._silent allows to add layer without triggering this event
		if (!layer.options || layer.options._silent || !layer.options.layerId || layer.feature || !(layer instanceof L.NonTiledLayer) && !(layer._tileContainer || layer._layers)) {
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
		init.options = init.options || {};

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
			if (t.options && t.options instanceof Object) {
				$.extend(layer.options, t.options);
			}
		}
		else {
			if (!t.url) {
				if (t.key) {
				//then it is for ex a Bing layer we assume
					layer = new init(t.key, t.options);
					layer.options.layerid = t.options.layerId;
					//layer.options.isBaseLayer=true;
					this._layers[t.options.layerId] = layer;
				}
				else {
					// Some layers only use options.
					layer = new init(t.options);
				}					
			}
			else {
				var opts = t.options;
				if (init === L.TileLayer.WMS) {
					// WMS layers will use all options as parameters for image requests (=bad)
					var newOpts = $.extend(true, {}, opts);

					// Keep only keys which belong to the WMS-API.
					// newOpts = _.omit(newOpts, ["legend", "category", "selectable", "popup", "zIndex", "attribution", "displayName", "layerId"]);
					newOpts = _.pick(newOpts, ["service", "request", "version", "layers", "styles", "format", "width", "height", "bbox",
										"angle", "buffer", "cql_filter", "env", "featureid", "filter", "format_options", "maxfeatures", "namespace",
										"palette", "propertyname", "tiled", "tilesorigin", "scalemethod",
										"srs", "map_resolution", "transparent", "sld", "sld_body"]);
					layer = new init(t.url, newOpts);
					$.extend(layer.wmsParams, newOpts);
					$.extend(layer.options, opts);
					layer.setZIndex(opts.zIndex);
				}
				else {
					if (!t.url) {
						layer = new init(opts);
					}
					else {
						layer = new init(t.url, opts);
					}
				}
			}
			// For ESRI bug
			if (layer instanceof L.esri.Layers.DynamicMapLayer || layer instanceof L.esri.Layers.TiledMapLayer) {
				this._layers[t.options.layerId] = layer;
				// layer.setZIndex(layer.options.zIndex);
			}
			// else if (layer instanceof L.NonTiledLayer.WMS) {
			// 	layer.options.zIndex = -1; // Solves issue where layer goes on top of vector features
			// }
		}
		
		var self = this;
		if (layer.on && layer.options) {
			if (layer._layers) {
				if (!layer.options.style && (!layer.options.geomType || (layer.options.geomType && layer.options.geomType.search(/POINT/gi))) > -1) {
					// Render as markers if no style (but only for point layers, which must be declared with geomType)
					layer.options.style = null;
				}
				else {
					layer.options.style = layer.options.style || $.extend({}, self.options.defaultStyle);
				}
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

			if (layer.on) {
				layer.on("load", function(e) {
					smap.cmd.loading(false);
				});
				layer.on("loading", function(e) {
					smap.cmd.loading(true);
				});
			}
		}
		
		return layer;
	},
	
	/**
	 * Show layer.
	 * @param  {Object | String} layerId   Either the layerId or a configuration object
	 * @return {L.Layer}
	 */
	showLayer: function(layerId) {
		var t = layerId instanceof Object ? layerId : smap.cmd.getLayerConfig(layerId);
		if (!t) {
			return;
		}
		var layer = this._getLayer(layerId);
		if (!layer) {
			layer = this._createLayer(t);
		}
		var cont = t.options.parentLayerId ? this._getLayer(t.options.parentLayerId) || this.map : this.map;
		if (cont.hasLayer(layer) === false) {
			cont.addLayer(layer);
		}
		return layer;
	},
	
	hideLayer: function(layerId) {
		// Just remove the layer from the map (still keep it in the ass. array).
		var layer = layerId instanceof Object ? layerId : this._getLayer(layerId);
		if (layer.fire) {
			layer.fire("loadcancel", {layer: this});
		}
		var cont = layer.options.parentLayerId ? this._getLayer(layer.options.parentLayerId) || this.map : this.map;
		cont.removeLayer(layer);
		return layer;
	},
	
	CLASS_NAME: "smap.core.Layer"
});