
L.Control.Editor = L.Control.extend({
	options: {
		position: 'bottomright',
		useProxy: false,
		reverseAxis: false,
		encodeKeys: null, // values with these keys will be encoded before saved to server. For example: ["id", "someattribute", "pics"] or "*" for encode all
		saveOnPressEnter: false,
		noEditProps: ["id", "fid", "gid"] // These values will not be editable through the form
	},
	
	_lang: {
		"sv": {
			dTitle: "Objektets attribut",
			close: "Avbryt",
			save: "Spara",
			remove: "Ta bort",
			move: "Flytta",
			editProps: "Ändra",
			moveLP: "Ändra geometri",
			editPropsLP: "Ändra attribut",
			ruSureRemove: "Ta bort objektet? Åtgärden kan inte ångras.",
			saveNewMarker: "Spara",
			saveMove: "Spara",
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
			moveLP: "Edit geometry",
			editPropsLP: "Edit attributes",
			doYouWantTo: "Do you want to",
			cannotBeUndoed: "Cannot be undoed",
			ruSureRemove: "Remove feature? Cannot be undoed.",
			saveNewMarker: "Save",
			saveMove: "Save",
			undo: "Undo",
			cancel: "Cancel"
		}
	},

	_geomTypes: {
		POINT: "marker",
		MULTIPOINT: "marker",
		LINESTRING: "polyline",
		MULTILINESTRING: "polyline",
		POLYGON: "polygon",
		MULTIPOLYGON: "polygon"
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

	// _onTouchHold: function(e) {
		
		
	// },

	onRemove: function(map) {},

	_addBtnAdd: function() {
		var self = this;
		var btnAdd = $(".smap-editor-btnadd");
		if (!btnAdd.length) {
			var btnAdd = $('<button class="btn btn-default btn-lg smap-editor-btnadd"><i class="glyphicon glyphicon-plus"></i></button>');
			$(".leaflet-top.leaflet-left").prepend(btnAdd);
			btnAdd.on("click touchend", function() {
				var drawToolbar = self._getDrawToolbar();
				$(this).toggleClass("btn-danger");
				if ($(this).hasClass("btn-danger")) {
					if (drawToolbar.handler.type && drawToolbar.handler.type === "marker") {
						
						self._onTouchHold = self._onTouchHold || function(e) {
							var thisHandler = drawToolbar.handler;
							self._tooltip = self._tooltip || {updatePosition: function() {}};
							thisHandler._onMouseMove({latlng: e.latlng});
							thisHandler._onClick({latlng: e.latlng});
						}
						
						self.map.on("click", self._onTouchHold, self);

					}
					drawToolbar.handler.enable();
				}
				else {
					if (utils.isTouchOnly() && drawToolbar.handler.type && drawToolbar.handler.type === "marker") {
						// Disable hack
						self.map.off("click", self._onTouchHold, self);
						$("#smap-editor-uglyhackconfirm").remove();
					}
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
		function onClick(e) {
			if ($(this).parent().hasClass("list-group-item-danger")) {
				self.stopEditing();
			}
			else {
				// Initiate editing of this layer
				var t = $(this).data("t") || {};
				t = $.extend(true, {}, t);
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
			editIcon = $('<i class="fa fa-edit smap-editor-switcher-icon"></i>');
			if (t.options.isEditable) {
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
		if ( $(e.target).hasClass("smap-editor-switcher-icon") ) {
			$(".smap-editor-switcher-icon").trigger("click")
		}
		else {
			$(e.target).tooltip("show");
			setTimeout(function() {
				$(e.target).tooltip("hide");
			}, 2000);
		}
		return false;
	},

	stopEditing: function() {
		if (this._editLayer) {
			// var res = confirm("Do you want to switch editing layer?");
			// if ( res !== true) {
			// 	return false;
			// }
			
			// Force the WFS layer to refresh all features by removing them all
			// if (this._editToolbar) {
			// 	this._editToolbar.handler._disableLayerEdit(this._marker);
			// 	// this._editToolbar = null;
			// }
			this._editLayer.options.editable = false;
			var lid = this._editLayer.options.layerId;
			var wfsLayerId = lid.substring(0, lid.length - "-edit".length);
			var wfsLayer = smap.cmd.getLayer(wfsLayerId);
			if (wfsLayer && wfsLayer.clearLayers) {
				wfsLayer.clearLayers();
			}
			if (wfsLayer && wfsLayer._refresh) {
				wfsLayer._refresh({force: true});
			}
			this.map.removeLayer(this._editLayer);
		}
		$(".lswitch-panel-ol .list-group-item")
			.off("click", this._disabledRowClick)
			.removeClass("list-group-item-danger");
		$(".lswitch-panel-ol .list-group-item").tooltip("destroy");


		this.map.off('draw:created');
		this.map.off("popupopen", this.__onPopupOpen);

		// this._addBtnAdd();
		$(".smap-editor-btnadd").remove();
		// if (this._marker) {
		// 	this.map.removeLayer(this._marker);
		// 	this._marker = null;
		// }
		// this._marker = null;
		// this._markerGeometry = null;

		return true;
	},

	_validateConfig: function(t) {
		t = t || {};
		
		var o = t.options || {};
		var arr = [];
		for (var geomType in this._geomTypes) {
			arr.push(geomType);
		}
		
		if (!o.geomType) {
			alert("You must specify one of these geomTypes: "+arr.join(", "));
			return false;
		}
		if ($.inArray(o.geomType.toUpperCase(),  arr) === -1) {
			alert("You must specify one of these geomTypes: "+arr.join(", "));
			return false;
		}
		return true;
	},

	startEditing: function(t, row) {
		var self = this,
			map = this.map;
		if (this.stopEditing() !== true) {
			return false;
		}
		this._addBtnAdd();
		self._tooltip = self._tooltip || {updatePosition: function() {}};

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
		if (this._validateConfig(t) === false) {
			return false;
		}
		var opts = $.extend({}, t.options); // Clone options
		var tn = opts.params.typeName;
		opts.url = t.url;
		opts.featureNS = tn.split(":")[0];
		opts.featureType = tn.split(":")[1];
		opts.layerId = opts.layerId + "-edit";
		
		var geomType = opts.geomType.toUpperCase();
		var langMove = geomType === "POINT" ? this.lang.move : this.lang.moveLP;
		var langEditProps = geomType === "POINT" ? this.lang.editProps : this.lang.editPropsLP;
		var langRemove = this.lang.remove;
		opts.popup = '${*}<div class="popup-divider"></div><div style="white-space:nowrap;min-width:25em;" class="btn-group btn-group-sm editor-popup-edit"><button id="editor-popup-edit" type="button" class="btn btn-default">'+langEditProps+'</button><button id="editor-popup-move" type="button" class="btn btn-default">'+langMove+'</button><button id="editor-popup-remove" type="button" class="btn btn-default">'+langRemove+'</button></div>';
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
		
		// Bug fix: L.Control.Draw checks for property editing and if not present cannot reload features after undoed edit geometry.
		this._editLayer.options.editing = this._editLayer.options.editing || {};

		this._editLayer.on("wfst:savesuccess", function() {
			smap.cmd.loading(false);
		});
		this._editLayer.on("wfst:saveerror", function() {
			smap.cmd.loading(false);
		});
		this._editLayer.on("wfst:ajaxerror", function() {
			smap.cmd.loading(false);
		});
		map.addLayer(this._editLayer);

		// Initialize the draw control and pass it the FeatureGroup of editable layers
		this._drawControl = new L.Control.Draw({
			edit: {
				featureGroup: this._editLayer
			}
		});

		map.addControl(this._drawControl);
		$(".leaflet-draw").remove();

		function onLoad(e) {
			var fs = e.layer.jsonData.features || [];
			if (fs.length) {
				self.options.geomType = self._geomType = self._geomTypes[e.layer.options.geomType.toUpperCase()];
				if (!self._geomType) {
					alert("Could not detect geometry type. Please set it explicitly.");
				}
				// else {
				// 	alert(self._geomType);
				// }
			}
			else {
				var geomType = e.layer.options.geomType;
				if (!geomType) {
					alert("You must define a geomType in the options of this layer! Set of these: (POINT, LINESTRING, POLYGON, MULTIPOINT, MULTILINESTRING, MULTIPOLYGON).");
				}
				else {
					self._geomType = self._geomTypes[geomType.toUpperCase()];
				}
			}
		};
		this._editLayer.on("load", onLoad);

		// this._editLayer.options.onEachFeature = function(json, layer) {
		// 	var onEdit = function() {
		// 		self._marker = this;
		// 		self._showSaveToolbar("update");
		// 	}
		// 	layer.on("edit", onEdit);
		// };

		map.on('draw:created', function (e) {
			$(".smap-editor-btnadd").removeClass("btn-danger");
			self._editLayer.addLayer(e.layer);
			self._marker = e.layer;
			self._showSaveToolbar("insert");
		});

		this.__onPopupOpen = this.__onPopupOpen || $.proxy(this._onPopupOpen, this);
		this.map.on("popupopen", this.__onPopupOpen);
	},

	_getLayerById: function(layer, theId) {
		var topLevelId;
		var level = 0;
		function digIntoTheMud(_layer) {
			var lays = _layer._layers || {};
			if (!lays) {
				return null;
			}
			if (lays.hasOwnProperty(theId)) {
				return {
					marker: lays[theId],
					markerGeometry: lays[theId]

				}
			}
			var resp, lid;
			for (lid in lays) {
				if (level === 0) {
					topLevelId = lid;
				}
				level += 1;
				resp = digIntoTheMud(lays[lid]);
				level -= 1;
				if (resp) {
					return {
						marker: layer._layers[topLevelId],
						markerGeometry: resp.marker
					}
				}
			}
			return null;
		};
		return digIntoTheMud(layer);
	},

	_onPopupOpen: function(e) {
		// var theId, f, ff, fMod,
		// 	inserts = this._inserts,
		// 	updates = this._updates,
		// 	deletes = this._deletes;

		var self = this;
		if (this._marker && this._marker.dragging && this._marker.dragging._draggable && this._marker.dragging._draggable._enabled) {
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
		if (!e.popup._source.feature || this._geomType == "polyline") {
			var m = this._getLayerById(this._editLayer, e.popup._source._leaflet_id);
			this._marker = m.marker;
			this._markerGeometry = e.popup._source; //m.markerGeometry;
		}
		else {
			this._marker = e.popup._source;
			this._markerGeometry = null;
		}
		
		cont.find("#editor-popup-remove").on("click", function() {
			if (confirm(self.lang.ruSureRemove) === true) {
				self._editLayer.wfstRemove(self._marker).done(function() {
					self._editLayer.clearLayers();
					self._editLayer._refresh({force: true});
				});
			}
			return false;
		});
		cont.find("#editor-popup-move").on("click", function() {
			// Activate move
			// self._marker.closePopup();
			self.map.closePopup();
			var editToolbar = self._getEditToolbar();
			editToolbar.handler._enableLayerEdit(self._markerGeometry || self._marker);
			self._showSaveToolbar("update");
			self._editLayer.options.editable = true;

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
					smap.cmd.loading(true);
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

	cancelEdit: function() {
		var editToolbar = this._getEditToolbar();
		editToolbar.handler._disableLayerEdit(this._markerGeometry || this._marker);
		this._editLayer.clearLayers();
		this._editLayer._refresh({force: true});
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
				self._marker.options.geomType = self._editLayer.options.geomType.toUpperCase();

				if (self._editType === "update") {
					var geomType = self._marker.options.geomType;
					if (geomType === "POINT" || geomType === "POLYGON") {
						self.wfstSave(self._marker);
					}
					else { //if (self._geomType === "polyline") {
						self._markerGeometry.feature = $.extend({}, self._marker.feature);
						self.wfstSave(self._markerGeometry);
					}
				}
				var editToolbar = self._getEditToolbar();
				editToolbar.handler._disableLayerEdit(self._markerGeometry || self._marker);
				
				if (self._editType === "insert") {
					self._inserts.push(self._marker);
					self.save(function() {
						self._editLayer.clearLayers();
						self._editLayer._refresh({force: true});
						self._hideSaveToolbar();
					});
				}
				else if (self._editType === "update") {
					self.save();
					self._hideSaveToolbar();
				}
				// self.cancelEdit();
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
			form = $('<form role="form" />'),
			encodeKeys = this.options.encodeKeys || [],
			noEditProps = this.options.noEditProps || [];
		for (key in props) {
			if ( $.inArray(key, noEditProps) > -1) {
				continue;
			}
			val = props[key];
			val = val || ""; // Always decode first
			if ( encodeKeys === "*" || $.inArray(key, encodeKeys) > -1 ) {
				val = decodeURIComponent(val);
			}
			inputId = "smap-editor-propentry-"+key;
			group = '<div class="form-group">\
					<label for="'+inputId+'">'+key+'</label>\
					<textarea rows="1" resizable name="'+key+'" class="form-control" id="'+inputId+'">'+val+'</textarea>\
				</div>';
			form.append(group);
		}
		form.find("textarea").on("change", function() {
			$(this).addClass("changed");
		}).on("focus", function() {
			$(this).prop("rows", 5);
		}).on("blur", function() {
			$(this).prop("rows", 1);
		});
		cont.append(form);
	},

	_onSaveAttributesSuccess: function(e) {
		this._marker.fire("click");
	},

	_saveAttributes: function() {
		var orgProps = this._marker.feature.properties,
			newProps = {};
		var inputs = this._modalEdit.find("form").find('textarea.changed');
		if (!inputs.length) {
			this._modalEdit.modal("hide");
			return false;
		}
		var key, val,
			encodeKeys = this.options.encodeKeys || [];
		inputs.each(function() {
			key = $(this).attr("name");
			val = $(this).val();
			if ( encodeKeys === "*" || $.inArray(key, encodeKeys) > -1 ) {
				val = encodeURIComponent( val );
			}
			newProps[key] = val;
		});
		var saveProps = $.extend({}, orgProps, newProps);
		this._marker.feature.properties = saveProps;


		if (!this._marker.toGML) {
			this._markerGeometry.feature = $.extend({}, this._marker.feature);
		}
		
		this.__onSaveAttributesSuccess = this.__onSaveAttributesSuccess || $.proxy(this._onSaveAttributesSuccess, this);
		this._editLayer
			.off("wfst:savesuccess", this.__onSaveAttributesSuccess)
			.on("wfst:savesuccess", this.__onSaveAttributesSuccess);
		this._editLayer._wfstSave(this._markerGeometry || this._marker, {newProps: newProps}); // Hack for saving new properties (otherwise extracted from the old XML response)
		this._modalEdit.modal("hide");

		this.map.closePopup();

		var self = this;
	},

	_drawModal: function() {
		var self = this;
		var bodyContent = $('<div id="smap-editor-content" />');
		var footerContent = '<button type="button" class="btn btn-default" data-dismiss="modal">'+this.lang.close+'</button>'+
				'<button id="smap-editor-editmodal-btnsave" type="button" class="btn btn-primary">'+this.lang.save+'</button>';
		this._modalEdit = utils.drawDialog(this.lang.dTitle, bodyContent, footerContent, {});
		this._modalEdit.find("#smap-editor-editmodal-btnsave").on("click", function() {
			// Save new attributes
			self._saveAttributes();
			return false;
		});

		this._modalEdit.on("shown.bs.modal", function() {
			var props = self._marker.feature.properties;
			self._fillModal(props);

			if (self.options.saveOnPressEnter) {
				// Trigger save and close modal if user presses Enter.
				self._modalEdit.on("keypress", function(e) {
					if (e.which === 13) {
						// Trigger save and prevent event bubbling
						// self._modalEdit.blur();
						$("#smap-editor-editmodal-btnsave").focus();
						self._saveAttributes();
						self._modalEdit.modal("hide");
						e.preventDefault();
					}
				});
			}
		});
		

		// d.modal("show");
		// d.on("shown.bs.modal", function() {
			
		// });
		self._modalEdit.on("hidden.bs.modal", function() {
			// self._saveAttributes(props);
			bodyContent.empty();
			self._modalEdit.off("keypress");
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