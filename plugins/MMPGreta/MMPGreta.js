
L.Control.MMPGreta = L.Control.extend({
	options: {
		// wsSave: location.protocol+"//gkvmgretaws.gkmalmo.local/KartService.svc/saveGeometry",
		wsSave: location.protocol+"//kartor.malmo.se/gkgreta/KartService.svc/saveGeometry",
		xhrType: "GET",
		inputCrs: "EPSG:3008",
		saveCrs: "EPSG:3008",
		uniqueKey: false, //"ArendeId",
		reverseAxis: false,
		reverseAxisBbox: true,
		colorSaved: "#71A500",
		colorUnSaved: "#FF0000",
		statusKey: "Attribut",
		statusColors: {
			"passed": 	"blue",
			"now": 		"darkred",
			"future": 	"orange"
		},
		popup:	'<div>'+
					'<div>${TooltipTitle}</div>'+
					'<div>${Tooltip}</div>'+
					'<div style="margin-top: 0.7em;">${TooltipUrl}</div>'+
				'</div>'

	},
	
	_lang: {
		"sv": {
			addPoint: "Rita punkt",
			addPolyline: "Rita linje",
			addPolygon: "Rita yta",
			remove: "Ta bort",
			edit: "Redigera",
			save: "Spara",
			instructEditing: "Klicka här igen när du redigerat klart",
			saveSuccess: "<b>Ändringarna har sparats!</b>",
			saveError: "<b>Ändringarna kunde inte sparas!</b><p>Felet har loggats till utvecklingskonsolen.</p>"
		},
		"en": {
			addPoint: "Draw point",
			addPolyline: "Draw line",
			addPolygon: "Draw polygon",
			remove: "Remove",
			edit: "Edit",
			save: "Save",
			instructEditing: "Click here when you are done editing",
			saveSuccess: "Edits saved!",
			saveError: "Could not save edits!"
		}
	},

	initialize: function(options) {
		L.setOptions(this, options);
		if (options._lang) {
			// Always allow setting lang through options
			$.extend(true, this._lang, options._lang);
		}
		this._setLang(options.langCode);

		// Init hooks
		L.Edit.Poly.addInitHook(function () {
			if (this._poly && !this._poly.options.editing) {
				this._poly.options.editing = {};
			}
			this._fireEdit = function () {
				this._poly.edited = true;
				this._poly.fire('edit');
				smap.map.fire("draw:editedpoly", this._poly);
			};
		});
		L.Edit.Marker.addInitHook(function () {
			this._onDragEnd = function (e) {
				var layer = e.target;
				layer.edited = true;
				smap.map.fire("draw:editedmarker", layer);
			};
		});

		L.EditToolbar.Delete.addInitHook(function() {
			this._removeLayer = function (e) {
				var layer = e.layer || e.target || e;

				var marker = layer.editing._marker;
				if ( !marker || !(marker.options.hasOwnProperty("editable") && marker.options.editable === false)) {
					this._deletableLayers.removeLayer(layer);
					this._deletedLayers.addLayer(layer);
					this._map.fire("mmpgreta:edited");
				}
				else {
					smap.cmd.notify("Ärendepunkter kan inte redigeras/tas bort", "warning", {fade: true});
				}
			}
		});


	},

	_setLang: function(langCode) {
		langCode = langCode || smap.config.langCode;
		if (this._lang) {
			this.lang = this._lang ? this._lang[langCode] : null;			
		}
	},

	onAdd: function(map) {
		this.map = map;
		this._container = L.DomUtil.create('div', 'leaflet-control-MMPGreta'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		this.$container = $(this._container);
		this._bindEvents();

		this._tools = {};

		// this._createBtn();

		return this._container;
	},

	_bindEvents: function() {
		smap.event.on("smap.core.createjsonlayer", (function(e, layerOptions) {
			// Modify external layer options before created (this can also be done in config using smapOptions.externalJsonOptions)

			function onMouseOver(e) {
				var props = e.target.feature.properties;
				if (props.TooltipTitle && props.Tooltip) {
					var text = '<b>'+props.TooltipTitle+"</b><p>"+props.Tooltip+"</p>";
					if ( !$(".leaflet-top.leaflet-right").find("button.active").length) {
						this._tooltip = utils.createLabel(e.latlng, text, "mmpgreta-tooltip");
						this._map.addLayer(this._tooltip);
					}
				}
			}
			function onMouseOut(e) {
				if (this._tooltip) {
					this._map.removeLayer(this._tooltip);
				}
			}

			var i = 0;
			$.extend(layerOptions, {
				inputCrs: this.options.inputCrs,
				uniqueKey: this.options.uniqueKey,
				reverseAxis: this.options.reverseAxis,
				reverseAxisBbox: this.options.reverseAxisBbox,
				noBindZoom: true,
				noBindDrag: true,
				style: {
					fillColor: this.options.colorSaved,
					color: this.options.colorSaved,
					opacity: 1
				},
				pointToLayer: (function (f, latLng) {
					var props = f.properties;
					
					// - For dev only! -
					// var rand = Math.floor( Math.random() * 3 );
					// var val = ["f", "n", "p"][rand];
					// props[this.options.statusKey] = val;
					// - End dev -
					
					var markerColor = this.options.statusColors[props[this.options.statusKey]];
					var isObject = !markerColor ? true : false; // Greta has 2 types of features: Objects and POIs

					// The iconClass can be overriden from the Icon property, otherwise defaults to the below.
					var iconClass = props.Icon && props.Icon.length ? props.Icon : (isObject ? "warning" : "warning");
					iconClass = iconClass.replace("fa fa-", "").replace(/fa/g, "");
					var markerIcon = L.AwesomeMarkers.icon({
						icon: iconClass,
						prefix: 'fa',
						markerColor: isObject ? "green" : markerColor
					});

					var marker = L.marker(latLng, {icon: markerIcon});
					marker.on("mouseover", onMouseOver.bind(this));
					marker.on("mouseout", onMouseOut.bind(this));

					if (f.id && f.id.toUpperCase().indexOf("POI_ARENDE_") > -1) {
						marker.options.editable = false;
						marker.options.draggable = false;
						delete marker.editing;
						marker.editing = {enable: function() {}, disable: function() {}, _marker: marker}; // attach nonsence func to avoid error
					}
					
					return marker;
				}).bind(this)
			});
		}).bind(this));
		var self = this;
		smap.event.on("smap.core.beforeapplyparams", (function(e, p) {
			// self._snapLayer = smap.cmd.getLayer(p.CATEGORY);
			// if (self._snapLayer) {
			// 	self._addEditInterface();
			// }


			// if (p.GRETA_EDIT && p.GRETA_EDIT.toUpperCase() === "TRUE" ) {
			// 	// Show the edit panel
			// 	this.addEditPanel();
			// }
			if (p.GRETA_EDITID) {
				// This means, we should start editing (modifying, deleting or creating new features).
				// The ID is used for allowing editing of features with the given id only.
				this._editId = parseInt(p.GRETA_EDITID);

				smap.event.on("smap.core.addedjsonlayer", (function(e, layer) {
					if (this._hasInitiated) {
						return false;
					}
					this._hasInitiated = true;
					layer.options.popup = self.options.popup;
					var onLayerLoad = (function() {
						var fg = L.featureGroup([], {
							selectable: true
						});
						fg.options = {}; // editable: false
						this.map.removeLayer(layer);
						layer.eachLayer(function(lay) {
							fg.addLayer(lay);
						});
						this._editLayer = fg;
						this.map.addLayer(fg);
						// layer._map = this.map;
						this.addEditPanel(fg);

						// Make sure edited features are also rendered as unselected on map click e.g.
						this.map.on("unselected", function() {
							fg.eachLayer(function(lay) {
								if (lay.editing && lay.editing._poly && (lay.options || lay.editing._poly.options)) {
									var poly = lay.editing._poly;
									var style = lay.editing._poly.options || lay.options;
									// poly.setStyle(poly.options.style);
									var wasSaved = style.color === "#FF0000" ? false : true;
									if (wasSaved === false) {
										setTimeout(function() {
											self._updateLayerStyle(wasSaved, poly);
										}, 0);
									}
									else {
										self._updateLayerStyle(wasSaved, poly);
									}
									// console.log(poly.options.style.color === "#FF0000");
									// self._updateLayerStyle(lay.options._saved, lay.editing._poly);
								}
							});
						});
						layer.off("load", onLayerLoad);
					}).bind(this);
					layer.on("load", onLayerLoad);
				}).bind(this));

			}
			else {
				smap.event.on("smap.core.addedjsonlayer", (function(e, layer) {
					layer.options.popup = self.options.popup;
					delete layer.pointToLayer;
				}).bind(this));
			}
			this._map.on("selected", (function() {
				if (this._tooltip) {
					this.map.removeLayer(this._tooltip);
				}
			}).bind(this));

		}).bind(this));
	},

	onRemove: function(map) {},


	_adaptUrl: function(url) {
		if (!url || !url.length || !(typeof url === "string")) {
			return url;
		}
		switch(document.domain) {
			case "localhost":
				return url.replace("kartor.malmo.se", "localhost");
			case "kartor.malmo.se":
				return url;
			default:
				return url;

		}
	},

	onStartEdit: function() {
		alert("edited indeed");
	},

	_getTool: function(type) {
		type = utils.capitalize(type.toLowerCase());

		if (!this._tools[type]) {
			var init, tool;
			switch (type) {
				case "Delete":
					init = L.EditToolbar.Delete;
					var options = {featureGroup: this._editLayer};
					tool = new init(this.map, options);
					break;
				case "Edit":
					tool = {
						enable: this.startEditing.bind(this),
						disable: this.stopEditing.bind(this)
					};
					break;
				default:
					init = L.Draw[type] || L.Edit[type] || L.EditToolbar[type];
					tool = new init(this.map, options);
					var options = this._drawControl.options.draw[type];
					var color = this.options.colorUnSaved; //"#0077E2";
					tool.options.shapeOptions = {
						color: color,
						fillColor: color
					};

			}

			// $.extend(true, tool.options, {
			// 	selectedPathoptions: {
			// 		maintainColor: true,
			// 		opacity: 0.3
			// 	}
			// });
			this._tools[type] = tool;
		}
		return this._tools[type];

	},

	_deactivateAllTools: function(except) {
		for (var type in this._tools) {
			if (except && type.toUpperCase() === except.toUpperCase()) {
				continue;
			}
			this._deactivateTool(type);
		}	
	},

	_activateTool: function(type) {
		this._deactivateAllTools(type);
		var tool = this._getTool(type);
		switch (type) {
			case "DELETE":
				// this._map.fire("draw:deleteactive");
				break;
			// case "EDIT":
			// 	var $btnEdit = $(".mmpgreta-type-edit:parent");
			// 	$btnEdit.popover({
			// 		placement: "bottom",
			// 		title: false, //this.lang.instructEditing,
			// 		content: this.lang.instructEditing,
			// 		delay: {hide: 5000},
			// 		trigger: "manual"

			// 	}).popover("show")
			// 	break;
			default:
				break;

		}
		tool.enable();
	},

	_deactivateTool: function(type) {
		var tool = this._getTool(type);
		var $btn = $(".mmpgreta-type-"+type.toLowerCase());
		tool.disable();
		$btn.removeClass("active btn-danger");
		// switch (type) {
		// 	case "EDIT":
		// 		var $btnEdit = $(".mmpgreta-type-edit:parent");
		// 		$btnEdit.popover("destroy");
		// 		break;
		// 	default:
		// 		break;

		// }

	},

	startEditing: function() {
		this._editLayer.options.editable = true;
		smap.cmd.loading(true);
		var self = this;
		setTimeout((function() {
			this._editLayer.eachLayer(function(layer) {
				switch (layer.editing) {
					case undefined:
						break;
					default:
						layer.editing.enable();
				}
			});
			smap.cmd.loading(false);
			// this._map.fire("mmpgreta:edited");
		}).bind(this), 1);
	},

	stopEditing: function() {
		this._editLayer.options.editable = false;
		smap.cmd.loading(true);
		setTimeout((function() {
			this._editLayer.eachLayer(function(layer) {
				if (layer.editing) {
					layer.editing.disable();
				}
			});
			smap.cmd.loading(false);
		}).bind(this), 1);
	},

	addEditPanel: function(editLayer) {
		var drawControl = new L.Control.Draw({
				draw: false,
				edit: {
					// edit: true,
					featureGroup: editLayer,
					remove: false
				}
		});
		this.map.addControl(drawControl);
		this._drawControl = drawControl;
		$(".leaflet-draw").remove(); // Remove the default interface

		function onAdd(e) {
			var type = e.layerType,
				layer = e.layer;
			// layer = L.GeoJSON.geometryToLayer(layer.toGeoJSON());
			editLayer.addLayer(layer);

			// layer.options.clickable = true;
			// layer.on("click", function() {
			// 	alert("click");
			// 	editLayer.removeLayer(layer);
			// });

			// layer.off("click").on("click", function() {
			// 	alert("he");
			// });
			// for (var k in layer._layers) {
			// }
			// editLayer._refresh(); // Make the layer update
			this._deactivateAllTools();
			this._map.fire("mmpgreta:edited", layer);
		}
		this.map.on('draw:created', onAdd.bind(this));


		// this._map.on("draw:deleteactive", (function() {
		// 	// this._editLayer.removeLayer(e.layers);
		// 	// this._drawControl.options.edit.featureGroup.removeLayer(e.layers);
		// 	this._editLayer.eachLayer(function(marker) {
		// 		var f = marker.feature;
		// 		if (f.id && f.id.toUpperCase().indexOf("POI_ARENDE_") > -1) {
		// 			marker.options.editable = false;
		// 		}
		// 	});

		// }).bind(this));

		var self = this;

		function onClick(e) {
			var $this = $(this);
			var type = $this.prop("data-geomtype");
			if ($this.toggleClass("active btn-danger").hasClass("active")) {
				self._activateTool(type);
			}
			else {
				self._deactivateTool(type);
			}
			return false;
		}

		var $btnSave = this._addBtn("fa fa-save", this.lang.save, (function() {
			this._deactivateAllTools();
			this.save();
		}).bind(this));
		$btnSave.prop("id", "btn-save");
		this._allowSaving(false);
		
		this._map.on("draw:editedpoly", function(layer) {
			self._updateLayerStyle(false, layer.editing._poly);
			self._allowSaving(true);
			layer.editing._poly.options._save = false;
			layer.editing._poly.options._saved = layer.options._saved = false;
		});
		this._map.on("draw:editedmarker", function(layer) {
			self._updateLayerStyle(false, layer.editing._marker);
			self._allowSaving(true);
			layer.editing._marker.options._save = layer.options._saved = false;
		});

		// this._map.on("draw:vertexchanged", function(e) {
		// 	var poly;
		// 	if (poly) {
		// 		self._map.fire("mmpgreta:edited", poly);
		// 	}
		// });
		this._map.on("mmpgreta:edited", (function(layer) {
			this._allowSaving(true);
			if (layer && layer.options && layer.options.icon) {
				var marker = layer.editing._marker || layer;
				marker.setIcon(L.AwesomeMarkers.icon({
						icon: 'warning',
						prefix: 'fa',
						markerColor: "red"
					})
				)
				layer.options._saved = false;
			}

			// if (this._prevJson && this._prevJson == this.filterBeforeSave(this._editLayer.toGeoJSON())) {
			// 	// Nothing has changed
			// 	console.log("nothing changed");
			// }
			// else {
			// 	this._allowSaving(true); //.addClass("btn-warning");
			// 	console.log("Changed! …");
			// }
		}).bind(this));
		// $btnSave.find(".btn").removeClass("btn-default").addClass("btn-primary"); // Special color for Save



		this._addToolBtn("fa fa-eraser", this.lang.remove, "DELETE", onClick);
		this._addToolBtn("fa fa-edit", this.lang.edit, "EDIT", onClick);
		this._addToolBtn("fa fa-object-ungroup", this.lang.addPolygon, "POLYGON", onClick);
		this._addToolBtn("fa fa-code-fork", this.lang.addPolyline, "POLYLINE", onClick);
		this._addToolBtn("fa fa-map-marker", this.lang.addPoint, "MARKER", onClick);


		// this._addBtn("fa fa-edit", this.lang.edit);

		// Since we are adding buttons async, the Toolhandler module won't know it should show its button
		var toolhandler = smap.cmd.getControl("ToolHandler");
		if (toolhandler) {
			toolhandler.update();
		}

	},

	_allowSaving: function(doEnable) {
		var $btnSave = $("#btn-save .btn");
		if (doEnable) {
			$btnSave.prop("disabled", false);
		}
		else {
			$btnSave.prop("disabled", true);
		}
	},

	removeEditPanel: function() {},

	_addBtn: function(iconClass, title, onClick) {
		var $btn = $('<div class="leaflet-control"><button title="' + title + '" class="btn btn-default"><span class="'+iconClass+'"></span></button></div>');
		$btn.find(".btn").on("click", onClick);
		$(".leaflet-top.leaflet-right").append($btn);
		$btn.prop("title", title).tooltip({placement: "bottom"});
		return $btn;
	},

	_addToolBtn: function(iconClass, title, type, onClick) {
		var $btn = this._addBtn(iconClass, title, onClick);
		$btn.find(".btn").prop("data-geomtype", type).addClass("mmpgreta-type-"+type.toLowerCase());
		return $btn;

	},

	filterBeforeSave: function(geoJson) {
		var self = this;

		geoJson.features.forEach(function(f, i) {
			// Project to desired projection
			utils.projectFeature(f, "EPSG:4326", self.options.saveCrs, {
				reverseAxisOutput: false,
				decimals: 0
			});
			f.properties.ArendeId = self._editId; // Important, so that saving will work server-side
		});

		// Don't save ÄrendePunkter
		geoJson.features = geoJson.features.filter(function(item) {
			return !item.id || item.id && item.id.toUpperCase().indexOf("POI_ARENDE_") === -1;
		});
		return geoJson; // not needed since we modify the object, but anyways…
	},

	_updateLayerStyle: function(saved, layer) {
		layer = layer || this._editLayer;
		
		var color;

		if (layer.setStyle) {
			color = saved ? this.options.colorSaved : this.options.colorUnSaved;
			var style = {
					fillColor: color,
					color: color,
					opacity: 1
			};
			layer.setStyle(style);
			layer.options.style = style;
			// layer.editing._poly.options.style = style;
		}
		else {
			color = saved ? "green" : "red";
			var prevColor = saved ? "red" : "green";

			// var icon = L.AwesomeMarkers.icon({
			// 	icon: null, //'warning',
			// 	prefix: 'fa',
			// 	markerColor: color
			// });
			// if (layer.setIcon && color !== layer.options.icon.options.markerColor) {
			// 	layer.setIcon(icon);
			// }
			var prefix = "awesome-marker-icon-";
			layer.options.icon.options.markerColor = color;
			$(layer._icon).removeClass(prefix+prevColor).addClass(prefix+color);
			// layer.options.icon.options.className = layer.options.icon.options.className.replace(prefix+prevColor, prefix+color);

			// layer._initIcon();
			// layer.update();
		}
	},

	/**
	 * If needed, add this to fool the browser's cache by creating a unique URL.
	 * @param {String} url The URL to be modified.
	 * @returns {String} Url with the custom parameter "_"
	 */
	_addPreventCacheParam: function(url) {
		var lastChar = url.charAt(url.length-1);
		var containsQ = url.indexOf("?") > 0;
		if (!containsQ) {
			url += "?";
		}
		else if (lastChar !== "&" && lastChar !== "?") {
			url += "&";
		}
		return url + "_=" + (new Date()).getTime(); // Add parameter

	},

	save: function() {
		// The following code is possible only because can always expect 
		// that everything in the layer should be saved and all features 
		// share the same ArendeId

		var geoJson = this._editLayer.toGeoJSON();
		geoJson = this.filterBeforeSave(geoJson);

		// -- dev only --
		// this._prevJson = geoJson;
		// console.log(geoJson);
		// smap.cmd.notify(this.lang.saveSuccess, "success", {fade: true});
		// -- dev end --

		var self = this;
		
		console.log(geoJson);


		smap.cmd.notify(this.lang.saveSuccess, "success", {fade: true});
		this._allowSaving(false);
		this._updateLayerStyle(true); // necessary???
		this._editLayer.eachLayer(function(layer) {
			if (layer.options._saved === false) {
				layer.options._saved = true;
				self._updateLayerStyle(true, layer); // necessary???
			}
		});
		this._prevJson = geoJson;
		
		// - Uncomment after testing is done

		$.ajax({
			type: "POST",
			contentType: "text/plain; charset=utf-8",
			url: this._adaptUrl(this.options.wsSave),
			data: JSON.stringify(geoJson),
			dataType: "json",
		 	context: this,
			success: function (data, status) {
				if (data.success === "true") {
					smap.cmd.notify(this.lang.saveSuccess, "success", {fade: true});
					this._allowSaving(false);
					this._updateLayerStyle(true); // necessary???
					this._editLayer.eachLayer(function(layer) {
						if (layer.options._saved === false) {
							layer.options._saved = true;
							self._updateLayerStyle(true, layer); // necessary???
						}
					});
					this._prevJson = geoJson;
				}
				else {
					smap.cmd.notify(this.lang.saveError, "error", {fade: true});
				}
			},
			error: function (a, b, c) {
				console.log(a.responseText);
				smap.cmd.notify(this.lang.saveError, "error", {fade: true});
			}
		});
		// - End Uncomment

	}

	// save: function() {
	// 	var self = this;
	// 	// var p = this.map.getCenter();

	// 	// setTimeout(function() {
	// 	// 	var data = {easting: self._latLng.lng, northing: self._latLng.lat};
	// 	// 	parent.$("body").trigger("smap:updatedata", data);
	// 	// 	smap.cmd.loading(false);
	// 	// }, 1000);

	// 	// -- Create params --

	// 	var p3008 = utils.projectPoint(this._latLng.lng, this._latLng.lat, "EPSG:4326", "EPSG:3008");
	// 	var east = p3008[0],
	// 		north = p3008[1];

		
	// 	east = Math.round(east);
	// 	north = Math.round(north);
	// 	var tempId = this._tempId || null;

	// 	var geoJson = {
	// 			type: "FeatureCollection",
	// 			features: [
	// 				{
	// 					geometry: {
	// 						coordinates: [east, north],	// <= The coordinates resulting from user interaction with the marker
	// 						type: "Point"
	// 					},
	// 					properties: {
	// 						ArendeId: self._tempId,		// <= The ID from parameter MMP_ID
	// 						Aktiv: "true"
	// 					},
	// 					type: "Feature"
	// 				}
	// 			],
	// 			crs: {
	// 				properties: {
	// 					name: "EPSG:3008",
	// 					code: "3008"
	// 				},
	// 				type: "Name"
	// 			}
	// 	};

	// 	console.log('Skickar: ' + JSON.stringify(geoJson));
	// 	this._save(JSON.stringify(geoJson), {
	// 		contentType: "text/plain; charset=utf-8",
	// 		type: "POST"
	// 	});
	// }
});

//L.control.MMPGreta = function (options) {
//	return new L.Control.mMPGreta(options);
//};

