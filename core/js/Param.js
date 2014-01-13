smap.core.Param = L.Class.extend({
	
	initialize: function() {},
	
	getParams: function() {
		var p = location.href.split(smap.core.mainConfig.urlSep);
    	var pString = p.length > 1 ? p[1] : "";
		
		// The following code taken and modified from OpenLayers 2.13.1.
		var out = {},
			key, value, keyValue,
	    	pairs = pString.split(/[&;]/);
		for (var i=0,len=pairs.length; i<len; i++) {
			keyValue = pairs[i].split('=');
			if (keyValue[0]) {
				key = keyValue[0];
				try {
					key = decodeURIComponent(key);
				} catch (err) {
					key = unescape(key);
				}
	            // being liberal by replacing "+" with " "
	            value = (keyValue[1] || '').replace(/\+/g, " ");
	            try {
	                value = decodeURIComponent(value);
	            } catch (err) {
	                value = unescape(value);
	            }
	            // follow OGC convention of comma delimited values
	            value = value.split(",");

	            //if there's only one value, do not return as array                    
	            if (value.length == 1) {
	                value = value[0];
	            }                
	            out[key.toUpperCase()] = value;
	         }
	    }
	    smap.event.trigger("paramscreate", out);
	    return out;
	},
	
	createParams: function() {
		
	},
	
	applyParams: function() {
		
	},
	
	CLASS_NAME: "smap.core.Param"
		
});