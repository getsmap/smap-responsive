smap.core.Div = L.Class.extend({
	
	initialize: function() {
		this.parentTag = $("body");
		this.draw();
	},
	
	draw: function() {
		var mapDiv = $("#mapdiv");
		
		if ( !mapDiv.length ) {
			// It is is possbile to run smap with custom divs
			var mapDiv = $('<div id="mapdiv" class="mapdiv" />');
			var mainDiv = $('<div id="maindiv" class="maindiv" />');
			mainDiv.append(mapDiv);
			this.parentTag.append(mainDiv);
		}
		
		// Fix things after orientation change.
		var isTouchOnly = utils.isTouchOnly();
		if (L.Browser.touch) {
			$(window).on("orientationchange", function() {
				window.scrollTo(0,0);
			});			
		}

		smap.event.on("smap.core.pluginsadded", function() {
			if ( $("body > header").length || smap.cmd.getControl("MalmoHeader") ) {
				// If body has an immediate child that is a <header>-tag then we assume
				// a toolbar exists and the map should have a chance to adapt.
				mainDiv.addClass("map-with-header");
			}
			var b = utils.getBrowser();
			if ( b.ie && b.ieVersion <= 8 ) {
				// Because IE8 >= doesn't seem to understand
				$(".leaflet-top.leaflet-right").addClass("map-with-header-ie8");
			}
		});
	},
	
	
	CLASS_NAME: "smap.core.Div"
});