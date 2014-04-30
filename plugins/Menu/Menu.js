L.Control.Menu = L.Control.extend({
    options: {
        position: 'topright' // just an example
    },

    _lang: {
        "sv": {
            caption: "Dela länk till positionen"
        },
        "en": {
            caption: "Share position link"
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

        this._container = L.DomUtil.create('div', 'leaflet-control-Menu'); // second parameter is class name
        L.DomEvent.disableClickPropagation(this._container);

        this.$container = $(this._container);
        this._createMenu();

        return this._container;
    },

    addButton: function(id, iconClass, clickFunc, options){
        var $btn = $('<button type="button" id="bapp" class="btn btn-default"><span class="' + iconClass + '"></span></button>');
        $btn.on("click", clickFunc);
        $("#btns").append($btn);
    },

    _createMenu: function() {

        var $div = $('<nav id="smap-menu-div"  class="navbar navbar-default" role="navigation" style="border:none; background-color: transparent; background: transparent;>' +
            '<div class="container-fluid">' +
            '<div class="navbar-header" >' +
            '<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">' +
            '<span class="sr-only">Toggle navigation</span>' +
            '<span class="icon-bar"></span>' +
            '<span class="icon-bar"></span>' +
            '<span class="icon-bar"></span>' +
            '</button>' +
            '</div>' +
            '<div class="collapse navbar-collapse" id="theNavBar">' +
            '<ul id="btns" class="nav navbar-nav">' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '</nav>');


        $("#mapdiv").append($div);
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
L.control.SharePos = function (options) {
    return new L.Control.Menu(options);
};