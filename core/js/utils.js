var utils = {
		rmPx: function(text) {
			return parseInt( text.replace(/px/gi, "").replace(/em/gi, "").replace(/pt/gi, "") );
		},
		
		log: function(msg) {
			if (window.console) {
				window.console.log(msg);
			}
		},

		getBrowser: function() {
			var match = navigator.userAgent.match(/(?:MSIE |Trident\/.*; rv:)(\d+)/);
    		var ieVersion = match ? parseInt(match[1]) : undefined;

			return {
				ie8: ieVersion === 8,
				ie9: ieVersion === 9,
				ie10: ieVersion === 10,
				ie11: ieVersion === 11
			};
		},

		isInIframe: function() {
			return top.location != self.location;
		},
		
		/**
		 * Remove all duplicates in the array.
		 * @param arr {Array}
		 * @returns {Array} A new array containing only unique values.
		 */
		makeUniqueArr: function(arr) {
			var newArr = [];
			$.each(arr, function(i, val) {
				if ( $.inArray(val, newArr) === -1) {
					newArr.push(val);
				}
			});
			return newArr;
		},

		/**
		 * Transforms all keys in an object into upper-case.
		 * @param  {Object} o
		 * @return {Object} Upper-case object.
		 */
		objectToUpperCase: function(o) {
			var out = {};
			for (var key in o) {
				out[key.toUpperCase()] = o[key];
			}
			return out;
		},
		
		drawDialog: function(title, bodyContent, footerContent, options) {
			options = options || {};
			
			options.size = options.size || "";
			
			var d = $('<div class="modal fade"><div class="modal-dialog">'+
				'<div class="modal-content">'+
			  '<div class="modal-header">'+
				'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
				(title.search(/</g) === -1 ? '<h4 class="modal-title">'+title+'</h4>' : title) + 
			  '</div>'+
			  '<div class="modal-body"></div>'+
			'</div>');
			d.find(".modal-body").append(bodyContent);
			if (footerContent) {
				var footer = $('<div class="modal-footer"></div>');
				d.find(".modal-body").after(footer);
				footer.append(footerContent);
			}
			
			if (options.size) {
				d.addClass("bs-modal-"+options.size);
				d.find(".modal-dialog").addClass("modal-"+options.size);	
			}
			
			return d;
		},
		
		/**
		 * Due to the way Leaflet is designed, a feature is packed inside
		 * a layer (which is actually more like "true" feature). To be able to
		 * do anything with the feature, one must find its layer – which is the
		 * purpose of this function.
		 * @param parentLayer {L.Layer} The layer containing other layers, of which one layer must contain our feature.
		 * @param feature {Object} A Leaflet feature, who's layer we want to find. This layer must be added to the parentLayer.
		 * @returns {L.Layer | null}
		 */
		getLayerFromFeature: function(feature, parentLayer) {
			var layersObj = parentLayer._layers;
			for (var nbr in layersObj) {
				var _lay = layersObj[nbr];
				if (_lay.feature.id === feature.id) {
					return _lay;
				}
			}
			return null;
		},
		
		round: function(val, nbrOfDecimals) {
			var exp = Math.pow(10, nbrOfDecimals || 0);
			return Math.round(val * exp) / exp;
		},
		
		makeUnselectable: function(tag) {
			tag.attr("unselectable", "unselectable").addClass("unselectable");
		},
		
		extractToHtml: function(html, props) {
			function getFunctionEnd(text) {
				var p = 1,
					found = false,
					startIndex = text.search(/\{/g); // get starting "{"
				text = text.substring(startIndex+1);
				var i=0;			
				for (i=0,len=text.length; i<len; i++) {
					if (text.charAt(i) === "{") {
						p += 1;
					}
					else if (text.charAt(i) === "}") {
						p -= 1;
					}
					if (p === 0) {
						found = true;
						i = i + startIndex + 2;
						break;
					}
				}
				if (!found) {
					i = -1;
				}
				return i;
			};
			
			
			function extractAttribute(a, txt) {
				var index = txt.search(/\${/g);
				if (index !== -1) {
					var extractedAttribute = "";
					
					// Find the end of the attribute
					var attr = html.substring(index + 2);
					var endIndex = 0;
					if (attr.substring(0, 8) === "function") {
						endIndex = getFunctionEnd(attr);
					}
					else {
						endIndex = attr.search(/\}/g);
						
					}
					attr = attr.substring(0, endIndex);
					
					if (attr.substring(0, 8) === "function") {
						var theFunc = attr.replace("function", "function f");
						eval(theFunc);
						extractedAttribute = f.call(this, a);
					}
					else {
						// Replace ${...} by the extracted attribute.
						extractedAttribute = a[attr] || ""; // If attribute does not exist – use empty string "".						
					}
					txt = txt.replace("${"+attr+"}", extractedAttribute);
				}
				return txt;
			}
			
			//If a selectable layer misses a popup parameter in config.
			if( typeof html === 'undefined' ){
				html = null;
				return html;
			}

			// Extract props until there are no left to extract.
			var index = html.search(/\${/g);
			while (index !== -1) {
				html = extractAttribute(props, html);			
				index = html.search(/\${/g);
			}
			return html;
		},

		paramsStringToObject: function(pString, keysToUpperCase) {
			keysToUpperCase = keysToUpperCase || false;

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
					if (keysToUpperCase) {
						key = key.toUpperCase();
					}
					out[key] = value;
				 }
			}
			return out;
		}
		
		
};