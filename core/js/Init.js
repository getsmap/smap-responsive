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

		// if (utils.isInIframe()) {
		// 	var w = window.frameElement.offsetWidth;
		// 	alert(w);
		// 	$("html, body").css({
		// 		"width": w+"px",
		// 		"max-width": w+"px"
		// 	});
		// }

		// this.bindEvents(this.map);
		smap.core.layerInst = new smap.core.Layer(this.map);
		smap.core.selectInst = new smap.core.Select(this.map);
		smap.core.paramInst = new smap.core.Param(this.map);
		smap.core.pluginHandlerInst = new smap.core.PluginHandler(this.map);
		var params = options.params || smap.core.paramInst.getParams(); //Parameters from URL
		this.loadConfig(params.CONFIG).done(function() {
				function applyConfig() {
					smap.config.configName = params.CONFIG; // Store for creating params
					smap.config.langCode = smap.cmd.getLang();
					params = $.extend( utils.objectToUpperCase(smap.config.params || {}), params);
					self.applyConfig(smap.config);
					smap.core.paramInst.applyParams(params);
					smap.cmd.loading(false);
				}

				smap.config = config || window.config;
				if (smap.config.onLoad) {
					var deferred = smap.config.onLoad(smap.config);
					deferred.done(applyConfig);
				}
				else {
					applyConfig();
				}
		}).fail(function(a, text, c) {
			utils.log("Config not loaded because: "+text);
			smap.cmd.loading(false);
		});
	},
	
	applyConfig: function(theConfig) {
		this.preProcessConfig(theConfig);

		// this._loadTheme(theConfig.theme);
		
		// if (theConfig.ws) {
		// 	// Set proxy for layers and controls
		// 	var proxy = smap.config.ws.proxy;
		// 	L.GeoJSON.WFS.prototype.proxy = proxy;
		// 	L.GeoJSON.Custom.prototype.proxy = proxy;
		// 	L.Control.SelectWMS.prototype.proxy = proxy;
		// }
		
		// Extend map options
		$.extend(this.map.options, theConfig.mapConfig || {});
		if (this.map.options.maxBounds) {
			this.map.setMaxBounds(this.map.options.maxBounds); // [[north, west], [south, east]]
		}
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
		try {
			delete window.config;
		} catch(e) {}
		
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
	
	// bindEvents: function(map) {
		
	// },
	
	drawMap: function(options) {
		options = options || {};
		
		if (L.Browser.touch && L.Browser.ie) {
			options.tapTolerance = 30;
		}
		var defaultOptions = smap.core.mainConfig.mapConfig || {};
		var mapOptions = $.extend(defaultOptions, options);
		this.map = L.map("mapdiv", mapOptions);
		smap.map = this.map;

		if (mapOptions.disabledRightClick) {
			this.map.on("contextmenu", function(e) {
				e.originalEvent.preventDefault();
				e.originalEvent.stopPropagation();
			});
		}

		if (utils.getBrowser().ie9) {
			$(".leaflet-bottom.leaflet-right").addClass(".leaflet-bottom-right-ie9");
		}
	},
	
	loadConfig: function(configName) {
		configName = configName || "config.js";
		if (configName.search(/\//g) === -1) {
			if (document.URL.split("?")[0].search("dev.html") > -1) {
				// dev.html (dev/test)
				configName = "dist/configs/" + configName;
			}
			else {
				// index.html (production)
				configName = "configs/" + configName;
			}
		}
		return $.ajax({
			url: configName,	
			context: this,
			dataType: "script"
		});
	},
	
	preProcessConfig: function(config) {
		if (config.ws && config.ws.hasOwnProperty(document.domain)) {
			config.ws = config.ws[document.domain];
		}
		
		var bls = config.bl || [];
		for (var i=0,len=bls.length; i<len; i++) {
			bls[i].options = bls[i].options || {};
			bls[i].options.isBaseLayer = true;
		}


		var cLayers = config.bl.concat(config.ol || []);
		var createLegendUrl = this._createLegendUrl,
			t;
		for (var i=0,len=cLayers.length; i<len; i++) {
			t = cLayers[i];
			if (t.options.legend === undefined && t.options.layers && _.indexOf(["L.TileLayer.WMS", "L.NonTiledLayer.WMS"], t.init) > -1) {
				t.options.legend = createLegendUrl(t.url, t.options.layers);
			}
		}

		// Set default theme if not set
		// config.theme = config.theme || smap.core.mainConfig.defaultTheme;
	},

	_createLegendUrl: function(url, wmsLayers) {
		if (wmsLayers.split(",").length > 1) {
			wmsLayers = wmsLayers.split(",")[0]; // Use first if many layers
		}
		var paramsString = "request=GetLegendGraphic&format=image/png&width=20&height=20&layer=" + wmsLayers;
		return utils.urlAppend(url, paramsString);
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