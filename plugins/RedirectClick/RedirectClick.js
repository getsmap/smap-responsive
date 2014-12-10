L.Control.RedirectClick = L.Control.extend({
	
	options: {
		position: 'topright',
		btnID: "smap-redirect-btn",
	},
	
	_setLang: function(langCode) {
		langCode = langCode || smap.config.langCode || navigator.language.split("-")[0] || "en";
		if (this._lang) {
			this._lang = $.extend( true, this._lang, this.options._lang);
			this.lang = this._lang ? this._lang[langCode] : null;
		}
	},

	initialize: function(options) {
		this._lang = {
			"sv": {},
			"en": {}
		};
		L.setOptions(this, options);
		this._setLang(options.langCode);
	},
	
	_setURL: function(url){
		var self = this;
		self.options.url = url ? url || self.options.url : null;
	},
	
	onAdd: function(map) {
		
		this.map = map;

		this._container = L.DomUtil.create('div', 'leaflet-control-RedirectClick');
		L.DomEvent.disableClickPropagation(this._container);
		this.$container = $(this._container);

		this._createButton();

		return this._container;
	},

	addHooks: function () {
		this._tooltip = {};
		this._tooltip.text = this.lang.hoverText; // L.Tooltip expects an object with key "text"
		this.tooltip = new L.Tooltip(this.map).updateContent(this._tooltip);
		this.map.on("click", this.onMapClick, this);
		this.map.on('mousemove mouseup', this._onMouseMove, this);
	},
	
	removeHooks: function () {
		if (this.map) {
			if(this.tooltip){					
				this.tooltip.dispose();
				this.map.off('click', this.onMapClick, this);
				this.map.off('mousemove mouseup', this._onMouseMove, this);
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
		this.onDone(e);
		this._deactivate();
	},

	_createButton: function() {
		var self = this;

		var $btn = $('<button id="'+ this.options.btnID +'" title="' + this.lang.name + '" class="btn btn-default"><span class="'+this.options.btnClass+'"></span></button>');
		$btn.on("click", function() {
			if (!self.active || self.active === false) {
				self._deactivate();
				self._activate();
				self.active = true;
			}

			else{
				self._deactivate();
				$("#mapdiv").focus(); //takes focus from button
				self.active = false;
			}

			return false;
		});

		self.$container.append($btn);
	},

	_activate: function() {
		var self = this;
		if (self.active) {
			return false; 
		}

		this._deactivateAll();

		if (this.options.url) {
			if (this.map) {
				self.removeHooks();
				self.addHooks();
				$("#mapdiv").css({'cursor': self.options.cursor});
			}
		}

		else {
			self._deactivate()
			$("#mapdiv").focus(); //takes focus from button
			utils.log('RedirectClick error: Redirect URL missing. Check config-file.')
		}
	},

	_deactivate: function() {
		this.active = false;
		this.removeHooks();
		$("#mapdiv").css({'cursor': ''}); //reset cursor CSS
		
	},

	_deactivateAll: function() {
		var controls = smap.cmd.getControls('RedirectClick');
		for (var i = 0; i < controls.length; i++) {
			controls[i]._deactivate();
		}
	},

	onRemove: function(map) {
		this.$container.empty();
	},
	
	onDone : function(e) {
		var self = this;

		var url = self.options.url;
		var source = new proj4.Proj('EPSG:4326');    	//source coordinates will be in Longitude/Latitude
		var dest = new proj4.Proj('EPSG:3008');     	//destination coordinates in WGS84, south of Leaflet

		var point = {
			x:e.latlng.lng,
			y:e.latlng.lat
		};

		proj4.transform(source, dest,point);
		url = url.replace(/\${x}/g, point.x).replace(/\${y}/g, point.y); 
		
		window.open(url, this.lang.name);
	},
});

/*
 * This code just makes removes the need for
 * using "new" when instantiating the class. It
 * is a Leaflet convention and should be there.
 */
 L.control.redirectclick = function(options) {
 	return new L.Control.RedirectClick(options);
 };
