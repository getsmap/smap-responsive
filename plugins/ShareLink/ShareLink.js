L.Control.ShareLink = L.Control.extend({
	options: {
		position: 'bottomright', // just an example
		addToMenu: false,
		maxLen: 2083,
		root: null
	},

	_lang: {
		"sv": {
			caption: "Länk till kartan",
			close: "Stäng",
			tooLong: "För lång länk",
			tooLongUrl: "Notera! Länken är för lång för att fungera i en del äldre webbläsare. "+
					"Ta bort ett eller flera ritade objekt för att göra länken kortare."
		},
		"en": {
			caption: "Share link",
			close: "Close",
			tooLong: "Too long link",
			tooLongUrl: "Note! The link may not work in some older browsers. Please remove "+
				"one or more drawn features to make it shorter."
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

		this._container = L.DomUtil.create('div', 'leaflet-control-ShareLink'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);

		this.$container = $(this._container);
		this._createBtn();

		return this._container;
	},

	activate: function() {
		var self = this;
		var url = smap.cmd.createParams(this.options.root || true);
		var inputDiv = $('<div class="form-group"><input type="text" class="form-control" placeholder="'+this.lang.caption+'"></div>');
		var input = inputDiv.find("input");
		input.val(url);

		var select = function(tag) {
//			tag.selectionStart = 0;
//			tag.selectionEnd = 9999;
			if (tag.setSelectionRange) {
				tag.setSelectionRange(0, 9999);				
			}
			else {
				$(tag).select();
			}
		};
		
		if (!this._$dialog) {
			var footerContent = '<button type="button" class="btn btn-default" data-dismiss="modal">'+this.lang.close+'</button>';
			this._$dialog = utils.drawDialog(this.lang.caption, inputDiv, footerContent);
			this._$dialog.attr("id", "slink-modal");
			
			input.on("tap click", function() {
				select(this);
			});
			this._$dialog.on("shown.bs.modal", function() {
				select(input[0]);
			});
			this._$dialog.on("hide.bs.modal", function() {
				// Hide keyboard on touch devices
				$(this).find('input[type=text]').blur();
			});
			this._$dialog.on("hidden.bs.modal", function() {
				self._$dialog.empty().remove();
				self._$dialog = null;
			});
			
		}
		if (url.length > this.options.maxLen) {
			var d = this._$dialog;
			var note = smap.cmd.notify(this.lang.tooLongUrl, "warning", {parent: inputDiv.parent()});
			note.removeClass("map-alert");
			function notifyTooLong() {
				// alert(self.lang.tooLongUrl);
				d.find("input[type=text]").prop("disabled", true);
				d.off("shown.bs.modal", notifyTooLong);
			}
			d.find("input[type=text]").val(this.lang.tooLong);
			d.on("shown.bs.modal", notifyTooLong);
		}
		this._$dialog.modal("show");

	},

	_createBtn: function() {
		var self = this;
		var $btn = $('<button id="smap-sharelink-btn" title="'+this.lang.caption+'" class="btn btn-default"><span class="fa fa-link"></span></button>');
		$btn.on("click touchstart", function () {
			self.activate();
			return false;
		});
		this.$container.append($btn);
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
L.control.sharePos = function (options) {
	return new L.Control.SharePos(options);
};