var utils = {
		rmPx: function(text) {
			return parseInt( text.replace(/px/gi, "").replace(/em/gi, "").replace(/pt/gi, "") );
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
		
		round: function(val, nbrOfDecimals) {
			var exp = Math.pow(10, nbrOfDecimals || 0);
			return Math.round(val * exp) / exp;
		},
		
		makeUnselectable: function(tag) {
			tag.attr("unselectable", "unselectable").addClass("unselectable");
		},
		
		extractToHtml: function(html, props) {
			function extractAttribute(a, txt) {
				var index = txt.search(/\${/g);
				if (index !== -1) {
					var extractedAttribute = "";
					
					// Find the end of the attribute
					var attr = html.substring(index + 2);
					var endIndex = 0;
					if (attr.substring(0, 8) === "function") {
						endIndex = sMap.util.getFunctionEnd(attr);
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
			
			// Extract props until there are no left to extract.
			var index = html.search(/\${/g);
			while (index !== -1) {
				html = extractAttribute(props, html);			
				index = html.search(/\${/g);
			}
			return html;
		}
		
		
};