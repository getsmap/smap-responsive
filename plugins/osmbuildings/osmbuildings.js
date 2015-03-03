L.Control.Osmbuildings = L.Control.extend({
	options: {
		position: 'bottomright'
	},
	
	_lang: {
		"sv": {
			errorOsmbuildings: "Kunde inte visa 3D byggnader",
			notSupported: "Din webbläsare stödjer 3D byggnader"
		},
		"en": {
			errorOsmbuildings: "Can´t visualize 3D buildings",
			notSupported: "Your browser does not support 3D buildings"
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
		
		this._container = L.DomUtil.create('div', 'leaflet-control-Osmbuildings'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		
		this.$container = $(this._container);
		this._drawButton();
		var osmb;
		return this._container;
	},

	onRemove: function(map) {
		
	},
	
	_drawButton: function() {
		var btn = $('<button id="smap-glocate-btn" class="btn btn-default"><span class="fa fa-cube"></span></button>');
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
		this.active = true;
		this.btn.addClass("btn-primary");
		osmb = new OSMBuildings(this.map).load();
		//L.control.layers({}, { Buildings:osmb }).addTo(this.map);
	},
	
	deactivate: function() {
		if (!this.active) {
			return false;
		}
		this.active = false;

		//var osmb2 = osmb;
		//alert(osmb._leaflet_id);
		this.map.removeLayer(this.map._layers[osmb._leaflet_id])
		
		//smap.cmd.loading(false);
		this.btn.removeClass("btn-primary");
	
	}
});


// Do something when the map initializes (example taken from Leaflet attribution control)

//L.Map.addInitHook(function () {
//	if (this.options.attributionControl) {
//		this.attributionControl = (new L.Control.Osmbuildings()).addTo(this);
//	}
//});


/*
 * This code just makes removes the need for
 * using "new" when instantiating the class. It
 * is a Leaflet convention and should be there.
 */
L.control.osmbuildings = function (options) {
	return new L.Control.Osmbuildings(options);
};
