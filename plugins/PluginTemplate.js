
L.Control.Template = L.Control.extend({
	options: {
		position: 'topright'
	},
	
	_lang: {
		"sv": {
			btnLabel: "Ett exempel"
		},
		"en": {
			btnLabel: "An example"
		}
	},
	
	_setLang: function(langCode) {
		langCode = langCode || smap.config.langCode;
		if (this._lang) {
			this.lang = this._lang ? this._lang[langCode] : null;			
		}
	},

	initialize: function(options) {
		L.setOptions(this, options);
		if (this.options._lang) {
			// Always allow setting lang through options
			$.extend(true, this._lang, this.options._lang);
		}
		this._setLang(options.langCode);
	},

	onAdd: function(map) {
		// this._map // map can be accessed using *this* from all functions
		this._container = L.DomUtil.create('div', 'leaflet-control-template'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		this.$container = $(this._container);
		this._createBtn();
		return this._container;
	},

	onRemove: function(map) {},

	_createBtn: function() {
		var self = this;

		this.$btn = $('<button id="smap-template-btn" title="' + self.lang.btnLabel + '" class="btn btn-default"><span class="fa fa-expand"></span></button>');
		this.$btn.on("click", function () {
			self.activate();
			return false;
		});
		this.$container.append(this.$btn);
	}
});

//L.control.template = function (options) {
//	return new L.Control.Template(options);
//};