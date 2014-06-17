L.Control.Menu = L.Control.extend({

    options: {
        position: 'topright', // just an example
        btnID: "my-btn" //plugin ID which can be used with jquery e.g.
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
        
        var id = "";
        if(this.options.btnID){
        	id = this.options.btnID; 
        }
        // Example of usage -- UNCOMMENT HERE TO ADD EXAMPLE BUTTON
        this.addButton(id,"My button", "fa fa-link", function() {
        	alert("Hej");
        	return false;
        });
	   
        return this._container;
    },

    /**
     * 
     * @param label {String}
     * @param iconClass {String} E.g. "fa fa-link"
     * @param onClick {Function}
     * @param options {Options} Optional.
     * @returns
     */
    addButton: function(btnID, label, iconClass, onClick, options) {
    	options = options || {};
		var id = btnID || "";
		
    	var $btn = $('<li><a id="'+id+'" href="btn btn-default"><span class="'+iconClass+'"></span> '+label+'</a></li>');
    	
    	if (options.proxy) {
    		onClick = $.proxy(onClick, options.proxy);
    	}
    	$btn.on("click", onClick);
    	$("#btns").append($btn);
    	
    	if (options.callback) {
    		// Since this function is sometimes called async (using smap.cmd.addToolButton)
    		// it needs a callback function to return the button.
    		options.callback($btn);
    	}
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

        $("#maindiv").prepend($div);
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