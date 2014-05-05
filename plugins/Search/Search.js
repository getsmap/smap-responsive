L.Control.Search = L.Control.extend({
	options: {
		//wsAcUrl : "http://localhost/cgi-bin/proxy.py?url=http://kartor.helsingborg.se/Hws/sok_json_fme.py?term=",
		//wsAcUrl : "http://localhost/cgi-bin/proxy.py?url=http://kartor.helsingborg.se/Hws/autocomplete_hbg.ashx?q=",
		wsAcUrl: "http://xyz.malmo.se/WS/sKarta/autocomplete_limit.ashx",  //"http://localhost/cgi-bin/proxy.py?url=http://kartor.helsingborg.se/Hws/sok.py?",
		wsLocateUrl: "http://xyz.malmo.se/WS/sKarta/sokexakt.ashx",  //"http://localhost/cgi-bin/proxy.py?url=http://kartor.helsingborg.se/Hws/sokexakkt.py",
		whitespace: "%2B",
		wsOrgProj: "EPSG:3006", //"EPSG:3008"
		pxDesktop: 992
	},
	
	_lang: {
		"sv": {
			search: "Sök",
			addressNotFound: "Den sökta adressen hittades inte",
			remove: "Ta bort"
		},
		"en": {
			search: "Search",
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
		this._setLang(options.langCode);
	},

	onAdd: function(map) {
		var self = this;
		self.map = map;
		self._container = L.DomUtil.create('div', 'leaflet-control-search'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		self.$container = $(self._container);
		self._makeSearchField();
		
		// Bind events
		this.__onApplyParams = this.__onApplyParams || $.proxy( this._onApplyParams, this );
		smap.event.on("smap.core.applyparams", this.__onApplyParams);
		
		this.__onCreateParams = this.__onCreateParams || $.proxy( this._onCreateParams, this );
		smap.event.on("smap.core.createparams", this.__onCreateParams);
		
		this.map.on("click", this._blurSearch);
			
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
			this._geoLocate(decodeURIComponent( p.POI ));
		}
	},
	
	_onCreateParams: function(e, obj) {
		if (this.marker && this.marker.options.q) {
			obj.POI = encodeURIComponent( this.marker.options.q );
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
		
		/**
		 * Force keyboard to appear on Windows Phone: 
		 * http://stackoverflow.com/questions/11855609/forcing-numeric-keyboard-in-internet-explorer-on-windows-phone-7-5
		 */
		$entry.attr("pattern", "[0-9]");
		
		function activate() {
			// Note! This is the breakpoint for small devices
			var w = $(window).width();
			if ( w >= self.options.pxDesktop || !L.Browser.touch) {
				return;
			}
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
		
		$entry.on("keypress", activate)
			.on("dblclick", prevDefault)
			.on("mousedown", prevDefault)
			.on("focus", function() {
				$(this).parent().addClass("smap-search-div-focused");
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

		
//		var bHound = new Bloodhound({
//			datumTokenizer: Bloodhound.tokenizers.whitespace,
//			queryTokenizer: Bloodhound.tokenizers.whitespace,
////			local:  ["Alabama","Alaska","Arizona","Arkansas","Arkansas2","Barkansas"]
//	    	remote: {
//	      		url: smap.config.ws.proxy + encodeURIComponent( this.options.wsAcUrl ),
//	        	filter: function(text) {
//					text = text.split("\n");
//					var vals = [];
//	            	for (var i=0; i<text.length; i++) {
//	            		vals.push({
//		                    value: text[i]
//		                });
//	            	}
//	            	return vals;
//				}
//	    	}
//		});
//		bHound.initialize();
		
		var whitespace = this.options.whitespace;

		var geoLocate = this._geoLocate;
		$entry.typeahead({
			items: 5,
			minLength: 2,
			highlight: true,
			hint: true,
			updater: function(val) {
				smap.cmd.loading(true);
				geoLocate.call(self, val);
				deactivate();
				return val;
			},
//		    displayKey: 'value',
//		    source: bHound.ttAdapter(),
			source: function(q, process) {
				var url = encodeURIComponent( self.options.wsAcUrl + "?q="+q);
				if (whitespace) {
					url = url.replace(/%20/g, whitespace);					
				}
				if (self.proxyInst) {
					self.proxyInst.abort();
				}
				self.proxyInst = $.ajax({
					type: "GET",
					url: smap.config.ws.proxy + url,
					dataType: "text",
					success: function(resp) {
						var arr = resp.split("\n");
						process(arr);
					},
					error: function() {}
				});
			}
//		    template: '<p>{{value}} ({{country_code}})</p>',
		});
	},
	
	
	_geoLocate: function(q) {
		var url = encodeURIComponent( this.options.wsLocateUrl + "?q="+q);
		var whitespace = this.options.whitespace;
		if (whitespace) {
			url = url.replace(/%20/g, whitespace);					
		}
		$.ajax({
			url: smap.config.ws.proxy + url,
			type: "GET",
			dataType: "json",
			context: this,
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
				
				
				this.marker.bindPopup('<p class="lead">'+q+'</p><div><button id="smap-search-popupbtn" class="btn btn-default">'+this.lang.remove+'</button></div>');
				this.marker.openPopup();
				this.map.setView(latLng, 15);
				$("#smap-search-div input").val(null);
				$("#smap-search-div input").blur();
				setTimeout(function() {
					$("#smap-search-div input").blur();
				}, 100);
			},
			complete: function() {
				smap.cmd.loading(false);
			}
		});
		
				
	},
	
	CLASS_NAME: "L.Control.Search"
});

L.control.search = function (options) {
	return new L.Control.Search(options);
};