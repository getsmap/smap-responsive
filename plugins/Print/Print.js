	L.Control.Print = L.Control.extend({
		options: {
			position: 'bottomright', // just an example
			addToMenu: false,
			printUrl: "http://kartor.malmo.se/print-servlet/"
		},

		_lang: {
			"sv": {
				caption: "Skriv ut",
				close: "Stäng"
			},
			"en": {
				caption: "Print",
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

			this._drawModal();

			return this._container;
		},

		_drawModal: function() {
			this.load()
			this._modal = utils.drawDialog(this.lang.mTitle, bodyContent,
					'<button class="btn btn-default">'+this.lang.close+'</button>');
			this._modal.modal("show");

		},

		show: function() {
			var self = this;




		},

		hide: function() {

		},

		_postData: function(data) {
			smap.cmd.loading(true);
			$.ajax({
				url: smap.config.ws.proxy + encodeURIComponent(this.options.printUrl+"Export/"),
				data: data,
				context: this,
				success: function(resp) {
					
				},
				error: function(a, text, c) {
					alert("Error response from print/export server");
				},
				complete: function() {
					smap.cmd.loading(false);
				}
			});

		},

		_createBtn: function() {
			var self = this;
			if(this.options.addToMenu) {
				smap.cmd.addToolButton( "", "fa fa-print", function () {
					self.activate();
					return false;
				},null);
			}
			else {
				var $btn = $('<button id="smap-print-btn" class="btn btn-default"><span class="fa fa-print"></span></button>');
				$btn.on("click", function () {
					self.show();
					return false;
				});
				this.$container.append($btn);
			}

		},


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