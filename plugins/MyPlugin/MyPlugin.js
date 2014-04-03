L.Control.MyPlugin = L.Control.extend({
	options: {
		position: 'bottomright' // just an example
	},
	
	_lang: {
		"sv": {
			modalTitle: "Lager i kartan"
		},
		"en": {
			modalTitle: "Layers in the map"
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
		
		this._container = L.DomUtil.create('div', 'leaflet-control-myplugin');
		L.DomEvent.disableClickPropagation(this._container);
		this.$container = $(this._container);
		
		this._createButton();
		
		return this._container;
	},
	
	_createButton: function() {
		// Create a button and add to the container of this plugin
		var btn = $('<button class="btn btn-default"><span class="fa fa-bars fa-2x"></span></button>');
		this.$container.append(btn);
		
		// Bind click function
		var self = this;
		btn.on("click", function() {
			
			// Create HTML from the layers to display inside the "modal window"
			var htmlLayers = "",
				layer;
			for (var key in self.map._layers) {
				layer = self.map._layers[key];
				var t = smap.cmd.getLayerConfig(layer.options.layerId);
				htmlLayers += '<p>'+t.options.displayName+'</p>';
			}
			
			// Open content in a "modal window"
			var modal = utils.drawDialog("Some layers", self.lang.modalTitle);
			
			// Destroy on close
			modal.on("hidden.bs.modal", function() {
				$(this).remove();
			});
			
			// Show dialog
			modal.modal("show");
		});
	},

	onRemove: function(map) {
		// Do everything "opposite" of onAdd – e.g. unbind events and destroy things
		// map.off('layeradd', this._onLayerAdd).off('layerremove', this._onLayerRemove);
	}
});


// Do something when the map initializes
//L.Map.addInitHook(function () {
//	if (this.options.attributionControl) {
//		this.attributionControl = (new L.Control.MyPlugin()).addTo(this);
//	}
//});


/*
 * This code just makes removes the need for
 * using "new" when instantiating the class. It
 * is a Leaflet convention and should be there.
 */
L.control.myPlugin = function(options) {
	return new L.Control.MyPlugin(options);
};