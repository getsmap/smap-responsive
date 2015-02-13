L.Control.Search = L.Control.extend({
	options: {
		//wsAcUrl : "//localhost/cgi-bin/proxy.py?url=//kartor.helsingborg.se/Hws/sok_json_fme.py?term=",
		//wsAcUrl : "//localhost/cgi-bin/proxy.py?url=//kartor.helsingborg.se/Hws/autocomplete_hbg.ashx?q=",
		// wsAcUrl: "//xyz.malmo.se/WS/sKarta/autocomplete_limit.ashx",  //"//localhost/cgi-bin/proxy.py?url=//kartor.helsingborg.se/Hws/sok.py?",
		// wsLocateUrl: "//xyz.malmo.se/WS/sKarta/sokexakt.ashx",  //"//localhost/cgi-bin/proxy.py?url=//kartor.helsingborg.se/Hws/sokexakkt.py",
		
		whitespace: "%2B", //"%20",
		wsOrgProj: "EPSG:3006", //"EPSG:3008"
		pxDesktop: 992,
		gui: false,
		addToMenu: false,
		zoom: 15
		// _geoLocate: function(q) {
			// // TODO: When this function is completed, move to config file cultmap.js
			// function cleanUp() {
				// // Hide layer if added and
				// $(".lswitch-temprow.active").tap();
				// $(".lswitch-temprow").remove(); // Remove old searches
				// // $(".lswitch-temprow.active").each(function() {
				// // 	var t = $(this).data("t");
				// // 	var layer = smap.cmd.getLayer( t.options.layerId );
				// // 	if (layer) {
				// // 		layer.destroy();
				// // 	}
				// // });
			// }

			// function onKeyUp(e) {
				// if (e.keyCode === 8 && $(this).val() == "") {
					// cleanUp();
				// }
			// }
			// // This code should not be here, but it's ok because it doesn't harm anyone
			// this._onKeyUp = this._onKeyUp || onKeyUp;
			// $("#smap-search-div input").off("keyup", this._onKeyUp).on("keyup", this._onKeyUp);

			// cleanUp(); // clean up old searches

			// var lswitchInst = smap.cmd.getControl("L.Control.LayerSwitcher");
			// if (lswitchInst) {
				// var t = {
						// init: "L.GeoJSON.WFS",
						// url: "//localhost/cherrypy/cultmap/getdata", //"//localhost/cgi-bin/cultMap/getGeoData.py",
						// options: {
							// proxy: null,
							// // zoomToExtent: true,
							// // xhrType: "GET",
							// layerId: "searchresults",
							// displayName: "Sökresultat: "+'"'+q+'"',
							// category: null,
							// attribution: "Stadsbyggnadskontoret, Malmö",
							// inputCrs: "EPSG:4326",
							// reverseAxis: false,
							// reverseAxisBbox: false,
							// selectable: true,
							// popup: '<h4>${txt_name}</h4>',
							// uniqueKey: "id",
							// params: {
								// q: encodeURIComponent(q)
							// },
							// style: {
								// radius: 8,
								// fillColor: "#ff7800",
								// color: "#000",
								// weight: 1,
								// opacity: 1,
								// fillOpacity: 0.8
							// },
							// selectStyle: {
								// radius: 8,
								// fillColor: "#0FF",
								// color: "#0FF",
								// weight: 1,
								// opacity: 1,
								// fillOpacity: 0.5
							// }
						// }
				// };
				// var row = lswitchInst._addRow(t);
				// row.data("t", t);
				// row.addClass("lswitch-temprow");
				// row.tap();

			// }
		// }

							// onLocateSuccess: function(json) {
							// 	// Simply add all the features to a new layer we call "searchlayer"
							// 	// TODO: This layer should have the same popup interaction as all other layers.
							// 	// TODO: Probably the layer should be cleared when an overlay is turned on.
								
							// 	var self = this;
							// 	function clearMarkerLayer() {
							// 		if (self.markerLayer) {
							// 			self.map.removeLayer(self.markerLayer);
							// 			self.markerLayer = null;
							// 		}
							// 	}
							// 	function onKeyUp(e) {
							// 		if (e.keyCode === 8 && $(this).val() == "") {
							// 			clearMarkerLayer();
							// 		}
							// 	}
							// 	// This code should not be here, but it's ok because it doesn't harm anyone
							// 	this._onKeyUp = this._onKeyUp || onKeyUp;
							// 	$("#smap-search-div input").off("keyup", this._onKeyUp).on("keyup", this._onKeyUp);

							// 	if (!json.features.length) {
							// 		smap.cmd.notify("Inga sökträffar", "error");
							// 		return;
							// 	}
							// 	var geoJson = L.geoJson(json);
							// 	if (this.markerLayer) {
							// 		clearMarkerLayer()
							// 	}
							// 	this.markerLayer = L.geoJson(null, {
							// 		layerId: "searchlayer",
							// 		selectable: true,
							// 		popup: '${txt_cat}',
							// 		uniqueKey: "id",
							// 		style: {
							// 			radius: 8,
							// 			fillColor: "#00F",
							// 			color: "#00F",
							// 			weight: 2,
							// 			opacity: 1,
							// 			fillOpacity: 0.2
							// 		},
							// 		selectStyle: {
							// 			weight: 5,
							// 			fillColor: "#0FF",
							// 	       color: "#0FF",
							// 	       opacity: 1,
							// 	       fillOpacity: 1
							// 		}
							// 	}).addTo(this.map);
							// 	this.map.addLayer(this.markerLayer);
							// 	this.markerLayer.addData(json);
							// 	this.markerLayer.fire("load"); // Make all features selectable
							// 	this.map.fitBounds(this.markerLayer.getBounds());
							// }
		// qPattern: '{"txt_cat": ${q}}'
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
			this._makeSearchField();
			this.map.on("click", this._blurSearch);
		}
		
		// Bind events
		this.__onApplyParams = this.__onApplyParams || $.proxy( this._onApplyParams, this );
		smap.event.on("smap.core.applyparams", this.__onApplyParams);
		
		this.__onCreateParams = this.__onCreateParams || $.proxy( this._onCreateParams, this );
		smap.event.on("smap.core.createparams", this.__onCreateParams);
		
		
		return self._container;
	},
	
	_blurSearch: function() {
		$("#smap-search-div input").blur();
	},
	
	onRemove: function(map) {
		smap.event.off("smap.core.applyparams", this.__onApplyParams);
		smap.event.off("smap.core.createparams", this.__onCreateParams);
		this.map.off("click", this._blurSearch);
	},
	
	_onApplyParams: function(e, p) {
		if (p.POI) {
			var q = p.POI instanceof Array ? p.POI[0] : p.POI;
			q = q.replace(/--c--/g, ",");
			var showPopup = p.POI instanceof Array && p.POI.length > 1 ? p.POI[1] : false;

			var setView = false;
			var orgParams = smap.core.paramInst.getParams();
			if (!orgParams.ZOOM && !orgParams.CENTER) {
				setView = true;
			}
			this._geoLocate(decodeURIComponent(q), {
				setView: setView,
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
		
		var $searchDiv = $('<div id="smap-search-div" class="input-group input-group-lg"><span class="input-group-addon"><span class="glyphicon glyphicon-search"></span></span>'+
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
		
		$("#mapdiv").append( $searchDiv );
		smap.event.on("smap.core.pluginsadded", function() {
			var toolbar = $("#smap-menu-div nav");
			if (toolbar.length) {
				$searchDiv.addClass("smap-search-div-in-toolbar");
			}
		});
		
		var whitespace = this.options.whitespace;

		var geoLocate = this.options._geoLocate || this._geoLocate;
		var typeheadOptions = {
				items: 5,
				minLength: 2,
				highlight: true,
				hint: true,
				updater: function(val) {
					smap.cmd.loading(true);
					geoLocate.call(self, val);
					deactivate();
					return val;
				}
	//		   displayKey: 'value',
	//		   source: bHound.ttAdapter(),
		};

		if (this.options.wsAcUrl) {
			typeheadOptions.source = function(q, process) {
				q = encodeURIComponent(q);
				var url = self.options.wsAcUrl;
				if (whitespace) {
					q = q.replace(/%20/g, whitespace);
				}
				if (self.proxyInst) {
					self.proxyInst.abort();
				}
				self.proxyInst = $.ajax({
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
			typeheadOptions.source = this.options.wsAcLocal;
		}

		
		$entry.typeahead(typeheadOptions);
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
			url = url+"?q="+q
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
					
					this.marker = L.marker(latLng).addTo(this.map);
					this.marker.options.q = q; // Store for creating link to map
					
					this.marker.bindPopup('<p class="lead">'+decodeURIComponent(q)+'</p><div><button id="smap-search-popupbtn" class="btn btn-default btn-sm">'+this.lang.remove+'</button></div>');
					
					if (options.setView) {
						this.map.setView(latLng, this.options.zoom, {animate: false}); // animate false fixes bug for IE10 where map turns white: https://github.com/getsmap/smap-mobile/issues/59					
					}
					if (options.showPopup) {
						this.marker.openPopup();
					}
					$("#smap-search-div input").val(null);
					$("#smap-search-div input").blur();
					setTimeout(function() {
						$("#smap-search-div input").blur();
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