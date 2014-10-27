
L.Control.Editor = L.Control.extend({
	options: {
		position: 'bottomright',
		useProxy: false,
		reverseAxis: false
	},
	
	_lang: {
		"sv": {
			dTitle: "Objektets attribut",
			close: "Avbryt",
			save: "Spara",
			remove: "Ta bort",
			move: "Flytta",
			editProps: "Ändra",
			ruSureRemove: "Ta bort objektet? Åtgärden kan inte ångras.",
			saveNewMarker: "Spara ny markör",
			saveMove: "Spara ny position",
			undo: "Ångra",
			cancel: "Avbryt"
		},
		"en": {
			dTitle: "Object attributes",
			close: "Cancel",
			save: "Save",
			remove: "Remove",
			move: "Move",
			editProps: "Edit",
			doYouWantTo: "Do you want to",
			cannotBeUndoed: "Cannot be undoed",
			ruSureRemove: "Remove feature? Cannot be undoed.",
			saveNewMarker: "Save new marker",
			saveMove: "Save move",
			undo: "Undo",
			cancel: "Cancel"
		}
	},

	_geomType: "marker",
	
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
		this._drawModal();
		this._addBtnAdd();

		
		return this._container;
	},

	onRemove: function(map) {},

	_addBtnAdd: function() {
		var self = this;
		var btnAdd = $('<button class="btn btn-default btn-lg smap-editor-btnadd"><i class="fa fa-map-marker fa-2x"></i></button>');
		$(".leaflet-top.leaflet-left").append(btnAdd);
		btnAdd.on("click", function() {
			var drawToolbar = self._getDrawToolbar();
			$(this).toggleClass("btn-danger");
			if ($(this).hasClass("btn-danger")) {
				drawToolbar.handler.enable();
			}
			else {
				drawToolbar.handler.disable();
			}
			return false;
		});
		
	},

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
				popup: '${*}<div class="popup-divider"></div><div style="white-space:nowrap;min-width:18em;" class="btn-group btn-group-sm editor-popup-edit"><button id="editor-popup-edit" type="button" class="btn btn-default">'+this.lang.editProps+'</button><button id="editor-popup-move" type="button" class="btn btn-default">'+this.lang.move+'</button><button id="editor-popup-remove" type="button" class="btn btn-default">'+this.lang.remove+'</button></div>'
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
		$(".leaflet-draw").remove();

		map.on('draw:created', function (e) {
			console.log("created");
			$(".smap-editor-btnadd").removeClass("btn-danger");
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

		this.map.on("popupopen", function(e) {
			if (self._marker && self._marker.dragging._draggable && self._marker.dragging._draggable._enabled === true) {
				self.map.closePopup();
				// self._marker.openPopup();
				if (confirm("Do you to stop editing this feature? Any changes made to the feature will be removed.") === true) {
					self.cancelEdit();
				}
				else {
					return;
				}
			}

			var cont = $(e.popup._container);
			// var layer = e.popup._source;
			self._marker = e.popup._source;
			
			// I used this before: map.on('draw:edited', function (e) {
			// But this one applies only to one marker (the marker that was selected for being moved)
			// self._marker.off('dragend').on('dragend', function(e) {
			// 	f = e.layers;
			// 	for (theId in f._layers) {
			// 		// Don't try to update a feature that has not yet been added (inserted).
			// 		fMod = $.extend({}, {
			// 			_layers: {}
			// 		});
			// 		ff = f._layers[theId];
			// 		if ( $.inArray(ff, inserts) === -1 ) {
			// 			fMod._layers[theId] = ff;
			// 		}
			// 		else {
			// 			alert("already in inserts arr");
			// 		}
			// 	}
			// 	updates.push(fMod);
			// 	// self._updates.push(e.layers);
			// });

			// layer.off('dragend').on('dragend', function(e) {
			// 	// Save on client (not commit)
			// 	var lay = e.target;
			// 	self.wfstSave(lay);
			// 	lay.edited = true;
			// });
			cont.find("#editor-popup-remove").on("click", function() {
				if (confirm(self.lang.ruSureRemove) === true) {
					editLayer.wfstRemove(self._marker).done(function() {
						self._editLayer.clearLayers();
						self._editLayer._refresh(true);
					});
				}
				return false;
			});
			cont.find("#editor-popup-move").on("click", function() {
				// Activate move
				self._marker.closePopup();
				var editToolbar = self._getEditToolbar();
				editToolbar.handler._enableLayerEdit(self._marker);
				self._showSaveToolbar("update");

				// self.map._toolbars[1]._modes["edit"].handler.enable();
				// self._editLayer.eachLayer(drawControl._enableLayerEdit, drawControl);
				return false;
			});
			cont.find("#editor-popup-edit").on("click", function() {
				// Open edit modal
				self._modalEdit.modal("show");
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

	_getDrawToolbar: function() {
		var tBar;
		for (var theId in this._drawControl._toolbars) {
			tBar = this._drawControl._toolbars[theId];
			if (tBar && tBar._modes && tBar._modes[this._geomType]) {
				return tBar._modes[this._geomType];
			}
		}
		return null;
	},

	wfstSave: function(layers){
		layers = layers ? (L.Util.isArray(layers) ? layers : [layers]) : [];

		var defs = [];
		var inst = this._editLayer;
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

	cancelEdit: function() {
		var editToolbar = this._getEditToolbar();
		editToolbar.handler._disableLayerEdit(this._marker);
		this._editLayer.clearLayers();
		this._editLayer._refresh(true);
		this._hideSaveToolbar();
	},

	_showSaveToolbar: function(type) {
		this._editType = type;

		if (!this._saveToolbar) {
			var self = this;
			this._saveToolbar = $('<div class="smap-editor-savetoolbar btn-group btn-group-lg" />');
			var btnSave = $('<button class="btn btn-success">Save</button>'),
				btnCancel = $('<button class="btn btn-default">Cancel</button>');

			this._saveToolbar.append(btnCancel).append(btnSave);
			$(".leaflet-top.leaflet-left").append(this._saveToolbar);
			btnSave.on("click", function() {
				if (self._editType === "update") {
					self.wfstSave(self._marker);
				}
				var editToolbar = self._getEditToolbar();
				editToolbar.handler._disableLayerEdit(self._marker);
				
				if (self._editType === "insert") {
					self._inserts.push(self._marker);
					self.save(function() {
						self._editLayer.clearLayers();
						self._editLayer._refresh(true);
						self._hideSaveToolbar();
					});
				}
				else if (self._editType === "update") {
					self.save();
					self._hideSaveToolbar();
				}
				return false;
			});
			btnCancel.on("click", function() {
				self.cancelEdit();
				return false;
			});
		}

		var btnSaveLbl = this._editType == "insert" ? this.lang.saveNewMarker : this.lang.saveMove;
		var btnCancelLbl = this.lang.cancel;
		this._saveToolbar.find("button:eq(0)").text(btnCancelLbl);
		this._saveToolbar.find("button:eq(1)").text(btnSaveLbl);
		this._saveToolbar.show();
	},

	_hideSaveToolbar: function() {
		this._saveToolbar.hide();
	},

	_fillModal: function(props) {
		props = props || null;

		if (props === null) {
			return false;
		}

		var cont = this._modalEdit.find("#smap-editor-content");
		var key, val, group, inputId,
			form = $('<form role="form" />');
		for (key in props) {
			if (key === "fid" || key === "id" || key === "gid") {
				continue;
			}
			val = props[key];
			inputId = "smap-editor-propentry-"+key;
			group = '<div class="form-group">\
					<label for="'+inputId+'">'+key+'</label>\
					<input type="text" name="'+key+'" class="form-control" id="'+inputId+'" value="'+(val || "")+'">\
				</div>';
			form.append(group);
		}
		form.find("input").on("change", function() {
			$(this).addClass("changed");
		});
		cont.append(form);
	},

	_drawModal: function() {
		var self = this;
		var bodyContent = $('<div id="smap-editor-content" />');
		var footerContent = '<button type="button" class="btn btn-default" data-dismiss="modal">'+this.lang.close+'</button>'+
				'<button id="smap-editor-editmodal-btnsave" type="button" class="btn btn-primary">'+this.lang.save+'</button>';
		this._modalEdit = utils.drawDialog(this.lang.dTitle, bodyContent, footerContent, {});
		this._modalEdit.find("#smap-editor-editmodal-btnsave").on("click", function() {
			// Save new attributes

			var orgProps = self._marker.feature.properties,
				newProps = {};
			var inputs = bodyContent.find("form").find('input.changed');
			if (!inputs.length) {
				self._modalEdit.modal("hide");
				return false;
			}
			inputs.each(function() {
				newProps[$(this).attr("name")] = $(this).val();
			});
			var saveProps = $.extend({}, orgProps, newProps);
			self._marker.feature.properties = saveProps;
			self._editLayer._wfstSave(self._marker, {newProps: newProps}); // Hack for saving new propetrties (otherwise extracted from the old XML response)
			self._modalEdit.modal("hide");

			self.map.closePopup();
			self._marker.fire("click", {
				properties: saveProps,
				latlng: self._marker.getLatLng(),
				originalEvent: {shiftKey: false}
			});
			return false;
		});

		this._modalEdit.on("shown.bs.modal", function() {
			var props = self._marker.feature.properties;
			self._fillModal(props);
		});
		

		// d.modal("show");
		// d.on("shown.bs.modal", function() {
			
		// });
		self._modalEdit.on("hidden.bs.modal", function() {
			// self._saveAttributes(props);
			bodyContent.empty();
		});


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