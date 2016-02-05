smap.core.Init = L.Class.extend({
	
	_selectedFeatures: [],
	
	
	initialize: function() {
		this.defineProjs();

		// Instantiate core classes
		smap.core.divInst = new smap.core.Div();
		smap.cmd.loading(true); // needs the mapdiv to work :)
		this.init();
	},

	_checkBrowserSupport: function() {
		var b = utils.getBrowser();
		if (b.ie && b.ieVersion <= 8) {
			smap.cmd.notify("Obs! Applikationen stödjer inte din webbläsare. Använd en nyare version.", "warning");
		}
	},
	
	init: function(options) {
		options = options || {};
		var self = this;
		this.drawMap();
		this._checkBrowserSupport();

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
		var params = options.params || smap.core.paramInst.getParams(); //Parameters from URL / config

		// Solves: https://github.com/getsmap/smap-responsive/issues/212
		var configUrlsAttempted = [];
		var fileName = params.CONFIG.substring(params.CONFIG.lastIndexOf('/') + 1);
		function loadConfig(url) {
			configUrlsAttempted.push(url);
			self.loadConfig(url).done(function() {
					if (configUrlsAttempted.length > 1) {
						// Means first try did not work, so we need to modify the config parameter 
						// when someone tries to create a URL reproducing this map.
						smap.event.on("smap.core.createparams", function(e, p) {
							p.config = url;
						});
					}
					function applyConfig() {
						smap.config.configName = params.CONFIG; // Store for creating params
						smap.config.langCode = smap.cmd.getLang();
						self.applyConfig(smap.config);
						// params = smap.core.paramInst.getParams();
						params = $.extend({}, utils.objectToUpperCase(smap.config.params || {}), params);
						smap.core.paramInst.applyParams(params);
						smap.cmd.loading(false);
					}

					smap.config = config || window.config;
					if (smap.config.onLoad) {
						var deferred = smap.config.onLoad(smap.config);
						deferred.done(applyConfig);
					}
					else {
						applyConfig(smap.config);
					}
			}).fail(function(a, text, c) {
				// Try finding the config in the directories – if any – specified in mainConfig
				// Stop when all dirs have been tested with no result (reference: https://github.com/getsmap/smap-responsive/issues/212)
				var configDirs = smap.core.mainConfig.configDirs || null;
				if (configDirs && configDirs instanceof Array && configUrlsAttempted.length <= configDirs.length) {
					loadConfig( configDirs[configUrlsAttempted.length-1] + fileName );
				}
				else {
					smap.cmd.loading(false);
					throw new Error("The specified config file was not found: " + params.CONFIG);
				}
			});
		}
		loadConfig(params.CONFIG);
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

		var coreConfig = theConfig.coreConfig || {};
		$.extend(smap.core.selectInst.options, coreConfig.select || {});
		
		// Extend map options
		$.extend(this.map.options, theConfig.mapConfig || {});

		// Extend smap options
		$.extend(smap.core.mainConfig.smapOptions, theConfig.smapOptions || {});
		var smapOptions = smap.core.mainConfig.smapOptions;

		// Set title
		var b = utils.getBrowser();
		if ( !(b.ie && b.ieVersion <= 8) ) {
			$("title").text(smapOptions.title);
		}

		// // Set favicon
		var favIconUrl = smapOptions.favIcon;
		if (favIconUrl && !(b.ie && b.ieVersion <= 8)) {
			var favIcon = $('<link rel="shortcut icon" type="image/x-icon" href="'+favIconUrl+'" />');
			$("[rel=shortcut]").remove();
			$("title").after(favIcon);
		}

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
		
		var ieTouchOnly = L.Browser.touch && L.Browser.msTouch;
		if (ieTouchOnly) {
			options.tapTolerance = 30;
		}
		var defaultOptions = smap.core.mainConfig.mapConfig || {};
		var mapOptions = $.extend(defaultOptions, options);
		this.map = L.map("mapdiv", mapOptions);
		smap.map = this.map;

		// Add attribution for smap responsive
		var a = this.map.attributionControl;
		a.addAttribution('<a href="//github.com/getsmap/smap-responsive" target="_blank">sMap responsive</a>&nbsp;|');

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
		// if (configName.search(/\//g) === -1) {
		// 	if (document.URL.split("?")[0].search("dev.html") > -1) {
		// 		// dev.html (dev/test)
		// 		configName = "dist/configs/" + configName;
		// 	}
		// 	else {
		// 		// index.html (production)
		// 		configName = "configs/" + configName;
		// 	}
		// }
		// if (location.protocol === "https:") {
		// 	// Create an absolute path or otherwise the ajax call will not work on https
			
		// 	// First, create a root (with correct protocol – http/https) to which we can add the relative path
		// 	var root = document.location.href.split("?")[0];
		// 	var index = root.lastIndexOf("/");
		// 	if (index > 7) { // prevent http://kartor.malmo.se from being cut
		// 		root = root.substring(0, index);
		// 	}
		// 	root += "/";

		// 	// Second, add the relative path to the absolute
		// 	if (configName.substring(0, 2) !== "//" && configName.substring(0, 4).toLowerCase() !== "http") {
		// 		configName = root + configName;
		// 	}
		// }
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
		var paramsString = "version=1.1.1&request=GetLegendGraphic&format=image/png&width=20&height=20&layer=" + wmsLayers;
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