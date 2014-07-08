L.Control.ToolHandler = L.Control.extend({
    options: {
        position: 'bottomright',
        addToMenu: false
    },

    _lang: {
        "sv": {},
        "en": {}
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
        var self = this;
        smap.event.on("smap.core.pluginsadded", function() {
            $('.leaflet-control').children("button").each(function(){
               $(this).addClass("th-btn");
               self.$thDiv.append($(this));
            });
        });
        self._container = L.DomUtil.create('div', 'leaflet-control-toolhandler'); // second parameter is class name
        L.DomEvent.disableClickPropagation(self._container);

        self.$container = $(self._container);
        self.$container.css("display", "none");
        self._makeToolHandler();

        return self._container;
    },

    activate: function() {},

    _makeToolHandler: function() {
        var self = this;
        var $thDiv = $('<div id="toolhandler-container" class="toolhandler-div btn-group-lg"></div>');
        self.$thDiv = $thDiv;

        var thBtn = $('<div id="toolhandler-btn"><button id="thbtn" type="button" class="btn btn-default"><span class="fa fa-th"></span></button></div>');
        $(thBtn).children("button").click(function(){
            if( $("#toolhandler-container").hasClass("toolhandler-div-small") ){
                $("#toolhandler-container").removeClass("toolhandler-div-small btn-group-vertical").addClass("toolhandler-div btn-group-lg");
            }
            else{
                $("#toolhandler-container").removeClass("toolhandler-div btn-group-lg").addClass("toolhandler-div-small btn-group-vertical");
            }
        });

        $(window).resize(function(){    
            if ( $("#toolhandler-btn").css("display") == "none"){
                $("#toolhandler-container").addClass("toolhandler-div btn-group-lg").removeClass("toolhandler-div-small btn-group-vertical");
            }
        });
        $("#mapdiv").append(thBtn);
        $("#mapdiv").append($thDiv);
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
L.control.toolhandler = function (options) {
    return new L.Control.ToolHandler(options);
};