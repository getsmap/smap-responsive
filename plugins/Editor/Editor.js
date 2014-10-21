
L.Control.Editor = L.Control.extend({
	options: {
		position: 'bottomright',
		useProxy: false,
		reverseAxis: false
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

		this._inserts = [];
		this._updates = [];
		this._deletes = [];
	},

	onAdd: function(map) {
		this.map = map;
		
		this._container = L.DomUtil.create('div', 'leaflet-control-editor'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		
		this.$container = $(this._container);

		this._initEditor();
		this._drawGui();
		
		return this._container;
	},

	onRemove: function(map) {},

	_initEditor: function() {
		var self = this,
			map = this.map;
		var editLayer = L.wfst(null, {
			// Required
			url : 'http://kartor.malmo.se/geoserver/wfs',
			featureNS : 'sandbox',
			featureType : 'wfstpoints',
			primaryKeyField: 'fid',
			proxy: smap.config.ws.proxy,
			reverseAxis: this.options.reverseAxis
		}).addTo(map);

		// Initialize the draw control and pass it the FeatureGroup of editable layers
		var drawControl = new L.Control.Draw({
			edit: {
				featureGroup: editLayer
			}
		});
		map.addControl(drawControl);
		map.on('draw:created', function (e) {
			console.log("created");
			editLayer.addLayer(e.layer);
			self._inserts.push(e.layer);
			// editLayer.wfstAdd([e.layer]);
		});

		var theId, f, ff, fMod,
			inserts = this._inserts,
			updates = this._updates,
			deletes = this._deletes;
		map.on('draw:edited', function (e) {
			console.log("edited");

			f = e.layers;
			fMod = $.extend({}, {
				_layers: {}
			});
			for (theId in f._layers) {
				// Don't try to update a feature that has not yet been added (inserted).
				ff = f._layers[theId];
				if ( $.inArray(ff, inserts) === -1 ) {
					fMod._layers[theId] = ff;
				}
				else {
					alert("already in inserts arr");
				}
			}
			updates.push(fMod);
			// self._updates.push(e.layers);

		});
		this.editLayer = editLayer;

		editLayer.on("layerremove", function(e) {
			var layer = e.layer;
			deletes.push(layer);
		});


	},

	wfstSave: function(layers){
		layers = layers ? (L.Util.isArray(layers) ? layers : [layers]) : [];

		var defs = [];
		var inst = this.editLayer;
		var updates = this._updates;
		var v, i;
		for (i=0, len=layers.length; i<len; i++) {
			if (typeof layers[i]._layers == 'object') {
				for (v in layers[i]._layers) {
					defs.push( inst._wfstSave(layers[i]._layers[v]) );
				}
			}
			else {
				defs.push( inst._wfstSave(layers[i]) );
			}
		}
		return $.when.apply($, defs);
	},

	save: function() {
		var inserts = this._inserts,
			updates = this._updates,
			deletes = this._deletes,
			i, f,
			editLayer = this.editLayer,
			len = inserts.length;
		for (i=0; i<len; i++) {
			f = inserts[i];
			editLayer._wfstAdd(f).done(function() {
				inserts.splice(f, 1);
			});
		}
		len = updates.length;
		for (i=0; i<len; i++) {
			f = updates[i];
			this.wfstSave(f).done(function() {
				updates.splice(f, 1);
			});
		}
		editLayer.wfstRemove(deletes).done(function() {
			deletes = [];
		});
	},

	_drawGui: function() {

		var btn = $('<button class="btn btn-primary btn-lg">Save</button>');
		$("#mapdiv").append(btn);
		btn.css({
			"position": "absolute",
			"left": "50%",
			"bottom": "10%",
			"z-index": "2000"
		});
		var self = this;
		btn.on("click", function() {
			self.save();
			return false;
		});
	}



});

/*
 * This code lets us skip "new" before the
 * Class name when instantiating it.
 */
//L.control.editor = function (options) {
//	return new L.Control.Editor(options);
//};