smap.core.Layer = L.Class.extend({
	
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
	},
	
	addOverlays: function(arr) {
		this._addLayers(arr);
	},
	
	_addLayers: function(arr) {
		arr = arr || [];
		
		var i, t, layer;
		for (i=0,len=arr.length; i<len; i++) {
			t = arr[i];
			layer = this._createLayer(t);
			this._addLayer(layer);
		}
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
		if (this._layers[layerId]) {
			console.log("Layer with "+layerId+" is already added to the map. Not added again.");
			return false;
		}
		this._layers[layerId] = layer;
		this.map.addLayer(layer);
		return layer;
	},
	
	_removeLayer: function(layerId) {
		var layer = this._layers[layerId];
		if (this.map.hasLayer(layer)) {
			this.map.removeLayer( layer );
			return true;
		}
		return false;
	},
	
	_createLayer: function(t) {
		var init = eval(t.init);
		var layer = new init(t.url, t.options);

		var self = this;
		if (layer.CLASS_NAME && layer.CLASS_NAME === "L.GeoJSON.WFS2") {
			layer.on("load", function(e) {
				var html;
				layer.eachLayer(function(f) {
					if (!f._popup) {
						html = layer.options.popup
						html = utils.extractToHtml(html, f.feature.properties);
						f.bindPopup(html);						
					}
				});
			});
		}
		return layer;

	},
	
	CLASS_NAME: "smap.core.Layer"
});