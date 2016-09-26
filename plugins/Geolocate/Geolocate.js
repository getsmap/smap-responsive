L.Control.Geolocate = L.Control.extend({
	options: {
		position: 'bottomright',
		hoverTooltip: true,
		locateOptions: {
			maxZoom: 17,
			enableHighAccuracy: true
		}
		
	},
	
	_lang: {
		"sv": {
			notSupported: "Din webbläsare stödjer inte geolokalisering",
			hoverTooltip: "Hitta din position",

			errorGeolocate: "Kunde inte hitta din position",

			// Targeted error messages can be created by putting a matching phrase as the key (matched using .search()) and the desired message as a value
			errorMessages: {
				"User denied Geolocation": "Kunde inte hitta din position. Ändra platsinställningarna i din telefon.",
				"Only secure origins are allowed": "Kunde inte hitta din position. Anslutningen är osäker (kräver https:)."
			}
		},
		"en": {
			notSupported: "Your browser does not support geolocation",
			hoverTooltip: "Find your current location",
			errorGeolocate: "The browser could not detect your position",
			errorMessages: {
				"User denied Geolocation": "Could not geolocate you. Change the geolocation settings in your phone.",
				"Only secure origins are allowed": "Could not geolocate you. The connection is insecure (requires https:)."
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
		btn.on("touchstart click", $.proxy(function() {
			// Toggle the geolocation on btn click
			if (this.active) {
				this.deactivate();				
			}
			else {
				this.activate();
			}
			return false;
		}, this));

		if (this.options.hoverTooltip) {
			if (!btn.parent().data('bs.tooltip')) {
				btn.parent().tooltip({
					title: this.lang.hoverTooltip,
					trigger: "hover",
					placement: "left"
				});
			}
		}
	},
	
	activate: function() {
		if (this.active) {
			return false;
		}
		if (!navigator.geolocation) {
			smap.cmd.notify(this.lang.notSupported, "error");
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

		var displayMsg = this.lang.errorGeolocate+": "+e.message; // default error message
		var errorMessages = this.lang.errorMessages;
		for (var matchPhrase in errorMessages) {
			if (e.message.search( matchPhrase ) > -1) {
				displayMsg = errorMessages[matchPhrase]; 	// hurray, we found a more specific error message
				break;
			}
		}
		var msgTag = smap.cmd.notify(displayMsg, "error", {parent: $("body")});
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
