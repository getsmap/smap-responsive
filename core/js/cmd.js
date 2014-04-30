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
		 * @returns {void}
		 */
		addToolButton: function(label, iconClass, onClick, options) {
			var pluginToolbar = "Menu";
			options = options || {
				index: null,
				toggle: false,
				callback: null // function called when the toolbar plugin is done creating the button
			};
			smap.core.pluginHandlerInst.callPlugin(pluginToolbar, "addButton", [label, iconClass, onClick, options]); 
		},


		/**
		 * Create params as a string.
		 * @param addRoot {Boolean}
		 * @returns {String} URL (or just params) recreating the map.
		 */
		createParams: function(addRoot) {
			return smap.core.paramInst.createParams(addRoot);
		},
		
		getControl: function(controlName) {
			// "Attribution" or "Scale"
			var inst,
				ctrls = smap.core.controls || [];
			for (var i=0,len=ctrls.length; i<len; i++) {
				inst = ctrls[i];
				if (inst instanceof L.Control[controlName]) {
					return inst;
				}
			}
			return null;
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
			case "error":
				msgType = "alert-danger";
				break;
			}
			var msg = $('<div class="alert '+msgType+' alert-dismissable"> <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+text+'</div>');
			options.parent.find(".alert").remove();
			options.parent.append(msg);
			return msg;
		},
		
		addLayerWithConfig: function(layerConfig) {
			return smap.core.layerInst._addLayerWithConfig(layerConfig);
		},
		
		getLayerConfig: function(layerId) {
			return this.getLayerConfigBy("layerId", layerId);
		},
		
		getLayerConfigBy: function(key, val, options) {
			options = options || {};
			
			var arr = smap.config.bl.concat(smap.config.ol || []),
				i, t;
			for (i=0,len=arr.length; i<len; i++) {
				t = arr[i];
//				try {
//					val = eval("t." + key);
//				} catch(e) {
//					continue;
//				}
//				return val;
				
				var exVal = t.options[key];
				if (options.inText) {
					if (exVal !== undefined && exVal.search(val) > -1) {
						return t;
					}
				}
				else {
					if (exVal !== undefined && exVal === val) {
						return t;
					}					
				}
			}
			return null;
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
		
		
		loading: function(show) {
			if (show && show === true) {
				if (!this.spinner) {
					var opts = {
							length: 10,
							width: 8,
							radius: 15
					};
					this.spinner = new Spinner(opts).spin();
				}
				this.spinner.spin();
				$("#mapdiv").append(this.spinner.el);
				$(this.spinner.el).css({
					"left": "50%",
					"top": "50%"
				});
			}
			else {
				this.spinner.stop();
			}
		}
		
};