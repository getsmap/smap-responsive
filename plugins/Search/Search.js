L.Control.Search = L.Control.extend({
	options: {
		//wsAcUrl : "//localhost/cgi-bin/proxy.py?url=//kartor.helsingborg.se/Hws/sok_json_fme.py?term=",
		//wsAcUrl : "//localhost/cgi-bin/proxy.py?url=//kartor.helsingborg.se/Hws/autocomplete_hbg.ashx?q=",
		// wsAcUrl: "//xyz.malmo.se/WS/sKarta/autocomplete_limit.ashx",  //"//localhost/cgi-bin/proxy.py?url=//kartor.helsingborg.se/Hws/sok.py?",
		// wsLocateUrl: "//xyz.malmo.se/WS/sKarta/sokexakt.ashx",  //"//localhost/cgi-bin/proxy.py?url=//kartor.helsingborg.se/Hws/sokexakkt.py",
		
		whitespace: "%20", //"%2B"
		wsOrgProj: "EPSG:3006", //"EPSG:3008"
		pxDesktop: 992,
		gui: false,
		addToMenu: false,
		zoom: 15,
		markerIcon: $.extend({}, new L.Icon.Default().options, {iconUrl: L.Icon.Default.imagePath + '/marker-icon.png'}),
		source: null,
		acHeight: null, // CSS value - height of autocomplete div
		autoScrollAcOnRowNbr: 2,
		acOptions: {
			items: 100
		},
		suffix: "[Adress]", // If you want to distinguish it from other hits (usually only desirable if using vectorSearch)
		vectorSearch: {
			layerId: "guidelayer",
			suffix: "[Hus]",
			keyVals: {
				title: "Titel",
				architect: "Arkitekt",
				byggherre: "Byggherre",
				address: "Husadress"
			}
		}
	},
	
	_lang: {
		"sv": {
			search: "Sök adress",
			addressNotFound: "Den sökta adressen hittades inte",
			remove: "Ta bort"
		},
		"en": {
			search: "Search address",
			addressNotFound: "The searched address was not found",
			remove: "Remove"
		}
	},
	
	_setLang: function(langCode) {
		langCode = langCode || smap.config.langCode || navigator.language.split("-")[0] || "en";
		if (this._lang) {
			this.lang = this._lang ? this._lang[langCode] : null;
		}
	},

	initialize: function(options) {
		L.setOptions(this, options);
		if (this.options._lang) {
			// Allow setting lang in options
			$.extend(true, this._lang, this.options._lang);
		}
		this._setLang(options.langCode);
	},

	onAdd: function(map) {
		var self = this;
		this.map = map;
		
		this._container = L.DomUtil.create('div', 'leaflet-control-search'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		
		if (this.options.gui === undefined || this.options.gui === true) {
			this.$container = $(this._container);
			this.$container.css("display", "none");
			// this.$container.remove();
			this._makeSearchField();
			this.map.on("click", this._blurSearch);
		}
		if (this.options.vectorSearch) {
			// Initiate vector search (cache search/auto-complete values)
			this.map.on("layeradd", this._onLayerAdd, this);
			
		}
		
		// Bind events
		this.__onApplyParams = this.__onApplyParams || $.proxy( this._onApplyParams, this );
		smap.event.on("smap.core.applyparams", this.__onApplyParams);
		
		this.__onCreateParams = this.__onCreateParams || $.proxy( this._onCreateParams, this );
		smap.event.on("smap.core.createparams", this.__onCreateParams);

		$(".leaflet-top.leaflet-left").addClass("with-search-bar");

		// this.$container.on("mousedown", $.noop);
		// this.$container.on("touchstart", $.noop);
		
		return self._container;
	},
	
	_blurSearch: function() {
		$(".smap-search-div input").blur();
	},
	
	onRemove: function(map) {
		smap.event.off("smap.core.applyparams", this.__onApplyParams);
		smap.event.off("smap.core.createparams", this.__onCreateParams);
		this.map.off("click", this._blurSearch);
		$(".leaflet-top.leaflet-left").removeClass("with-search-bar");
	},

	_onLayerAdd: function(e) {
		var layer = e.layer || {};
		if (!layer.options || layer.options._silent || !layer.options.layerId || layer.feature) {
			return;
		}
		if (this.options.vectorSearch && this.options.vectorSearch.layerId === layer.options.layerId) {
			this._setACOptions();
			this._initVectorSearch(layer);
		}
	},

	_cacheProperties: function(props, keys, displayKeys) {
		var val, obj,
			searchWords = [];

		obj = $.extend(true, {}, {
			// Use the first key for the name/title (the "header" or "label" of the autocomplete result row)
			name: props[keys[0]]
		});
		searchWords = [];
		for (var i=0,len=keys.length; i<len; i++) {
			val = props[ keys[i] ]; // Extract value for this key
			if (val && val.length) {
				searchWords.push(displayKeys[i]+"=="+val);
			}
		}
		obj.searchWords = searchWords.join("&&");
		return obj;
	},

	_cacheLayers: function(layer) {
		var val, props, obj,
			out = [],
			cacheProperties = this._cacheProperties,
			keyVals = this.options.vectorSearch.keyVals;
		var keys = [], displayKeys = [];
		for (var key in keyVals) {
			keys.push( key );
			displayKeys.push( keyVals[key] );
		}
		layer.eachLayer(function(lay) {
			props = lay.feature.properties;
			obj = cacheProperties(props, keys, displayKeys);
			out.push(obj);
		});

		this._acVector = out; // The cached search words for autocomplete
		$("#smap-search-div input").prop("disabled", false);

	},

	_initVectorSearch: function(layer) {
		var o = layer.options;
		if (!o) {
			return false;
		}
		$("#smap-search-div input").prop("disabled", true);
		if ($.isEmptyObject(layer._layers)) {
			// Need to wait for features to load
			var onLayerLoad = function(e) {
				this._cacheLayers(layer);
				layer.off("load", onLayerLoad);
			};
			layer.on("load", onLayerLoad, this);
		}
		else {
			this._cacheLayers(layer); // Already loaded
		}
	},

	_setACOptions: function() {
		// Extend ac options to suit vector search
		var self = this;

		var vsConfig = this.options.vectorSearch;

		// Get any of the vector keys for distinguishing between address 
		// search result and wfs result.
		for (var anyVectorKey in vsConfig.keyVals) {break;};
		var anyDisplayVectorKey = vsConfig.keyVals[anyVectorKey];

		var vectorSuffix = this.options.vectorSearch.suffix,
			addressSuffix = this.options.suffix;

		// var typeaheadInst = $("#smap-search-div input").data("typeahead");
		// typeaheadInst.options = $.extend(typeaheadInst.options, {

		this.options.typeaheadOptions = $.extend(true, {}, this.options.typeaheadOptions, {
			
			// Merge address request with vector request in some more clever way than this.
			source: $.proxy(function(q, process) {
						q = encodeURIComponent(q);
						var url = this.options.wsAcUrl;  // "http://kartor.malmo.se/api/v1/addresses/autocomplete/";
						if (url) {
							if (this.options.whitespace) {
								q = q.replace(/%20/g, this.options.whitespace);
							}
							if (this._proxyInst) {
								this._proxyInst.abort();
							}
							smap.cmd.loading(true);
							this._proxyInst = $.ajax({
								type: "GET",
								url: this.options.useProxy ? smap.config.ws.proxy + encodeURIComponent(url + "?q=") + q : url + "?q="+q,
								dataType: "text",
								context: this,
								success: function(resp) {
									var arr = resp.split("\n");

									// Process arr to fit vector search
									var out = [], item;
									for (var i=0,len=arr.length; i<len; i++) {
										item = $.trim(arr[i]);
										if (item.length) {
											out.push({
												name: item,
												searchWords: "Adress=="+item
											});
										}
									}
									out = this._acVector.concat(out);
									process(out);
								},
								error: function() {},
								complete: function() {
									smap.cmd.loading(false);
								}
							});
						}
						else {
							process(this._acVector);
						}
					}, this),
			displayText: function(item) {
				return item.searchWords;
			},
			// matcher: function(item) {
			// 	return item.name.search(this.query) > -1;
			// },
			highlighter: function(item) {

				// Make a dict from string
				var dict = {}, keyVal;
				var keyVals = item.split("&&");
				for (var i=0,len=keyVals.length; i<len; i++) {
					keyVal = keyVals[i].split("==");
					dict[keyVal[0]] = keyVal[1];
				}
				// Create HTML from dict
				var out = "";
				var i = 0;
				for (var key in dict) {
					if (i === 0) {
						out += '<div style="font-size:1.2em;">'+dict[key]+'</div>';
					}
					else {
						out += '<div><span>'+key+'</span>:&nbsp;<span>'+dict[key]+'</span></div>';
					}
					i++;
				}
				return out;
			},
			updater: function(item) {
				// Make a dict from string
				var dict = {}, keyVal;
				var keyVals = item.searchWords.split("&&");
				for (var i=0,len=keyVals.length; i<len; i++) {
					keyVal = keyVals[i].split("==");
					dict[keyVal[0]] = keyVal[1];
				}
				if ( dict[anyDisplayVectorKey] ) {
					return item.name + " " + vectorSuffix; //" [Hus]";
				}
				return item.name + " " + addressSuffix; //" [Adress]";
			},
			afterSelect: function(item) {
				// Do something with the result (geolocate it)

				if ( encodeURIComponent(item).search(encodeURIComponent(addressSuffix)) > -1) {
					item = $.trim(item.replace(addressSuffix, ""));
					self._geoLocate(item, "");
				}
				else if (encodeURIComponent(item).search(encodeURIComponent(vectorSuffix)) > -1) {
					item = $.trim(item.replace(vectorSuffix, ""));
					var layer = smap.cmd.getLayer(self.options.vectorSearch.layerId),
						lay, key;
					for (key in layer._layers) {
						lay = layer._layers[key];
						if (lay.feature.properties.title === item) {
							// This is the one
							var latLng = lay.getLatLng();
							smap.map.setView(latLng, 17);
							smap.map.fire("selected", {
								feature: lay.feature,
								selectedFeatures: [lay],
								layer: layer,
								latLng: latLng,
								shiftKeyWasPressed: false
							});
							break;
						}
					}
				}
			}
		});
	
		// Set options again
		var $entry = $("#smap-search-div input");
		$entry.typeahead('destroy');
		this._initAutoComplete($entry);
	},
	
	_onApplyParams: function(e, p) {
		if (p.POI) {
			var q = p.POI instanceof Array ? p.POI[0] : p.POI;
			q = q.replace(/--c--/g, ",");
			var showPopup = p.POI instanceof Array && p.POI.length > 1 ? p.POI[1] : false;

			var setView = false;

			// If POI is specified, then CENTER and ZOOM params given in the config should have no effect.
			// Therefore, we need the original web parameters and not those "polluted" with the params
			// from the config.
			var webParams = smap.core.paramInst.getWebParamsAsObject(),
				configParams = config.params;

			var zoom = webParams.ZOOM || this.options.zoom;
			if (!webParams.CENTER) {
				setView = true;
				if (!webParams.POI && configParams.CENTER) { // => POI is only defined in config
					// Follows this reasoning: https://github.com/getsmap/smap-responsive/issues/162 
					// If POI is only defined in config (not as a web parameter), then – and only then – will the CENTER and ZOOM 
					// in the config "fill in" (be a fallback) for missing CENTER or ZOOM in the web parameters – which would otherwise
					// set view to default poi CENTER and ZOOM.
					setView = false;
					zoom = p.ZOOM;
				}
			}

			this._geoLocate(decodeURIComponent(q), {
				setView: setView,
				zoom: zoom,
				showPopup: showPopup
			});
		}
	},
	
	_onCreateParams: function(e, obj) {
		if (this.marker && this.marker.options.q) {
			var showPopup = this.marker.getPopup()._isOpen ? true : false;
			obj.poi = [encodeURIComponent( this.marker.options.q.replace(/,/g, "--c--") )];
			if (showPopup) {
				obj.poi.push(1);
			}
		}
	},

	_rmAdressMarker: function(marker){
		if(marker != null){ 
			this.map.removeLayer(marker);
			this.addressMarker = null;
		}
	},

	_makeSearchField: function() {
		var self = this;
		
		var $searchDiv = $('<div id="smap-search-div" class="smap-search-div input-group input-group-lg"><span class="input-group-addon"><span class="glyphicon glyphicon-search"></span></span>'+
				'<input autocorrect="off" autocomplete="off" data-provide="typeahead" type="text" class="form-control" placeholder="'+this.lang.search+'"></input></div>');
		var $entry = $searchDiv.find("input");
		$entry.placeholder(); // IE9<= polyfill
		
		/**
		* Force keyboard to appear on Windows Phone: 
		* //stackoverflow.com/questions/11855609/forcing-numeric-keyboard-in-internet-explorer-on-windows-phone-7-5
		*/
		if (L.Browser.msTouch) {
			$entry.attr("pattern", "[0-9]");
		}
		
		function activate() {
			// Note! This is the breakpoint for small devices
			var w = $(window).width();
			if ( w >= self.options.pxDesktop || !L.Browser.touch) {
				return;
			}

			// Add a bg only for small touch devices
			var $bg = $("#smap-search-bg");
			if ( !$bg.length ) {
				$bg = $('<div id="smap-search-bg" />');
				$searchDiv.addClass("search-active");
				$("#mapdiv").append($bg);
				setTimeout(function() {
					$bg.addClass("search-bg-visible");					
				}, 1);
			}
		};
		function deactivate() {
			var w = $(window).width();
			if ( w >= self.options.pxDesktop || !L.Browser.touch) {
				return;
			}
			$searchDiv.removeClass("search-active");
			$("#smap-search-bg").removeClass("search-bg-visible");
			setTimeout(function() {
				$("#smap-search-bg").remove();			
			}, 300);
		};
		
		function prevDefault(e) {
//			e.preventDefault();
			e.stopPropagation();
		};
		
		$entry //.on("keypress", activate)
			.on("dblclick", prevDefault)
			.on("mousedown", prevDefault)
			.on("focus", function() {
				$(this).parent().addClass("smap-search-div-focused");
				$("#mapdiv").trigger("touchstart"); // Hide switcher panel
				activate();
			})
			.on("blur", function() {
				$(this).parent().removeClass("smap-search-div-focused");
			})
			.on("touchstart", function() {
				$(this).focus();
			});
		$searchDiv.on("click touchstart", function(e) {
			$(this).find("input").focus();
			e.stopImmediatePropagation(); // Don't stop event totally since select from autocomplete won't work
		});
		$entry.on("blur", deactivate);
		
		$("#maindiv").append( $searchDiv );
		smap.event.on("smap.core.pluginsadded", function() {
			var toolbar = $("#smap-menu-div nav");
			if (toolbar.length) {
				$searchDiv.addClass("smap-search-div-in-toolbar");
			}
		});
		
		var whitespace = this.options.whitespace;

		var geoLocate = this.options._geoLocate || this._geoLocate;
		var typeaheadOptions = {
				items: 5,
				minLength: 2,
				highlight: true,
				hint: true,
				// showHintOnFocus: true,
				afterSelect: function(val) {  // updater:
					smap.cmd.loading(true);
					geoLocate.call(self, val);
					deactivate();
					return val;
				}
	//		   displayKey: 'value',
	//		   source: bHound.ttAdapter(),
		};

		$.extend(typeaheadOptions, this.options.acOptions || {});

		if (this.options.source) {
			// Use your own custom source for autocomplete
			typeaheadOptions.source = $.proxy(this.options.source, this);
		}
		else {
			if (this.options.wsAcUrl) {
				typeaheadOptions.source = function(q, process) {
					q = encodeURIComponent(q);
					var url = self.options.wsAcUrl;
					if (whitespace) {
						q = q.replace(/%20/g, whitespace);
					}
					if (self._proxyInst) {
						self._proxyInst.abort();
					}
					self._proxyInst = $.ajax({
						type: "GET",
						url: self.options.useProxy ? smap.config.ws.proxy + encodeURIComponent(url + "?q=") + q : url + "?q="+q,
						dataType: "text",
						success: function(resp) {
							var arr = resp.split("\n");
							process(arr);
						},
						error: function() {}
					});
				}
			}
			else if (this.options.wsAcLocal && this.options.wsAcLocal instanceof Array) {
				// Use local autocomplete words
				typeaheadOptions.source = this.options.wsAcLocal;
			}
		}
		// $entry.typeahead(typeaheadOptions);
		this._initAutoComplete($entry, typeaheadOptions);
	},

	_initAutoComplete: function($entry, typeaheadOptions) {
		typeaheadOptions = typeaheadOptions || this.options.typeaheadOptions;

		var nbrOfRows = this.options.autoScrollAcOnRowNbr;
		this._onKeyPress = this._onKeyPress || function(e) {
			var isScrollUp = e.which === 38; // down
			var isScrollDown = e.which === 40; // up
			if (isScrollUp || isScrollDown) {
				var $item = $(".typeahead.dropdown-menu li.active");
				var totNbrOfRows = $item.parent().find("li").length;
				if ( isScrollUp && $item.index() === 1 || isScrollDown && $item.index() === totNbrOfRows-1) {
					// alert($item.find("a").text());
					// When going from last item and pressing arrow-down-key we want to scroll to top
					$item.parent().scrollTo($(".typeahead.dropdown-menu li:first"), 0);
				}
				else if ( isScrollUp && $item.index() === 0) {
					// alert($item.find("a").text());
					// When going from last item and pressing arrow-down-key we want to scroll to top
					$item.parent().scrollTo($(".typeahead.dropdown-menu li:last"), 0);
				}
				else if ($item.index() >= nbrOfRows) {
					// Scroll so that the selected item is vertically centered
					var $midItem = $item;
					for (var i = 0; i < nbrOfRows/2; i++) {
						$midItem = $midItem.prev();
					}
					if ($midItem && $midItem.length) {
						$item.parent().scrollTo($midItem, 0);
					}
				}
			}
		};
		$entry.off("keydown", this._onKeyPress).on("keydown", this._onKeyPress);
		$entry.typeahead(typeaheadOptions);
		// Set ac field height
		if (this.options.acHeight) {
			var $menu = $entry.data("typeahead").$menu;
			$menu.css({"max-height": this.options.acHeight});
		}
	},
	
	
	_geoLocate: function(q, options) {
		options = options || {};
		
		// Set defaults and override with options
		var defaults = {
				setView: true,
				showPopup: true
		};
		options = $.extend({}, defaults, options);
		
		if (this.options.qPattern) {
			// Modify the question value according to the pattern, e.g. 'qPattern: {"txt_cat": ${q}}'
			q = utils.extractToHtml(this.options.qPattern, {q: q});
		}
		q = encodeURIComponent(q);
		var url = this.options.wsLocateUrl;
		if (this.options.useProxy) {
			url = smap.config.ws.proxy + encodeURIComponent(url+"?q=")+q;
			var whitespace = this.options.whitespace;
			if (whitespace) {
				url = url.replace(/%20/g, whitespace);
			}
		}
		else {
			url = url+"?q="+q;
		}

		var callbacks = {
				success: function(json) {
					var self = this;
					if (this.marker) {
						this.map.removeLayer(this.marker);
						this.marker = null;
					}
					if (!json.features.length) {
						// This means the searched place does not exist – inform user
						smap.cmd.notify(this.lang.addressNotFound, "error");
						return;
					}
					var coords = json.features[0].geometry.coordinates;
					var latLng = L.latLng( coords[1], coords[0] );
					
					var wgs84 = "EPSG:4326";
					if (this.options.wsOrgProj && this.options.wsOrgProj !== wgs84) {
						// project the response
						var arr = window.proj4(this.options.wsOrgProj, wgs84, [latLng.lng, latLng.lat]);
						latLng = L.latLng(arr[1], arr[0]);
					}
					function onPopupOpen(e) {
						$("#smap-search-popupbtn").off("click").on("click", function() {
							self.map.removeLayer(self.marker);
							self.marker = null;
							return false;
						});
					};
					this.map.off("popupopen", onPopupOpen);
					this.map.on("popupopen", onPopupOpen);
					
					this.marker = L.marker(latLng, {icon: L.icon(this.options.markerIcon) }).addTo(this.map);
					this.marker.options.q = q; // Store for creating link to map
					
					this.marker.bindPopup('<p class="lead">'+decodeURIComponent(q)+'</p><div><button id="smap-search-popupbtn" class="btn btn-default btn-sm">'+this.lang.remove+'</button></div>');
					
					var zoom = options.zoom || this.options.zoom;
					if (options.setView) {
						this.map.setView(latLng, zoom, {animate: false}); // animate false fixes bug for IE10 where map turns white: https://github.com/getsmap/smap-mobile/issues/59					
					}
					else {
						// Don't let the popup force the map to pan – messing up the 
						// location we intended to set the map around.
						this.marker._popup.options.autoPan = false;
					}
					if (options.showPopup) {
						this.marker.openPopup();
					}
					$(".smap-search-div input").val(null);
					$(".smap-search-div input").blur();
					setTimeout(function() {
						$(".smap-search-div input").blur();
					}, 100);
				},
				complete: function() {
					smap.cmd.loading(false);
				}
		};


		$.ajax({
			url: url,
			type: "GET",
			dataType: "json",
			context: this,
			success: this.options.onLocateSuccess || callbacks.success,
			complete: callbacks.complete
		});
		
				
	},
	
	CLASS_NAME: "L.Control.Search"
});

L.control.search = function (options) {
	return new L.Control.Search(options);
};