smap.core.Layer = L.Class.extend({
	
	initialize: function(map) {
		this.map = map;
		
		var self = this;
		smap.event.on("smap.core.applyparams", function(e, obj) {
			var p = obj.params;
			if (p.OL) {
				var t;
				for (var i=0,len=p.OL.length; i<len; i++) {
					t = smap.cmd.getLayerConfig( p.OL[i] );
					self._addLayer( self._createLayer(t) );
				}
			}
			if (p.BL) {
				var t = smap.cmd.getLayerConfig( p.BL );
				self._addLayer( self._createLayer(t) );
			}
			else {
				self._addLayer( self._createLayer( smap.config.bl[0] ) );
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
	
	_addLayer: function(layer) {
		this.map.addLayer(layer);
	},
	
	_createLayer: function(t) {
		var init = eval(t.init);
		var layer = new init(t.url, t.options);
		return layer;
		
	},
	
	CLASS_NAME: "smap.core.Layer"
});