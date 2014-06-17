smap.core.Init = L.Class.extend({
	
	_selectedFeatures: [],
	
	
	initialize: function() {
		this.defineProjs();

		// Instantiate core classes
		smap.core.divInst = new smap.core.Div();
		smap.cmd.loading(true); // needs the mapdiv to work :)
		this.init();
	},
	
	init: function(options) {
		options = options || {};
		
		var self = this;
		this.drawMap();
		this.bindEvents(this.map);
		smap.core.layerInst = new smap.core.Layer(this.map);
		smap.core.selectInst = new smap.core.Select(this.map);
		smap.core.paramInst = new smap.core.Param(this.map);
		smap.core.pluginHandlerInst = new smap.core.PluginHandler(this.map);
		var params = options.params || smap.core.paramInst.getParams(); //Parameters from URL
		this.loadConfig(params.CONFIG).done(function() {
				smap.config = config || window.config;
				smap.config.configName = params.CONFIG; // Store for creating params
				
				
				var lang = params.LANG || navigator.language;
				smap.config.langCode = lang ? lang.split("-")[0] : "en";
				self.applyConfig(smap.config);

				params = utils.objectToUpperCase(smap.config.params);

				params = $.extend(smap.config.params || {}, params);
				smap.core.paramInst.applyParams(params);
				smap.cmd.loading(false);
		}).fail(function(a, text, c) {
			console.log("Config not loaded because: "+text);
			smap.cmd.loading(false);
		});
	},
	
	applyConfig: function(theConfig) {
		this.preProcessConfig(theConfig);

		// this._loadTheme(theConfig.theme);
		
		// Set proxy for layers and controls
		var proxy = smap.config.ws.proxy;
		L.GeoJSON.WFS.prototype.proxy = proxy;
		L.GeoJSON.Custom.prototype.proxy = proxy;
		L.Control.SelectWMS.prototype.proxy = proxy;
		
		// Extend map options
		$.extend(this.map.options, theConfig.mapOptions || {});
		
		smap.core.pluginHandlerInst.addPlugins( theConfig.plugins );
	},

	// _loadTheme: function(themeSrc) {
	// 	var themesFolder = 'css/themes/';
	// },
	
	resetMap: function() {
		// Destroy map
		smap.map.off();

		var ctrls = smap.core.controls;
		for (var i=0,len=ctrls.length; i<len; i++) {
			try {
				smap.map.removeControl(ctrls[i]);
			}
			catch(e) {
				
			}
		}
		this.map.remove();
		
		this.map = null;
		delete this.map;
		
		smap.map = null;
		delete smap.map;
		
		window.config = null;
		delete window.config;
		smap.config = null;
		delete smap.config;
		
		smap.event.off();
		smap.core.controls = [];
		smap.core.layerInst = null;
		smap.core.modInst = null;
		smap.core.paramInst = null;
		delete smap.core.layerInst;
		delete smap.core.modInst;
		delete smap.core.paramInst;
	},
	
	bindEvents: function(map) {
		
	},
	
	drawMap: function(options) {
		options = options || {};
		
		if (L.Browser.touch && L.Browser.ie) {
			options.tapTolerance = 30;
		}
		var defaultOptions = smap.core.mainConfig.mapConfig || {};
		this.map = L.map("mapdiv", $.extend(defaultOptions, options));
		smap.map = this.map;
	},
	
	loadConfig: function(configName) {
		configName = configName || "config.js";
		
		return $.ajax({
			url: "configs/"+configName,
			context: this,
			dataType: "script"
		});
	},
	
	preProcessConfig: function(config) {
		try {
			config.ws = config.ws ? config.ws[document.domain] : {};
		} catch(e) {
			config.log("smap.core.Init: config file's ws property not specified for domain: "+document.domain);
		};
		
		var bls = config.bl || [];
		for (var i=0,len=bls.length; i<len; i++) {
			bls[i].options.isBaseLayer = true;
		}

		// Set default theme if not set
		// config.theme = config.theme || smap.core.mainConfig.defaultTheme;

	},
	
	defineProjs: function() {
		if (window.proj4) {
			proj4 = window.proj4;
			proj4.defs([
			            ["EPSG:4326", "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"],
			            ["EPSG:3857", "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs"],
			            ["EPSG:3008", "+proj=tmerc +lat_0=0 +lon_0=13.5 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"],
			            ["EPSG:3006", "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"],
			            ["EPSG:3021", "+proj=tmerc +lat_0=0 +lon_0=15.8062845294444 +k=1.00000561024+x_0=1500064.274 +y_0=-667.711 +ellps=GRS80 +units=m"]
			            ]);			
		}
	},
	
	CLASS_NAME: "smap.core.Init"
});

$(document).ready(function() {
	smap.core.initInst = new smap.core.Init();	
});