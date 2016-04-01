L.Control.Opacity = L.Control.extend({
	options: {
		position: 'topright',
		addToMenu: false
	},

	_lang: {
		"sv": {
			caption: "Ändra genomskinlighet på lager",
			close: "Stäng",
			btnTitle: "Justera transparens",
			popoverTitle: "Titel"
		},
		"en": {
			caption: "Transparency tool",
			close: "Close",
			btnTitle: "Adjust transparency",
			popoverTitle: "Title"
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
		if (options._lang) {
			// Always allow setting lang through options
			$.extend(true, this._lang, options._lang);
		}
		this._setLang(options.langCode);
	},

	onAdd: function(map) {
		

		this._container = L.DomUtil.create('div', 'leaflet-control-opacity'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		this.$container = $(this._container);
		
		this._createBtn();
		this._bindEvents();
		
		return this._container;
	},

	_bindEvents: function() {
		var onAddRemove = (function(e) {
			if (!e.layer.options || !e.layer.options.layerId || e.layer.feature) { 
				return;
			}
			var layer = e.layer;
			switch (e.type) {
				case "layeradd":
					// Add slider to GUI
					this._addRow(layer);
					break;
				case "layerremove":
					// Remove slider to GUI
					this._removeRow(layer);
					break;
			}
		}).bind(this);

		this._map.on("layeradd layerremove", onAddRemove);
	},

	_createId: function(layerId) {
		return "opacity-"+layerId;
	},

	_addRow: function(layer) {
		var c = this.$popContainer;
		var theId = this._createId(layer.options.layerId);
		if ( c.find("#"+theId).length ) {
			return false;
		}
		var row = '<input type="text" id="'+theId+'" data-provide="slider" '+
					// 'data-slider-ticks="[1, 2, 3]" '+
					// 'data-slider-ticks-labels='["short", "medium", "long"]' '+
					'data-slider-min="0" data-slider-max="100" data-slider-step="10" data-slider-value="'+layer.opacity+'" '+
					'data-slider-tooltip="hide">';
		c.append(row);
		$('#'+theId).slider({
			formatter: function(value) {
				return 'Current value: ' + value;
			}
		});
	},

	_removeRow: function(layer) {
		var c = this.$popContainer;
		var theId = this._createId(layer.options.layerId);
		c.find("#"+theId).remove();
	},

	_createBtn: function() {
		var self = this;
		var $btn = $('<button id="smap-opacity-btn" title="' + this.lang.btntitle + '" class="btn btn-default"><span class="fa fa-adjust"></span></button>');
		$btn.on("click", function () {
			self.activate();
			return false;
		});
		this.$container.append($btn);
		this.$btn = $btn;

		this.$popContainer = $('<div class="smap-opacity-popcontainer" />');
		$btn.popover({
			// container: 'body',
			content: function() {
				// console.log($(this).data("bs.popover"));
				$(this).data("bs.popover").$tip.append( self.$popContainer );
			},
			placement: "bottom",
			title: this.lang.popoverTitle,
			trigger: "click"
		});

		// Draw dropdown
		$btn.on("shown.bs.popover", function() {
			// var $popover = $(".popover"),
			// 	$popCont = $(".smap-opacity-popover");
			// if (!self.options.showPopoverTitle) {
			// 	$popover.find("h3").remove();
			// }
			// $popover.addClass("thandler-popover");
		});
	},


	activate: function() {
		if (this._active) {
			return false;
		}
		this._active = true;
		var $btn = this.$btn;
		
		// this.$btn.popover("show");
		// var $popover = $btn.data("bs.tooltip").$element;
		// $popover.append(this.$popContainer);
		return true;
	},

	deactivate: function() {
		var $btn = this.$btn;
		this.$popContainer.detach();
		// $btn.popover("hide");
		$btn.popover("destroy");
	},


	onRemove: function(map) {
		this.$btn.remove();
		delete this.$btn;
		delete this.$popContainer;

	}
});

/*
 * This code lets us skip "new" before the
 * Class name when instantiating it.
 */
L.control.opacity = function (options) {
	return new L.Control.Opacity(options);
};