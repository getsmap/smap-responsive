L.Control.RedirectClick = L.Control.extend({
	
	options: {
		position: 'topright', // just an example
		
		snedbild: {
					name: "snedbild",
					url: "http://xyz.malmo.se/urbex/index.htm?p=true&xy=${x};${y}", // Malmö URL
					//url: "http://kartor.helsingborg.se/urbex/sned_2011.html?p=true&xy=${x};${y}", //Helsingborg URL
					btnID: "smap-snedbild-btn",
					btnClass: "fa fa-plane",
					cursor: "crosshair"
		},
		gatuvy: {
					name: "gatuvy",
					url: "http://sbkvmgeoserver.malmo.se/cyclomedia/index.html?posx=${x}&posy=${y}",
					btnID: "smap-gatuvy-btn",
					btnClass: "fa fa-car",
					cursor: "crosshair"
		}
	},
	
	_lang: {
		"sv": {
			tooltipPrefix: "Klicka i kartan för att se ",

			snedbild: {
						name: "Snedbild"
			},
			gatuvy: {
						name: "Gatuvy"
			}
		},
		"en": {
			tooltipPrefix: "Click on the map to show ",
			snedbild: {
						name: "Perspective image"
			},
			gatuvy: {
						name: "Street view"
			}
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
	
	_setURL: function(url){
		var self = this;
		self.options.url = url ? url || self.options.url : null;
	},
	
	onAdd: function(map) {
		var self = this;
		this.map = map;
		
		this._container = L.DomUtil.create('div', 'leaflet-control-RedirectClick');
		L.DomEvent.disableClickPropagation(this._container);
		
		this.$container = $(this._container);
		
		if (this.options.snedbild.url) {
			self._createButton(this.options.snedbild);
		}
		if (this.options.gatuvy.url) {
			self._createButton(this.options.gatuvy);
		}
		

		return this._container;
	},

	addHooks: function (target) {
		var targetName = this.lang[target.name].name.toLowerCase();
		target.text = this.lang.tooltipPrefix + targetName;

		this.tooltip = new L.Tooltip(this.map).updateContent(target);

		this.map.on('mousemove mouseup', this._onMouseMove, this);

	},
	
	removeHooks: function () {
		if (this._map) {
			if(this.tooltip){					
				this.tooltip.dispose();
				this._map.off( "click" );
				this._map.off('mousemove mouseup', this._onMouseMove, this);
			}
		}
	},
	
	_projectEPSG: function (evt) {
		//creating source and destination Proj4js objects
		//once initialized, these may be re-used as often as needed
		var source = new Proj4js.Proj('EPSG:4326');    	//source coordinates will be in Longitude/Latitude
		var dest = new Proj4js.Proj('EPSG:3008');     	//destination coordinates in WGS84, south of Leaflet
		
		var lfproj = L.Proj;
				
		//transforming point coordinates
		var p = new Proj4js.Point(evt.latlng.lng, evt.latlng.lat);   //any object will do as long as it has 'x' and 'y' properties
		Proj4js.transform(source, dest, p);     		//do the transformation.  x and y are modified in place	

		evt.latlng.lat = p.x; //Must proj x to this (117252 or 13.123);
		evt.latlng.lng = p.y; //Must proj y to this (6165717 or 55.456);
		return evt	
	},
	
	_onMouseMove: function (e) {
		
		this.tooltip.updatePosition(e.latlng);
	},

	onMapClick: function(e) {
		
		this.onDone(e, this.target);
		this._deactivate(this.target);	
	},
		
	
	_createButton: function(target) {
		var self = this;

		var $btn = $('<button id="'+ target.btnID +'" title="' + this.lang[target.name].name + '" class="btn btn-default"><span class="'+target.btnClass+'"></span></button>');
		$btn.on("click", function() {
			self._deactivate(target);
			self._activate(target);
			return false;
		});
		self.$container.append($btn);
	},

	_activate: function(target) {
		var self = this;

		if (target.url) {
			this.target = target;
			if (this.map) {
				self.addHooks(target);
				$("#mapdiv").css({'cursor': target.cursor});

				self._map.on("click", this.onMapClick, this);
			}
		}

		else {
			self._deactivate()
			utils.log('Redirect URL missing.')
		}
	},

	_deactivate: function(target) {
		$("#mapdiv").css({'cursor': ''});
		this.removeHooks();
		this._map.off( "click", this.onMapClick, this );
		this._map.off('mousemove mouseup', this._onMouseMove, this);
	},

	onRemove: function(map) {
		this.$container.empty();
	},
	
	onDone : function(e, target) {
		var self = this;

		if (target.name == 'snedbild'){
			var url = self.options.snedbild.url;
			var source = new proj4.Proj('EPSG:4326');    	//source coordinates will be in Longitude/Latitude
			var dest = new proj4.Proj('EPSG:3008');     	//destination coordinates in WGS84, south of Leaflet
		
			var point = {
				x:e.latlng.lng,
				y:e.latlng.lat
			};

			proj4.transform(source, dest,point);
			url = url.replace(/\${x}/g, point.x).replace(/\${y}/g, point.y); 
		}

		if (target.name == 'gatuvy'){
			var url = self.options.gatuvy.url;
			var source = new proj4.Proj('EPSG:4326');    	//source coordinates will be in Longitude/Latitude
			var dest = new proj4.Proj('EPSG:3008');     	//destination coordinates in WGS84, south of Leaflet
		
			var point = {
				x:e.latlng.lng,
				y:e.latlng.lat
			};

			proj4.transform(source, dest,point);
			url = url.replace(/\${x}/g, point.x).replace(/\${y}/g, point.y); 
		}

		window.open(url, target.name);
	},
});

// Do something when the map initializes
//L.Map.addInitHook(function () {
//	if (this.options.attributionControl) {
//		this.attributionControl = (new L.Control.MyPlugin()).addTo(this);
//	}
//});


/*
 * This code just makes removes the need for
 * using "new" when instantiating the class. It
 * is a Leaflet convention and should be there.
 */
L.control.redirectclick = function(options) {
	return new L.Control.RedirectClick(options);
};
