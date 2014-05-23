L.Control.Info = L.Control.extend({
	options: {
        addToMenu: false,
		autoActivate: false,
		position: 'bottomright',
		_lang: {
			"sv": {
				titleInfo: "<h4>Välkommen till smap-mobile!</h4>",
				bodyContent:
					'<h4>Vad?</h4>'+
			  		'<p>Smap-mobile är ett ramverk för att skapa kartor med "responsiv design". '+
			  			'Det innebär att kartorna anpassar sitt innehåll efter skärmens storlek. Ramverket kan byggas ut med plugins (Leaflet-kontroller).</p>'+
		  			'<p>Koden är öppen och kan laddas ner gratis från <a target="_blank" href="https://github.com/getsmap/smap-mobile/">GitHub</a>.</p>'+
		  			'<h4>Vem?</h4>'+
			  		'<p>Ramverket har hittills utvecklats av Malmö Stadsbyggnadskontor men är tänkt att ingå '+
					  'i sMap-samarbetet – där även kommunerna Kristianstad, Helsingborg och Lund är delaktiga.'+
			  		'<h4>Kontakta oss!</h4>'+
					'<p>Har du synpunkter, frågor eller vill hjälpa till med utvecklingen? Kontakta sMaps systemarkitekt och huvudutvecklare <a href="mailto:johan.lahti@malmo.se">Johan Lahti</a>, Malmö stad.</p>'+
					'<p>Vill du veta mer om sMap-samarbetet eller publicering av geodata? Kontakta projektsamordnade <a href="mailto:ulf.minor@malmo.se">Ulf Minör</a> eller '+
					'<a href="mailto:Karl-Magnus.Jonsson@kristianstad.se">Karl-Magnus Jönsson.</a></p>'
			},
			"en": {
				titleInfo: "<h4>Welcome to smap-mobile!</h4>",
				bodyContent:
					'<h4>What?</h4>'+
			  		'<p>Smap-mobile is a framework for creating maps with a "responsive design". '+
			  			'This means the site adapts the content to the screen size. The framework can be extended with plugins (Leaflet controls).</p>'+
		  			'<p>The code is open source and can be downloaded free from <a target="_blank" href="https://github.com/getsmap/smap-mobile/">GitHub</a>.</p>'+
		  			'<h4>Who?</h4>'+
			  		'<p>The framework has so far been developed by Malmö Stadsbyggnadskontor but will be used in '+
					  'the sMap project – where the municipalities of Kristianstad, Helsingborg and Lund will participate.'+
			  		'<h4>Feed-back!</h4>'+
					'<p>Do you have suggestions, or are you interested in contributing with the development of sMap mobile? Please contact sMap\'s System Architect and main developer <a href="mailto:johan.lahti@malmo.se">Johan Lahti</a>.</p>'+
					'<p>Do you want more info about the sMap project or publishing geographic data? Then contact the project administrators <a href="mailto:ulf.minor@malmo.se">Ulf Minör</a> or '+
					'<a href="mailto:Karl-Magnus.Jonsson@kristianstad.se">Karl-Magnus Jönsson.</a></p>'
			}
		}
	},
	
	_lang: {
		"sv": {
			close: "Stäng"
		},
		"en": {
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
		if (this.options._lang) {
			$.extend(true, this._lang, this.options._lang);
		}
		this._setLang(options.langCode);
	},

	onAdd: function(map) {
		this.map = map;
		
		this._container = L.DomUtil.create('div', 'leaflet-control-info'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		
		this.$container = $(this._container);
		this._drawBtn();
		
		return this._container;
	},

	onRemove: function(map) {
		// Do everything "opposite" of onAdd – e.g. unbind events and destroy things
		// map.off('layeradd', this._onLayerAdd).off('layerremove', this._onLayerRemove);
	},
	
	activate: function() {
		if (!this._$dialog) {
			var footerContent = '<button type="button" class="btn btn-default" data-dismiss="modal">'+this.lang.close+'</button>';
			this._$dialog = utils.drawDialog(this.lang.titleInfo, this.lang.bodyContent, footerContent);
		}
		this._$dialog.modal("show");
	},
	
	
	_drawBtn: function() {
		var self = this;

        if(this.options.addToMenu) {
            smap.cmd.addToolButton( "", "fa fa-info", function () {
                self.activate();
                return false;
            },null);
        }

        else {
            var $btn = $('<button id="smap-info-btn" class="btn btn-default"><span class="fa fa-info"></span></button>');
//		$("#mapdiv").append($btn);
            $btn.on("click", function () {
                self.activate();
                return false;
            });
            this.$container.append($btn);
        }

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