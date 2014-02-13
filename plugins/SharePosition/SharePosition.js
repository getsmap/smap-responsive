L.Control.SharePosition = L.Control.extend({
	options: {
		position: 'topright' // just an example
	},
	
	_lang: {
		"sv": {
			btnShare: "Dela position",
			btnUnshare: "Sluta dela position"
		},
		"en": {
			btnShare: "Share position",
			btnUnshare: "Stop sharing position"
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
		
		this._container = L.DomUtil.create('div', 'leaflet-control-shareposition'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		
		this.$container = $(this._container);
		
		this._drawBtn();
		
		return this._container;
	},

	onRemove: function(map) {},
	
	_onLocationFound: function(e) {
		
	},
	
	_onLocationError: function(e) {
		
	},
	
	sharePosition: function() {
		$("#sharepos-btn span:eq(1)").text(this.lang.btnUnshare);
		
		// Bind events
		this.map.on("locationfound", $.proxy(this._onLocationFound, this));
		this.map.on("locationerror", $.proxy(this._onLocationError, this));
	},
	
	unSharePosition: function() {
		$("#sharepos-btn span:eq(1)").text(this.lang.btnShare);
		
		// Unbind events
		this.map.off("locationfound", $.proxy(this._onLocationFound, this));
		this.map.off("locationerror", $.proxy(this._onLocationError, this));
	},
	
	_drawBtn: function() {
		var self = this;
		var btn = $('<button id="sharepos-btn" class="btn btn-default btn-lg"><span class="glyphicon glyphicon-eye-open"></span>  <span>'+this.lang.btnShare+'</span></button>');
		btn.on("click", function() {
			if ( $(this).hasClass("btn-primary") ) {
				$(this).removeClass("btn-primary");
				self.unSharePosition();
			}
			else {
				$(this).addClass("btn-primary");
				self.sharePosition();
			}
			
		});
		this.$container.append(btn);
	}
});


// Do something when the map initializes (example taken from Leaflet attribution control)

//L.Map.addInitHook(function () {
//	if (this.options.attributionControl) {
//		this.attributionControl = (new L.Control.SharePosition()).addTo(this);
//	}
//});


/*
 * This code just makes removes the need for
 * using "new" when instantiating the class. It
 * is a Leaflet convention and should be there.
 */
L.control.sharePosition = function(options) {
	return new L.Control.SharePosition(options);
};