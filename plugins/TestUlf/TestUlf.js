L.Control.TestUlf = L.Control.extend({
	options: {
		position: 'bottomright' // just an example
	},
	
	_lang: {
		"sv": {
			exampleLabel: "Ett exempel"
		},
		"en": {
			exampleLabel: "An example"
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
		
		this._container = L.DomUtil.create('div', 'leaflet-control-testUlf'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		
		this.$container = $(this._container);
		
		this._createButton_zoomin();
		this._createButton_zoomout();
		return this._container;
	},


	_createButton_zoomin: function() {
		//var $btn = $('<button class="btn btn-default"><span class="fa fa-plus-square-o fa-2x" style="color:rgba(255,0,0,0.9);"></span></button>');
		var $btn = $('<button class="btn btn-default"><span class="fa fa-plus-square-o fa-2x" ></span></button>');
		this.$container.append($btn);
		
		var self = this;
		
		$btn.on("click", function() {
			self.map.zoomIn();
		});

		// -- TODO: Do something when clicking the button --
	},


	_createButton_zoomout: function() {
		var $btn = $('<button class="btn btn-default"><span class="fa fa-minus-square-o fa-2x"></span></button>');
		this.$container.append($btn);
		
		var self = this;
		
		$btn.on("click", function() {
			self.map.zoomOut();
		});

		// -- TODO: Do something when clicking the button --
	},

	
	onRemove: function(map) {
		// Do everything "opposite" of onAdd – e.g. unbind events and destroy things
		// map.off('layeradd', this._onLayerAdd).off('layerremove', this._onLayerRemove);
	}
});

/*
 * This code lets us skip "new" before the
 * Class name when instantiating it.
 */
L.control.testUlf = function (options) {
	return new L.Control.TestUlf(options);
};