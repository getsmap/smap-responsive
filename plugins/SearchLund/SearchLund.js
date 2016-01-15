L.Control.SearchLund = L.Control.extend({
	options: {

		whitespace: "%2B", //%20
		wsOrgProj: "EPSG:3006", //"EPSG:3008"
		pxDesktop: 992,
		addToMenu: false
		
	},
	
	_lang: {
		"sv": {
			search: "Sök",
			addressNotFound: "Den sökta adressen hittades inte",
			remove: "Ta bort"
		},
		"en": {
			search: "Search property",
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
		this.map = map;
		this._container = L.DomUtil.create('div', 'leaflet-control-searchlund'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		this.$container = $(this._container);
		this.$container.css("display", "none");
		this._makeSearchField();
		
		// Bind events
		this.__onApplyParams = this.__onApplyParams || $.proxy( this._onApplyParams, this );
		smap.event.on("smap.core.applyparams", this.__onApplyParams);
		
		this.__onCreateParams = this.__onCreateParams || $.proxy( this._onCreateParams, this );
		smap.event.on("smap.core.createparams", this.__onCreateParams);
		
		this.map.on("click", this._blurSearch);
		
		return self._container;
	},
	
	_blurSearch: function() {
		$("#smap-searchlund-div input").blur();
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
			this._geoLocate(decodeURIComponent(q), {
				setView: false,
				showPopup: showPopup
			});
		}
	},
	
	_onCreateParams: function(e, obj) {
		if (this.marker && this.marker.options.q) {
			var showPopup = this.marker.getPopup()._isOpen ? true : false;
			obj.POI = [encodeURIComponent( this.marker.options.q.replace(/,/g, "--c--") )];
			if (showPopup) {
				obj.POI.push(1);
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
		
		var $searchDiv = $('<div id="smap-searchlund-div" class="input-group input-group-lg"><span class="input-group-addon"><span class="glyphicon glyphicon-search"></span></span>'+
				'<input autocorrect="off" autocomplete="off" data-provide="typeahead" type="text" class="form-control" placeholder="'+this.lang.search+'"></input></div>');
		var $entry = $searchDiv.find("input");
		
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
			if ( w >= self.options.pxDesktop || !utils.isTouchOnly()) {
				return;
			}

			// Add a bg only for small touch devices
			var $bg = $("#smap-searchlund-bg");
			if ( !$bg.length ) {
				$bg = $('<div id="smap-searchlund-bg" />');
				$searchDiv.addClass("searchlund-active");
				$("#mapdiv").append($bg);
				setTimeout(function() {
					$bg.addClass("searchlund-bg-visible");					
				}, 1);
			}
		};
		function deactivate() {
			var w = $(window).width();
			if ( w >= self.options.pxDesktop || !utils.isTouchOnly()) {
				return;
			}
			$searchDiv.removeClass("searchlund-active");
			$("#smap-searchlund-bg").removeClass("searchlund-bg-visible");
			setTimeout(function() {
				$("#smap-searchlund-bg").remove();			
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
				$(this).parent().addClass("smap-searchlund-div-focused");
			})
			.on("blur", function() {
				$(this).parent().removeClass("smap-searchlund-div-focused");
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
				$searchDiv.addClass("smap-searchlund-div-in-toolbar");
			}
		});
		
		var whitespace = this.options.whitespace;

		var geoLocate = this.options._geoLocate || this._geoLocate;
		var typeheadOptions = {
				items: 10,
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
				var url = encodeURIComponent( self.options.wsAcUrl + "?format=json&prefix="+q);
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
						//var arr = resp.split("\n");
						var arr = $.parseJSON(resp);
						//alert (arr.items[0].name);
						var arr2 = [];
						for (i=0, len=arr.items.length; i<len; i++) {
							//alert("in");
							arr2[i]= arr.items[i].name; //.split(",")[0];
							//alert("ut");
						}
						//alert(arr2[0]);
						process(arr2);
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
		//alert(q);
		var url = encodeURIComponent( this.options.wsLocateUrl + "?format=json&objectname="+q);
		//alert(url);
		var whitespace = this.options.whitespace;
		if (whitespace) {
			url = url.replace(/%20/g, whitespace);	
			//alert(url);
		}
		


		var callbacks = {
				success: function(json) {
					var self = this;
					if (this.marker) {
						this.map.removeLayer(this.marker);
						this.marker = null;
						if(this.polyLayerGroup){
							this.polyLayerGroup.clearLayers();
							self.map.removeLayer(this.polyLayerGroup);
						}
					}
					if (!json.items.length) {
						// This means the searched place does not exist – inform user
						smap.cmd.notify(this.lang.addressNotFound, "error");
						return;
					}
					var coords=[];
					for (var m=0,len=json.items.length; m<len; m++) {
						coords[m] = $.parseJSON(json.items[m].geometry);
					}
					
					if(coords[0].type=="MultiPoint") {
						var latLng = L.latLng( coords[0].coordinates[0][1],coords[0].coordinates[0][0]);
					
						var wgs84 = "EPSG:4326";
						if (this.options.wsOrgProj && this.options.wsOrgProj !== wgs84) {
							// project the response
							var arr = window.proj4(this.options.wsOrgProj, wgs84, [latLng.lng, latLng.lat]);
							latLng = L.latLng(arr[1], arr[0]);
						}
					}
					if(coords[0].type=="Polygon") {
						var polyLatLng = [];
						var latLng;
						for (var i=0;i<coords.length;i++) {
							polyLatLng[i] = [];
						}
						for (var j=0,len1=coords.length; j<len1; j++) {
							for (var i=0,len2=coords[j].coordinates[0].length; i<len2; i++) {
								var latLng = L.latLng( coords[j].coordinates[0][i][1],coords[j].coordinates[0][i][0])
								var wgs84 = "EPSG:4326";
								if (this.options.wsOrgProj && this.options.wsOrgProj !== wgs84) {
									// project the response
									var arr = window.proj4(this.options.wsOrgProj, wgs84, [latLng.lng, latLng.lat]);
									latLng = L.latLng(arr[1], arr[0]);
								}
								polyLatLng[j].push(latLng);
							}
							//alert(polyLatLng[j]);
							// for (var i=0,len2=coords[j].coordinates[].length; i<len2; i++) {
								// var latLng = L.latLng( coords[0].coordinates[j][i][1],coords[0].coordinates[j][i][0])
								// var wgs84 = "EPSG:4326";
								// if (this.options.wsOrgProj && this.options.wsOrgProj !== wgs84) {
									// // project the response
									// var arr = window.proj4(this.options.wsOrgProj, wgs84, [latLng.lng, latLng.lat]);
									// latLng = L.latLng(arr[1], arr[0]);
								// }
								// polyLatLng.push(latLng);
							// }
						
						
						}
					}
					function onPopupOpen(e) {
						$("#smap-searchlund-popupbtn").off("click").on("click", function() {
							self.map.removeLayer(self.marker);
							self.marker = null;
							self.polyLayerGroup.clearLayers();
							self.map.removeLayer(self.polyLayerGroup);
							return false;
						});
					};
					this.map.off("popupopen", onPopupOpen);
					this.map.on("popupopen", onPopupOpen);
					
					if(coords[0].type=="MultiPoint") {
						this.marker = L.marker(latLng).addTo(this.map);
						this.marker.options.q = q; // Store for creating link to map
						
						this.marker.bindPopup('<p class="lead">'+q+'</p><div><button id="smap-searchlund-popupbtn" class="btn btn-default">'+this.lang.remove+'</button></div>');
					
						if (options.setView) {
							this.map.setView(latLng, 17, {animate: false}); // animate false fixes bug for IE10 where map turns white: https://github.com/getsmap/smap-mobile/issues/59					
						}
					}
					
					if(coords[0].type=="Polygon") {
					this.polyLayerGroup = new L.LayerGroup();
						for (var i=0;i<coords.length;i++) {
							this.mapPolygon = L.polygon(polyLatLng[i]);
							this.polyLayerGroup.addLayer(this.mapPolygon);
							
						}
						this.map.addLayer(this.polyLayerGroup);
						
						var polCenter = this.mapPolygon.getBounds().getCenter();
						this.marker = L.marker(polCenter).addTo(this.map);
						this.marker.options.q = q; // Store for creating link to map
						
						
						
						this.marker.bindPopup('<p class="lead">'+q+'</p><div><button id="smap-searchlund-popupbtn" class="btn btn-default">'+this.lang.remove+'</button></div>');
					
						if (options.setView) {
							this.map.setView(latLng, 17, {animate: false}); // animate false fixes bug for IE10 where map turns white: https://github.com/getsmap/smap-mobile/issues/59					
						}
					}
					
					if (options.showPopup) {
						this.marker.openPopup();
					}
					$("#smap-searchlund-div input").val(null);
					$("#smap-searchlund-div input").blur();
					setTimeout(function() {
						$("#smap-searchlund-div input").blur();
					}, 100);
				},
				complete: function() {
					smap.cmd.loading(false);
				}
		};


		$.ajax({
			url: smap.config.ws.proxy + url,
			type: "GET",
			dataType: "json",
			context: this,
			success: this.options.onLocateSuccess || callbacks.success,
			complete: callbacks.complete
		});
		
				
	},
	
	CLASS_NAME: "L.Control.SearchLund"
});

L.control.searchLund = function (options) {
	return new L.Control.SearchLund(options);
};