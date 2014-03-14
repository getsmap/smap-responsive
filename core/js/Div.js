smap.core.Div = L.Class.extend({
	
	initialize: function() {
		this.parentTag = $("body");
		this.draw();
	},
	
	draw: function() {
		var div = $('<div id="mapdiv" />');
		this.parentTag.append(div);
		
		// Fix things after orientation change.
		if (L.Browser.touch) {
			$(window).on("orientationchange", function() {
				window.scrollTo(0,0);
			});			
		}
	},
	
	
	CLASS_NAME: "smap.core.Div"
});