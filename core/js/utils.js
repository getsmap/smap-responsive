var utils = {
		rmPx: function(text) {
			return parseInt( text.replace(/px/gi, "").replace(/em/gi, "").replace(/pt/gi, "") );
		},
		
		drawDialog: function(title, bodyContent, footerContent) {
			var html = $('<div class="modal fade"><div class="modal-dialog">'+
			    '<div class="modal-content">'+
		      '<div class="modal-header">'+
		        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
		        (title.search(/</g) === -1 ? '<h4 class="modal-title">'+title+'</h4>' : title) + 
		      '</div>'+
		      '<div class="modal-body"></div>'+
		      '<div class="modal-footer"></div>'+
		    '</div>');
			html.find(".modal-body").append(bodyContent);
			if (footerContent) {
				html.find(".modal-footer").append(footerContent);				
			}
			return html;
		},
		
		round: function(val, nbrOfDecimals) {
			var exp = Math.pow(10, nbrOfDecimals || 0);
			return Math.round(val * exp) / exp;
		},
		
		makeUnselectable: function(tag) {
			tag.attr("unselectable", "unselectable").addClass("unselectable");
		}
		
		
};