
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
			drawRectangle: "Rektangel"
		},
		"en": {
			drawTools: "Draw tools",
			btnTitle: "Draw & Measure",
			drawPoint: "Point/Coordinates",
			drawLine: "Line",
			drawPolygon: "Area",
			drawCircle: "Circle",
			drawRectangle: "Rectangle"
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

	onCreated: function(e) {
		var type = e.layerType,
			layer = e.layer;
		var centerLabel, circumLabel;
		switch (type) {
			case "marker":
				// Set label to coords in selected coordinate system (TODO)
				break;
			case "polyline":
				break;
			case "polygon":
				break;
			case "circle":
				break;
			case "rectangle":
				break;
		}
	},

	_initDraw: function() {
		// this._layer = L.featureGroup();
		// this.map.addLayer(this._layer);
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
		this.map.on("draw:created", this.onCreated);
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

	_onRowClick: function(e) {
		var $this = e.target.tagName === "li" ? $(e.target) : $(e.target).parents("li");
		var geomType = $this.data("geomType");
		$this.toggleClass("active");
		// var tbar = this._getDrawToolbar( $this.data("geomType") );
		if ( $this.hasClass("active") ) {
			// tbar.handler.enable();
			this._tools[geomType].enable();
		}
		else {
			this._tools[geomType].disable();
			// tbar.handler.disable();
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