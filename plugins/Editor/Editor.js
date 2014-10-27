
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

		this._drawModal();

		var self = this;
		smap.event.on("smap.core.pluginsadded", function() {
			self._setEditableLayer();
		});
		return this._container;
	},

	onRemove: function(map) {},

	_addBtnAdd: function() {
		var self = this;
		var btnAdd = $(".smap-editor-btnadd");
		if (!btnAdd.length) {
			var btnAdd = $('<button class="btn btn-default btn-lg smap-editor-btnadd"><i class="fa fa-map-marker fa-2x"></i></button>');
			$(".leaflet-top.leaflet-left").prepend(btnAdd);
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
		}
	},

	_setEditableLayer: function() {
		var ols = smap.config.ol || [],
			t, row, editIcon;
		var s = smap.cmd.getControl("LayerSwitcher");
		if (!s)
			return false;

		var self = this;
		function onClick() {
			if ($(this).parent().hasClass("list-group-item-danger")) {
				self.stopEditing();
			}
			else {
				// Initiate editing of this layer
				var t = $(this).data("t") || {};
				if (t.init === "L.GeoJSON.WFS") {
					self.startEditing(t, $(this).parent());
				}
				else {
					alert("Kan inte redigera lager av typen "+t.init);
				}
			}
			return false;
		};
		for (var i=0,len=ols.length; i<len; i++) {
			t = ols[i];
			editIcon = $('<i class="fa fa-edit smap-editor-switcher-icon"></i>')
			if (t.options.editable) {
				// Add the edit icon
				row = $("#"+s._makeId(t.options.layerId));
				row.append(editIcon);
				editIcon.data("t", t);
				editIcon.on("click", onClick);
			}

		}
	},

	_disabledRowClick: function(e) {
		e.stopPropagation();
		e.preventDefault();
		$(e.target).tooltip("show");
		setTimeout(function() {
			$(e.target).tooltip("hide");
		}, 2000);
		return false;
	},

	stopEditing: function() {
		if (this._editLayer) {
			// var res = confirm("Do you want to switch editing layer?");
			// if ( res !== true) {
			// 	return false;
			// }
			
			// Force the WFS layer to refresh all features by removing them all
			var lid = this._editLayer.options.layerId;
			var wfsLayerId = lid.substring(0, lid.length - "-edit".length);
			var wfsLayer = smap.cmd.getLayer(wfsLayerId);
			if (wfsLayer && wfsLayer.clearLayers) {
				wfsLayer.clearLayers();
			}
			if (wfsLayer && wfsLayer._refresh) {
				wfsLayer._refresh(true);
			}
			this.map.removeLayer(this._editLayer);
		}
		$(".lswitch-panel-ol .list-group-item")
			.off("click", this._disabledRowClick)
			.removeClass("list-group-item-danger");
		$(".lswitch-panel-ol .list-group-item").tooltip("destroy");


		this.map.off('draw:created');
		this.map.off("popupopen", this.__onPopupOpen);

		this._addBtnAdd();
		$(".smap-editor-btnadd").remove();
		return true;
	},

	startEditing: function(t, row) {
		var self = this,
			map = this.map;

		if (this.stopEditing() !== true) {
			return false;
		}
		this._addBtnAdd();

		$(".lswitch-panel-ol .list-group-item.active").trigger("tap"); // Hide all layers
		$(".lswitch-panel-ol .list-group-item-danger").removeClass("list-group-item-danger");
		$(".lswitch-panel-ol .list-group-item")
			.tooltip({
				title: "Redigering är aktiv. Deaktivera redigering för att tända lagret.",
				trigger: "manual",
				placement: "right",
				container: "#maindiv"
			})
			.on("click", this._disabledRowClick);
		row.addClass("list-group-item-danger");

		// var defaults = {
		// 		// Required
		// 		xhrType: "POST",
		// 		reverseAxis: this.options.reverseAxis
		// };

		var opts = $.extend({}, t.options); // Clone options
		var tn = opts.params.typeName;
		opts.url = t.url;
		opts.featureNS = tn.split(":")[0];
		opts.featureType = tn.split(":")[1];
		opts.layerId = opts.layerId + "-edit";
		opts.popup = '${*}<div class="popup-divider"></div><div style="white-space:nowrap;min-width:18em;" class="btn-group btn-group-sm editor-popup-edit"><button id="editor-popup-edit" type="button" class="btn btn-default">'+this.lang.editProps+'</button><button id="editor-popup-move" type="button" class="btn btn-default">'+this.lang.move+'</button><button id="editor-popup-remove" type="button" class="btn btn-default">'+this.lang.remove+'</button></div>';
		// var t = {
		// 		url : url,
		// 		featureNS : "sandbox",
		// 		featureType : "wfstpoints",
		// 		uniqueKey: 'fid',
		// 		selectable: true,
		// 		reverseAxis: false,
		// 		reverseAxisBbox: true,
		// 		useProxy: false,
		// 		srs: "EPSG:4326",
		// 		layerId: "mylayerid",
		// 		popup: '${*}<div class="popup-divider"></div><div style="white-space:nowrap;min-width:18em;" class="btn-group btn-group-sm editor-popup-edit"><button id="editor-popup-edit" type="button" class="btn btn-default">'+this.lang.editProps+'</button><button id="editor-popup-move" type="button" class="btn btn-default">'+this.lang.move+'</button><button id="editor-popup-remove" type="button" class="btn btn-default">'+this.lang.remove+'</button></div>'
		// };
		this._editLayer = L.wfst(t.url, opts);
		map.addLayer(this._editLayer);

		// Initialize the draw control and pass it the FeatureGroup of editable layers
		this._drawControl = new L.Control.Draw({
			edit: {
				featureGroup: this._editLayer
			}
		});

		map.addControl(this._drawControl);
		$(".leaflet-draw").remove();

		map.on('draw:created', function (e) {
			$(".smap-editor-btnadd").removeClass("btn-danger");
			self._editLayer.addLayer(e.layer);
			self._marker = e.layer;
			self._showSaveToolbar("insert");
		});

		this.__onPopupOpen = this.__onPopupOpen || $.proxy(this._onPopupOpen, this);
		this.map.on("popupopen", this.__onPopupOpen);
	},

	_onPopupOpen: function(e) {
		// var theId, f, ff, fMod,
		// 	inserts = this._inserts,
		// 	updates = this._updates,
		// 	deletes = this._deletes;

		var self = this;
		if (this._marker && this._marker.dragging._draggable && this._marker.dragging._draggable._enabled === true) {
			this.map.closePopup();
			// this._marker.openPopup();
			if (confirm("Do you to stop editing this feature? Any changes made to the feature will be removed.") === true) {
				this.cancelEdit();
			}
			else {
				return;
			}
		}

		var cont = $(e.popup._container);
		// var layer = e.popup._source;
		this._marker = e.popup._source;
		
		cont.find("#editor-popup-remove").on("click", function() {
			if (confirm(self.lang.ruSureRemove) === true) {
				self._editLayer.wfstRemove(self._marker).done(function() {
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

			// this.map._toolbars[1]._modes["edit"].handler.enable();
			// this._editLayer.eachLayer(drawControl._enableLayerEdit, drawControl);
			return false;
		});
		cont.find("#editor-popup-edit").on("click", function() {
			// Open edit modal
			self._modalEdit.modal("show");
			return false;
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