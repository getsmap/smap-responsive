L.Control.ThreeD = L.Control.extend({
	options: {
//		position: 'bottomright',
		layerId: "stadsdel3d"
	},
	
	_lang: {
		"sv": {
			exampleLabel: "Ett exempel"
		},
		"en": {
			exampleLabel: "An example"
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
		
		this._container = L.DomUtil.create('div', 'leaflet-control-threed'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		
		this.$container = $(this._container);
		
		this._bindEvents();
		
//		this.testDraw();
		
		return this._container;
	},
	
	_bindEvents: function() {
		var self = this;
		
		var layer = smap.core.layerInst.showLayer(self.options.layerId); //smap.core.layerInst._createLayer( smap.cmd.getLayerConfig(self.options.layerId) );
		layer.on("load", function(e) {
			new OSMBuildings(self.map).setData(e.layer.jsonData);
		});
		layer._map = this.map;
//		layer._bindEvents(this.map);
		// layer._refresh();
		layer._unbindEvents(this.map);
		
//		this.map.on("layeradd", function() {
//		});
		
	},
	
	testDraw: function() {
		var geoJSON = {
				  "type": "FeatureCollection",
				  "features": [{
				    "type": "Feature",
				    "geometry": {
				      "type": "Polygon",
				      "coordinates": [[
				        [13.37356, 52.52064],
				        [13.37350, 52.51971],
				        [13.37664, 52.51973],
				        [13.37594, 52.52062],
				        [13.37356, 52.52064]
				      ]]
				    },
				    "properties": {
				      "wallColor": "rgb(81, 111, 143)",
				      "roofColor": "rgb(81, 111, 143)",
				      "height": 100,
				      "minHeight": 0,
				      roofShape: "dome"
				    }
				  },
				  {
					    "type": "Feature",
					    "geometry": {
					      "type": "Polygon",
					      "coordinates": [[
					        [13.37056, 52.52164],
					        [13.37050, 52.52071],
					        [13.37364, 52.52073],
					        [13.37294, 52.52162],
					        [13.37056, 52.52164]
					      ]]
					    },
					    "properties": {
					      "wallColor": "rgba(1, 111, 143, 1)",
					      "roofColor": "rgba(1, 111, 143, 1)",
					      "height": 200,
					      "minHeight": 0,
					      roofShape: "dome"
					    }
					  }
				  ]
				};
		new OSMBuildings(this.map).setData(geoJSON);
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
//L.control.threeD = function (options) {
//	return new L.Control.ThreeD(options);
//};