L.Control.FullScreen = L.Control.extend({
	options: {
		position: 'topright',
		url_root: location.origin + location.pathname + '?',

		// The type of fullscreen to display: replace and newTab is most suitable for maps in an iframe. full is 'real' HTML5-fullscreen. 
		// replace: open map in the same window, like a regular html link. newTab: open map in new tab. full: show map in fullscreen.
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
			back: 'Tillbaka',
			notAllowed: 'Helskärmsläge stöds eller tillåts inte av din webläsare. Funktionen kommer inte vara tillgänglig'
		},
		"en": {
			viewLarge: 'Show larger map',
			newTab: 'Open map in new tab',
			fullExp: "Show in fullscreen",
			reset: "Reset",
			back: 'Go back',
			notAllowed: 'Fullscreen mode not supported/allowed by your browser. Feature will not be available.'
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

		// If mode is full, check if browser allows fullscreen mode and if map is in iframe. Else just create the button, no questions asked...
		if (this.options.mode === 'full') {
			if (this._enableIframeFullscreen() && screenfull.enabled) {
				this._createBtn();
				document.addEventListener(screenfull.raw.fullscreenchange, function () {
					self._updateButton();
				});
			}
			else {
				console.log(self.lang.notAllowed);
			}
		}
		else {
			this._createBtn();
		}
		
		return this._container;
},

	activate: function() {

		this._properties().action();
	},

	_enableIframeFullscreen: function() {
		//if not on top, then in iframe
		if (self !== top) {
		// Parent's not on the same domain = error.
			try {
				var iframe = window.parent.document.getElementsByTagName('iframe')[0];
				iframe.setAttribute('allowfullscreen', '');
				return true;
			}
			catch(error) {
				console.log(error.message);
				return false;
			}
		}
		else {
			return true
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

 L.control.fullScreen = function (options) {
 	return new L.Control.FullScreen(options);
 };