smap.core.Param = L.Class.extend({
	
	initialize: function(map) {
		this.map = map;
	},
	
	_lang: {
		"sv": {
			remove: "Ta bort"
		},
		"en": {
			remove: "Remove"
		}
	},
	
	_setLang: function() {
		langCode = smap.config.langCode;
		if (this._lang) {
			this.lang = this._lang ? this._lang[langCode] : null;
		}
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
			if (!layer || !layer.options || !layer.options.layerId) {
				continue;
			}
			
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
		if (smap.config.configName) {
			p.config = smap.config.configName;
		}
		
		smap.event.trigger("smap.core.createparams", p);
		
		// Remove all undefined or null values
		$.map(p, function(i, val) {
			
		});
		
		
		
		var pString = "",
			val;
		for (var key in p) {
			val = p[key];
			if (val instanceof Array) {
				if (!val.length) {
					continue;
				}
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
		
		var self = this;
		
		this._setLang();
		
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
		
		if (p.XY) {
			/*
			 * e.g. xy=13.0,55.0,A%popup%20text (third parameter is optional)
			 */ 
			var marker = L.marker( L.latLng(parseFloat(p.XY[1]), parseFloat(p.XY[0])) );
			this.map.addLayer(marker);
			if (p.XY.length > 2) {
				var html = '<p>'+p.XY[2]+'</p><button class="btn btn-default smap-core-btn-popup">'+this.lang.remove+'</button>';
				marker.bindPopup(html).openPopup();
				$(".smap-core-btn-popup").on("click", function() {
					self.map.removeLayer(marker);
				});
			}
		}
		
		if (p.SEL) {
			this._handleSelect(p.SEL);
		}
		
		smap.event.trigger("smap.core.applyparams", {
			params: p
		});
	},
	
	_handleSelect: function(sel) {
		var arrSels = sel instanceof Array ? sel : sel.split(","),
			s,
			self = this,
			layer;
		for (var i=0,len=arrSels.length; i<len; i++) {
			arrSel = arrSels[i].split(":");
			
			var layerId = arrSel[0],
				key = arrSel[1],
				val = arrSel[2];
//			var t = smap.cmd.getLayerConfig(layerId);
			
			layer = smap.core.layerInst.showLayer(layerId);
			layer._key = key;
			layer._val = val;
			
			function onLoadWfs() {
				var selFeature = null,
					layer = this;
				$.each(layer._layers, function(i, f) {
					if (f.feature) {
						var props = f.feature.properties;
						if (!props[layer._key]) {
							return false; // No such property, no use iterating
						}
						if (props[layer._key].toString() === val) {
							selFeature = f; // This is the feature we want to select
							return false; // break
						}
					}
				});
				if (selFeature) {
					selFeature.fire("click", {
						properties: selFeature.feature.properties
					});
					selFeature.openPopup(); // TODO: Could render error if popup not defined! "Try statement" or if (selFeature._layers[XX]._popup)?
				}
				this.off("load", onLoadWfs);
			};
			
			
			function onLoadWms() {
				// This is a WMS
				self.map.fire("click", {
					latlng: L.latLng(parseFloat(this._val), parseFloat(this._key)), // val is lat, key is lon
					_layers: [this]
				});
				this.off("load", onLoadWms);
				
			};
			
			var onLoad = layer && layer._layers ? onLoadWfs : onLoadWms;
			layer.on("load", onLoad);
			
			
		}
	},
	
	CLASS_NAME: "smap.core.Param"
		
});