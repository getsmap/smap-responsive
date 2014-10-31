L.Control.SelectVector = L.Control.extend({
	options: {
		position: 'bottomright', // just an example
		selectStyle: {
			weight: 5,
	        color: '#00FFFF',
	        fillColor: '#00FFFF',
	        opacity: 1,
	        fillOpacity: .5
		}
	},
	
	_lang: {
		"sv": {
			exampleLabel: "Ett exempel"
		},
		"en": {
			exampleLabel: "An example"
		}
	},
	
	/**
	 * Keeps track of which vector features have been selected.
	 */
	_selectedFeatures: [],
	
	_setLang: function(langCode) {
		langCode = langCode || smap.config.langCode;
		if (this._lang) {
			this.lang = this._lang ? this._lang[langCode] : null;			
		}
	},

	initialize: function(options) {
		L.setOptions(this, options);
		this._setLang(options.langCode);
		
		// Func with proxy to be bound to individual features.
		var self = this;
		this._onFeatureClick = function(e) {
			self.onFeatureClick(e);
		};
		
	},

	onAdd: function(map) {
		this.map = map;
		
		this._container = L.DomUtil.create('div', 'leaflet-control-selectvector'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		this.$container = $(this._container);
		this.$container.css("display", "none");
		this._bindEvents();

		return this._container;
	},

	onRemove: function(map) {
		// Unbind them all!
		this.map.off("layeradd", this._onLayerAdded);
		this.map.off("click", this._onMapClick);
	},
	
	_bindEvents: function() {
		
		// Funcs with proxy
		this._onLayerAdded = $.proxy(this.onLayerAdded, this);
		this._onLayerRemoved = $.proxy(this.onLayerRemoved, this);
		this._onMapClick = $.proxy(this.onMapClick, this);
		
		// Bind them all!
		this.map.on("layeradd", this._onLayerAdded);
		this.map.on("layerremove", this._onLayerRemoved);
		this.map.on("click", this._onMapClick);
		
	},
	
	/*
	 * --- Event listeners ------------------------------------------------------------
	 */
	onMapClick: function() {
		this._selectedFeatures = [];
	},
	
	_vectorLayers: [],
	
	onLayerAdded: function(e) {
		var self = this;
		var layer = e.layer;
		var isVector = layer.hasOwnProperty("_layers") && layer.resetStyle;
		if (!isVector)
			return;
		
		layer.on("load", function() {
			this.eachLayer(function(lay) {
				lay.options = lay.options || {};
				lay.options.layerId = layer.options.layerId;
				lay.off("click", self._onFeatureClick).on("click", self._onFeatureClick);
			});			
		});
		this._vectorLayers.push(layer);
	},
	
	onLayerRemoved: function(e) {
		if (!e.layer.options || !e.layer.options.layerId) {
			return;
		}
		var layerId = e.layer.options.layerId;
		if (layerId && e.layer._layers) {
			var index = $.inArray(e.layer, this._vectorLayers);
			if (index > -1) {
				this._vectorLayers.splice(index, 1);
			}
//			var fs = this._selectedFeatures.slice(),
//				f,
//				newArr = [];
//			for (var i=0,len=fs.length; i<len; i++) {
//				f = fs[i];
//				if (f.layerId === layerId) {
//					// Remove this feature from the array
//					this.unselect(f);	
//				}
//			}			
		}
		
	},
	
	_layerFromFeature: function(_f, theLay) {
		var layersObj = theLay._layers;
		for (var nbr in layersObj) {
			var _lay = layersObj[nbr];
			if (_lay.feature.id === _f.id) {
				return _lay;					
			}
		}
		return null;
	},
	
	unselect: function(f) {
		var layerId = f.layerId;
		var parentLayer = smap.cmd.getLayer(layerId);
		var indexOfFeature = $.inArray(f, this._selectedFeatures);
		// Remove the feature from selected arr and reset style
		this._selectedFeatures.splice(indexOfFeature, 1);
		
		var lay = utils.getLayerFromFeature(f, parentLayer) || parentLayer;
//		if (!lay.resetStyle) {
//			lay = parentLayer;
//		}
		parentLayer.resetStyle.call(parentLayer, lay);
		
		this._map.fire("unselected", {
			feature: f
		});

	},
	
	onFeatureClick: function(e) {
		var f = e.layer && e.layer.feature ? e.layer.feature : e.target.feature,
			shiftKeyWasPressed = e.originalEvent ? e.originalEvent.shiftKey || false : false, 
			target = e.target,
			paramVal = null;
		var layerId = target.options.layerId || e.layer.options.layerId;
		var parentLayer = smap.core.layerInst._getLayer(layerId);
		
		if (parentLayer && shiftKeyWasPressed === false) {
			this._selectedFeatures = [];
			var resetStyle = parentLayer.resetStyle;
			parentLayer.eachLayer(function(lay) {
				resetStyle.call(parentLayer, lay);
			});
			
			// Reset other vector layer's selection.
			var arr = this._vectorLayers;
			for (var i=0,len=arr.length; i<len; i++) {
				lay = arr[i];
				if (lay !== parentLayer) {
					lay.resetStyle(lay);
				}
			}
		}
		
		
		var indexOfFeature = $.inArray(f, this._selectedFeatures);
		if (shiftKeyWasPressed === true && indexOfFeature > -1) {
			// Remove the feature from selected arr and reset style
			this._selectedFeatures.splice(indexOfFeature, 1);
			this._map.fire("unselected", {
				feature: f
			});
			var lay = this._layerFromFeature(f, parentLayer);
			parentLayer.resetStyle.call(parentLayer, lay);
		}
		else {
			f.layerId = layerId;
			f.uniqueKey = parentLayer.options.uniqueKey;
			this._selectedFeatures.push(f);
			var _lay = this._layerFromFeature(f, parentLayer);
			if (_lay && _lay.setStyle) {
				_lay.setStyle(parentLayer.options.selectStyle || this.options.selectStyle);
			}
			this._map.fire("selected", {
				feature: f,
				selectedFeatures: this._selectedFeatures,
				layer: parentLayer,
				latLng: e.latlng,
				shiftKeyWasPressed: e.originalEvent ? e.originalEvent.shiftKey || false : false
			});
			utils.log("selected a feature");
		}
	},
	
	
	A: 1
	
});

/*
 * This code lets us skip "new" before the
 * Class name when instantiating it.
 */
L.control.selectVector = function (options) {
	return new L.Control.SelectVector(options);
};