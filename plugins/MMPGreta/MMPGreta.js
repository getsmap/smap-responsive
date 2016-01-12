
L.Control.MMPGreta = L.Control.MMP.extend({
	options: {
		wsSave: location.protocol+"//gkvmgretaws.gkmalmo.local/test/KartService.svc/saveGeometry",
		xhrType: "POST"
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
		L.Control.MMP.prototype.initialize.apply(this, arguments);
		L.setOptions(this, options);
		this._lang = $.extend(true, L.Control.MMP.prototype._lang, this._lang);
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
		if (document.domain === "localhost") {
			// For debug
			url = url.replace("gkvmgretaws.gkmalmo.local", "localhost").replace("kartor.malmo.se", "localhost");
			// url = 'http://localhost/smap-responsive/examples/data/mmpsave.json';
		}
		// else if (document.domain === "kartor.malmo.se") {
		// 	// While testing, and maybe keep after deploy
		// 	url = url
		// 			.replace("gkvmgretaws.gkmalmo.local/", "kartor.malmo.se/gkkundservicedev/")
		// 			.replace("gkkundservice.malmo.se/", "kartor.malmo.se/gkkundservice/");
		// }
		return url;
	},

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