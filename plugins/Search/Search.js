L.Control.Search = L.Control.extend({
	options: {
		//wsAcUrl : "http://localhost/cgi-bin/proxy.py?url=http://kartor.helsingborg.se/Hws/sok_json_fme.py?term=",
		//wsAcUrl : "http://localhost/cgi-bin/proxy.py?url=http://kartor.helsingborg.se/Hws/autocomplete_hbg.ashx?q=",
		wsAcUrl: "http://xyz.malmo.se/WS/sKarta/autocomplete_limit.ashx",  //"http://localhost/cgi-bin/proxy.py?url=http://kartor.helsingborg.se/Hws/sok.py?",
		wsLocateUrl: "http://xyz.malmo.se/WS/sKarta/sokexakt.ashx",  //"http://localhost/cgi-bin/proxy.py?url=http://kartor.helsingborg.se/Hws/sokexakkt.py",
		whitespace: "%2B"
	},
	
	_lang: {
		"sv": {
			search: "Sök"
		},
		"en": {
			search: "Search"
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
		return self._container;
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
				'<input autocomplete="off" data-provide="typeahead" type="text" class="form-control" placeholder="'+this.lang.search+'"></input></div>');
		var $entry = $searchDiv.find("input");
		
		function activate() {
			var $bg = $("#smap-search-bg");
			if ( !$bg.length ) {
				$bg = $('<div id="smap-search-bg" />');				
				$searchDiv.addClass("search-active");
				$("#mapdiv").append($bg);
			}
		};
		function deactivate() {
			$searchDiv.removeClass("search-active");
			$("#smap-search-bg").remove();
		};
		
		function prevDefault(e) {
//			e.preventDefault();
			e.stopPropagation();
		};
		
		$entry.on("keypress", activate);
		$entry.on("dblclick", prevDefault);
		$entry.on("mousedown", prevDefault);
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

		// instantiate the typeahead UI
		$entry.typeahead({
			items: 10,
			minLength: 2,
			highlight: true,
			hint: true,
			updater: function(val) {
				deactivate();
				return val;
			},
//		    displayKey: 'value',
//		    source: bHound.ttAdapter(),
			source: function(q, process) {
				var url = encodeURIComponent( self.options.wsAcUrl + "?q="+q);
				if (whitespace) {
					url = url.replace(/%20/g, self.options.whitespace);					
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
		}).on('typeahead:selected', function(e, datum) {
				
				$.ajax({
					url : smap.config.ws.proxy + encodeURIComponent( this.options.wsLocateUrl ),
					data:{ "q" : datum.value },
					type:"POST",
					dataType: "json",
					success: function(json) {
						self._rmAdressMarker(self.addressMarker);
						var p = new proj4.Point(json.features[0].geometry.coordinates[0],json.features[0].geometry.coordinates[1]);
						var src = proj4.defs["EPSG:3008"];
						var dest = proj4.defs["EPSG:4326"];			
						p = proj4(src, dest, p);
						var content = $('<button id="search-marker">Ta bort markör</button>').click(function() {
							self._rmAdressMarker(self.addressMarker);
						})[0];
						var addressMarker = L.marker([p.y, p.x]).bindPopup(content);
						//var addressMarker = L.Control.SideBars.createMarker([p.y, p.x]);
						addressMarker.addTo(self.map);
						self.addressMarker = addressMarker;
					}
				});
		});

	},
	

	onRemove: function(map) {
		// Do everything "opposite" of onAdd – e.g. unbind events and destroy things
		// map.off('layeradd', this._onLayerAdd).off('layerremove', this._onLayerRemove);
	},
	CLASS_NAME: "L.Control.Search"
});


// Do something when the map initializes (example taken from Leaflet attribution control)

//L.Map.addInitHook(function () {
//	if (this.options.attributionControl) {
//		this.attributionControl = (new L.Control.Template()).addTo(this);
//	}
//});


/*
 * This code just makes removes the need for
 * using "new" when instantiating the class. It
 * is a Leaflet convention and should be there.
 */
L.control.search = function (options) {
	return new L.Control.Search(options);
};