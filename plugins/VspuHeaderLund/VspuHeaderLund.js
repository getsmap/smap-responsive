L.Control.VspuHeaderLund = L.Control.extend({

    options: {
        position: 'topright', // just an example
        btnID: "vspu-btn" //plugin ID which can be used with jquery e.g.
    },

    _lang: {
        "sv": {
            caption: "Meny"
        },
        "en": {
            caption: "Menu"
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
        this._container = L.DomUtil.create('div', 'leaflet-control-VspuHeaderLund'); // second parameter is class name

        L.DomEvent.disableClickPropagation(this._container);

        this.$container = $(this._container);
        this._createMenu();
        
        var id = "";
        if(this.options.btnID){
        	id = this.options.btnID; 
        }
        // Example of usage -- UNCOMMENT HERE TO ADD EXAMPLE BUTTON
        this.addButton(id,"Teman", "fa fa-plus-circle", function() {
        	alert("Hej vspu");
			
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
		
    	//var $btn = $('<li><a id="'+id+'" href="btn btn-default"><span class="'+iconClass+'"></span> '+label+'</a></li>');
    	var $btn = $('<div class="btn-group">'+
					'<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">'+
					'Teman <span class="caret"></span>'+
					'<span class="sr-only">Toggle Dropdown</span>'+
					  '</button>'+
					  '<ul class="dropdown-menu" role="menu">'+
						'<li><a href="http://localhost:8080/smap-responsive/dev.html?zoom=10&center=13.3717,55.66209&ol=Avrinningsområde,Vattendrag-huvud,Vattendrag-mellan,Vattendrag-sma,Kommungränser,Höjdkurva5m,DetaljplaneradMark&bl=mapboxlund&config=configVspu.js">Länk 1</a></li>'+
						'<li><a href="http://localhost:8080/smap-responsive/dev.html?zoom=10&center=13.3717,55.66209&bl=mapboxlund&config=configVspu.js">Länk 2</a></li>'+
						'<li><a href="http://www.google.se">Länk 3</a></li>'+
						//'<li class="divider"></li>'+
						'<li><a href="http://getbootstrap.com/components/#btn-dropdowns-single">Länk 4</a></li>'+
					  '</ul>'+
					'</div>'
				);
		
		
		
    	if (options.proxy) {
    		//onClick = $.proxy(onClick, options.proxy);
    	}
    	//$btn.on("click", onClick);
    	$("#btns").append($btn);
    	
    	if (options.callback) {
    		// Since this function is sometimes called async (using smap.cmd.addToolButton)
    		// it needs a callback function to return the button.
    		options.callback($btn);
    	}
    },

    _createMenu: function() {

	    var $div = $(
	
	    '<header id="smap-vspuHeaderLund-div" class="navbar navbar-static-top bs-docs-nav" role="banner">'+
	      '<div class="container">'+
	        '<div class="navbar-header">'+
	      '    <button class="navbar-toggle" type="button" data-toggle="collapse" data-target=".bs-navbar-collapse">'+
	      '      <span class="sr-only">Toggle navigation</span>'+
	      '      <span class="fa fa-bars"></span>'+
	      '    </button>'+
	      		'<a class="navbar-brand" href="#">Vspu</a>'+
	      '  </div>'+
	      '  <nav class="collapse navbar-collapse bs-navbar-collapse" role="navigation">'+
	      '    <ul id="btns" class="nav navbar-nav navbar-right">'+
	      '    </ul>'+
	      '  </nav>'+
	      '</div>'+
	    '</header>'
	    );

        $("#maindiv").prepend($div);
		$("body").addClass("mf-v4 no-footer");
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
L.control.vspuHeaderLund = function (options) {
    return new L.Control.VspuHeaderLund(options);
};