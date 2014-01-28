smap.cmd = {
	
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
							length: 20,
							width: 15,
							radius: 30
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