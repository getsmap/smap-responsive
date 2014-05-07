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
        var $btn = $('<li><a href=""><span class="'+iconClass+'"></span> Getting started</a></li>');
        $btn.on("click", clickFunc);
        $("#btns").append($btn);
    },

    _createMenu: function() {

	    var $div = $(
	
	    '<header id="smap-menu-div" class="navbar navbar-static-top bs-docs-nav" role="banner">'+
	      '<div class="container">'+
	        '<div class="navbar-header">'+
	      '    <button class="navbar-toggle" type="button" data-toggle="collapse" data-target=".bs-navbar-collapse">'+
	      '      <span class="sr-only">Toggle navigation</span>'+
	      '      <span class="fa fa-bars"></span>'+
	      '    </button>'+
	      		'<a class="navbar-brand" href="#">Stadsatlas</a>'+
	      '  </div>'+
	      '  <nav class="collapse navbar-collapse bs-navbar-collapse" role="navigation">'+
	      '    <ul id="btns" class="nav navbar-nav navbar-right">'+
	      '    </ul>'+
	//      '    <ul class="nav navbar-nav navbar-right">'+
	//      '      <li><a href="http://expo.getbootstrap.com" onclick="_gaq.push(['_trackEvent', 'Navbar', 'Community links', 'Expo']);">Expo</a></li>'+
	//      '      <li><a href="http://blog.getbootstrap.com" onclick="_gaq.push(['_trackEvent', 'Navbar', 'Community links', 'Blog']);">Blog</a></li>'+
	//      '    </ul>'+
	      '  </nav>'+
	      '</div>'+
	    '</header>'
	    );

        $("body").append($div);
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
L.control.menu = function (options) {
    return new L.Control.Menu(options);
};