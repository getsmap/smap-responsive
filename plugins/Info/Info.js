L.Control.Info = L.Control.extend({
	options: {
		autoActivate: true,			// If you want the Info dialog to open from start, set this to true
		dontShowAgainBox: true,		// Requires autoActivate: true. Allows the user to check the box to not show this box again (using localStorage)
		addToMenu: true,			// Creates a button that toggles the info dialog (if autoActivate is false this should probably be set to true)
		position: 'topright',		// The position using Leaflet's positioning system

		// This is how you fill the Info dialog with content (utilizing the language support 
		// functionality in smap-responsive)
		_lang: {
			"sv": {
				titleInfo: "<h4>Välkommen till smap-responsive!</h4>",
				bodyContent: '<p>Jag är dialogen kropp.</p>',
				tooltipText: "Visa info"
					
			},
			"en": {
				titleInfo: "<h4>Welcome to smap-responsive!</h4>",
				bodyContent: '<p>I am the body of the dialog.</p>',
				tooltipText: "Show info"
			}
		}
	},
	
	// Please don't touch these :) These can be overridden from options so you can set your own titleInfo, bodyContent and tooltipText
	_lang: {
		"sv": {
			close: "Stäng",
			tooltipText: "Visa info",
			dontShowAgain: "Visa inte från start nästa gång"
		},
		"en": {
			close: "Close",
			tooltipText: "Show info",
			dontShowAgain: "Don't show from start next time"
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

	_getLocalStorage: function() {
		return window.localStorage ? window.localStorage : false;
	},
	
	activate: function(activatedFromClick) {
		activatedFromClick = activatedFromClick || false;

		var o = this.options;
		var store = this._getLocalStorage();
		if (!activatedFromClick && store && store.dontShowAgain) {
			return false;
		}
		if (!this._$dialog) {
			var $footerContent = $('<div class="smap-info-footer"><button type="button" class="btn btn-default" data-dismiss="modal">'+this.lang.close+'</button></div>');
			var $bodyContent = this._drawBody(this.lang.bodyContent);
			$footerContent.prepend( this._createCheckbox() );
			this._$dialog = utils.drawDialog(this.lang.titleInfo, $bodyContent, $footerContent);
		}
		this._$dialog.modal("show");
	},

	_drawBody: function(bodyContent) {
		var $newBody = $("<div />");
		$newBody.append(bodyContent);

		return $newBody;
	},

	_createCheckbox: function() {
		var addCheckbox = this.options.autoActivate && this.options.dontShowAgainBox;
		var store = this._getLocalStorage();
		if (!store) {
			return null;
		}
		if (addCheckbox === true) {
			var startChecked = store.dontShowAgain ? true : false;
			var $cb = $('<div class="checkbox">\
				<label>\
					<input type="checkbox"> '+this.lang.dontShowAgain+' \
				</label>\
			</div>');
			var self = this;
			$cb.find("input").on("change", function() {
				var isChecked = $(this).is(":checked");
				if (isChecked) {
					store.dontShowAgain = "1"; 
				}
				else {
					delete store.dontShowAgain;
				}
			}).prop("checked", startChecked);
		}
		return $cb;
	},
	
	_drawBtn: function() {
		var self = this;

		if (this.options.addToMenu) {
			var $btn = $('<button id="smap-info-btn" title="'+this.lang.tooltipText+'" class="btn btn-default"><span class="fa fa-info"></span></button>');
			$btn.on("click", function () {
				self.activate(true);
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