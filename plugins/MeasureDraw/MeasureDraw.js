
L.Control.MeasureDraw = L.Control.extend({
	options: {
		position: "topright"
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
			clickToAddText: "Klicka för att lägga till text",
			showMeasures: "Visa mätresultat"

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
			showMeasures: "Show measure results"
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
	},

	onAdd: function(map) {
		this.map = map;
		this._container = L.DomUtil.create('div', 'leaflet-control-measuredraw'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		this.$container = $(this._container);
		
		this._proxyListeners();

		this._initDraw();
		this._createBtn();
		smap.event.on("smap.core.pluginsadded", function() {
			$('.leaflet-control-measuredraw .dropdown-toggle').dropdown();
		});
		return this._container;
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
		this._layer.addLayer(layer);

		var center, circum, area;
		var html = "";
		switch (type) {
			case "marker":
				// Set label to coords in selected coordinate system (TODO)
				var wgs = center = layer.getLatLng();
				var espg3006 = utils.projectLatLng(wgs, "EPSG:4326", "EPSG:3006");
				var espg3008 = utils.projectLatLng(wgs, "EPSG:4326", "EPSG:3008");
				var espg3021 = utils.projectLatLng(wgs, "EPSG:4326", "EPSG:3021");

				html =	'<div style="font-size:70%;">'+"<strong>WGS 84 (EPSG:4326)</strong><br>"+
						"Lat/y: &nbsp;"+utils.round(wgs.lng, 5)+"<br>"+
						"Long/x: &nbsp;"+utils.round(wgs.lat, 5)+"<br><br>"+
						"<strong>Sweref99 TM (EPSG:3006)</strong><br>"+
						"East: &nbsp;"+utils.round(espg3006.lng)+"<br>"+
						"North: &nbsp;"+utils.round(espg3006.lat)+"<br><br>"+
						"<strong>Sweref99 13 39 (EPSG:3008)</strong><br>"+
						"East: &nbsp;"+utils.round(espg3008.lng)+"<br>"+
						"North: &nbsp;"+utils.round(espg3008.lat)+"<br><br>"+
						"<strong>RT90 2.5 gon V (EPSG:3021)</strong><br>"+
						"East: &nbsp;"+utils.round(espg3021.lng)+"<br>"+
						"North: &nbsp;"+utils.round(espg3021.lat)+"</div>";

				layer.bindPopup(html);
				layer.openPopup();


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

		if (type !== "marker") {
			var fid = layer._leaflet_id;
			var fidClass = "measuredrawlabel--"+fid+"--";
			var label = utils.createLabel(center, html, "leaflet-maplabel "+fidClass);
			this._layer.addLayer(label);
			// Center the tag
			var labelTag = $(".leaflet-maplabel:last");
			// labelTag.hide();
			labelTag.css({
				"margin-left": (-labelTag.width()/2)+"px"
				// "margin-top": (-labelTag.height()/2)+"px"
			});

			var popupHtml = '<div class="measuredraw-popup-div-save '+fidClass+'"><textarea resizeable="false" class="form-control" placeholder="'+this.lang.clickToAddText+'" rows="3"></textarea>'+
								// '<div class="checkbox"><label><input type="checkbox"> '+this.lang.showMeasures+'</label></div>'+
							'</div>';
						// '<div><button class="btn btn-default measuredraw-popup-btn-save">OK</button></div></div>';
			layer.bindPopup(popupHtml);
			layer.openPopup();
			$(".measuredraw-popup-div-save textarea").focus();
			// $(".measuredraw-popup-div-save input[type=checkbox]").on("change", function() {
			// 	var cNames = $(this).parents(".measuredraw-popup-div-save").attr("class").split("--");
			// 	var fid = parseInt(cNames[1]);
			// 	var cName = "measuredrawlabel--"+fid+"--";
			// 	var labelTag = $(".leaflet-maplabel."+cName);
			// 	if ( $(this).is(":checked") ) {
			// 		labelTag.show();
			// 	}
			// 	else {
			// 		labelTag.hide();
			// 	}

			// });

			$(".measuredraw-popup-div-save textarea").on("blur", function() {
				var val = $(this).val();
				if (val === "") {
					layer.closePopup();
				}
				else {
					layer.bindPopup( val );
					layer._popupHtml = val;
					// layer.closePopup();
				}
			});
		}
	},

	_initDraw: function() {
		this._layer = L.featureGroup();
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
		this.map.on("draw:created", this._onCreated);
		var self = this;

		this.map.on("draw:drawstart", function() {
			self._nodes = [];
			self.map.on("click", self._onNodeClick);
		});

		this.map.on("draw:drawstop", function(e) {
			self.map.off("click", this._onNodeClick);
			if (self._nodes && _.indexOf(["polygon", "rectangle"], e.layerType) > -1) {
				self._onNodeClick({latlng: self._nodes[0]});
			}
			// self._nodes = [];
		});
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