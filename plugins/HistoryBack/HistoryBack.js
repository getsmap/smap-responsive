L.Control.HistoryBack = L.Control.extend({

	options: {
		position: "topright",		// Button's position
		btnClass: "glyphicon glyphicon-hand-left",	// Button's icon class
		
	},

	// Don't touch these, instead override from options
	_lang: {
		en: {
			name: "Navigate back",
			hoverText: "Navigate back to last page"
		},
		sv: {
			name: "Navigera tillbaks",
			hoverText: "Navigera tillbaks till senaste plats"
		}
	},

	_setLang: function (langCode) {
		langCode = langCode || smap.config.langCode || navigator.language.split("-")[0] || "en";
		if (this._lang) {
			this.lang = this._lang ? this._lang[langCode] : null;
		}
	},

	initialize: function (options) {
		L.setOptions(this, options);
		if (this.options._lang) {
			$.extend(true, this._lang, this.options._lang);
		}
		this._setLang(options.langCode);
	},


	onAdd: function (map) {

		this.map = map;

		this._container = L.DomUtil.create('div', 'leaflet-control-HistoryBackClick');
		L.DomEvent.disableClickPropagation(this._container);
		this.$container = $(this._container);

		this._createButton();

		return this._container;
	},

	_createButton: function () {
		var self = this;
		var $btn = $('<button title="' + this.lang.hoverText + '" class="btn btn-default" onclick="window.history.back()"><span class="' + this.options.btnClass + '"></span></button>');
		this.$btn = $btn;
		self.$container.append($btn);
	},

});

/*
 * This code just makes removes the need for
 * using "new" when instantiating the class. It
 * is a Leaflet convention and should be there.
 */
L.control.HistoryBack = function (options) {
	return new L.Control.HistoryBack(options);
};
