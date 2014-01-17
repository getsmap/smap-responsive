smap.cmd = {
	
		
		getLayerConfig: function(layerId) {
			return this.getLayerConfigBy("layerId", layerId);
		},
		
		getLayerConfigBy: function(key, val, options) {
			options = options || {};
			
			var arr = smap.config.bl.concat(smap.config.ol || []),
				i, t;
			for (i=0,len=arr.length; i<len; i++) {
				t = arr[i];
//				try {
//					val = eval("t." + key);
//				} catch(e) {
//					continue;
//				}
//				return val;
				
				var exVal = t.options[key];
				if (options.inText) {
					if (exVal !== undefined && exVal.search(val) > -1) {
						return t;
					}
				}
				else {
					if (exVal !== undefined && exVal === val) {
						return t;
					}					
				}
			}
			return null;
		}
};