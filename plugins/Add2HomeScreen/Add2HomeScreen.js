L.Control.Add2HomeScreen = L.Control.extend({
	options: {},

	initialize: function(options) {
		L.setOptions(this, options);
		$('body').append('<script src="dist/lib/add-to-homescreen/src/addtohomescreen.js"></script>');
	},

	onAdd: function(map) {
		this.map = map;
		
		this._container = L.DomUtil.create('div', 'leaflet-control-add2HomeScreen'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		
		this.$container = $(this._container);
		
		return this._container;
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
L.control.add2HomeScreen = function(options) {
	return new L.Control.Add2HomeScreen(options);
};
