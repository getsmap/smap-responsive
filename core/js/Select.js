smap.core.Select = L.Class.extend({
	
	
	/**
	 * Containers for selected features (Vector and WMS).
	 */
	_selectedFeaturesVector: [],
	_selectedFeaturesWms: [],
	
	initialize: function(map) {
		this.map = map;
		this._bindEvents(map);
		
		this._wfsLayers = smap.core.layerInst._wfsLayers;
	},
	
	_getVectorVal: function(props, key) {
		var val,
			props = props || {};
			paramVal = null;
		if (key.split(";").length > 1) {
			var keyArr = key.split(";");
			val = props[keyArr[0]] + ";" + props[keyArr[1]];
		}
		else {
			val = props[key];						
		}
		return val;
	},
	
	_setSelectStyle: function(e) {
		var layer = e.target;

		if (layer.setStyle) {
			layer.setStyle(this.options.selectStyle);			
		}

	    if (layer.bringToFront && !L.Browser.ie && !L.Browser.opera) {
	    	layer.bringToFront();
	    }
	},
	
	_resetStyle: function(layer) {
		layer.eachLayer(function(lay) {
			layer.resetStyle(lay);
		});
	},
	
	_bindEvents: function(map) {
		var self = this;
		
		map.on("click", function() {
			// On "click out" – unselect all features (applies to WFS-layers).
			var arr = self._wfsLayers;
			for (var i=0,len=arr.length; i<len; i++) {
				self._resetStyle( arr[i] );
			}
			map.fire("unselected", {});
		});
		
		map.on("unselected", function(e) {
			
			if (e.feature) {
				// Remove the feature from the selected features array.
				$.each(self._selectedFeaturesVector, function(i, val) {
					if (e.feature.id === val.id) {
						self._selectedFeaturesVector.splice(i, 1);
						return false;
					}
				});
			}
			else {
				self._selectedFeaturesVector = [];				
				self._selectedFeaturesWms = [];
			}
		});
		
		map.on("selected", function(e) {
//			var arr = self._wfsLayers;
//			for (var i=0,len=arr.length; i<len; i++) {
//				arr[i].resetStyle(arr[i]);
//			}
			
			var layer = e.layer;
			var isWfs = layer.hasOwnProperty("_layers"),
				layerId = layer.options.layerId,
				selectedFeature = e.feature,
				selectedFeatures = e.selectedFeatures || [],
				uniqueKey = layer.options.uniqueKey || "-",
				shiftKeyWasPressed = e.shiftKeyWasPressed, //e.clickEvent.originalEvent ? e.clickEvent.originalEvent.shiftKey || false : false,
				latLng = e.latLng;
			var props = selectedFeature.properties;
			
			
			if (isWfs) {
				// Assign layerId to all features to enable fetching a feature during SEL param creation
				$.each(selectedFeatures, function(i, f) {
					f.layerId = layerId;
					f.uniqueKey = uniqueKey;
				});
				if (shiftKeyWasPressed) {
					// Extend vector array and remove duplicates.
					self._selectedFeaturesVector = utils.makeUniqueArr( self._selectedFeaturesVector.concat(selectedFeatures) );
					
					// Unbind popups to avoid them opening on unselect (when holding shift).
					$.each(self._wfsLayers, function(i, lay) {
						lay.eachLayer(function(_layer) {
							if (_layer.unbindPopup) {
								_layer.unbindPopup();								
							}
							if (_layer._layers) {
								$.each(_layer._layers, function(j, lay2) {
									if (lay2.unbindPopup) {
										lay2.unbindPopup();
									}
								});
							}
						});
//						lay.off("click", lay.togglePopup); // Unbind the default listener that comes with bindPopup
					});
				}
				else {
					self._selectedFeaturesVector = [].concat(selectedFeatures);
				}
			}
			else {
				// Do same as for above – but assign to WMS property
				self._selectedFeaturesWms = utils.makeUniqueArr( self._selectedFeaturesWms.concat(selectedFeatures) );
			}
			self.map.closePopup();
			
			if (isWfs && !shiftKeyWasPressed) {
				if (self._selectedFeaturesVector.length <= 1) {
					var arr = self._wfsLayers,
						lay;
					for (var i=0,len=arr.length; i<len; i++) {
						lay = arr[i];
						if (lay !== layer) {
							lay.resetStyle(lay);
							lay._selectedFeatures = [];
						}
					}
					
					
					var html = utils.extractToHtml(layer.options.popup, props);
					var lay = utils.getLayerFromFeature(selectedFeature, layer);
					if (lay._popup) {
						lay.unbindPopup();
					}
					lay.bindPopup(html, {autoPan: false});
//					lay.off("click", lay.togglePopup); // Unbind the default listener that comes with bindPopup
//					lay._popup.options.autoPanPaddingTopLeft = [0, 50];
					lay.openPopup(latLng);
				}
			}
			
			
			
			
			/**
			 * If WMS GetFeatureInfo – create a popup with the response.
			 */
			if (!isWfs && latLng) {
				for (var typeName in props) {} // because of the way typename is stored
				
				// Get popup html for this typename
				var typeNameArr = typeName.split(":");
				var cutTypeName = typeNameArr[typeNameArr.length-1];
				var t = smap.cmd.getLayerConfigBy("layers", cutTypeName, {
					inText: true
				});
				if (!t) {
					return false;
				}
				props = props[typeName][0];
				props._displayName = t.options.displayName;
				var html = utils.extractToHtml(t.options.popup, props);
				html = html.replace("${_displayName}", t.options.displayName);
				
				// Fix – anchors cannot be tapped inside a popup – so creating a button instead (also easier to tap on).
				// (This issue was only found for touch devices.)
				var $html = $("<div>"+html+"</div>");
				$html.find("a").each(function() {
					var href = $(this).attr("href"),
						text = $(this).text();
					var $btn = $('<button class="btn btn-default btn-sm">'+text+'</button>')
					// Get the anchor href value and set it to the onclick value.
					$btn.attr("onclick", 'window.open("'+href+'", "_blank")');
	//					$(this).removeAttr("href");
					$(this).after($btn);
					$(this).remove();
					html = $html.html();
				});
				map.closePopup();
				var popup = L.popup()
					.setLatLng(latLng)
					.setContent(html)
					.openOn(map);
			}
		});
		
		/**
		 * Apply the current param "sel" (if any).
		 */
		smap.event.on("smap.core.createparams", function(e, p) {
			/*
			 * Make SEL param.
			 */
			var selObj = {};
			
			/**
			 * Add an item to the object. Adapt key name depending on layer type
			 * (either xy or vals (for key-val)).
			 */
			function addToObject(layerId, vk, item) {
				if (!selObj[layerId]) {
					selObj[layerId] = {};
				}
				if (!selObj[layerId][vk]) {
					selObj[layerId][vk] = [];
				}
				selObj[layerId][vk].push(item);
			};
			
			// -- Iterate through vector features --
			var f, layer, item, fs;
			if (self._selectedFeaturesVector && self._selectedFeaturesVector.length) {
				fs = self._selectedFeaturesVector;
				for (var i=0,len=fs.length; i<len; i++) {
					f = fs[i];
					item = self._getVectorVal(f.properties, f.uniqueKey);
					addToObject(f.layerId, "vals", item);
					selObj[f.layerId]["key"] = f.uniqueKey;
				}
			}
			
			// -- Iterate through WMS pseudo-features --
			if (self._selectedFeaturesWms && self._selectedFeaturesWms.length) {
				fs = self._selectedFeaturesWms;
				for (var i=0,len=fs.length; i<len; i++) {
					f = fs[i];
//					for (var typeName in f.properties) {}
//					item = [f.uniqueKey, f.properties[typeName][0][f.uniqueKey]];
					item = [f.latLng.lng, f.latLng.lat];
					addToObject(f.layerId, "xy", item);
				}
			}
			if ($.isEmptyObject(selObj) === false) {
				p.sel = encodeURIComponent( JSON.stringify(selObj) );				
			}
		});
		
		/**
		 * Create the "sel"-parameter, recreating the current selection (if any).
		 */
		smap.event.on("smap.core.applyparams", $.proxy(function(e, p) {
			if (p.SEL) {
				var obj = JSON.parse(decodeURIComponent( p.SEL )),
					self = this,
					isWms = false,
					latLng, s, layer,
					item, xy, layerId;
				
				/**
				 * Called when the Vector layer is loaded so we can iterate through
				 * the features in order to select them.
				 */
				function onLoadWfs() {
					var thisLayer = this,
					thisLayerId = this.options.layerId,
					thisKey = this.options.uniqueKey,
					selFeature;
					
					var item = obj[thisLayerId];
					var valsArr = item["vals"],
						paramVal, i, props, keyArr, val;
					
					// Iterate through the layers features until we find the feature
					// with the given key and value.
					for (i=0,len=valsArr.length; i<len; i++) {
						paramVal = valsArr[i];
						selFeature = null;
						$.each(thisLayer._layers, function(i, f) {
							if (f.feature) {
								props = f.feature.properties;
								if (thisKey.split(";").length > 1) {
									keyArr = thisKey.split(";");
									val = props[keyArr[0]] + ";" + props[keyArr[1]];
								}
								else {
									val = f.feature.properties[thisKey];
								}
								if (!val) {
									return false; // No such property, no use iterating
								}
								if (val === paramVal) {
									selFeature = f; // This is the feature we want to select
									return false; // break
								}
							}
						});
						if (selFeature) {
							// Select
							selFeature.fire("click", {
								properties: selFeature.feature.properties,
								latlng: latLng,
								originalEvent: {shiftKey: true}
							});
						}
					}
					thisLayer.off("load", onLoadWfs);
				};
				
				for (layerId in obj) {
					item = obj[layerId];
					if (item["key"]) {
						layer = smap.core.layerInst.showLayer(layerId);
						layer.on("load", onLoadWfs);
					}
				}
			}
		}));
		
		
		
		
		
	}
	
});