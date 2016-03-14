
L.Control.MalmoHeader = L.Control.extend({
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

	onAdd: function(map) {
		this.map = map;
		
		this._container = L.DomUtil.create('div', 'leaflet-control-MalmoHeader'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		
		this.$container = $(this._container);

		// smap.event.on("smap.core.pluginsadded", function() {
		// 	$("#smap-search-div, .leaflet-top.leaflet-right, .thandler-btn").addClass("malmoheader-offset-top");
		// });

		// if ( $("#malmo-masthead").length ) {
		// 	return this._container;
		// }
		
		var headerHtml = 
			'<!--[if IE]><meta content="IE=edge" http-equiv="X-UA-Compatible" /><![endif]-->'+
			'<!--[if lte IE 8]><script src="//assets.malmo.se/external/v4/html5shiv-printshiv.js" type="text/javascript"></script><![endif]-->'+
			'<link href="//assets.malmo.se/external/v4/masthead_standalone.css" media="all" rel="stylesheet" type="text/css"/>'+
			'<!--[if lte IE 8]><link href="//assets.malmo.se/external/v4/legacy/ie8.css" media="all" rel="stylesheet" type="text/css"/><![endif]-->'+
			'<noscript><link href="//assets.malmo.se/external/v4/icons.fallback.css" rel="stylesheet"></noscript>'+
			'<link rel="icon" type="image/x-icon" href="//assets.malmo.se/external/v4/favicon.ico" />'
		$("head").prepend(headerHtml);
		$("body").addClass("mf-v4 no-footer");
		// $("body").addClass("test"); // during dev only
		$("body").append('<script src="//assets.malmo.se/external/v4/masthead_standalone_without_jquery.js"></script>');
		
		return this._container;
	},

	onRemove: function(map) {
		// Do everything "opposite" of onAdd – e.g. unbind events and destroy things
		// map.off('layeradd', this._onLayerAdd).off('layerremove', this._onLayerRemove);
		$("#malmo-masthead").remove();

	}
});

/*
 * This code lets us skip "new" before the
 * Class name when instantiating it.
 */
L.control.malmoHeader = function (options) {
	return new L.Control.MalmoHeader(options);
};