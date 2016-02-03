
L.Control.MMPGreta = L.Control.extend({
	options: {
		// wsSave: location.protocol+"//gkvmgretaws.gkmalmo.local/KartService.svc/saveGeometry",
		wsSave: location.protocol+"//kartor.malmo.se/gkgreta/KartService.svc/saveGeometry",
		xhrType: "GET",
		inputCrs: "EPSG:3008",
		saveCrs: "EPSG:3008",
		uniqueKey: "ArendeId",
		reverseAxis: true,
		reverseAxisBbox: true,
		statusKey: "Attribut",
		statusColors: {
			"p": "gray",
			"n": "darkred",
			"f": "orange"
		}

	},
	
	_lang: {
		"sv": {
			addPoint: "Rita punkt",
			addPolyline: "Rita linje",
			addPolygon: "Rita yta",
			remove: "Ta bort",
			edit: "Redigera",
			save: "Spara",
			instructEditing: "Klicka här igen när du redigerat klart"
		},
		"en": {
			addPoint: "Draw point",
			addPolyline: "Draw line",
			addPolygon: "Draw polygon",
			remove: "Remove",
			edit: "Edit",
			save: "Save",
			instructEditing: "Click here when you are done editing"
		}
	},

	initialize: function(options) {
		L.setOptions(this, options);
		if (options._lang) {
			// Always allow setting lang through options
			$.extend(true, this._lang, options._lang);
		}
		this._setLang(options.langCode);
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
			if (this._hasInitiated) {
				return false;
			}
			this._hasInitiated = true;
			// Modify external layer options before created (this can also be done in config using smapOptions.externalJsonOptions)

			function onMouseOver(e) {
				var text = '<b>'+e.target.feature.properties.TooltipTitle+"</b><p>"+e.target.feature.properties.Tooltip+"</p>";
				if ( !$(".leaflet-top.leaflet-right").find("button.active").length) {
					this._tooltip = utils.createLabel(e.latlng, text, "mmpgreta-tooltip");
					this._map.addLayer(this._tooltip);
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
				pointToLayer: (function (f, latLng) {
					var props = f.properties;
					
					// - For dev only! -
					// var rand = Math.floor( Math.random() * 3 );
					// var val = ["f", "n", "p"][rand];
					// props[this.options.statusKey] = val;
					// - End dev -
					
					var markerIcon = L.AwesomeMarkers.icon({
						icon: 'warning',
						prefix: 'fa',
						markerColor: this.options.statusColors[props[this.options.statusKey]] || 'white'
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
					var onLayerLoad = (function() {
						var fg = L.featureGroup([]);
						fg.options = {}; // editable: false
						this.map.removeLayer(layer);
						layer.eachLayer(function(lay) {
							fg.addLayer(lay);
						});
						this._editLayer = fg;
						this.map.addLayer(fg);
						// layer._map = this.map;
						this.addEditPanel(fg);
						layer.off("load", onLayerLoad);
					}).bind(this);
					layer.on("load", onLayerLoad);
				}).bind(this));

			}
			else {
				smap.event.on("smap.core.addedjsonlayer", (function(e, layer) {
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
					var color = "#0077E2";
					tool.options.shapeOptions = {color: color, fillColor: color};

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
		tool.disable();
		$(".mmpgreta-type-"+type.toLowerCase()).removeClass("active btn-danger");
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
		this._editLayer.eachLayer(function(layer) {
			layer.editing.enable();
		});
	},

	stopEditing: function() {
		this._editLayer.options.editable = false;
		this._editLayer.eachLayer(function(layer) {
			layer.editing.disable();
		});
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
		}
		var self = this;
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

		this._addToolBtn("fa fa-eraser", this.lang.remove, "DELETE", onClick);
		this._addToolBtn("fa fa-edit", this.lang.edit, "EDIT", onClick);
		this._addToolBtn("fa fa-object-ungroup", this.lang.addPolygon, "POLYGON", onClick);
		this._addToolBtn("fa fa-code-fork", this.lang.addPolyline, "POLYLINE", onClick);
		this._addToolBtn("fa fa-map-marker", this.lang.addPoint, "MARKER", onClick);


		// this._addBtn("fa fa-edit", this.lang.edit);
	},

	removeEditPanel: function() {},

	_addBtn: function(iconClass, title, onClick) {
		var $btn = $('<div class="leaflet-control"><button id="smap-template-btn" title="' + title + '" class="btn btn-default"><span class="'+iconClass+'"></span></button></div>');
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

	save: function() {
		// The following code is possible only because can always expect 
		// that everything in the layer should be saved and all features 
		// share the same ArendeId

		var self = this;
		var geoJson = this._editLayer.toGeoJSON();

		geoJson.features.forEach(function(f, i) {
			// Project to desired projection
			utils.projectFeature(f, "EPSG:4326", self.options.saveCrs, {
				reverseAxisOutput: true,
				decimals: 0
			});
			f.properties.ArendeId = self._editId; // Important, so that saving will work server-side
		});

		// Don't save ÄrendePunkter
		geoJson.features = geoJson.features.filter(function(item) {
			return !item.id || item.id && item.id.toUpperCase().indexOf("POI_ARENDE_") === -1;
		});
		console.log(geoJson);

		// $.ajax({
		// 	type: "POST",
		// 	contentType: "text/plain; charset=utf-8",
		// 	url: this._adaptUrl(this.options.wsSave),
		// 	data: JSON.stringify(geoJson),
		// 	dataType: "json",
		// 	success: function (data, status) {
		// 		if (data.success === "true") {

		// 		}
		// 	},
		// 	error: function (a, b, c) {
		// 		console.log(a.responseText);
		// 	}
		// });

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



// Bug fix for this class
L.Edit.Poly.addInitHook(function () {
	if (this._poly && !this._poly.options.editing) {
		this._poly.options.editing = {};
	}
});

L.EditToolbar.Delete.addInitHook(function() {
	this._removeLayer = function (e) {
		var layer = e.layer || e.target || e;

		var marker = layer.editing._marker;
		if ( !(marker.options.hasOwnProperty("editable") && marker.options.editable === false)) {
			this._deletableLayers.removeLayer(layer);
			this._deletedLayers.addLayer(layer);
		}
		else {
			smap.cmd.notify("Ärendepunkter kan inte redigeras/tas bort", "warning", {fade: true});
		}
	}
	
});

