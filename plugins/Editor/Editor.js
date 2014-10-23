
L.Control.Editor = L.Control.extend({
	options: {
		position: 'bottomright',
		useProxy: false,
		reverseAxis: false
	},
	
	_lang: {
		"sv": {
			dTitle: "Objektets attribut",
			close: "Avbryt"
		},
		"en": {
			dTitle: "Object attributes",
			close: "Cancel"
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
		var url = "http://localhost/geoserver/wfs";

		var defaults = {
				// Required
				xhrType: "POST",
				reverseAxis: this.options.reverseAxis
		};
		var t = {
				url : url,
				featureNS : "sandbox",
				featureType : "wfstpoints",
				uniqueKey: 'fid',
				selectable: true,
				reverseAxis: false,
				reverseAxisBbox: true,
				useProxy: false,
				srs: "EPSG:4326",
				layerId: "mylayerid",
				popup: '${*}<div style="white-space:nowrap;min-width:18em;margin-top:.5em;" class="btn-group btn-group-sm"><button id="editor-popup-remove" type="button" class="btn btn-default"><i class="fa fa-times"></i>&nbsp;Remove</button><button id="editor-popup-move" type="button" class="btn btn-default"><i class="fa fa-arrows"></i>&nbsp;Move</button><button id="editor-popup-edit" type="button" class="btn btn-default"><i class="fa fa-edit"></i>&nbsp;Edit</button></div>'
		};
		var editLayer = L.wfst(url, $.extend({}, defaults, t));
		map.addLayer(editLayer);

		

		// Initialize the draw control and pass it the FeatureGroup of editable layers
		var drawControl = new L.Control.Draw({
			edit: {
				featureGroup: editLayer
			}
		});
		this._drawControl = drawControl;
		map.addControl(drawControl);
		map.on('draw:created', function (e) {
			console.log("created");
			editLayer.addLayer(e.layer);
			self._marker = e.layer;
			self._showSaveToolbar("insert");

			// editLayer.wfstAdd([e.layer]);
		});

		var theId, f, ff, fMod,
			inserts = this._inserts,
			updates = this._updates,
			deletes = this._deletes;
		
		this._editLayer = editLayer;

		// editLayer.on("layerremove", function(e) {
		// 	var layer = e.layer;
		// 	deletes.push(layer);
		// });

		this.map.on("popupopen", function(e) {


			var cont = $(e.popup._container);
			// var layer = e.popup._source;
			self._marker = e.popup._source;
			
			// I used this before: map.on('draw:edited', function (e) {
			// But this one applies only to one marker (the marker that was selected for being moved)
			self._marker.off('dragend').on('dragend', function(e) {
				f = self._marker;
				for (theId in f._layers) {
					// Don't try to update a feature that has not yet been added (inserted).
					fMod = $.extend({}, {
						_layers: {}
					});
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

			// layer.off('dragend').on('dragend', function(e) {
			// 	// Save on client (not commit)
			// 	var lay = e.target;
			// 	self.wfstSave(lay);
			// 	lay.edited = true;
			// });
			cont.find("#editor-popup-remove").on("click", function() {
				if (confirm("Remove?") === true) {
					editLayer.wfstRemove(self._marker);
					// .done(function(){});
				}
				return false;
			});
			cont.find("#editor-popup-move").on("click", function() {
				// Activate move
				self._marker.closePopup();
				var editToolbar = self._getEditToolbar();
				editToolbar.handler.enable();
				self._showSaveToolbar("update");

				// self.map._toolbars[1]._modes["edit"].handler.enable();
				// self._editLayer.eachLayer(drawControl._enableLayerEdit, drawControl);
				return false;
			});
			cont.find("#editor-popup-edit").on("click", function() {
				// Open edit modal
				return false;
			});
		});
	},

	_getEditToolbar: function() {
		var tBar;
		for (var theId in this._drawControl._toolbars) {
			tBar = this._drawControl._toolbars[theId];
			if (tBar && tBar._modes && tBar._modes.edit) {
				return tBar._modes.edit;
			}
		}
		return null;
	},

	wfstSave: function(layers){
		layers = layers ? (L.Util.isArray(layers) ? layers : [layers]) : [];

		var defs = [];
		var inst = this._editLayer;
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

	save: function(onInsertDone) {
		onInsertDone = onInsertDone || null;

		var inserts = this._inserts,
			updates = this._updates,
			i, f,
			editLayer = this._editLayer,
			len = inserts.length;
		for (i=0; i<len; i++) {
			f = inserts[i];
			editLayer._wfstAdd(f).done(function() {
				inserts.splice(f, 1);
				if (onInsertDone) {
					onInsertDone();
				}
			});
		}
		len = updates.length;
		for (i=0; i<len; i++) {
			f = updates[i];
			this.wfstSave(f).done(function() {
				updates.splice(f, 1);
			});
		}
	},

	_saveAttributes: function(props) {
		props = props || {};

	},

	_showSaveToolbar: function(type) {

		if (!this._saveToolbar) {
			var self = this;
			this._saveToolbar = $('<div class="smap-editor-savetoolbar btn-group btn-group-lg" />');
			var btnSave = $('<button class="btn btn-success">Save</button>'),
				btnCancel = $('<button class="btn btn-default">Cancel</button>');

			this._saveToolbar.append(btnCancel).append(btnSave);
			$("#mapdiv").append(this._saveToolbar);
			btnSave.on("click", function() {
				if (type === "update") {
					self.wfstSave(self._marker);
				}
				var editToolbar = self._getEditToolbar();
				editToolbar.handler.disable();
				
				if (type === "insert") {
					self._inserts.push(self._marker);
					self.save(function() {
						self._editLayer.clearLayers();
						self._editLayer._refresh(true);
						self._hideSaveToolbar();
					});
				}
				else if (type === "update") {
					self.save();
					self._hideSaveToolbar();
				}
				return false;
			});
			btnCancel.on("click", function() {
				// alert("TODO Revert (stop editing and force reload features from source)");
				var editToolbar = self._getEditToolbar();
				editToolbar.handler.disable();
				self._editLayer.clearLayers();
				self._editLayer._refresh(true);
				self._hideSaveToolbar();
				return false;
			});
		}
		var btnSaveLbl = type == "insert" ? "Save new marker" : "Save move";
		var btnCancelLbl = type == "insert" ? "Undo" : "Undo move";
		this._saveToolbar.find("button:eq(0)").text(btnCancelLbl);
		this._saveToolbar.find("button:eq(1)").text(btnSaveLbl);
		this._saveToolbar.show();
	},

	_hideSaveToolbar: function() {
		this._saveToolbar.hide();
	},

	_drawGui: function() {
		var self = this;
		var bodyContent = $('<div id="smap-editor-content" />');
		var footerContent = '<button type="button" class="btn btn-default" data-dismiss="modal">'+this.lang.close+'</button>';
		var d = utils.drawDialog(this.lang.dTitle, bodyContent, footerContent, {});
		// d.modal("show");
		// d.on("shown.bs.modal", function() {
			
		// });
		// d.on("hidden.bs.modal", function() {
		// 	self._saveAttributes(props);
		// 	bodyContent.find("input, textarea").val("");
		// });


		// var btn = $('<button class="btn btn-primary btn-lg">Save</button>');
		// $("#mapdiv").append(btn);
		// btn.css({
		// 	"position": "absolute",
		// 	"left": "50%",
		// 	"bottom": "10%",
		// 	"z-index": "2000"
		// });
		// var self = this;
		// btn.on("click", function() {
		// 	self.save();
		// 	return false;
		// });
	}
});

//L.control.editor = function (options) {
//	return new L.Control.Editor(options);
//};