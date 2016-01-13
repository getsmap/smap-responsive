L.Control.FullScreen = L.Control.extend({
	options: {
		position: 'topright',
		url_root: location.origin + location.pathname + '?',
		// fetching fs-parameter from url:
		fs_button: (function(){
					var s = location.search;
					return s.substring(s.indexOf('fs') + 3)
		})(),
		// Control-object to add when opening new tab or replacing parent window.
		controlToAdd: false, 

		// The type of fullscreen to display: replace and newTab is most suitable for maps in an iframe. full is 'real' HTML5-fullscreen. 
		// replace: open map in the same window, like a regular html link. newTab: open map in new tab. full: show map in fullscreen.
		mode: 'full' // 'replace', 'newTab', or 'full'
		
	},

	_properties: function() {
		var self = this;
		var l = this.lang;
		switch (this.options.mode) {
			// in case of 'replace' or 'newTab' the 'fs' parameter is included in the url. This will alter appearence and function
			// of the button in the target page.
			case 'replace':
				return {
					expand: 'fa fa-expand',
					compress: 'fa fa-compress',
					expTitle: l.viewLarge,
					compTitle: l.back,
					action: function () {
						// document.domain = 'malmo.se';
						window.parent.location.href = smap.cmd.createParams(self.options.url_root) + '&fs=back';
					}
				}
				break;

			case 'newTab':
				return {
					expand: 'fa fa-external-link',
					compress: 'fa fa-times',
					expTitle: l.newTab,
					compTitle: l.close,
					action: function () {
						window.open(smap.cmd.createParams(self.options.url_root) + '&fs=close');
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
						if (screenfull.enabled) {
							screenfull.toggle();

							// Workaround because IE11 makes maindiv 0x0 px after switch to fullscreen.
							if (navigator.userAgent.indexOf('Trident/7.') > -1) {
								var body = $('body')[0];
								body.style.width = screen.width + 'px';
								body.style.height = screen.height + 'px';
							}
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
			close: 'Stäng kartan',
			notAllowed: 'Helskärmsläge stöds eller tillåts inte av din webläsare. Funktionen kommer inte vara tillgänglig'
		},
		"en": {
			viewLarge: 'Show larger map',
			newTab: 'Open map in new tab',
			fullExp: "Show in fullscreen",
			reset: "Reset",
			back: 'Go back',
			close: 'Close the map',
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
		if (this.options._lang) {
			$.extend(true, this._lang, this.options._lang);
		}
		this._setLang(options.langCode);

		// add custom control if needed.
		if (this.options.fs_button === 'close' || this.options.fs_button === 'back') {
			smap.core.pluginHandlerInst.addPlugins([this.options.controlToAdd]);
		}
		// if (this.options.forceDomain) {
 	// 		document.domain = this.options.forceDomain;
 	// 	}

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
		// btnParams depends on fs-parameter in url.
		var self = this,
			btnParams = {
			title: self._properties().expTitle,
			icon: self._properties().expand,
			action: self._properties().action
		}
		if (self.options.fs_button === 'back') {
			btnParams = {
				title: self._properties().compTitle,
				icon: self._properties().compress,
				action: function() {
					history.back()
				}
			}
		}
		else if (self.options.fs_button === 'close') {
			btnParams = {
				title: self._properties().compTitle,
				icon: self._properties().compress,
				action: function() {
					window.close()
				}
			}
		}
		this.$btn = $('<button id="smap-fullscreen-btn" title="' + btnParams.title + '" class="btn btn-default"><span class="' + btnParams.icon + '"></span></button>');
		this.$btn.on("click", function () {
			btnParams.action();
			this.blur();
			return false;
		});
		this.$container.append(this.$btn);
	}
});

 L.control.fullScreen = function (options) {
 	return new L.Control.FullScreen(options);
 };