smap.core.Layer = L.Class.extend({
	
	initialize: function(map) {
		this.map = map;
	},
	
	
	addBaseLayers: function(arr) {
		arr = arr || [];
		
		var i, t, init, layer;
		for (i=0,len=arr.length; i<len; i++) {
			t = arr[i];
			init = eval(t.init);
			layer = new init(t.url, t.options);
			this._addLayer(layer);
		}
	},
	
	addOverlays: function(arr) {
		arr = arr || [];
		
		var i, t, init, layer;
		for (i=0,len=arr.length; i<len; i++) {
			t = arr[i];
			init = eval(t.init);
			layer = new init(t.url, t.options);
			this._addLayer(layer);
		}
	},
	
	_addLayer: function(layer) {
		this.map.addLayer(layer);
	},
	
	CLASS_NAME: "smap.core.Layer"
});