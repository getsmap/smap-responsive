smap.core.Div = L.Class.extend({
	
	initialize: function() {
		this.parentTag = $("body");
		this.draw();
	},
	
	draw: function() {
		var div = $('<div id="mapdiv" />');
		this.parentTag.append(div);
	},
	
	
	CLASS_NAME: "smap.core.Div"
});