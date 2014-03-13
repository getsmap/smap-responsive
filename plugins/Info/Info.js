L.Control.Info = L.Control.extend({
	options: {
//		position: 'bottomright',
		bodyContent: '<h3>Vad är det här?</h3>'+
			'<p>Den här kartan är byggd med sMap-mobile – ett JavaScript-ramverk utvecklat av Stadsbyggnadskontoret i Malmö.</p>'+
			'<p>Ramverket bygger på…</p>'
	},
	
	_lang: {
		"sv": {
			titleInfo: "Info",
			close: "Stäng"
		},
		"en": {
			titleInfo: "Info",
			close: "Close"
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
		
		this._container = L.DomUtil.create('div', 'leaflet-control-info'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		
		// Use $ prefix for all jQuery objects to make it easier to sort out all
		// jQuery dependencies when sharing the code in future.
		this.$container = $(this._container);
		
		this._drawBtn();
		
		// Binding an event (example)
		// this.map.on('layeradd', this._onLayerAdd, this).on('layerremove', this._onLayerRemove, this);

		return this._container;
	},

	onRemove: function(map) {
		// Do everything "opposite" of onAdd – e.g. unbind events and destroy things
		// map.off('layeradd', this._onLayerAdd).off('layerremove', this._onLayerRemove);
	},
	
	activate: function() {
		if (!this._$dialog) {
			var footerContent = '<button type="button" class="btn btn-default" data-dismiss="modal">'+this.lang.close+'</button>';
			this._$dialog = utils.drawDialog(this.lang.titleInfo, this.options.bodyContent, footerContent);
		}
		this._$dialog.modal("show");
	},
	
	
	_drawBtn: function() {
		var self = this;
		var $btn = $('<button id="smap-info-btn" class="btn btn-default btn-lg"><span class="glyphicon glyphicon-info-sign"></span></button>');
		$("#mapdiv").append($btn);
		$btn.on("click", function() {
			self.activate();
			return false;
		});
	}
});


/*
 * This code just makes removes the need for
 * using "new" when instantiating the class. It
 * is a Leaflet convention and should be there.
 */
L.control.info = function (options) {
	return new L.Control.Info(options);
};