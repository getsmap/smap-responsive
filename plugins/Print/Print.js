	L.Control.Print = L.Control.extend({
		options: {
			position: 'bottomright', // just an example
			addToMenu: false,
			printUrl: "http://localhost/geoserver/pdf" //"http://localhost/print-servlet/export"
		},

		_lang: {
			"sv": {
				caption: "Skriv ut",
				mTitle: "Skriv ut/Exportera",
				close: "Stäng"
			},
			"en": {
				caption: "Print",
				mTitle: "Print/Export",
				close: "Close"
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

			this._container = L.DomUtil.create('div', 'leaflet-control-Print'); // second parameter is class name
			L.DomEvent.disableClickPropagation(this._container);

			this.$container = $(this._container);
			this._createBtn();
			this._initPrint();


			// this._drawModal();

			return this._container;
		},

		_createBtn: function() {
			var self = this;

			this.$btn = $('<button id="smap-print-btn" title="' + self.lang.btnExpand + '" class="btn btn-default"><span class="fa fa-print"></span></button>');
			this.$btn.on("click", function () {
				self.print();
				return false;
			});
			this.$container.append(this.$btn);
		},

		_initPrint: function() {
			L.mapbox = L.mapbox || {TileLayer: L.Class.extend({})};
			this.printProvider = L.print.provider({
				method: 'POST',
				url: this.options.printUrl,
				autoLoad: true,
				mapTitle: "Malmö stad",
				comment: "Hej Hej",
				copy: "© Stadsbyggnadskontoret, Malmö stad",
				dpi: 96,
				layout: "A4 portrait", //"A4_Portrait_NoArrow_NoBar",
				outputFormat: "png",
				map: this.map
			});

			var self = this;
			this.printProvider.on('capabilitiesload', function(e) {
				e.capabilities.printURL = e.capabilities.printURL.replace(/localhost:8080/, "localhost");
				e.capabilities.createURL = e.capabilities.createURL.replace(/localhost:8080/, "localhost");
			});

			// this.printProvider.loadCapabilities();

			// var printControl = L.control.print({
			// 	provider: printProvider
			// });
			// this.printControl = printControl;
			// this.map.addControl(printControl);
		},

		print: function() {
			this.printProvider.print();
		},

		// _drawModal: function() {
		// 	var self = this;
		// 	$.get("plugins/Print/resources/PrintModal.html", function(html) {
		// 		self._modal = utils.drawDialog(self.lang.mTitle, html,
		// 				'<button data-dismiss="modal" class="btn btn-default">'+self.lang.close+'</button>');
		// 		smap.event.trigger("smap:print:modalfetched");
		// 	});
			
		// },

		// show: function() {
		// 	var self = this;
		// 	if (this._modal) {
		// 		this._modal.modal("show");
		// 	}
		// 	else {
		// 		smap.event.off("smap:print:modalfetched").on("selfmap:print:modalfetched", function() {
		// 			self._modal.modal("show");
		// 		});
		// 	}
		// 	var postData = {
		// 			"mapTitle": "",
		// 			"comment": "",
		// 			"units": "m",
		// 			"srs": "EPSG:4326",
		// 			"layout": "A4_Portrait_NoArrow_NoBar",
		// 			"dpi": "96",
		// 			"layers": [
		// 				{
		// 					baseURL: "http://xyz.malmo.se/data_e/Tilecache/malmo/",
		// 					format: "jpeg",
		// 					type: "TMS",
		// 					layer: "malmo_leaflet_cache_EPSG900913",
		// 					maxExtent: [12.9, 55.5, 13.1, 55.7],
		// 					resolutions: [],
		// 					tileSize: [256,256]
		// 				}
		// 			],
		// 			"pages": [{
		// 				bbox: [12.9, 55.5, 13.1, 55.7],
		// 				center: [13.0, 55.6],
		// 				clientResolution: 27,
		// 				rotation: 0,
		// 				scale: 5000,
		// 				copy: "Stadsbyggnadskontoret, Malmö stad"
		// 			}]
		// 								};
		// 	this._postData(postData);
		// },

		// hide: function() {
		// 	this._modal.modal("hide");
		// },

		// _postData: function(data) {
		// 	smap.cmd.loading(true);
		// 	$.ajax({
		// 		url: this.options.printUrl+"print/create.json",
		// 		type: "POST",
		// 		data: data,
		// 		context: this,
		// 		success: function(resp) {
		// 			alert(JSON.stringify(resp));
		// 		},
		// 		error: function(a, text, c) {
		// 			alert("Error response from print/export server: "+text);
		// 		},
		// 		complete: function() {
		// 			smap.cmd.loading(false);
		// 		}
		// 	});

		// },

		onRemove: function(map) {
			// Do everything "opposite" of onAdd – e.g. unbind events and destroy things
			// map.off('layeradd', this._onLayerAdd).off('layerremove', this._onLayerRemove);
		}
	});

	/*
	 * This code lets us skip "new" before the
	 * Class name when instantiating it.
	 */
	 L.control.Print = function (options) {
		return new L.Control.Print(options);
	};