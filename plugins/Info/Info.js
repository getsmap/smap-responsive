L.Control.Info = L.Control.extend({
	options: {
		addToMenu: true,			// Creates a button that toggles the info dialog (if autoActivate is false this should probably be set to true)
		autoActivate: true,			// If you want the Info dialog to open from start, set this to true
		dontShowAgainBox: true,		// Requires autoActivate: true. Allows the user to check the box to not show this box again (using localStorage)
		dateLastUpdated: "2016-03-31",	// Requires dontShowAgainBox: true. Setting a date here means dontShowAgain checkbox checked by user before this date will expire.
		daysExpired: 90,			// Requires dontShowAgainBox: true. If set, the dontShowAgain choice will expire after this many days.
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
		if (this.options.dateLastUpdated) {
			if (this.options.dateLastUpdated.search("T") === -1) {
				// If date is given like 2016-03-31 then add additional required text for ISO date strings (time defaults to 12 at night).
				this.options.dateLastUpdated += "T00:00:00.000Z";
			}
			this._updateExpirationStatus();
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

	/**
	 * This func removes dontShowAgain from localStorage if
	 * it does not satisfy the conditions (older than last update <dateLastUpdated> or age limit <daysExpired>)
	 * @return {void}
	 */
	_updateExpirationStatus: function() {
		var store = this._getLocalStorage();
		if (!store || !store.dontShowAgain) return false;
		
		var dontShowAgain = new Date(store.dontShowAgain);
		var lastUpdated = new Date(this.options.dateLastUpdated);
		var now = new Date();
		
		var isExpired = lastUpdated > dontShowAgain;
		
		var daysExpired = this.options.daysExpired;
		if (!isExpired && typeof daysExpired === "number") {
			var ageInDays = ((now - dontShowAgain) / 1000 / 3600 / 24);
			isExpired = ageInDays >= daysExpired;
		}
		if (isExpired) {
			delete store.dontShowAgain;
		}
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
					store.dontShowAgain = (new Date()).toISOString();
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
			$btn.on("touchstart click", function () {
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