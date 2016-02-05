
L.Control.BackwardCompat = L.Control.extend({
	options: {
		position: 'bottomright'
	},
	
	_lang: {
		"sv": {
			btnLabel: "Ett exempel"
		},
		"en": {
			btnLabel: "An example"
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
		// if (options._lang) {
		// 	// Always allow setting lang through options
		// 	$.extend(true, this._lang, options._lang);
		// }
		// this._setLang(options.langCode);
	},

	onAdd: function(map) {
		this.map = map;
		this._container = L.DomUtil.create('div', 'leaflet-control-BackwardCompat'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		this.$container = $(this._container);
		// this._createBtn();

		smap.event.on("smap.core.beforeapplyparams", this._onBeforeApplyParams);

		return this._container;
	},

	onRemove: function(map) {
		smap.event.off("smap.core.beforeapplyparams", this._onBeforeApplyParams);
	},

	_onBeforeApplyParams: function(e, p) {
		p = p || {};

		// -- Convert parameters from old smap (< 2.0) into responsive's new names. --
		
		// No support for these guys
		delete p.FEATURES;
		delete p.ADDMARKER;

		var c = p.CENTER;
		if (c && c[0] > 96000 && c[0] < 215000 && c[1] > 6000000 && c.length === 2) {
			// Take care of CENTER coordinates given in EPSG:3008 (old Stadsatlas)
			var pArr = utils.projectPoint(Number(c[0]), Number(c[1]), "EPSG:3008", "EPSG:4326");
			p.CENTER = pArr.concat(c.slice(2)); // Extend in case more params

			// We are now assuming zoom is also using old api, so we need to convert it.
			if (p.ZOOM !== undefined && p.ZOOM <= 6) {
				var z = parseInt(p.ZOOM);
				p.ZOOM = z + 12;
			}
			else if (p.POI) {
				// When using only center the default zoom level (map extent) overrides poi's (search module's) zoom level
				// Therefore, we set zoom to the search module's zoom level.
				p.ZOOM = 15;
			}
		}
		if (p.MAPTYPE) {
			p.BL = p.MAPTYPE;
			delete p.MAPTYPE;
		}
		if (p.OVERLAYS) {
			p.OL = p.OVERLAYS;
			delete p.OVERLAYS;
		}
		if (p.ZOOMLEVEL) {
			p.ZOOM = p.ZOOMLEVEL;
			delete p.ZOOMLEVEL;
		}
	}

});

//L.control.backwardCompat = function (options) {
//	return new L.Control.BackwardCompat(options);
//};