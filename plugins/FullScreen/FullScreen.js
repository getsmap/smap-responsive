
L.Control.FullScreen = L.Control.extend({
	options: {
		position: 'topright',
		url_root: location.origin + location.pathname + '?',

		// The type of fullscreen to display: replace and newTab is most suitable for maps in an iframe. full is 'real' HTML5-fullscreen. 
		// replaceWindow: open map in the same window, like a regular html link. newTab: open map in new tab. realFull: show map in fullscreen.
		mode: 'full' // 'replace', 'newTab', or 'full'
		
	},

	_properties: function() {
		var self = this;
		var l = this.lang;
		switch (this.options.mode) {
			case 'replace':
				return {
					expand: 'fa fa-expand',
					compress: 'fa fa-compress',
					expTitle: l.viewLarge,
					compTitle: l.back,
					action: function () {
						window.parent.location.href = smap.cmd.createParams(self.options.url_root);
					}
				}
				break;

			case 'newTab':
				return {
					expand: 'fa fa-external-link',
					compress: 'fa fa-compress',
					expTitle: l.newTab,
					compTitle: l.back,
					action: function () {
						window.open(smap.cmd.createParams(self.options.url_root));
					}
				}
				break;

			case 'full':
				return {
					expand: 'fa fa-expand',
					compress: 'fa fa-compress',
					expTitle: l.fullExp,
					compTitle: l.reset,
					action: function () {
						self._enableFullscreen();
						var elem = document.getElementById('body');
						if (screenfull.enabled) {
							screenfull.toggle(elem);
						}
					}
				}
				break;
		}
	},
	
	_lang: {
		"sv": {
			viewLarge: 'Visa större karta',
			newTab: 'Öppna kartan i ny flik',
			fullExp: "Visa kartan i fullskärm",
			reset: "Återställ",
			back: 'Tillbaka'
		},
		"en": {
			viewLarge: 'Show larger map',
			newTab: 'Open map in new tab',
			fullExp: "Show in fullscreen",
			reset: "Reset",
			back: 'Go back'
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
		var self = this;
		
		this._container = L.DomUtil.create('div', 'leaflet-control-fullScreen'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		
		this.$container = $(this._container);

		this._createBtn();

		if (screenfull.enabled) {
			document.addEventListener(screenfull.raw.fullscreenchange, function () {
				self._updateButton();
			});
		}

		return this._container;
	},

	activate: function() {

		this._properties().action();
	},

	_enableFullscreen: function() {
		try {
			var iframe = window.parent.document.getElementsByTagName('iframe')[0];
			iframe.setAttribute('allowfullscreen', '');
			utils.log(iframe);
		}
		catch(err) {
			utils.log(err.message);
		}
		
	},

	_updateButton: function() {
		var self = this,
			$btn = $('#smap-fullscreen-btn'),
			p = this._properties()

		if (screenfull.isFullscreen) {			
			$btn.find('span').removeClass(p.expand).addClass(p.compress); // change button
			$btn.attr('data-original-title', p.compTitle); // change toltip text
		}
		else {			
			$btn.find('span').removeClass(p.compress).addClass(p.expand);
			$btn.attr('data-original-title', p.expTitle);

		}
		$btn.blur();

	},

	onRemove: function(map) {
		// Do everything "opposite" of onAdd – e.g. unbind events and destroy things
		// map.off('layeradd', this._onLayerAdd).off('layerremove', this._onLayerRemove);
	},

	_createBtn: function() {
		var self = this;

		this.$btn = $('<button id="smap-fullscreen-btn" title="' + self._properties().expTitle + '" class="btn btn-default"><span class="' + self._properties().expand + '"></span></button>');
		this.$btn.on("click", function () {
			self.activate();
			return false;
		});

		this.$container.append(this.$btn);		
	}
});

/*
 * This code lets us skip "new" before the
 * Class name when instantiating it.
 */
 L.control.fullScreen = function (options) {
 	return new L.Control.FullScreen(options);
 };