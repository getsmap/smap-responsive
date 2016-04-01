L.Control.Redirect = L.Control.extend({
	
	options: {
		position: 'topright',		// Leaflet container (default is topright)
		url: '//malmo.se/kartor',	// Where to redirect
		target: 'newTab',			// How to open the link: sameWindow or newTab
		btnClass: "fa fa-external-link"		// The icon class (e.g. fa or glyphicon)
		// _lang: {						
		// 	sv: {
		// 		name: "Länk till Malmös kartor"	// Optional custom tooltip
		// 	},
		// 	en: {
		// 		name: "Link to Malmö's maps"	// Optional custom tooltip
		// 	}
		// }
	},

	// Don't touch these, instead override from options
	_lang: {
		sv: {
			name: "Länk"
		},
		en: {
			name: "Link"
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
			$.extend(true, this._lang, this.options._lang);
		}
		this._setLang(options.langCode);
	},
	
	onAdd: function(map) {
		this.map = map;
		this._container = L.DomUtil.create('div', 'leaflet-control-Redirect');
		L.DomEvent.disableClickPropagation(this._container);
		this.$container = $(this._container);
		this._createButton();
		return this._container;
	},

	_createButton: function() {
		var self = this,
			$btn = $('<button title="' + this.lang.name + '" class="btn btn-default"><span class="'+this.options.btnClass+'"></span></button>');
		$btn.on("click touchstart", function() {
			self._activate();
			this.blur();
		});
		this.$btn = $btn;
		self.$container.append($btn);
	},

	_activate: function() {
		if (this.active) {
			return false; 
		}
		if (this.options.url) {
			this.redirect();
		}

		else {
			utils.log('Redirect error: Redirect URL missing. Check config-file.')
		}
	},

	onRemove: function(map) {
		this.$container.empty();
	},
	
	redirect : function() {
		var url = this.options.url,
			target;

		if (this.options.target === 'sameWindow') {
			target = '_self';
		}

		window.open(url, target);
	},
});

 L.control.redirectclick = function(options) {
 	return new L.Control.Redirect(options);
 };
