
	L.Control.Print = L.Control.extend({
		options: {
			position: 'topleft',
			addToMenu: false,
			printUrl: "http://localhost/print-servlet/print" //http://localhost/geoserver/pdf"
		},

		_lang: {
			"sv": {
				caption: "Skriv ut",
				mTitle: "Skriv ut/Exportera",
				header: "Rubrik",
				tip_header: "Rubrik (valfritt)",
				descript: "Beskrivning",
				tip_descript: "Beskrivning (valfritt)",
				layout: "Pappersformat",
				resolution: "Upplösning",
				orientation: "Orientering",
				portrait: "Stående",
				landscape: "Liggande",
				create: "Skapa bild",
				close: "Stäng",
				loading: "Laddar konfiguration…",
				processingPrint: "Skapar bild…",
				northarrow: "Nordpil",
				scalebar: "Skalstock"
			},
			"en": {
				caption: "Skriv ut",
				mTitle: "Skriv ut/Exportera",
				header: "Rubrik",
				tip_header: "Rubrik (valfritt)",
				descript: "Beskrivning",
				tip_descript: "Beskrivning (valfritt)",
				layout: "Layout",
				resolution: "Resolution",
				orientation: "Orientation",
				portrait: "Portrait",
				landscape: "landscape",
				create: "Create image",
				close: "Stäng",
				loading: "Loading capabilities…",
				processingPrint: "Creating image…",
				northarrow: "North arrow",
				scalebar: "Scalebar"
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
			this._initPrint(); // Load the print capabilities from the mapfish print
			this._drawModal();

			return this._container;
		},

		onRemove: function(map) {
			this._removeBtn();
			this._destroyPrint();
		},

		_createBtn: function() {
			var self = this;

			this.$btn = $('<button id="smap-print-btn" title="' + self.lang.caption + '" class="btn btn-default"><span class="fa fa-print"></span></button>');
			this.$btn.on("click", function () {
				self.show();
				return false;
			});
			this.$container.append(this.$btn);
		},

		_removeBtn: function() {
			this.$btn.remove();
		},

		_initPrint: function() {
			var self = this;
			L.mapbox = L.mapbox || {TileLayer: L.Class.extend({})};
			this.printProvider = L.print.provider({
				method: 'POST',
				url: this.options.printUrl,
				autoLoad: true,
				copy: "© Stadsbyggnadskontoret, Malmö stad",
				dpi: 96,
				layout: "A4_Portrait_NoArrow_NoBar", // A4 portrait
				outputFormat: "pdf",
				map: this.map
			});
			this.printProvider.on("printexception printsuccess", function() {
				var b = self._modal.find("button[type='submit']");
				b.button("reset");
				smap.cmd.loading(false);
			});

			// Print options picked from the GUI. Will be sent into print func when printing.
			this.printOptions = {
				paperFormat: "A4",
				orientation: "Portrait",
				arrow: false,
				scalebar: false,
				dpi: 96
			}
			this.printProvider.on('capabilitiesload', function(e) {
				// Go through proxy to avoid cross-domain.
				e.capabilities.printURL = e.capabilities.printURL.replace(/localhost:8080/g, "localhost").replace(/localhost:6080/g, "localhost").replace(document.domain, "localhost");
				e.capabilities.createURL = e.capabilities.createURL.replace(/localhost:8080/g, "localhost").replace(/localhost:6080/g, "localhost").replace(document.domain, "localhost");
			});
		},

		_destroyPrint: function() {
			this.printProvider.destroy();
			this.printProvider = null;
			this._modal.remove();

		},

		/**
		 * Adapt params from form to fit the server-side print service.
		 * @param  {Object} o Params from form submit (as Object).
		 * @return {Object}   Params ready to send server-side.
		 */
		_preprocessPrintOptions: function(o) {
			var out = {
					mapTitle: o.mapTitle,
					comment: o.comment,
					dpi: parseInt(o.dpi),
					layout: [
						o.paperFormat,
						o.orientation,
						o.arrow ? "Arrow" : "NoArrow",
						o.scalebar ? "Bar" : "NoBar"
					].join("_")
			};
			return out;
		},

		print: function(options) {
			if (!this.printProvider._capabilities) {
				console.log("Print capabilities could not be loaded. Cannot print.");
				return false;
			}
			var b = this._modal.find("button[type='submit']");
			b.attr("data-loading-text", this.lang.processingPrint);
			b.button("loading");
			smap.cmd.loading(true);
			this.printProvider.print(options);
		},

		_drawModal: function() {
			var self = this;
			var src = "resources/PrintModal.html";
			if (document.domain === "localhost") {
				src = "plugins/Print/"+src;
			}
			$.get(src, function(html) {
				html = utils.extractToHtml(html, self.lang);
				// var $html = $(html);
				// $html.find(".form-group").remove();
				// var d = $("<div />");
				// $html.appendTo( d );
				// html = d.html();
				self._modal = utils.drawDialog(self.lang.mTitle, html);
				self._modal.addClass("sprint-modal");
				self._modal.find("form").submit(function() {
					var p = utils.paramsStringToObject( $(this).serialize(), false );
					p = self._preprocessPrintOptions(p);
					self.print(p);
					return false;
				});
				smap.event.trigger("smap:print:modaldrawn");
			});
		},

		_loadCapabilities: function() {
			var self = this;
			this._modal.find('button[type="submit"]').button("loading");
			this.printProvider.loadCapabilities().done(function() {
				self._modal.find('button[type="submit"]').button("reset");
			});
		},

		show: function() {
			var self = this;

			if (!this.printProvider._capabilities) {
				this._loadCapabilities();
			}
			if (this._modal) {
				this._modal.modal("show");
			}
			else {
				// Wait till the modal HTML has been fetched and drawn
				smap.event.off("smap:print:modaldrawn").on("smap:print:modaldrawn", function() {
					self._modal.modal("show");
				});
			}
		},

		hide: function() {
			this._modal.modal("hide");
		}

	});

	/*
	 * This code lets us skip "new" before the
	 * Class name when instantiating it.
	 */
	 L.control.Print = function (options) {
		return new L.Control.Print(options);
	};
