smap.cmd = {
	
		
		getLayerConfig: function(layerId) {
			return this.getLayerConfigBy("layerId", layerId);
		},
		
		getLayerConfigBy: function(key, val) {
			var arr = smap.config.bl.concat(smap.config.ol || []),
				i, t;
			for (i=0,len=arr.length; i<len; i++) {
				t = arr[i];
				if (t.options[key] === val) {
					return t;
				}
			}
			return null;
		}
};