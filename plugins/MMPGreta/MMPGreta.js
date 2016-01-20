
L.Control.MMPGreta = L.Control.extend({
	options: {
		// wsSave: location.protocol+"//gkvmgretaws.gkmalmo.local/KartService.svc/saveGeometry",
		wsSave: location.protocol+"//kartor.malmo.se/gkgreta/KartService.svc/saveGeometry",
		xhrType: "GET"
	},
	
	_lang: {
		"sv": {
			btnLabel: "Ett exempel"
		},
		"en": {
			btnLabel: "An example"
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

	onAdd: function(map) {
		L.Control.MMP.prototype.onAdd.apply(this, arguments);
		this.map = map;
		this._container = L.DomUtil.create('div', 'leaflet-control-MMPGreta'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		this.$container = $(this._container);
		this._createBtn();

		return this._container;
	},

	onRemove: function(map) {
		L.Control.MMP.prototype.onRemove.apply(this, arguments);
	},

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

	save: function() {
		var self = this;
		// var p = this.map.getCenter();

		// setTimeout(function() {
		// 	var data = {easting: self._latLng.lng, northing: self._latLng.lat};
		// 	parent.$("body").trigger("smap:updatedata", data);
		// 	smap.cmd.loading(false);
		// }, 1000);

		// -- Create params --

		var p3008 = utils.projectPoint(this._latLng.lng, this._latLng.lat, "EPSG:4326", "EPSG:3008");
		var east = p3008[0],
			north = p3008[1];

		
		east = Math.round(east);
		north = Math.round(north);
		var tempId = this._tempId || null;

		var geoJson = {
				type: "FeatureCollection",
				features: [
					{
						geometry: {
							coordinates: [east, north],	// <= The coordinates resulting from user interaction with the marker
							type: "Point"
						},
						properties: {
							ArendeId: self._tempId,		// <= The ID from parameter MMP_ID
							Aktiv: "true"
						},
						type: "Feature"
					}
				],
				crs: {
					properties: {
						name: "EPSG:3008",
						code: "3008"
					},
					type: "Name"
				}
		};

		console.log('Skickar: ' + JSON.stringify(geoJson));
		this._save(JSON.stringify(geoJson), {
			contentType: "text/plain; charset=utf-8",
			type: "POST"
		});
	}


	// _createBtn: function() {
	// 	var self = this;

	// 	this.$btn = $('<button id="smap-MMPGreta-btn" title="' + self.lang.btnLabel + '" class="btn btn-default"><span class="fa fa-expand"></span></button>');
	// 	this.$btn.on("click", function () {
	// 		self.activate();
	// 		return false;
	// 	});
	// 	this.$container.append(this.$btn);
	// }
});

//L.control.MMPGreta = function (options) {
//	return new L.Control.mMPGreta(options);
//};