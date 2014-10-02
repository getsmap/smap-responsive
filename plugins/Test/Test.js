
L.Control.Test = L.Control.extend({
	options: {
		position: 'bottomright'
	},
	
	_lang: {
		"sv": {
			exampleLabel: "Ett exempel"
		},
		"en": {
			exampleLabel: "An example"
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
	},

	_createRandomMarker: function() {
		var southWest = L.latLng(-90, -180),
			northEast = L.latLng(90, 180);
		var bounds = L.latLngBounds(southWest, northEast);
		var minLng = bounds.getWest(),
			maxLng = bounds.getEast(),
			minLat = bounds.getSouth(),
			maxLat = bounds.getNorth();
		var lat = Math.random() * (maxLat - minLat) - maxLat,
			lng = Math.random() * (maxLng - minLng) - maxLng;
		var marker = L.userMarker([lat, lng], {pulsing: true, smallIcon: false});
		var p = this.map.project([lat, lng]);
		this._drawLine( 600, 300, p.x, p.y);
		return marker;
	},

	_createRandomMarkers: function() {
		var markers = [];
		for (var i=0,len=8; i<len; i++) {
			markers.push(this._createRandomMarker());
		}
		return markers;
	},

	_drawLine: function(fromX, fromY, toX, toY) {
		var cc = $("#myCanvas");
		if (!cc.length) {
			cc = $('<canvas id="myCanvas" width="100%" height="100%"></canvas>');
			$("#mapdiv").append(cc);
			$(window).on("resize", function() {
				cc[0].width = $("#mapdiv").innerWidth();
				cc[0].height = $("#mapdiv").innerHeight();
			});
			cc[0].width = $("#mapdiv").innerWidth();
			cc[0].height = $("#mapdiv").innerHeight();
		}
		var c = cc[0];
		var ctx = c.getContext("2d");
		ctx.beginPath();
		ctx.moveTo(fromX, fromY);
		ctx.lineTo(toX, toY);
		ctx.stroke();
	},

	onAdd: function(map) {
		this.map = map;
		
		this._container = L.DomUtil.create('div', 'leaflet-control-Test'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		
		this.$container = $(this._container);

		var self = this;
		smap.event.on("smap.core.pluginsadded", function() {
			setTimeout(function() {
				var markers = self._createRandomMarkers();
				var group = L.featureGroup(markers);
				self.map.addLayer(group);
			}, 2000)
			
		});


		var label = '<div class="test-thelabel">Test with some text</div>';
		$("#mapdiv").append(label);

		return this._container;
	},

	onRemove: function(map) {}
});

/*
 * This code lets us skip "new" before the
 * Class name when instantiating it.
 */
//L.control.Test = function (options) {
//	return new L.Control.Test(options);
//};