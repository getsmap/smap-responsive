
L.Control.MeasureDraw = L.Control.extend({
	options: {
		position: "topright",
		saveMode: "url", // url | wfs  (if "wfs" you also need additional parameters)
		saveWfsUrl: "",
		saveWfsTypeName: "",
		layerName: "measurelayer",
		moreCoordsAsModal: true,
		touchShowButtonAsDisabled: true,
		stylePolygon: {
			color: '#0077e2',
			weight: 3
		},
		stylePolyline: {
			color: '#0077e2',
			weight: 9
		}
	},
	
	_lang: {
		"sv": {
			btnDisabledBecauseTouch: "Rita & Mät stödjer inte pekskärmar",
			close: "Stäng",
			drawTools: "Ritverktyg",
			draggableMarker: "Markören är dragbar",
			btnTitle: "Rita & Mät",
			drawPoint: "Punkt/Koordinater",
			drawLine: "Linje",
			drawPolygon: "Yta",
			drawCircle: "Cirkel",
			drawRectangle: "Rektangel",
			circumference: "Omkrets",
			radius: "Radie",
			area: "Area",
			len: "Längd",
			lenPart: "Sidlängd",
			easting: "Easting (x/longitud)",
			northing: "Northing (y/latitud)",
			clickToAddText: "Klicka för att lägga till text (stäng pratbubblan för att spara)",
			showMeasures: "Visa mätresultat",
			remove: "Ta bort",
			moreCoords: "Fler koordinatsystem",
			helpTextSavePopup: "Stäng pratbubblan för att spara",
			
			handlers: {
				circle: {
					tooltip: {
						start: 'Klicka och dra för att rita cirkel.'
					}
				},
				marker: {
					tooltip: {
						start: 'Klicka i kartan för att placera markör.'
					}
				},
				polygon: {
					tooltip: {
						start: 'Klicka för att påbörja yta',
						cont: 'Klicka igen för att fortsätta rita ytan.',
						end: 'Dubbelklicka eller klicka första punkten för att avsluta ytan.'
					}
				},
				polyline: {
					error: '<strong>Error:</strong> linjers kanter kan inte korsa varandra!',
					tooltip: {
						start: 'Klicka för att påbörja linje.',
						cont: 'Klicka för att fortsätta linje.',
						end: 'Dubbelklicka för att avsluta linje.'
					}
				},
				rectangle: {
					tooltip: {
						start: 'Klicka och dra för att rita rektangel.'
					}
				},
				simpleshape: {
					tooltip: {
						end: 'Släpp musknappen för att avsluta.'
					}
				}
			}

			// coordinates: "Koordinater"
		},
		"en": {
			btnDisabledBecauseTouch: "Draw & Measure does not work on touch screens",
			close: "Close",
			drawTools: "Draw tools",
			draggableMarker: "The marker is draggable",
			btnTitle: "Draw & Measure",
			drawPoint: "Point/Coordinates",
			drawLine: "Line",
			drawPolygon: "Area",
			drawCircle: "Circle",
			drawRectangle: "Rectangle",
			circumference: "Circumference",
			radius: "Radius",
			area: "Area",
			len: "Length",
			easting: "Easting (x/longitude)",
			northing: "Northing (y/latitude)",
			clickToAddText: "Click to add text",
			showMeasures: "Show measure results",
			remove: "Remove",
			moreCoords: "More projections",
			helpTextSavePopup: "Close the popup to save"
			// coordinates: "Koordinater"
		}
	},
	
	_setLang: function(langCode) {
		langCode = langCode || smap.config.langCode;
		if (this._lang) {
			this.lang = this._lang ? this._lang[langCode] : null;			
		}
	},

	initialize: function(options) {

		// Adapt edit tool so that we can capture when a vertex changes and
		// add a label on the side of the poly-feature.
		L.Draw.Polyline.addInitHook(function() {
			this._vertexChanged = function (latlng, added) {
				this._updateFinishHandler();
				this._updateRunningMeasure(latlng, added);
				this._clearGuides();
				this._updateTooltip();
				this._map.fire("draw:vertexchanged", {latlng: latlng, context: this}); // So that we can add a label
			};
		});

		L.setOptions(this, options);
		this._setLang(options.langCode);
		this._tools = {};
		this._setLabels();
	},

	_jsonCompressDict: {
		'"FeatureCollection":' : ':fc:',
		'"Feature"' : ':F:',
		'"Point"' : ':P:',
		'"features":' : ':fs:',
		'"type":' : ':t:',
		'"geometry":' : ':g:',
		'"coordinates":' : ':c:',
		'"properties":' : ':p',
		// '},{"' : '::-',
		// ']}' : '::--',
		// '}]' : ':---',
		'"measure_form"': ':m:',
		'"measure_text"': ':mt:'
	},

	_compressJson: function(s) {
		var d = this._jsonCompressDict,
			f;
		for (var key in d) {
			f = new RegExp(key, 'g');
			s = s.replace(f, d[key]);
		}
		return s;
		
	},

	_uncompressJson: function(s) {
		var d = this._jsonCompressDict,
			f;
		for (var key in d) {
			f = new RegExp(d[key], 'g');
			s = s.replace(f, key);
		}
		return s;

	},

	onAdd: function(map) {
		this.map = map;
		this._container = L.DomUtil.create('div', 'leaflet-control-measuredraw'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		this.$container = $(this._container);
		
		this._proxyListeners();

		this._initDraw();

		this._isTouchOnly = utils.isTouchOnly();

		var showButtonAsDisabled = this._isTouchOnly && this.options.touchShowButtonAsDisabled;
		if (!this._isTouchOnly || showButtonAsDisabled) {
			// Only create a button if tool is enabled OR if it is going to be disabled 
			// (if touchShowButtonAsDisabled is true). Otherwise, don't show at all.
			var $btn = this._createBtn();
			if (showButtonAsDisabled) {
				$btn.prop("disabled", true);
				$btn.prop("title", this.lang.btnDisabledBecauseTouch);
				$btn.tooltip({placement: "bottom"});
			}
			else {
				smap.event.on("smap.core.pluginsadded", function() {
					$('.leaflet-control-measuredraw .dropdown-toggle').dropdown();
				});
			}
		}

		var self = this;
		this.map.on("layeradd", function(e) {
			self._layer.bringToFront();
			self._layer.setZIndex(10000);
			self._layer.eachLayer(function(lay) {
				lay.options.selectable = true;
				lay.options.clickable = false;
				if (lay.bringToFront)
					lay.bringToFront(); // Otherwise clicks will go through to other layers, making it impossible to select this feature
				if (lay.setZIndex)
					lay.setZIndex(10000);
			});
		});
		smap.event.on("smap.core.createparams", $.proxy(this._onCreateParams, this));
		smap.event.on("smap.core.applyparams", $.proxy(this._onApplyParams, this));

		return this._container;
	},

	_onCreateParams: function(e, p) {

		// First of all - remove the measurelayer from the ol param
		var ol = p.ol;
		var i = 0,
			len=ol.length,
			layerName = this.options.layerName;
		for (;i<len; i++) {
			if (ol[i] === layerName) {
				ol.splice(i, 1);
				break;
			}
		}

		// Next - store the features

		if (this.options.saveMode === "url") {

			// Properties must be set on a feature attribute for geojson to include properties
			
			var props = [];
			var nonEmptyProps = 0;
			this._layer.eachLayer(function(lay) {
				if (lay._radius) {
					// Circles are not represented in JSON
					lay.properties.radius = lay.getRadius();
				}
				if (lay._popup && lay._popup._isOpen) {
					delete p.sel;
					lay.properties.popupIsOpen = true;
				}
				props.push(lay.properties);
				if (lay.properties) {
					nonEmptyProps += 1;
				}
			});
			if (nonEmptyProps === 0) {
				return false; // Nothing to add to parameters
			}
			
			function diveInto(n) {
				// Recursively reduce the number of digits for each node (to make the link shorter)
				var item;
				for (var i=0,len=n.length; i<len; i++) {   
					item = n[i];
					if (item instanceof Array) {
						 diveInto(item);   
					}
					else {
						 n[i] = L.Util.formatNum(item, 5);
					}
				}
			}
			
			var md = this._layer.toGeoJSON();
			var fs = md.features,
				f, ff;
			var newFs = [];
			for (var i=0,len=fs.length; i<len; i++) {
				ff = fs[i];
				f = $.extend(true, {}, ff);
				diveInto(f.geometry.coordinates);
				if (props[i]) {
					// Only keep real features (not labels)
					f.properties = $.extend({}, props[i]);
					delete f.properties.measure_form;
					newFs.push(f);
				}
			}
			md.features = newFs;
			var json = JSON.stringify(md);
			json = this._compressJson(json);
			var param = encodeURIComponent(this.options.saveMode + "," + json);

			// Keep these as they are safe
			param = param.replace(/%3A/g, ":");
			param = param.replace(/%3A/g, ":");

			p.md = param;
		}
	},

	_onApplyParams: function(e, p) {
		if (p.MD) {
			var d = decodeURIComponent(p.MD);
			var firstComma = d.search(",");
			var saveMode = d.substring(0, firstComma);
			var data = d.substring(firstComma+1);
			if (saveMode === "url") {
				data = this._uncompressJson(data);
				var json = JSON.parse(data);
				var md = L.geoJson(json);

				var self = this,
					feature;
				md.eachLayer(function(lay) {
					var layersTypes = {
						"Point": "marker",
						"LineString": "polyline",
						"Polygon": "polygon"
					};
					if (lay.feature.geometry.type === "Point") {
						var cs = lay.feature.geometry.coordinates;
						feature = L.marker([cs[1], cs[0]]);
						feature.properties = $.extend(true, {}, lay.feature.properties);
					}
					else {
						feature = lay;
					}
					self.onCreated({
						_silent: true,
						layerType: layersTypes[lay.feature.geometry.type],
						layer: feature
					});
				});
			}
			else if (saveMode === "wfs") {
				// TODO
			}

			// var json, feature;
			// this._tempLayer = L.featureGroup();
			// for (var i=0,len=arr.length; i<len; i++) {
			// 	json = arr[i];
			// 	feature = L.geoJson(json);
			// 	this._layer.addLayer(feature);
			// }
		}
		
	},

	_proxyListeners: function() {
		this.__onRowClick = $.proxy(this._onRowClick, this);
	},

	onRemove: function(map) {},

	/**
	 * Convert input meter value into km if higher than 1000 m
	 * and round to even m
	 * @param  {Number} val [in meters]
	 * @param {Integer} dim Number of dimensions (optional) Default 1
	 * @return {String}	 [Value in m or km and rounded]
	 */
	readableDistance: function(val, dim) {
		dim = dim || 1; // Defaults to line measurement
		var unit = "m";
		var decimals = 0;
		if (dim === 1 && val >= 1000 || dim === 2 && val >= 100000) {
			// convert to km
			var dividor = Math.pow(1000, dim-1);
			val /= dividor; // m -> km, or m2 -> km2 (adapt for dimensions)
			
			val /= 1000; // m -> km
			decimals = 3;
			unit = "km";
		}
		unit = dim === 1 ? unit : unit+dim;
		return utils.round(val, decimals) + " " + unit;
	},

	_renderLabel: function(center, len) {
		this._labels = this._labels || [];

		var label = utils.createLabel(center, this.readableDistance(len, 1), "leaflet-maplabel leaflet-maplabel-small");
		this._layer.addLayer(label);
		this._labels.push(label);

		// Center the tag
		var labelTag = $(".leaflet-maplabel.leaflet-maplabel-small:last");
		labelTag.css({
			"margin-left": (-labelTag.width()/2)+"px"
		});
	},

	onNodeClick: function(e) {
		this._nodes = this._nodes || [];

		var latLng = e.latlng || null;
		var nds = this._nodes;
		
		if (latLng) {
			nds.push(latLng);
		}
		if (nds.length > 1) {
			var latLngs = nds.slice(nds.length-2);
			var len = utils.getLength(latLngs);
			if (len <= 0) {
				return false;
			}
			var center = L.latLng( (latLngs[0].lat+latLngs[1].lat)/2, (latLngs[0].lng+latLngs[1].lng)/2 );
			this._renderLabel(center, len);
		}

		console.log("node click");
	},

	_createCoordsHtml: function(wgs, showAll) {
		showAll = showAll || false;

		var self = this;

		var espg3006 = utils.projectLatLng(wgs, "EPSG:4326", "EPSG:3006");
		var espg3008 = utils.projectLatLng(wgs, "EPSG:4326", "EPSG:3008");
		var espg3021 = utils.projectLatLng(wgs, "EPSG:4326", "EPSG:3021");

		var hiddenClass="", draggable="", btnShow="";
		if (!showAll) {
			hiddenClass = " hidden";
			draggable = '<div style="margin-bottom:1em;">['+this.lang.draggableMarker+']</div>';
			btnShow = '<br><button ondrag="return false;" class="btn btn-primary btn-sm"><i class="fa fa-plus"></i>&nbsp;&nbsp;'+this.lang.moreCoords+'</button></div></div>';
		}

		var html =	draggable+
				'<div>'+"<strong>WGS 84 (EPSG:4326)</strong><br>"+
				"Lat: &nbsp;"+utils.round(wgs.lng, 5)+"<br>"+
				"Lon: &nbsp;"+utils.round(wgs.lat, 5)+'<div>'+btnShow;

		html +=		"<br><div class='measuredraw-morecoords"+hiddenClass+"'><strong>Sweref99 TM (EPSG:3006)</strong><br>"+
					"East: &nbsp;"+utils.round(espg3006.lng)+"<br>"+
					"North: &nbsp;"+utils.round(espg3006.lat)+"<br><br>"+
					"<strong>Sweref99 13 30 (EPSG:3008)</strong><br>"+
					"East: &nbsp;"+utils.round(espg3008.lng)+"<br>"+
					"North: &nbsp;"+utils.round(espg3008.lat)+"<br><br>"+
					"<strong>RT90 2.5 gon V (EPSG:3021)</strong><br>"+
					"East: &nbsp;"+utils.round(espg3021.lng)+"<br>"+
					"North: &nbsp;"+utils.round(espg3021.lat)+
				"</div>";
		return html;
	},

	_getLabel: function(layer) {
		var theLabel;
		this._layer.eachLayer(function(label) {
			if (label._parentFeature && label._parentFeature === layer) {
				theLabel = label;
			}
		});
		return theLabel;
	},

	onCreated: function(e) {
		var self = this;
		this._deactivateAll();

		var type = e.layerType,
			layer = e.layer;

		// layer.options.selectable = false;
		// layer.options.clickable = false;
		// layer.options.popup = "Hej Hej ${id}";

		// if (layer._latlng) {
		// 	var props = layer.properties;
		// 	layer = L.marker(layer._latlng, layer.options);
		// 	layer.properties = props;

		// }
		// layer.options._silent = true;


		if (layer.properties && layer.properties.radius) {
			var props = layer.properties;
			type = "circle";
			layer = L.circle(layer._latlng, layer.properties.radius); //, this.options.stylePolygon);
			layer.properties = props;
		}
		if (layer.setStyle) {
			switch(type) {
				case "polyline":
					layer.setStyle(this.options.stylePolyline);
					break;
				default:
					layer.setStyle(this.options.stylePolygon);
					break;
			}
		}

		if (type === "marker") {
			layer.options.draggable = true;
			layer.on("dragstart", function(e) {
				var lay = e.target;
				lay.closePopup();
				// self._layer.eachLayer(function(label) {
				// 	if (label._parentFeature && label._parentFeature === lay) {
				// 		self.map.removeLayer(label);
				// 	}
				// });
			});
			layer.on("drag", function(e) {
				// $(".alert").removeClass("notify-visible");
				// setTimeout(function() {
				// 	$(".alert").remove();
				// }, 500);

				var lay = e.target;
				var label = self._getLabel(lay);
				label.setLatLng(lay.getLatLng());
				var html = self._createCoordsHtml(lay.getLatLng());
				$(label._icon).html(html);

				var $alert = $(".alert");
				if ($alert.length) {
					var $msg = smap.cmd.notify(self._createCoordsHtml(lay.getLatLng(), true), "blank");
					$msg.addClass("notify-transition notify-visible");
				}

				// var labelTag = $(".leaflet-maplabel:last");

				// self._layer.addLayer(label);
				// var fid = lay._leaflet_id;
				// var fidClass = "measuredrawlabel_"+fid+"_";
				// var className = "leaflet-maplabel "+fidClass;
				// labelTag.empty().append(html);

			});
			// layer.on("dragend", function(e) {
			// 	var lay = e.target;
			// });
		}

		this._layer.addLayer(layer);
		layer.options.layerId = layer._leaflet_id; //L.stamp(layer); // Create unique id
		if (layer.feature) {
			layer.properties = layer.feature.properties || layer.properties;
			delete layer.feature;
		}

		if (!layer.properties || (!layer.properties.measure_form && !layer.properties.measure_text)) {
			layer.properties = {
				id: layer._leaflet_id,
				measure_form: '<div class="measuredraw-popup-div-save"><textarea class="form-control" placeholder="'+this.lang.clickToAddText+'" rows="3"></textarea></div>',
				measure_text: ""
			};
		}
		layer.properties.id = layer._leaflet_id;
		layer._measureDrawFeature = true;

		// JL: Testing
		// this._layer.eachLayer(function(lay) {
		// 	lay.options.selectable = true;
		// 	lay.options.clickable = true;
		// });
		
		this._layer.fire("load");
		layer.unbindPopup();

		var center, circum, area;
		var html = "";
		switch (type) {
			case "marker":
				// Set label to coords in selected coordinate system (TODO)
				var wgs = center = layer.getLatLng();
				html = this._createCoordsHtml(wgs);

				// layer.bindPopup(html);
				// layer.openPopup();


				// var label = utils.createLabel(center, html, "leaflet-maplabel leaflet-maplabel-small");
				// this._layer.addLayer(label);
				
				// // Center the tag
				// var labelTag = $(".leaflet-maplabel:last");
				// labelTag.css({
				// 	"margin-left": (-labelTag.width()/2)+"px"
				// 	// "margin-top": (-labelTag.height()/2)+"px"
				// });

				break;
			case "polyline":
				var latLngs = layer.getLatLngs();
				center = latLngs[parseInt(latLngs.length/2)];
				circum = utils.getLength( latLngs );
				html =	this.lang.len + ": &nbsp;"+this.readableDistance(circum, 1) + "<br>";
				break;
			case "polygon":
				center = layer.getBounds().getCenter();
				var latLngs = layer.getLatLngs();
				latLngs.push(latLngs[0]); // Complete polygon
				var area = L.GeometryUtil.geodesicArea( latLngs );
				circum = utils.getLength( latLngs );
				html =	this.lang.circumference + ": &nbsp;"+this.readableDistance(circum, 1) + "<br>"+
						this.lang.area+": &nbsp;"+this.readableDistance(area, 2);
				break;
			case "circle":
				center = layer.getBounds().getCenter();
				var r = layer.getRadius();
				area = r*r*Math.PI;
				circum = 2 * r * Math.PI;
				html =	this.lang.circumference + ": &nbsp;"+this.readableDistance(circum, 1) + "<br>"+
						this.lang.radius+": &nbsp;"+this.readableDistance(r, 1)+"<br>"+
						this.lang.area+": &nbsp;"+this.readableDistance(area, 2);
				break;
			case "rectangle":
				center = layer.getBounds().getCenter();
				var latLngs = layer.getLatLngs();
				latLngs.push(latLngs[0]); // Complete polygon
				var area = L.GeometryUtil.geodesicArea( latLngs );
				circum = utils.getLength( latLngs );
				html =	this.lang.circumference + ": &nbsp;"+this.readableDistance(circum, 1)+"<br>"+
						this.lang.area+": &nbsp;"+this.readableDistance(area, 2);
				break;
		}

		var fid = layer._leaflet_id;
		var fidClass = "measuredrawlabel_"+fid+"_";
		var className = "leaflet-maplabel "+fidClass;


		if (this._isTouchOnly) {
			
		}
		else {
			if ( (e._silent || type === "rectangle") && layer.getLatLngs) {
				// Add labels at the edges
				this._nodes = [];
				$.each(layer.getLatLngs(), function(i, latLng) {
					self.onNodeClick({latlng: latLng});
				});
			}
			var label = utils.createLabel(center, html, className);
			this._layer.addLayer(label);
			layer.on("mouseover", this.onMouseOver);
			layer.on("mouseout", this.onMouseOut);
			label.options.clickable = true;

			if (type === "marker") {
				var onBtnClick = function(e) {
					// On click btn "show more coordinates"
					if (self.options.moreCoordsAsModal) {
						// Create a modal with the coordinates
						// var footerContent = '<button type="button" class="btn btn-default" data-dismiss="modal">'+self.lang.close+'</button>',
						// 	bodyContent = $('<div />');
						// var coordsHtml = self._createCoordsHtml( layer.getLatLng(), true);
						// bodyContent.append(coordsHtml);
						// var d = utils.drawDialog(self.lang.moreCoords, bodyContent, footerContent);
						// d.on("hidden.bs.modal", function() {
						// 	$(this).empty().remove();
						// 	d = null;
						// });
						// d.modal("show");
						var coordsHtml = self._createCoordsHtml( layer.getLatLng(), true);
						smap.cmd.notify(coordsHtml, "blank", {fade: true});
					}
					else {
						// Just expand the label, showing the other coordinates
						var $this = $(this);
						var $tag = $this.parent().parent().parent();
						$tag.find(".measuredraw-morecoords").toggleClass("hidden");
						$this.parent().remove();
					}
					return false;
				};

				var onLabelEnter = function(e) {
					// Bind btn click to show more coordinates
					var $this = $(this);
					$this.find("button")
						.off("click", onBtnClick)
						.on("click", onBtnClick);
				};
				$(label._icon).on("mouseenter", onLabelEnter);
				$(label._icon).on("click", function() {
					// Prevent click from going through for marker's coordinates systems button
					return false;
				});
			}
			
			// Set this layer as "parent feature" of all labels so 
			// we know where they belong (when removing the feature we 
			// want to remove labels also)
			this._labels = this._labels || [];
			this._labels.push(label);
			var labels = this._labels || [];
			for (var i=0,len=labels.length; i<len; i++) {
				labels[i]._parentFeature = layer;
			}
			this._labels = []; // Reset for next time
			
			// Center the tag horisontally
			var labelTag = $(".leaflet-maplabel:last");  //$("."+className);
			
			if (type === "marker") {
				labelTag.css("transition", "none");
				// labelTag.css("margin-top", -labelTag.outerHeight() - 50+"px");
			}
			labelTag.css({
				"margin-left": (-labelTag.width()/2-15)+"px"
			});
			
		}
		if (!e._silent) {
			if (labelTag) {
				labelTag.addClass("leaflet-maplabel-hover");
				setTimeout(function() {
					labelTag.removeClass("leaflet-maplabel-hover");
				}, 2000);
			}
			// layer.fire("click");
		}
		else {
			if (layer.properties && layer.properties.popupIsOpen) {
				delete layer.properties.popupIsOpen;
				// layer.fire("click");
				this.map.fire("selected", {
					feature: layer,
					selectedFeatures: [],
					layer: this._layer
					// latLng: e.latlng,
					// shiftKeyWasPressed: e.originalEvent ? e.originalEvent.shiftKey || false : false
				});
			}
		}
	},

	onMouseOver: function(e) {
		var label = $(".measuredrawlabel_"+e.target._leaflet_id+"_");
		label.addClass("leaflet-maplabel-hover");
	},

	onMouseOut: function(e) {
		$(".measuredrawlabel_"+e.target._leaflet_id+"_").removeClass("leaflet-maplabel-hover");
	},

	_setLabels: function() {
		var d = L.drawLocal.draw;
		$.extend(true, d.handlers, this.lang.handlers || {});
	},

	_selection: function(activate) {
		var arr = [
				smap.cmd.getControl("L.Control.SelectWMS"),
				smap.cmd.getControl("L.Control.SelectVector")
		];
		var c, i;
		for (i=0; i<arr.length; i++) {
			c = arr[i];
			if (c) {
				if (activate === true) {
					c.activate();
				}
				else {
					c.deactivate();
				}
			}
		}
	},

	_initDraw: function() {
		this._layer = L.featureGroup();
		this._layer.options = {
			layerId: this.options.layerName,
			popup: '${measure_text}${measure_form}',
			uniqueKey: "id"
		};

		this.map.addLayer(this._layer);
		this._drawControl = new L.Control.Draw({
			draw: {
				marker: false,
				polyline: false,
				polygon: false,
				rectangle: false,
				circle: false
			},
			edit: null
		});

		this._onCreated = this._onCreated || $.proxy(this.onCreated, this);
		this._onNodeClick = this._onNodeClick || $.proxy(this.onNodeClick, this);
		this._onPopupOpen = this._onPopupOpen || $.proxy(this.onPopupOpen, this);

		this.map.on("draw:created", this._onCreated);
		var self = this;

		self.map.on("click", function() {
			this._removeAlerts();
		}, this);

		var onVertexChanged = (function(e) {
			this.onNodeClick(e);
		}).bind(this);

		this.map.on("draw:drawstart", function() {
			self._nodes = [];
			self._selection(false); // Deactivate select
			self._map.on("draw:vertexchanged", onVertexChanged); // Solves: https://github.com/getsmap/smap-responsive/issues/214
		});

		this.map.on("draw:drawstop", function(e) {
			self._map.off("draw:vertexchanged", onVertexChanged);
			// Reactivate select
			
			if (self._nodes && _.indexOf(["polygon", "rectangle"], e.layerType) > -1) {
				self._onNodeClick({latlng: self._nodes[0]});
			}
			self._selection(true); // Activate select
		});

		// this.map.on("layeradd", function() {
		// 	self._layer.eachLayer(function(lay) {
		// 		lay.options.selectable = true;
		// 		lay.options.clickable = true;
		// 	});
		// 	self._layer.bringToFront();
		// });

		this.map.on("popupopen", this._onPopupOpen);
	},

	_removeFeature: function(layer) {
		var self = this;

		this.map.fire("unselected", {});
		if (this.map._popup) {
			this.map.closePopup();
		}
		var labels = this._labels;
		layer.off();
		this._layer.eachLayer(function(label) {
			if (label._parentFeature && label._parentFeature === layer) {
				label.off();
				self.map.removeLayer(label);
			}
		});
		this._layer.removeLayer(layer);
	},

	onPopupOpen: function(e) {
		var self = this;

		this._removeAlerts();

		var layer = e.popup && e.popup._source ? e.popup._source : null;
		if (!layer || !layer._measureDrawFeature) {
			return;
		}

		// Prevent clicks to go through the drawn features, selecting underlying WMS-layer
		var c = smap.cmd.getControl("L.Control.SelectWMS");
		c._dblclickWasRegistered = true;
		if (c) {
			setTimeout(function() {
				c._dblclickWasRegistered = false;
			}, 400);
		}

		
		var ta = $(".measuredraw-popup-div-save textarea");
		var btnRemove = '<br><br><button class="btn btn-default btn-sm measuredraw-btn-popupremove">'+this.lang.remove+'</button>';
		
		// Add a remove button
		var popup = e.popup;
		var content = popup.getContent();
		if (content.search("measuredraw-btn-popupremove") === -1) {
			content += btnRemove;
			popup.setContent(content);
			popup.update();
			ta = $(".measuredraw-popup-div-save textarea"); // this must be done because we are dealing with a new textarea now
		}
		
		$(".leaflet-popup-content").find(".measuredraw-btn-popupremove").on("click", function() {
			// var fid = layer._leaflet_id; //measuredrawlabel_35_;
			// var label = $(".measuredrawlabel_"+fid+"_");
			self._removeFeature(layer);
			return false;
		});

		if (ta.length) {
			// ta.focus();
			ta.placeholder();
			ta.tooltip({
				placement: "top",
				title: this.lang.helpTextSavePopup,
				container: ".leaflet-popup",
				trigger: "manual"
			});
			ta.on("keypress", function() {
				if ( !$(".tooltip:visible").length ) {
					$(this).tooltip("show");
				}
			});
			var b = utils.getBrowser();
			ta.on("focus", function() {
				// $(this).attr("rows", 5);
				$(".measuredraw-btn-popupremove").prop("disabled", true);
				if (b.ie10 || b.ie11) {
					// Fix for IE10/11 bug: https://github.com/getsmap/smap-responsive/issues/160
					$(this).val("");
				}
			});
			var placeholderText = this.lang.clickToAddText;
			ta.on("blur", function() {
				// $(this).attr("rows", 3);
				$(".measuredraw-btn-popupremove").prop("disabled", false);
				$(this).tooltip("hide");
				var layer = e.popup._source;
				var val = $(this).val();
				if (val === "") {}
				else {
					layer.properties.measure_text = val;
					layer.properties.measure_form = ""; // erase
					// layer.options.label = val; // Dont do this. If label is set, markers become black points
					layer.closePopup();
				}
			});
		}
	},

	_getDrawToolbar: function(geomType) {
		var tBar;
		for (var theId in this._drawControl._toolbars) {
			tBar = this._drawControl._toolbars[theId];
			if (tBar && tBar._modes && tBar._modes[geomType]) {
				return tBar._modes[geomType];
			}
		}
		return null;
	},

	_deactivateAll: function() {
		var ts = this._tools;
		for (var key in ts) {
			ts[key].disable();
			this.$container.find(".dropdown-menu li.active").removeClass("active");
		}
		this._removeAlerts();
	},

	_removeAlerts: function() {
		// Remove alerts
		var alert = $(".alert");
		if (alert.length) {
			alert.removeClass("notify-visible");
			setTimeout(function() {
				alert.remove();
			}, 500);
		}

	},

	_onRowClick: function(e) {
		var $this = e.target.tagName === "li" ? $(e.target) : $(e.target).parents("li");
		var geomType = $this.data("geomType");
		
		// var tbar = this._getDrawToolbar( $this.data("geomType") );
		if ( !$this.hasClass("active") ) {
			this._deactivateAll();
			$this.toggleClass("active");
			this._tools[geomType].enable();
			setTimeout(function() {
				$(".leaflet-control-measuredraw .dropdown-menu").dropdown("toggle");
			}, 200);

		}
		else {
			$this.removeClass("active");
			this._tools[geomType].disable();
		}
		return false;
	},

	_createRow: function(t) {
		var b = $('<li><a><div><span class="drawicons '+t.cl+'"></span><span>'+t.label+'</span></div></a></li>');
		b.data("geomType", t.geomType);
		b.on("click", this.__onRowClick);

		var init = L.Draw[utils.capitalize(t.geomType)];
		var tool = new init(this.map, this._drawControl.options.draw[t.geomType]);
		tool.options.shapeOptions = tool.options.shapeOptions || {};
		// tool.options.shapeOptions.clickable = false;
		var style = {};
		switch(t.geomType) {
			case "polyline":
				style = this.options.stylePolyline;
				break;
			default:
				style = this.options.stylePolygon;
				break
		}
		$.extend(tool.options.shapeOptions, style);
		
		this._tools[t.geomType] = tool;
		return b;
	},

	_createBtn: function() {
		// this.$btn = $('<button id="smap-measuredraw-btn" title="' + self.lang.btnTitle + '" class="btn btn-default"><span class="fa fa-expand"></span></button>');
		
		var btnsArr = [
			{label: this.lang.drawPoint, cl: "leaflet-draw-draw-marker", geomType: "marker"},
			{label: this.lang.drawLine, cl: "leaflet-draw-draw-polyline", geomType: "polyline"},
			{label: this.lang.drawPolygon, cl: "leaflet-draw-draw-polygon", geomType: "polygon"},
			{label: this.lang.drawCircle, cl: "leaflet-draw-draw-circle", geomType: "circle"},
			{label: this.lang.drawRectangle, cl: "leaflet-draw-draw-rectangle", geomType: "rectangle"}
		];

		// '<li class="divider"></li>'+
		
		var $btn = $('<div class="btn-group">'+
				// '<button id="smap-measuredraw-btn" title="' + self.lang.btnTitle + '" class="btn btn-default"><span class="fa fa-expand"></span></button>'+
				'<button type="button" title="'+this.lang.btnTitle+'" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">'+
					'<span class="fa fa-map-marker"></span>'+
				'</button>'+
				'<ul class="dropdown-menu" role="menu">'+
					// '<li>'+this.lang.drawTools+'</li>'+
				'</ul>'+
			'</div>');
		if (utils.getBrowser().ie) {
			$btn.find(".measuredraw-btntoggle-image").css({
				"background-position": "-120px 0"
			});
		}
		var b, t,
			dm = $btn.find(".dropdown-menu");
		for (var i=0,len=btnsArr.length; i<len; i++) {
			t = btnsArr[i];
			b = this._createRow(t);
			dm.append(b);
		}
		this.$container.append($btn);
		return $btn;
	}
});

L.control.measureDraw = function (options) {
	return new L.Control.MeasureDraw(options);
};