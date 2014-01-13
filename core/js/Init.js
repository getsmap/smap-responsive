smap.core.Init = L.Class.extend({
	
	initialize: function() {
		// Instantiate core classes
		smap.core.divInst = new smap.core.Div();
		this.drawMap();
		smap.core.layerInst = new smap.core.Layer(this.map);
		smap.core.paramInst = new smap.core.Param(this.map);
		
		var params = smap.core.paramInst.getParams();

		var getConfig = this.getConfig(params.config).done(function() {
				smap.config = config || window.config;
				smap.core.layerInst.addBaseLayers(smap.config.bl);
				smap.core.layerInst.addOverlays(smap.config.ol);
		});
	},
	
	drawMap: function(options) {
		options = options || {};
		
		var defaultOptions = smap.core.mainConfig.mapConfig || {};
		this.map = L.map("mapdiv", $.extend(defaultOptions, options));
	},
	
	getConfig: function(configName) {
		configName = configName || "config.js";
		
		return $.ajax({
			url: "configs/"+configName,
			context: this,
			dataType: "script"
		});
		
	},
	
	CLASS_NAME: "smap.core.Init"
});

$(document).ready(function() {
	new smap.core.Init();	
});