smap.core.Param = L.Class.extend({
	
	initialize: function(map) {
		this.map = map;
	},
	
	getParams: function() {
		var sep = "?";
		var p = location.href.split(sep);
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
	
	applyParams: function(p) {
		p = p || {};
		
		var zoom = p.ZOOM ? parseInt(p.ZOOM) : 0,
			center = p.CENTER ? L.latLng([parseFloat(p.CENTER[1]), parseFloat(p.CENTER[0])]) : null;
		
		if (!zoom && zoom !== 0) {
			zoom = this.map.options.minZoom || 0;
		}
		if (center) {
			this.map.setView(center, zoom, {animate: false});
		}
		else {
			this.map.fitWorld();
		}
		smap.event.trigger("smap.core.applyparams", {
			params: p
		});
	},
	
	CLASS_NAME: "smap.core.Param"
		
});