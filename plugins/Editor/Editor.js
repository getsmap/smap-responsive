
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
		map.on('draw:edited', function (e) {
			console.log("edited");
			// if ($.inArray(e.layers, self._inserts) === -1) {
				// Don't try to update a feature that has not yet been added (inserted).
				self._updates.push(e.layers);
			// }
			// editLayer.wfstSave(e.layers);
		});
		this.editLayer = editLayer;

	},

	save: function() {
		var inserts = this._inserts || [],
			updates = this._updates || [],
			i, f,
			editLayer = this.editLayer;
		var insertLength = inserts.length;
		for (i=0,len=inserts.length; i<len; i++) {
			f = inserts[i];
			editLayer._wfstAdd(f).done(function() {
				inserts.splice(f, 1);
			});
		}
		for (i=0,len=updates.length; i<len; i++) {
			f = updates[i];
			editLayer._wfstSave(f).done(function() {
				updates.splice(f, 1);
			});
		}
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