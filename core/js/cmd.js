smap.cmd = {
		
		/**
		 * A proxy method for the plugin responsible for adding 
		 * toolbar buttons to the map. If no such plugin is added to the map,
		 * then it will fail silently.
		 * 
		 * @param label {String}
		 * @param iconClass {String}
		 * @param onClick {Function}
		 * @param options {Object}
		 * 		- callback {Function} Called when button has been created. Receives one argument, which is the button. 
		 * 		- index {Integer} Order from the right in the toolbar.
		 * 		- toggle {Boolean} If true, renders as active/inactive.
		 * @returns {void}
		 */
		// addToolButton: function(label, iconClass, onClick, options) {
		// 	options = options || {
		// 		index: null,
		// 		toggle: false,
		// 		callback: null  // function called when the toolbar plugin is done creating the button
		// 	};
		// 	smap.core.pluginHandlerInst.callPlugin(smap.core.mainConfig.toolbarPlugin, "addButton", [label, iconClass, onClick, options]); 
		// },


		/**
		 * Create params as a string.
		 * @param addRoot {Boolean | String}
		 * @returns {String} URL (or just params) recreating the map.
		 */
		createParams: function(addRoot) {
			return smap.core.paramInst.createParams(addRoot);
		},
		
		createParamsAsObject: function() {
			return smap.core.paramInst.createParamsAsObject();
		},
		
		getControl: function(controlName) {
			var ctrls = this.getControls(controlName);
			return ctrls.length ? ctrls[0] : null;
		},

		getControls: function(controlName) {
			// "Attribution" or "Scale" or "L.Control.Scale"
			if (controlName.search(/\./) > -1) {
				// Convert "L.Control.Scale" -> "Scale"
				controlName = controlName.split(".").slice(2).join(".");
			}
			var inst,
				ctrls = smap.core.controls || [],
				foundControls = [];
			for (var i=0,len=ctrls.length; i<len; i++) {
				inst = ctrls[i];
				if (inst instanceof L.Control[controlName]) {
					foundControls.push(inst);
				}
			}
			return foundControls;
		},
		
		/**
		 * Notify user about something, error or success.
		 * @param text {String} The message
		 * @param msgType {String} The message type (affects only the color of the msg)
		 * 		"success"|"error"
		 * @param options {Object}
		 * @returns {jQuery tag}
		 */
		notify: function(text, msgType, options) {
			options = options || {};
			
			options.parent = options.parent || $("body");
			switch(msgType) {
			case "success":
				msgType = "alert-success";
				break;
			case "warning":
				msgType = "alert-danger";
				break;
			case "error":
				msgType = "alert-danger";
				break;
			}
			var msg = $('<div class="alert map-alert '+msgType+' alert-dismissable"> <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+text+'</div>');
			options.parent.find(".alert").remove();
			options.parent.append(msg);
			return msg;
		},
		
		addLayerWithConfig: function(layerConfig) {
			return smap.core.layerInst._addLayerWithConfig(layerConfig);
		},
		
		/**
		 * Get the layer with given layerId (must be specified in layer's
		 * options object for this to work).
		 * 
		 * @param layerId {String}
		 * @returns {L.ILayer}
		 */
		getLayer: function(layerId) {
			return smap.core.layerInst._getLayer(layerId);
		},
		
		getLayerConfig: function(layerId) {
			return this.getLayerConfigBy("layerId", layerId);
		},
		
		getLayerConfigBy: function(key, val, options) {
			options = options || {};
			
			var arr = smap.config.bl.concat(smap.config.ol || []),
				i, t, compVal;
			for (i=0,len=arr.length; i<len; i++) {
				t = arr[i];
				if (key.search(/\./) !== -1) {
					// Extract the value using eval
					try {
						compVal = eval("t." + key);
					} catch(e) {
						continue;
					}
				}
				else {
					// Extract the value in a normal way
					compVal = t.options[key];
				}
				if (options.inText) {
					// Require in text match
					if (compVal !== undefined && compVal.search(val) > -1) {
						return t;
					}
				}
				else {
					// Require exact match
					if (compVal !== undefined && compVal === val) {
						return t;
					}
				}
			}
			return null;
		},

		getLang: function() {
			var defaultLang = smap.core.mainConfig.smapOptions.defaultLanguage || "en";
			var lang = smap.core.paramInst ? smap.core.paramInst.getParams().LANG : defaultLang; //Parameters from URL
			var langCode = lang ? lang.split("-")[0] : defaultLang;
			return langCode;
		},
		
		/**
		 * Load a config file and apply it to the map.
		 * Before the config file is applied, the map is reset:
		 * 	- all layers removed
		 * 	- all controls removed
		 * 
		 * @param options {Object}
		 * 		- params {Object} CGI-parameters (Optional)
		 * 	
		 */
		reloadCore: function(options) {
			options = options || {};
			
			smap.core.initInst.resetMap();
			smap.core.initInst.init(options);
		},
		
		
		loading: function(show, options) {
			options = options || {};

			if (!window.Spinner) {
				// IE8 cannot loading spinner lib for some reason
				return false;
			}
			
			var _lang = {
				"sv": {
						loading: 'Laddar'
				},
				"en": {
						loading: 'Loading'
				}
			};

			var langCode = this.getLang();
			var lang = _lang.hasOwnProperty(langCode) ? _lang[langCode] : _lang["en"];

			var text = options.text;
			if (text instanceof Object) {
				text = text[lang];
			}

			if (show && show === true) {

				// if (!this.loader) {
				// 	this.loader = $('<div class="loader"><span class="fa fa-spinner"></span><label>'+lang.loading+'</label></div>');
				// }
				// $("#mapdiv").append(this.loader);

				if (!this.spinner) {
					var opts = {
							lines: 12,
							length: 4,
							width: 6,
							radius: 40
					};
					this.spinner = new Spinner(opts).spin();
				}
				this.spinner.spin();
				$("#mapdiv").append(this.spinner.el);
				$('div .spinner').css({
					"top": "50%",
					"left": "50%"
				});
				$(this.spinner.el).append('<div id="loadingText">'+(text || lang.loading)+'</div>');
			}
			else {
				// this.loader.detach();
				this.spinner.stop();
			}
		}
		
};