L.Control.LayerSwitcher = L.Control.extend({
	options: {
//		position: "bottomleft"
	},

	initialize: function(options) {
		L.setOptions(this, options);
	},

	onAdd: function(map) {
		this.map = map;
		
		this._container = L.DomUtil.create('div', 'leaflet-control-LayerSwitcher'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		
		this.$container = $(this._container);
		
		this._addPanel();
		this._addBtn();
		this._bindEvents();
		
		$("#mapdiv").addClass("lswitch-panelslide");

		return this._container;
	},

	onRemove: function(map) {
		// Do everything "opposite" of onAdd – e.g. unbind events and destroy things
		// map.off('layeradd', this._onLayerAdd).off('layerremove', this._onLayerRemove);
	},
	
	_bindEvents: function() {
		$("#mapdiv").on("touchstart click", $.proxy(function() {
			this.hidePanel();
			return false;
		}, this));
	},
	
	_addBtn: function() {
		var btn = $('<div id="lswitch-btn"><img class="glyphicon" src="img/glyphicons_113_justify_lsw.png"></img></div>');
		$("#mapdiv").prepend(btn);
		btn.on("touchstart mousedown", $.proxy(function() {
			this.showPanel();
			return false;
		}, this));
	},
	
	_addPanel: function() {
		this.$panel = $('<div class="lswitch-panel" />');
		this.$panel.swipeleft($.proxy(function() {  
			this.hidePanel();
		}, this));
		$("body").append( this.$panel );
	},
	
	showPanel: function() {
		$("body").css("overflow", "hidden"); // To avoid scroll bars
		this.$panel.show();
		$("#mapdiv").css({
			"margin-left": this.$panel.outerWidth() + "px"
		});
	},
	
	hidePanel: function() {
		$("body").css("overflow", "auto"); // restore overflow
		$("#mapdiv").css({
			"margin-left": "0px"
		});
	}
});


// Do something when the map initializes (example taken from Leaflet attribution control)

//L.Map.addInitHook(function () {
//	if (this.options.attributionControl) {
//		this.attributionControl = (new L.Control.LayerSwitcher()).addTo(this);
//	}
//});


/*
 * This code just makes removes the need for
 * using "new" when instantiating the class. It
 * is a Leaflet convention and should be there.
 */
L.control.layerSwitcher = function (options) {
	return new L.Control.LayerSwitcher(options);
};