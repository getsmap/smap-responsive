L.Control.LundHeader = L.Control.extend({

    options: {
        position: 'topright', // just an example
        btnID: "lundHeader-btn" //plugin ID which can be used with jquery e.g.
    },

    _lang: {
        "sv": {
            caption: "Genvägar"
        },
        "en": {
            caption: "Themes"
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
        this._container = L.DomUtil.create('div', 'leaflet-control-LundHeader'); // second parameter is class name

        L.DomEvent.disableClickPropagation(this._container);

        this.$container = $(this._container);
        this._createMenu();
        
        var id = "";
        if(this.options.btnID){
        	id = this.options.btnID; 
        }
        return this._container;
    },

    _createMenu: function() {

	    var $div = $(
	
	    '<nav class="navbar navbar-default navbar-fixed-top">' +
             '<div class="container-fluid">' +
             '<div class="navbar-header"><a href="#" class="navbar-left" onclick="history.go(-1);"><img alt="lund.se" aria-label="Tillbaka till lund.se" class="img-lund-logo" src="img/lund-logo.png" >' +
             '<a class="navbar-brand lund-header" href="#" onclick="history.go(-1);" >' +
             'Tillbaka till lund.se' +
      '</a>' +
    '</div>' +
  '</div>     ' +        
        '</nav>'
	    );
$("body").append($div);
$("#smap-search-div").addClass("lund-header");
$(".leaflet-top.leaflet-right").addClass("lund-header");
$(".lswitch-panel").addClass("lund-header");

        //$("#maindiv").prepend($div);
        //this.$container.append($div);

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
L.control.LundHeader = function (options) {
    return new L.Control.LundHeader(options);
};