
L.Control.FullScreen = L.Control.extend({
	options: {
		position: 'topright'
	},
	
	_lang: {
		"sv": {
			btnExpand: "Visa i fullskärm",
			btnCompress: "Återställ"
		},
		"en": {
			btnExpand: "Show in fullscreen",
			btnCompress: "Reset"
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
		this._setLang(options.langCode);
	},

	onAdd: function(map) {
		this.map = map;
		var self = this;
		
		this._container = L.DomUtil.create('div', 'leaflet-control-fullScreen'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		
		this.$container = $(this._container);

		this._createBtn();

		document.addEventListener(screenfull.raw.fullscreenchange, function () {
			self._updateButton();
		});
		
		return this._container;
	},

	activate: function() {
		var elem = document.getElementById('body');

		if (screenfull.enabled) {
			screenfull.toggle(elem);
		}
	},

	_updateButton: function() {
		var self = this;

		var $btn = $('#smap-fullscreen-btn');
		//var $label = $('#smap-fullscreen-btn').find('title');

		if (screenfull.isFullscreen) {			
			$btn.find('span').addClass('fa-compress');
			$btn.attr('title', self.lang.btnCompress);
		}
		else {			
			$btn.find('span').removeClass('fa-compress');
			$btn.attr('title', self.lang.btnExpand);
		}

	},

	onRemove: function(map) {
		// Do everything "opposite" of onAdd – e.g. unbind events and destroy things
		// map.off('layeradd', this._onLayerAdd).off('layerremove', this._onLayerRemove);
	},

	_createBtn: function() {
		var self = this;

		this.$btn = $('<button id="smap-fullscreen-btn" title="' + self.lang.btnExpand + '" class="btn btn-default"><span class="fa fa-expand"></span></button>');
		this.$btn.on("click", function () {
			self.activate();
			return false;
		});

		this.$container.append(this.$btn);		
	}
});

/*
 * This code lets us skip "new" before the
 * Class name when instantiating it.
 */
 L.control.fullScreen = function (options) {
 	return new L.Control.FullScreen(options);
 };