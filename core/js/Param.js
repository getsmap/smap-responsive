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
	    return out;
	},
	
	createParams: function(addRoot) {
		addRoot = addRoot || false;
		
		var c = this.map.getCenter(),
			bl, layer;
		
		var layers = this.map._layers,
			ols = [];
		for (var lid in layers) {
			layer = layers[lid];
			if (layer.options.isBaseLayer) {
				bl = layer.options.layerId;
			}
			else {
				ols.push(layer.options.layerId);
			}
		}
		
		var p = {
				zoom: this.map.getZoom(),
				center: [utils.round(c.lng, 5), utils.round(c.lat, 5)],
				ol: ols,
				bl: bl
		};
		
		smap.event.trigger("smap.core.createparams", p);
		
		// Remove all undefined or null values
		$.map(p, function(i, val) {
			if (!val || val.length === 0) {
				return null;
			}
			return val;
		});
		var pString = "",
			val;
		for (var key in p) {
			val = p[key];
			if (val instanceof Array) {
				val = val.join(",");
			}
			pString += "&" + key + "=" + val;
		}
		pString = pString.substring(1); // remove &
		if (addRoot === true) {
			pString = document.URL.split("?")[0] + "?" + pString;
		}
		return pString;
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