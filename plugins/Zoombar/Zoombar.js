L.Control.Zoombar = L.Control.extend({
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
		
		this._container = L.DomUtil.create('div', 'leaflet-control-zoombar'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		
		this.$container = $(this._container);
		this.$container.addClass("btn-group-vertical");
		this.$container.on("mousedown", function() {
			return false;
		});
		
        this._createButtonZoomIn();
        this._createButtonZoomUt();
        
        this.__onZoomEnd = this.__onZoomEnd || $.proxy(this._onZoomEnd, this);
        this.map.on("zoomend", this.__onZoomEnd);

		return this._container;
	},
	
	_onZoomEnd: function() {
		if (this.map.getZoom() >= this.map.getMaxZoom()) {
			this.$container.find("#zoombar-plus").addClass("disabled");
		}
		else if (this.map.getZoom() <= this.map.getMinZoom()) {
			this.$container.find("#zoombar-minus").addClass("disabled");
		}
		else {
			this.$container.find("button").removeClass("disabled");
		}
		
	},

    _createButtonZoomIn: function() {
        var btn = $('<button id="zoombar-plus" class="btn btn-default"><span class="fa fa-plus"></span></button>');
        this.$container.append(btn);
        // -- TODO: Do something when clicking the button --
        var self = this;
        btn.on("click touchstart dblclick", function() {
            smap.map.zoomIn();
            return false;
        });
    },

    _createButtonZoomUt: function() {
        var btn = $('<button id="zoombar-minus" class="btn btn-default"><span class="fa fa-minus"></span></button>');
        this.$container.append(btn);
        // -- TODO: Do something when clicking the button --
        var self = this;
        btn.on("click touchstart dblclick", function() {
        	smap.map.zoomOut();
            return false;
        });
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
L.control.zoombar = function (options) {
	return new L.Control.Zoombar(options);
};