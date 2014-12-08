
L.Control.MeasureDraw = L.Control.extend({
	options: {
		position: "topright",
		saveMode: "url", // url | wfs  (if "wfs" you also need additional parameters)
		saveWfsUrl: "",
		saveWfsTypeName: "",
		stylePolygon: {
			color: '#0077e2',
			weight: 1
		},
		stylePolyline: {
			color: '#0077e2',
			weight: 9
		}
	},
	
	_lang: {
		"sv": {
			drawTools: "Ritverktyg",
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
			drawTools: "Draw tools",
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
			remove: "Remove"
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
		L.setOptions(this, options);
		this._setLang(options.langCode);
		this._tools = {};
		this._setLabels();
	},

	onAdd: function(map) {
		this.map = map;
		this._container = L.DomUtil.create('div', 'leaflet-control-measuredraw'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		this.$container = $(this._container);
		
		this._proxyListeners();

		this._initDraw();
		this._createBtn();

		var self = this;
		this.map.on("layeradd", function(e) {
			self._layer.eachLayer(function(lay) {
				lay.options.selectable = true;
				lay.options.clickable = true;
			});
		});
		smap.event.on("smap.core.pluginsadded", function() {
			$('.leaflet-control-measuredraw .dropdown-toggle').dropdown();
		});

		smap.event.on("smap.core.createparams", $.proxy(this._onCreateParams, this));
		smap.event.on("smap.core.applyparams", $.proxy(this._onApplyParams, this));


		return this._container;
	},

	_onCreateParams: function(e, p) {
		if (this.options.saveMode === "url") {

			// Properties must be set on a feature attribute for geojson to include properties
			
			var props = [];
			this._layer.eachLayer(function(lay) {
				if (lay._radius) {
					// Circles are not represented in JSON
					lay.properties.radius = lay.getRadius();
				}
				props.push(lay.properties);
			});
			// 	lay.feature = {
			// 		properties: $.extend(true, {}, lay.properties)
			// 	};
			// 	if (lay._latlng) {
			// 		lay.feature._latlng = $.extend(true, {}, lay._latlng);
			// 	}
			// 	else if (lay.geometry) {
			// 		lay.feature.geometry = $.extend(true, {}, lay.geometry);
			// 	}
			// });
			
			var md = this._layer.toGeoJSON();
			var fs = md.features,
				f;
			var newFs = [];
			for (var i=0,len=fs.length; i<len; i++) {
				f = fs[i];
				if (props[i]) {
					// Only keep real features (not labels)
					f.properties = props[i];
					newFs.push(f);
				}
			}
			md.features = newFs;
			var json = JSON.stringify(md);
			json = encodeURIComponent(this.options.saveMode + "," + json);
			p.md = json;
		}
	},

	_onApplyParams: function(e, p) {
		if (p.MD) {
			var d = decodeURIComponent(p.MD);
			var firstComma = d.search(",");
			var saveMode = d.substring(0, firstComma);
			var data = d.substring(firstComma+1);
			if (saveMode === "url") {
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
	 * @return {String}     [Value in m or km and rounded]
	 */
	readableDistance: function(val, dim) {
		dim = dim || 1; // Defaults to line measurement
		var unit = "m";
		var decimals = 0;
		if (val >= 1000) {
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

	onNodeClick: function(e) {
		var latLng = e.latlng;
		var nds = this._nodes;

		this._labels = this._labels || [];
		
		nds.push(latLng);

		if (nds.length > 1) {
			var latLngs = nds.slice(nds.length-2);
			var len = utils.getLength(latLngs);
			if (len <= 0) {
				return false;
			}
			var center = L.latLng( (latLngs[0].lat+latLngs[1].lat)/2, (latLngs[0].lng+latLngs[1].lng)/2 );
			var label = utils.createLabel(center, this.readableDistance(len, 1), "leaflet-maplabel leaflet-maplabel-small");
			this._layer.addLayer(label);

			this._labels.push(label);

			// Center the tag
			var labelTag = $(".leaflet-maplabel.leaflet-maplabel-small:last");
			labelTag.css({
				"margin-left": (-labelTag.width()/2)+"px"
			});
		}

		console.log("node click");
	},

	onCreated: function(e) {

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
		layer.options._silent = true;


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
		this._layer.addLayer(layer);
		layer.options.layerId = layer._leaflet_id; //L.stamp(layer); // Create unique id
		if (layer.feature) {
			layer.properties = layer.feature.properties || layer.properties;
			delete layer.feature;
		}

		if (!layer.properties) {
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
				var espg3006 = utils.projectLatLng(wgs, "EPSG:4326", "EPSG:3006");
				var espg3008 = utils.projectLatLng(wgs, "EPSG:4326", "EPSG:3008");
				var espg3021 = utils.projectLatLng(wgs, "EPSG:4326", "EPSG:3021");

				html =	'<div class="hidden-labelinfo">'+"<strong>WGS 84 (EPSG:4326)</strong><br>"+
						"Lat: &nbsp;"+utils.round(wgs.lng, 5)+"<br>"+
						"Lon: &nbsp;"+utils.round(wgs.lat, 5)+"<br><br>";

				html +=		"<strong>Sweref99 TM (EPSG:3006)</strong><br>"+
							"East: &nbsp;"+utils.round(espg3006.lng)+"<br>"+
							"North: &nbsp;"+utils.round(espg3006.lat)+"<br><br>"+
							"<strong>Sweref99 13 39 (EPSG:3008)</strong><br>"+
							"East: &nbsp;"+utils.round(espg3008.lng)+"<br>"+
							"North: &nbsp;"+utils.round(espg3008.lat)+"<br><br>"+
							"<strong>RT90 2.5 gon V (EPSG:3021)</strong><br>"+
							"East: &nbsp;"+utils.round(espg3021.lng)+"<br>"+
							"North: &nbsp;"+utils.round(espg3021.lat)+"</div>"+
						'</div>';

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
		var fidClass = "measuredrawlabel--"+fid+"--";
		var className = "leaflet-maplabel "+fidClass;
		// if (type === "marker") {
		// 	className = "leaflet-maplabel-small "+className;
		// }
		var label = utils.createLabel(center, html, className);
		this._layer.addLayer(label);
		layer.on("mouseover", this.onMouseOver);
		layer.on("mouseout", this.onMouseOut);

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
		// labelTag.find("div:first").addClass("hidden-labelinfo");
		// labelTag
		labelTag.css({
			"margin-left": (-labelTag.width()/2-15)+"px"
		});

		if (!e._silent) {
			labelTag.addClass("leaflet-maplabel-hover");
			setTimeout(function() {
				labelTag.removeClass("leaflet-maplabel-hover");
			}, 2000)
			layer.fire("click");
		}
		// else {
		// 	if (layer.eachLayer) {
		// 		layer.eachLayer(function(lay) {
		// 			self.onNodeClick({latlng: lay._latLng});
		// 		});
		// 	}
		// }
		// var popupHtml = '<div class="measuredraw-popup-div-save '+fidClass+'"><textarea class="form-control" placeholder="'+this.lang.clickToAddText+'" rows="3"></textarea></div>';
		// layer.options.popup = popupHtml;
		// layer.bindPopup(popupHtml);
		// layer.openPopup();
	},

	onMouseOver: function(e) {
		$(".measuredrawlabel--"+e.target._leaflet_id+"--").addClass("leaflet-maplabel-hover");
	},

	onMouseOut: function(e) {
		$(".measuredrawlabel--"+e.target._leaflet_id+"--").removeClass("leaflet-maplabel-hover");
	},

	_setLabels: function() {
		var d = L.drawLocal.draw;
		$.extend(true, d.handlers, this.lang.handlers || {});
	},

	_initDraw: function() {
		this._layer = L.featureGroup();
		this._layer.options = {
			layerId: "measurelayer",
			popup: '${measure_text}${measure_form}',
			uniqueKey: "id"
		};

		this.map.addLayer(this._layer);
		// this._layer.bringToFront();
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

		this.map.on("draw:drawstart", function() {
			self._nodes = [];
			self.map.on("click", self._onNodeClick);
		});

		this.map.on("draw:drawstop", function(e) {
			self.map.off("click", self._onNodeClick);
			if (self._nodes && _.indexOf(["polygon", "rectangle"], e.layerType) > -1) {
				self._onNodeClick({latlng: self._nodes[0]});
			}
			// self._nodes = [];
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

	onPopupOpen: function(e) {
		var self = this;

		var layer = e.popup && e.popup._source ? e.popup._source : null;
		if (!layer || !layer._measureDrawFeature) {
			return;
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
			// var fid = layer._leaflet_id; //measuredrawlabel--35--;
			// var label = $(".measuredrawlabel--"+fid+"--");
			var labels = self._labels;
			self._layer.eachLayer(function(label) {
				if (label._parentFeature && label._parentFeature === layer) {
					self.map.removeLayer(label);
				}
			});
			self._layer.removeLayer(layer);
			return false;
		});

		if (ta.length) {
			// ta.focus();
			ta.on("focus", function() {
				// $(this).attr("rows", 5);
				$(".measuredraw-btn-popupremove").prop("disabled", true);
			});
			ta.on("blur", function() {
				// $(this).attr("rows", 3);
				$(".measuredraw-btn-popupremove").prop("disabled", false);
				var layer = e.popup._source;
				var val = $(this).val();
				if (val === "") {
					// layer.closePopup();
				}
				else {
					layer.properties.measure_text = val;
					layer.properties.measure_form = ""; // erase
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
					'<span class="drawicons leaflet-draw-draw-marker measuredraw-btntoggle-image"></span>'+
				'</button>'+
				'<ul class="dropdown-menu" role="menu">'+
					// '<li>'+this.lang.drawTools+'</li>'+
				'</ul>'+
			'</div>');
		var b, t,
			dm = $btn.find(".dropdown-menu");
		for (var i=0,len=btnsArr.length; i<len; i++) {
			t = btnsArr[i];
			b = this._createRow(t);
			dm.append(b);
		}
		this.$container.append($btn);
	}
});

L.control.measureDraw = function (options) {
	return new L.Control.MeasureDraw(options);
};