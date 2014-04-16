smap.core.Layer = L.Class.extend({
	
	options: {
		selectStyle: {
			weight: 5,
	        color: '#00DDFF',
	        dashArray: '',
	        fillOpacity: .8,
	        strokeOpacity: 1
		}
	},
	
	_layers: {},
	
	_selectedFeatureParam: null,
	
	_bindEvents: function() {
		var self = this;
		var map = this.map;
		
		map.on("layeradd", $.proxy(this.onLayerAdd, this));
		
		smap.event.on("smap.core.createparams", function(e, p) {
			if (self._selectedFeatureParam) {
				p.SEL = self._selectedFeatureParam;
			}
		});
		
		smap.event.on("smap.core.applyparams", $.proxy(function(e, p) {
			var tBL;
			if (p.BL) {
				tBL = smap.cmd.getLayerConfig( p.BL );
			}
			else {
				tBL = smap.config.bl[0];
			}
			tBL.options.isBaseLayer = true;
			map.addLayer(this._createLayer(tBL));

			if (p.OL) {
				var t, i;
				var ol = p.OL instanceof Array ? p.OL : p.OL.split(",");
				for (i=0,len=ol.length; i<len; i++) {
					t = smap.cmd.getLayerConfig( ol[i] );
					if (!t || !t.init) {
						continue;
					}
					map.addLayer(this._createLayer(t));
//					self._addLayer( self._createLayer(t) );
				}
			}
			if (p.SEL) {
				var arrSel = p.SEL.split(":"),
					s,
					self = this,
					layer;
				var layerId = decodeURIComponent(arrSel[0]),
					key = decodeURIComponent(arrSel[1]),
					val = decodeURIComponent(arrSel[2]),
					isWms = true,
					latLng;
				if (arrSel.length === 5) {
					// Coords of click were also included
					var east = parseFloat(arrSel[3]),
						north = parseFloat(arrSel[4]);
					latLng = L.latLng(north, east);
				}
				
				// Test if the params are parsable (int/float). If so - this is a WMS. (WFS/vector uses key/val)
				var tryKey = parseFloat(key),
					tryVal = parseFloat(val);
				if (isNaN(tryKey) || isNaN(tryVal)) {
					isWms = false;
				}
				if (isWms === false) {
					layer = smap.core.layerInst.showLayer(layerId);
					function onLoad() {
						var selFeature = null,
							_layer = this,
							_val;
						$.each(_layer._layers, function(i, f) {
							if (f.feature) {
								var props = f.feature.properties;
								if (key.split(";").length > 1) {
									var keyArr = key.split(";");
									_val = props[keyArr[0]] + ";" + props[keyArr[1]];
								}
								else {
									_val = f.properties[key];
								}
								if (!_val) {
									return false; // No such property, no use iterating
								}
								if (_val.toString() === val) {
									selFeature = f; // This is the feature we want to select
									return false; // break
								}
							}
						});
						if (selFeature) {
							selFeature.fire("click", {
								properties: selFeature.feature.properties,
								latlng: latLng
							});
//							self.map.fire("selected", {
//								feature: selFeature.feature,
//								selectedFeatures: [selFeature.feature],
//								layer: _layer,
//								clickEvent: {originalEvent: {}}
//							});
//							selFeature.openPopup(); // TODO: Could render error if popup not defined! "Try statement" or if (selFeature._layers[XX]._popup)?
						}
						this.off("load", onLoad);
					};
					layer.on("load", onLoad);
				}
			}
		}, this));
		map.on("click", function() {
			// On "click out" – unselect all features (applies to WFS-layers).
			var arr = self._wfsLayers;
			for (var i=0,len=arr.length; i<len; i++) {
				self._resetStyle( arr[i] );
			}
			map.fire("unselected", {});
		});
		
		map.on("unselected", function() {
			map.closePopup();
			self._selectedFeatureParam = null;
		});
		
		map.on("selected", function(e) {
//			var arr = self._wfsLayers;
//			for (var i=0,len=arr.length; i<len; i++) {
//				arr[i].resetStyle(arr[i]);
//			}
			
			self._selectedFeatureParam = null;
			
			var layer = e.layer;
			var layerId = layer.options.layerId,
				selectedFeature = e.feature,
				pKey = layer.options.uniqueKey || "-",
				shiftKeyWasPressed = e.clickEvent.originalEvent ? e.clickEvent.originalEvent.shiftKey || false : false,
				latLng = e.latLng;
			var props = selectedFeature.properties;
			
			var paramVal = null;
			if (layer._layers) {
				// This is a vector layer
				paramVal = self._makeVectorParam(layerId, props, pKey, latLng);
			}
			else if (latLng && props.hasOwnProperty(pKey)) {
				// This is a wms layer
				paramVal = [encodeURIComponent(layerId), encodeURIComponent(pKey), encodeURIComponent(props[pKey])].join(":");
			}
			self._selectedFeatureParam = paramVal;
			
			self.map.closePopup();
			if (layer._layers && !shiftKeyWasPressed && e.selectedFeatures.length <= 1) { //(e.selectedFeatures.length <= 1 && layer._layers) {
				var html = utils.extractToHtml(layer.options.popup, props);
				var lay = utils.getLayerFromFeature(selectedFeature, layer);
				lay.bindPopup(html, {autoPan: false});
//				lay._popup.options.autoPanPaddingTopLeft = [0, 50];							
				lay.openPopup(latLng);
			}
			
			/**
			 * If WMS GetFeatureInfo – create a popup with the response.
			 */
			if (!layer._layers && latLng) {
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
	},
	
	_makeVectorParam: function(layerId, props, key, latLng) {
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
		if (layerId && val) {
			paramVal = [encodeURIComponent(layerId), encodeURIComponent(key), encodeURIComponent(val), utils.round(latLng.lng, 5), utils.round(latLng.lat, 5)].join(":");
		}
		return paramVal;
	},
	
	initialize: function(map) {
		this.map = map;
		this._bindEvents();
	},
	
	addOverlays: function(arr) {
		this._addLayers(arr);
	},
	
	_addLayers: function(arr) {
		arr = arr || [];
		
		var i, t, layer;
		for (i=0,len=arr.length; i<len; i++) {
			t = arr[i];
			this._addLayerWithConfig(t);
		}
	},
	
	_addLayerWithConfig: function(t) {
		var layer = this._createLayer(t);
//		return this._addLayer(layer);
		this.map.addLayer(layer);
		return layer;
	},
	
	/**
	 * Add a layer to the map through the smap framework's core. The advantage of
	 * doing this is that it listens to load events (so they connect to onloading)
	 * and you can use these methods:
	 * - smap.cmd.getLayer()
	 * 
	 * Note! The layer to be added must have a layerId (layer.options.layerId)
	 * Note 2! If the layer is removed – it must be done through this._removeLayer
	 * 
	 * TODO: Smarter to build this as a listener to leaflet event "layeradded"? Then
	 * one doesn't need to go through this API.
	 * 
	 * @param layer {Leaflet layer} with a (unique) layerId
	 */
//	_addLayer: function(layer) {
//		var layerId = layer.options.layerId;
//		if (this.map.hasLayer(layerId)) {
//			console.log("Layer with "+layerId+" is already added to the map. Not added again.");
//			return false;
//		}
//		this._layers[layerId] = layer;
//		this.map.addLayer(layer);
//		return layer;
//	},
	
	onLayerAdd: function(e) {
		var layer = e.layer;
		if (!layer.options || !layer.options.layerId || layer.feature || !(layer._tileContainer || layer._layers)) {
			return;
		}
		var layerId = layer.options.layerId;
//		if (this.map.hasLayer(layerId)) {
//			console.log("Layer with "+layerId+" is already added to the map. Not added again.");
//			return false;
//		}
		this._layers[layerId] = layer; // Store in object so we can fetch it when needed.
	},
	
//	onLayerRemove: function(e) {
//		var layer = e.layer;
//		if (!layer.options || !layer.options.layerId || layer.feature || !(layer._tileContainer || layer._layers)) {
//			return;
//		}
//		var layerId = layer.options.layerId;
//		if (this._layers[layerId]) {
//			delete this._layers[layerId];
//		}
//	},
	
	_getLayer: function(layerId) {
		return this._layers[layerId] || null;
	},
	
//	_removeLayer: function(layerId) {
//		var layer = this._layers[layerId];
//		if (this.map.hasLayer(layer)) {
//			this.map.removeLayer( layer );
//			delete this._layers[layerId];
//			layer = null;
//			return true;
//		}
//		return false;
//	},
	
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
//		layer.options.style = layer.options.style;
	},
	
	/**
	 * Used for resetting style on map click – to avoid binding
	 * multiple listeners for map click event.
	 */
	_wfsLayers: [],
	
	_createLayer: function(t) {
		var init = eval(t.init);
		
		/**
		 * Avoid baselayers appearing on top of overlays.
		 */
		if (t.options.isBaseLayer) {
			t.options.zIndex = t.options.zIndex || 0;
		}
		else {
			t.options.zIndex = t.options.zIndex || 10;
		}
		
		var layer = new init(t.url, t.options);
		
		var self = this;
		if (layer._layers) {   // i.e. is a vector layer //layer.CLASS_NAME && layer.CLASS_NAME === "L.GeoJSON.WFS" || layer.CLASS_NAME === "L.GeoJSON.Custom") {
			if (!t.options.style) {
				var style = {
						weight: 2,
				        opacity: 1,
				        color: '#fff',
				        dashArray: '3',
				        fillOpacity: 0.7
					};
				layer.setStyle(style);
				layer.options.style = style;
			}
			layer.on("load", function(e) {
//				var html;
//				layer.eachLayer(function(f) {
//					if (!f._popup && f.feature) {
//						html = utils.extractToHtml(layer.options.popup, f.feature.properties);
//						
//						// Do not use autoPan because this will set center around the popup
//						// when panning the map, making it impossible to pan away from the popup.
//						f.bindPopup(html, {autoPan: false});
//						if (f._popup) {
//							f._popup.options.autoPanPaddingTopLeft = [0, 50];							
//						}
//					}
//				});
				smap.cmd.loading(false);
			});
			this._wfsLayers.push(layer);
		}
		else {
			layer.on("load", function(e) {
				smap.cmd.loading(false);
			});
		}
		layer.on("loading", function(e) {
			smap.cmd.loading(true);
		});
		
		return layer;
	},
	
	showLayer: function(layerId) {
		var t = smap.cmd.getLayerConfig(layerId);
		var layer = this._getLayer(layerId);
		if (!layer) {
			layer = this._createLayer(t);
		}
		if (this.map.hasLayer(layer) === false) {
			this.map.addLayer(layer);			
		}
		return layer;
	},
	
	hideLayer: function(layerId) {
		// Just remove the layer from the map (still keep it in the ass. array).
		var layer = this._getLayer(layerId);
		this.map.removeLayer(layer);
	},
	
	CLASS_NAME: "smap.core.Layer"
});