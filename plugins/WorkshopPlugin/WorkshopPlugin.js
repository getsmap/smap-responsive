/**
 * This plugin creates a button which onclick will zoom to the world's extent.
 * The plugin was used during a workshop showing how to create a plugin for smap-responsive.
 */

L.Control.WorkshopPlugin = L.Control.extend({
	options: {
		position: 'bottomright',
		btnClass: "fa fa-globe"
	},
	
	_lang: {
		"sv": {
			alertText: "Hej världen!"
		},
		"en": {
			alertText: "Hello world!"
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
		this._container = L.DomUtil.create('div', 'leaflet-control-WorkshopPlugin'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		this.$container = $(this._container);
		
//		alert(this.lang.alertText);
		
		this._addButton();
		
		return this._container;
	},

	onRemove: function(map) {
		// Remove all tags created in onAdd and facilitate garbage collection.
		this.$container.empty().remove();
		this.$container = null;
		this._container = null;
	},
	
	_addButton: function() {
		var self = this;
		var btn = $('<button id="smap-zoomtoextent-btn" class="btn btn-default"><span class="'+this.options.btnClass+'"></span></button>');
		
		btn.on("click", function() {
//			alert(self.lang.alertText);
			
			self.map.fitWorld();
			return false; // This stops the event from propagating to tags below this one
		});
		
		this.$container.append(btn);
		
	}
	
	
	
});

/*
 * This code lets us skip "new" before the
 * Class name when instantiating it.
 */
//L.control.template = function (options) {
//	return new L.Control.Template(options);
//};