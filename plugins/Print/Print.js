
	L.Control.Print = L.Control.extend({
		options: {
			position: 'topleft',
			printUrl: "//localhost/print-servlet/print" ////localhost/geoserver/pdf"
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
				loading: "Laddar…",
				processingPrint: "Skapar bild…",
				northarrow: "Nordpil",
				scale: "Skala",
				misc: "Övrigt",
				legend: "Teckenförklaring",
				couldNotLoadCapabilities: "Kan inte skriva ut/exportera. Fick inget/felaktigt svar från servern.",
				conditionsHeader: "Jag godkänner <span>användarvillkoren</span>",
				conditions:'För utdrag från kartan/flygfotot till tryck eller annan publicering, krävs tillstånd från Malmö Stadsbyggnadskontor. Vid frågor om tillstånd, användningsområden eller kartprodukter kontakta Stadsbyggnadskontorets kartförsäljning:<br>040-34 24 35 eller <a href="mailto:sbk.sma@malmo.se?subject=Best%E4lla karta">sbk.sma@malmo.se</a>.',
				conditionsTip: 'För att kunna skriva ut måste du godkänna användarvillkoren.',
				confirm: 'Kom ihåg mitt val'
				// , scalebar: "Skalstock"
			},
			"en": {
				caption: "Print",
				mTitle: "Print/Export",
				header: "Rubrik",
				tip_header: "Header (optional)",
				descript: "Description",
				tip_descript: "Description (optional)",
				layout: "Layout",
				resolution: "Resolution",
				orientation: "Orientation",
				portrait: "Portrait",
				landscape: "landscape",
				create: "Create image",
				close: "Close",
				loading: "Loading…",
				processingPrint: "Creating image…",
				northarrow: "North arrow",
				scale: "Scale",
				misc: "Miscellaneous",
				legend: "Legend",
				couldNotLoadCapabilities: "Cannot print/export. Bad response from the server.",
				conditionsHeader: "I agree to these <span>terms</span>",
				conditions:'For excerpts from the map or aerial photo for commercial printing or other types of publication, permission is required from the City Planning Office. For questions about these terms or map products, please contact our sales office: <br> +46 40 34 24 35 or <a href="mailto:sbk.sma@malmo.se?subject=Best%E4lla karta">sbk.sma@malmo.se</a>.',
				conditionsTip: 'To print you must agree to the user terms.',
				confirm: 'Remember my choice'
				// , scalebar: "Scalebar"
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
			this.$btn.on("click touchstart", function () {
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
				// dpi: 96,
				layout: "A4_Portrait_NoArrow_NoBar", // A4 portrait
				outputFormat: "pdf",
				map: this.map
			});
			this.printProvider.on("printexception printsuccess", function() {
				var b = self._modal.find("button[type='submit']");
				b.button("reset");
				smap.cmd.loading(false);
			});

			function notifyError() {
				smap.cmd.notify(self.lang.couldNotLoadCapabilities, "error", {
					parent: $(".modal-body")
				});
				self._modal.off("shown.bs.modal", notifyError);
			}
			this.printProvider.on("oncapabilitiesloaderror", function(e) {
				if (!self._modal) {
					return;
				}
				if (!$(".modal-body").length) {
					self._modal.on("shown.bs.modal", notifyError);
				}
				else {
					notifyError();
				}

			});
			

			// Print options picked from the GUI. Will be sent into print func when printing.
			this.printOptions = {
				paperFormat: "A4",
				orientation: "Portrait",
				arrow: false,
				scalebar: false,
				dpi: 96,
				legends: []
			};
			this.printProvider.on('capabilitiesload', function(e) {
				// Go through proxy to avoid cross-domain.
				e.capabilities.printURL = e.capabilities.printURL.replace(/localhost:8080/g, "localhost").replace(document.domain, "localhost");  // .replace(/localhost:6080/g, "localhost")
				e.capabilities.createURL = e.capabilities.createURL.replace(/localhost:8080/g, "localhost").replace(document.domain, "localhost"); // .replace(/localhost:6080/g, "localhost")
			});
		},

		_destroyPrint: function() {
			this.printProvider.destroy();
			this.printProvider = null;
			this._modal.remove();

		},

		/**
		 * Web Mercator's scale is only valid for distance calculation
		 * at the equator. Therefore, we need to correct based on our
		 * latitude.
		 * @return {Integer} The corrected scale – i.e. where you can measure 
		 * on the print-out and multiply by the scale to get the real-world 
		 * distance value – well, that's what I thought a scale was for...)
		 */
		_getMercatorScaleForLat: function() {
			var lat = this.map.getCenter().lat;
			var scale = this.printProvider._getScale()
			var coeff = 1 / Math.cos(lat*Math.PI/180);
			scale = parseInt(Math.round(scale / coeff)); // modify scale for our latitude
			return scale;
		},

		_makeLegends: function() {
			var classes = [];
			var layers = this.map._layers;
			var layInst, url, displayName, o, useLegend;
			for (lid in layers) {
				layInst = layers[lid];
				o = layInst.options;
				if (!o || o.legend !== undefined && o.legend === false) {
					continue;
				}
				if (o.isBaseLayer) {
					delete o.legend;
					continue;
				}
				if (o && (o.legend || (layInst instanceof L.TileLayer.WMS || layInst instanceof L.GeoJSON.WFS))) {
					url = o.legend;
					if (!url || !url.length) {
						url = layInst._url.search(/\?/) === -1 ? layInst._url + "?" : layInst._url;
						url = url + "request=GetLegendGraphic&format=image/png&width=20&height=20&layer="+o.layers;
					}
					if (url) {
						displayName = o.displayName || "Unnamed layer";
					}
					classes.push({
						name: displayName,
						icon: url
					});
				}
			}
			var legends = [{
		            name: "Teckenförklaring",
		            classes: classes
		    }];
		    return legends;
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
					dpi: o.dpi,
					legends: this._makeLegends(),
					displayscale: this.lang.scale + " 1:",
					layout: [
						o.paperFormat,
						o.orientation,
						o.legend ? "Legend" : "NoLegend"
					].join("_")
			};
			return out;
		},

		_preprocessLayers: function() {
			var map = this.map,
				lid, t;
			for (lid in map._layers) {
				var lyr = map._layers[lid];
				if (lyr.options && lyr.options.layerId) {
					t = smap.cmd.getLayerConfig(lyr.options.layerId);
					if (!t)
						continue;
					if (lyr instanceof L.NonTiledLayer.WMS) {
						if (!t.options.printLayer) {
							// if (t) {
							var options = $.extend(true, {}, t.options);
							options.layerId += "1";
							t.options.printLayer = {
								url: t.url,
								init: "L.TileLayer.WMS",
								options: options
							};
							lyr.options.printLayer = $.extend(true, {}, t.options.printLayer);
							// }
						}
					}
				}
				// else if (t.options.printLayer) {
				// 	t.options.printLayer = $.extend(true, {
				// 		url: t.url,
				// 		init: "L.TileLayer.WMS",
				// 		options: $.extend(true, {}, t.options)
				// 	}, t.options.printLayer);
				// 	delete t.options.printLayer.options.printLayer;
				// 	var o = t.options.printLayer.options;
				// 	o.layerId += "1";
				// 	o.request = "Get"
				// 	lyr.options.printLayer = $.extend(true, {}, t.options.printLayer);
				// }
			}
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
			this._preprocessLayers();
			this.printProvider.print(options);
		},

		_drawModal: function() {
			var self = this;
			var src = "resources/PrintModal.html";
			if (document.URL.search(/\/dev.html/) > -1) {
				src = "plugins/Print/"+src;
			}
			var clickEvent = L.Browser.touch ? "tap" : "click";
			$.get(src, function(html) {
				html = utils.extractToHtml(html, self.lang);
				self._modal = utils.drawDialog(self.lang.mTitle, html);

				var conditionsText = self._modal.find('.print-conditions');
				self.conditionsCheckbox = self._modal.find('[name="conditions"]');
				var conditionsLink = self._modal.find('#conditionsLink span');
				self.submitDiv = self._modal.find("#submitDiv");
				var storeCheckbox = self._modal.find('[name="storeAnswer"]');
				var btn = self._modal.find('button[type=submit]');

				if (localStorage.getItem('smapConditionsAgreed') === 'yes'){
					self.conditionsCheckbox.prop('checked', true);
					storeCheckbox.prop({'checked': true, 'disabled': false});
					btn.prop('disabled', false);
				}
				else {
					self.conditionsCheckbox.prop('checked', false);
				}

				storeCheckbox.change(function() {
					self._storeConditions(storeCheckbox.prop('checked'));
				});
				storeCheckbox.next().on(clickEvent, function() {
					var cb = $(this).prev();
					cb.prop("checked", !cb.prop("checked"));
					return false;
				});

				self.conditionsCheckbox.change( function() {
					self._setButtonState(self.conditionsCheckbox.prop('checked'));
				});
				conditionsText.hide();
				conditionsLink.on(clickEvent, function() {
					conditionsText.slideToggle(250);
				});
				self.submitDiv.on(clickEvent, function() {
					if (!self.conditionsCheckbox.prop('checked')) {
						self.conditionsCheckbox = $('#printmodal').find('[name="conditions"]');
						self.conditionsCheckbox.popover({content: self.lang.conditionsTip, trigger:('focus'), placement: 'bottom', animation: 'false' });
						self.conditionsCheckbox.popover('show').focus();
					}
				});
				self.conditionsCheckbox.on(clickEvent, function() {
					self.conditionsCheckbox.popover('destroy').blur();
				});
				self._modal.attr("id", "printmodal");
				self._modal.addClass("printmodal");
				self._modal.find("form").submit(function() {
					var p = utils.paramsStringToObject( $(this).serialize(), false );
					p = self._preprocessPrintOptions(p);
					self.printProvider.setDpi(p.dpi);
					self.print(p);
					return false;
				});
				smap.event.trigger("smap:print:modaldrawn");
				self._modal.find("[placeholder]").placeholder(); // IE9<= polyfill
			});
		},

		_setButtonState: function(checkboxState) {
			var btn = $('#printmodal').find('button[type=submit]');
			var storeCheckbox = $('#printmodal').find('[name="storeAnswer"]');
			btn.prop('disabled', (checkboxState ? false : true));
			storeCheckbox.prop({'disabled': (checkboxState ? false : true)});
		},

		_storeConditions: function(checkboxState) {

			if (typeof(Storage) !== 'undefined') {
				var localData = localStorage.getItem('smapConditionsAgreed');
				
				if (localData === 'yes' && checkboxState) {
					return false;
				}
				else if (localData && !checkboxState){
					localStorage.removeItem('smapConditionsAgreed');
				}
				else if (checkboxState) {
					localStorage.setItem('smapConditionsAgreed', 'yes');
				}
			}
			else {
				console.log('No local storage support, unable to set user conditions confirmation.');
			}
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
