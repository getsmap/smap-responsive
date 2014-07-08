L.Control.Geolocate = L.Control.extend({
	options: {
		position: 'topright',
		locateOptions: {
			maxZoom: 12,
			enableHighAccuracy: true
		}
		
	},
	
	_lang: {
		"sv": {
			errorGeolocate: "Kunde inte hitta din position",
			notSupported: "Din webbläsare stödjer inte geolokalisering"
		},
		"en": {
			errorGeolocate: "The browser could not detect your position",
			notSupported: "Your browser does not support geolocation"
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
		this.map = map;
		
		this._container = L.DomUtil.create('div', 'leaflet-control-Geolocate'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		
		this.$container = $(this._container);
		this._drawButton();
		return this._container;
	},

	onRemove: function(map) {
		
	},
	
	_drawButton: function() {
		var btn = $('<button id="smap-glocate-btn" class="btn btn-default"><span class="fa fa-location-arrow"></span></button>');
		this.$container.append(btn);
		this.btn = btn;
		btn.on("click", $.proxy(function() {
			// Toggle the geolocation on btn click
			if (this.active) {
				this.deactivate();				
			}
			else {
				this.activate();
			}
			return false;
		}, this));
	},
	
	activate: function() {
		if (this.active) {
			return false;
		}
		if (!navigator.geolocation) {
			smap.cmd.notify(this.lang.notSupported);
			return false;
		}
		this.active = true;
		this.btn.addClass("btn-primary");
		smap.cmd.loading(true);
		
		// Define proxy functions so we can unbind them later.
		this.__onLocationFound = this.__onLocationFound || $.proxy(this._onLocationFound, this);
		this.__onLocationError = this.__onLocationError || $.proxy(this._onLocationError, this);
		this.__onDragStart = this.__onDragStart || $.proxy(this._onDragStart, this);
		
		// Bind listeners
		this.map.on("locationfound", this.__onLocationFound);
		this.map.on("locationerror", this.__onLocationError);
		this.map.on("dragstart", this.__onDragStart);
		this.map.on("zoomstart", this.__onDragStart);
		
		this._startLocate(this.options.locateOptions);
	},
	
	deactivate: function() {
		if (!this.active) {
			return false;
		}
		this.active = false;
		smap.cmd.loading(false);
		this.btn.removeClass("btn-primary");
		
		// Unbind listeners
		this.map.off("locationfound", this.__onLocationFound);
		this.map.off("locationerror", this.__onLocationError);
		this.map.off("dragstart", this.__onDragStart);
		this.map.off("zoomstart", this.__onDragStart);
		
		this._stopLocate();
		
		if (this.marker) {
			this.map.removeLayer(this.marker);
			this.marker = null;
		}
	},
	
	_startLocate: function(options) {
		options = options || {};
		var defaultOptions = {
				watch: true,
				setView: true,
				enableHighAccuracy: false
		};
		options = $.extend(defaultOptions, options);
		this.map.locate(options);
	},
	
	_stopLocate: function() {
		this.map.stopLocate();
	},
	
	_onLocationFound: function(e) {
		smap.cmd.loading(false);
		this.marker = this.marker || L.userMarker(e.latlng, {pulsing:true}).addTo(this.map);
		this.marker.setLatLng(e.latlng);
		this.marker.setAccuracy(e.accuracy);
	},
	
	_onLocationError: function(e) {
		smap.cmd.loading(false);
		var msgTag = smap.cmd.notify(this.lang.errorGeolocate+": "+e.message, "error", {parent: $("body")});
		msgTag.on("touchstart", function() {
			$("body").find(".alert").remove();
		});
		this.deactivate();
	},
	
	_onDragStart: function() {
		// Stop setting the view (requires "restart")
		this._stopLocate();
		this._startLocate({
			setView: false
		});
		
	}
});


// Do something when the map initializes (example taken from Leaflet attribution control)

//L.Map.addInitHook(function () {
//	if (this.options.attributionControl) {
//		this.attributionControl = (new L.Control.Geolocate()).addTo(this);
//	}
//});


/*
 * This code just makes removes the need for
 * using "new" when instantiating the class. It
 * is a Leaflet convention and should be there.
 */
L.control.geolocate = function (options) {
	return new L.Control.Geolocate(options);
};
