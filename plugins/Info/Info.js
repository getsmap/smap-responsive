L.Control.Info = L.Control.extend({
	options: {
		autoActivate: true,
		position: 'topright',
		_lang: {
			"sv": {
				titleInfo: "Välkommen till smap-mobile!",
				bodyContent:
					'<h4>Vad?</h4>'+
			  		'<p>Smap-mobile är ett ramverk för att skapa kartor med responsiv design. '+
			  			'Responsiv design betyder att kartorna anpassar sitt innehåll efter skärmens storlek. '+
			  			'Smap-mobile är i första hand utvecklat för att göra enkla, avskalade kartor – med ett visst fokus på mobila plattformar.</p>'+
		  			'<h4>Var?</h4>'+
		  			'<p>Koden är öppen och kan laddas ner gratis från <a href="https://github.com/getsmap/smap-mobile/">GitHub</a>.</p>'+
			  		'<h4>Hur?</h4>'+
			  		'<p>Ramverket har hittills utvecklats av Malmö Stadsbyggnadskontor men kommer ingå '+
					  'i sMap-samarbetet – där även kommunerna Kristianstad, Helsingborg och Lund är delaktiga.'+
			  		'<h4>Kontakt</h4>'+
					'<p>Är du intresserad av att använda koden eller hjälpa till med utvecklingen? Kontakta GIT-utvecklare <a href="mailto:johan.lahti@malmo.se">Johan Lahti</a>.</p>'+
					'<p>Vill du veta mer om sMap-samarbetet eller publicering av geodata? Kontakta projektsamordnade <a href="mailto:ulf.minor@malmo.se">Ulf Minör</a> eller '+
					'<a href="mailto:Karl-Magnus.Jonsson@kristianstad.se">Karl-Magnus Jönsson.</a></p>'
			},
			"en": {
				titleInfo: "Välkommen till smap-mobile!",
				bodyContent:
					'<h4>Vad?</h4>'+
			  		'<p>Smap-mobile är ett ramverk för att skapa kartor med responsiv design. '+
			  			'Responsiv design betyder att kartorna anpassar sitt innehåll efter skärmens storlek. '+
			  			'Smap-mobile är utvecklat för enklare, avskalade applikationer med ett visst fokus på mobila plattformar</p>'+
		  			'<h4>Var?</h4>'+
		  			'<p>Koden är öppen och kan laddas ner gratis från <a href="https://github.com/getsmap/smap-mobile/">GitHub</a>.</p>'+
			  		'<h4>Hur?</h4>'+
			  		'<p>Ramverket har hittills utvecklats av Malmö Stadsbyggnadskontor men kommer ingå '+
					  'i "sMap"-samarbetet – där även kommunerna i Kristianstad, Helsingborg och Lund är med.'+
			  		'<h4>Kontakt</h4>'+
					'<p>Är du intresserad av att använda koden eller hjälpa till med utvecklingen? Kontakta GIT-utvecklare <a href="mailto:johan.lahti@malmo.se">Johan Lahti</a>.</p>'+
					'<p>Vill du veta mer om sMap-samarbetet eller publicering av geodata? Kontakta <a href="mailto:ulf.minor@malmo.se">Ulf Minör</a> eller '+
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
		var $btn = $('<button id="smap-info-btn" class="btn btn-default btn-lg"><span class="glyphicon glyphicon-info-sign"></span></button>');
//		$("#mapdiv").append($btn);
		$btn.on("click", function() {
			self.activate();
			return false;
		});
		this.$container.append($btn);
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