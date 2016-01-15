smap.core.Select = L.Class.extend({

	options: {
		manyUseDialog: true
	},

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
		if (!layer.resetStyle)
			return;
		layer.eachLayer(function(lay) {
			layer.resetStyle(lay);
		});
	},

	_processHtml: function(html) {
		// Fix – anchors cannot be tapped inside a popup – so creating a button instead (also easier to tap on).
		// (This issue was only found for touch devices.)
		var $html = $("<div>"+html+"</div>");
		// $html.find(".popup-divider:last").remove();
		$html.find("a").each(function() {
			var $this = $(this);
			var href = $this.attr("href"),
				text = $this.text();
			if (href && href.length >= 4 && $.inArray(href, ["null", "undefined"]) === -1) {
				if (href.substring(0, 4).toUpperCase() !== "HTTP") {
					// Add http
					href = "http://" + href;
				}
				var $btn = $('<button class="btn btn-default btn-sm">'+text+'</button>')
				// Get the anchor href value and set it to the onclick value.
				$btn.attr("onclick", 'window.open("'+href+'", "_blank")');
				$this.after($btn);
			}
			// If no valid href - just remove it. Fix for: https://github.com/getsmap/smap-responsive/issues/115
			$this.remove();
		});
		return $html.html();
	},

	_extractAllAttributes: function(popupText, props) {
		props = props || {};

		// Options for extracting all keys and attributes in a table-like manner.
		var allProps = "";
		var template = '<div><strong>_key_:</strong>&nbsp;<span>_val_</span></div>';
		for (var key in props) {
			allProps += template.replace(/_key_/g, key).replace(/_val_/g, "${"+key+"}");
		}
		var repl = "*";
		if (popupText.search(/\$\{\*\}/) > -1) {
			repl = /\$\{\*\}/g;
		}
		return popupText.replace(repl, allProps);
	},
	
	_bindEvents: function(map) {
		var self = this;

		function onPopupOpen(e) {
			// Add close popup button without unselecting feature (btnMinimize)
			var btnClose = $(".leaflet-popup-close-button"),
				btnMinimize = '<a class="leaflet-popup-close-button leaflet-popup-minimize-button" href="#">–</a>';
			btnClose.before(btnMinimize);

			$(".leaflet-popup-minimize-button").on("click", function(e) {
				smap.map.closePopup();
				return false;
			});
			btnClose.on("click", function() {
				map.fire("unselected", {});
				return false;
			});
		}
		map.on("popupopen", onPopupOpen); // off("popupopen", onPopupOpen)


		map.on("layerremove", function(e) {
			var isPopup = e.layer._tip !== undefined;
			if (isPopup) {
				return false;
			}

			if (self._rasterFeature) {
				map.removeLayer(self._rasterFeature);
				self._rasterFeature = null;
			}
			
		});

		map.on("click", function() {
			// On "click out" – unselect all features (applies to WFS-layers).
			var arr = self._wfsLayers;
			for (var i=0,len=arr.length; i<len; i++) {
				self._resetStyle( arr[i] );
			}
			map.fire("unselected", {});
		});
		
		map.on("unselected", function(e) {
			if (self._rasterFeature) {
				self.map.removeLayer(self._rasterFeature);
				self._rasterFeature = null;
			}
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
//			var isGeoJsonLayer = !layer.addData ? false : true;			
			var layer = e.layer;
			var isVector = layer.hasOwnProperty("_layers") || (layer.options && layer.options.clickable),
				layerId = layer.options.layerId,
				selectedFeature = e.feature,
				selectedFeatures = e.selectedFeatures || [],
				uniqueKey = layer.options.uniqueKey || "-",
				shiftKeyWasPressed = e.shiftKeyWasPressed; //e.clickEvent.originalEvent ? e.clickEvent.originalEvent.shiftKey || false : false,
			var props = selectedFeature.properties;
			var latLng = e.latLng;
			
			if (isVector) {
				self._selectedFeaturesWms = []; // We don't allow mixing vector and raster "features" in current version
				
				// Assign layerId to all features to enable fetching a feature during SEL param creation
//				$.each(selectedFeatures, function(i, f) {
//					f.layerId = layerId;
//					f.uniqueKey = uniqueKey;
//				});
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
				self._selectedFeaturesVector = []; // We don't allow mixing vector and raster "features" in current version
				// Do same as for above – but assign to WMS property
				self._selectedFeaturesWms = utils.makeUniqueArr( self._selectedFeaturesWms.concat(selectedFeatures) );
			}
//			self.map.closePopup();
			
			if (isVector && !shiftKeyWasPressed) {
				if (self._selectedFeaturesVector.length <= 1) {
					var arr = self._wfsLayers,
						lay;
					for (var i=0,len=arr.length; i<len; i++) {
						lay = arr[i];
						if (lay !== layer) {
							if (lay.resetStyle) {
								if (lay._layers) {
									lay.eachLayer(function(subLay) {
										lay.resetStyle(subLay);
									});
								}
								else {
									lay.resetStyle(lay);
								}
							}
							lay._selectedFeatures = [];
						}
					}

					var popupText = layer.options.popup;
					if (layer.options.popup && layer.options.popup === "*" || layer.options.popup.search(/\$\{\*\}/) > -1) {
						popupText = self._extractAllAttributes(popupText, props);
					}
					var html = utils.extractToHtml(popupText, props);
					html = self._processHtml(html);
					var lay = utils.getLayerFromFeature(selectedFeature, layer) || selectedFeature;
					if (lay._popup) {
						lay.unbindPopup();
					}
					lay.bindPopup(html, {autoPan: true, keepInView: false, autoPanPadding: L.point(smap.core.mainConfig.smapOptions.popupAutoPanPadding)});
					if (lay._map) {
						lay.openPopup(latLng);
						
						var $content = $(".leaflet-popup-content:visible");
						$content.find("img").each(function() {
							utils.addImageLoadIndicator( $(this), {
								height: "100px"
							});
						});
					}
				}
			}


			function drawPopupHtml(popup, props, displayName) {
				// classShort = classShort || false;

				var className = "";
				// if (classShort) {
				// 	className += "leaflet-popup-option leaflet-popup-option-short";
				// }
				var html = "";
				html += '<div class="'+className+'"><h4 class="popup-layertitle">'+displayName+'</h4>';
				html += utils.extractToHtml(popup, props) + '</div>';
				// html += '<div class="popup-divider"></div>';
				return html;
			}
			
			/**
			 * If WMS GetFeatureInfo – create a popup with the response.
			 */
			if (!isVector) {
				function removeWmsFeature() {
					if (self._rasterFeature) {
						self._rasterFeature.resetStyle();
						self.map.removeLayer(self._rasterFeature);
						self._rasterFeature = null;
					}
				}

				// function fixGhostPolygons() {
				// 	removeWmsFeature();
				// 	self.map.off("zoomend", fixGhostPolygons);
				// }

				function addWmsFeature(theFeature) {
					removeWmsFeature();
					if (theFeature.geometry.type && theFeature.geometry.type !== "Point" && theFeature.geometry.type !== "MultiPoint") {
						self._rasterFeature = L.geoJson(theFeature.geometry);
						self._rasterFeature.options = $.extend({}, theFeature.options);
						self._rasterFeature.options._silent = true; // Don't trigger onLayerAdd event in core
						self._rasterFeature.latLng = theFeature.latLng;
						self._rasterFeature.setStyle({
							color: "#0FF",
							fillColor: "#0FF",
							weight: 10,
							opacity: 0.9,
							fillOpacity: 0.3
						});
						self._rasterFeature.options.selectable = false;
						self._rasterFeature.eachLayer(function(lay) {
							if (lay.eachLayer) {
								lay.eachLayer(function(lay2) {
									lay2.options.clickable = false;
								});
							}
							if (lay.options) {
								lay.options.clickable = false;
							}
						});
						self.map.addLayer(self._rasterFeature);
						self._rasterFeature.setZIndex(900);
					}
					return self._rasterFeature;
				}
				var popup = L.popup();
				var f = self._selectedFeaturesWms[0]; // select feature per default (if only one hit)
				if (self._selectedFeaturesWms.length === 1) {
					addWmsFeature(f);
					// $html.find(".leaflet-popup-option").removeClass("leaflet-popup-option leaflet-popup-option-short");
				}
				else {
					// Many hits. These are the options (depending on manyUseDialog setting):
					// 	1) Create a dialog where user can choose which one to select, or
					// 	2) Select one of the features (preferably the nearest feature)
					if (self.options.manyUseDialog) {
						if (!self._selectManyModal) {
							var footerContent = $('<button type="button" class="btn btn-default">Stäng</button>');
							var bodyContent = $('<div class="list-group"></div>');
							var sf, props, row;
							footerContent.on("tap click", function() {
								removeWmsFeature();
								self._selectManyModal.modal("hide");
								return false;
							});

							self._selectManyModal = utils.drawDialog('Flera träffar: Välj ett objekt', bodyContent, footerContent, {
								size: "sm"
							});
							self._selectManyModal.find(".modal-header").addClass("panel-heading");
							self._selectManyModal.on("hidden.bs.modal", function() {
								$(this).find(".list-group").empty();
							});
							self._selectManyModal.on("shown.bs.modal", function() {
								$(this).scrollTop(0); // Make sure the modal has scrolled to top
							});
							self._selectManyModal.addClass("core-select-modal");
						}
						var bContent = self._selectManyModal.find(".list-group");

						// Add rows
						var theSf, pText;
						for (var i=0,len=selectedFeatures.length; i<len; i++) {
							theSf = selectedFeatures[i];
							props = theSf.properties;
							pText = utils.extractToHtml(theSf.options.popup, props);
							if (pText && pText === "*" || pText.search(/\$\{\*\}/) > -1) {
								pText = self._extractAllAttributes(pText, props);
							}
							pText = self._processHtml(pText);
							// <strong>'+theSf.options.displayName+'</strong>
							row = $('<a href="#" class="list-group-item"><span><strong>'+theSf.options.displayName+'</strong>'+pText+'</span>'+
								'<div class="btn btn-success select-btn-zoom-to-feature">Zooma hit</div></a>');
							row.data("index", i);
							if (utils.isTouchOnly()) {
								row.addClass("select-row-touch");
							}
							bContent.append(row);
						}
						function onRowClick() {
							var theIndex = $(this).data("index");
							var sf = self._selectedFeaturesWms[ theIndex ];
							addWmsFeature(sf);
							var popup = L.popup();
							var html = drawPopupHtml(sf.options.popup, sf.properties, sf.options.displayName);
							html = self._processHtml(html);
							popup.setContent(html);

							// Intelligently distinguish if the popup should center at centroid or at click.
							// When clicking on (especially) large polygons/polylines the centroid falls outside the polygon (#146)
							// and therefore a coarse estimate is made here that multi-type geometries should use clicked latLng
							// rather than using the centroid of a feature.
							if (self._rasterFeature && self._rasterFeature.getBounds && sf.geometry.coordinates.length === 1) {
								var bounds = self._rasterFeature.getBounds();
								var latLng = bounds.getCenter();
								popup.setLatLng(latLng); // latLng
							}
							else {
								popup.setLatLng(sf.latLng);
							}
							// popup.setLatLng(sf.latLng);

							popup.openOn(self.map);

							// Add image load indicator
							var $content = $(".leaflet-popup-content:visible");
							$content.find("img").each(function() {
								utils.addImageLoadIndicator( $(this), {
									height: "100px"
								});
							});

							$(this).trigger("mouseenter");
							self._selectManyModal.modal("hide");
							return false;
						}

						var listItems = bContent.find(".list-group-item");
						listItems.find(".select-btn-zoom-to-feature").on("touchend click", function() {
							onRowClick.call( $(this).parent()[0] );
							if (self._rasterFeature) {
								var bounds = self._rasterFeature.getBounds();
								var paddingTopLeft = L.Browser.touch ? [100, 100] : [200, 150]; // On mobile, no need to think about layer switcher
								self.map.fitBounds(bounds, {
									paddingTopLeft: paddingTopLeft,
									paddingBottomRight: [100, 100]
								});
							}
							else {
								var i = $(this).parent().data("index");
								var zoom = 15;
								zoom = self.map.getZoom() < zoom ? zoom : self.map.getZoom() + 1;
								self.map.setZoomAround(f.latLng, zoom);
							}
							self._selectManyModal.modal("hide");
							// self.map.off("zoomend", fixGhostPolygons).on("zoomend", fixGhostPolygons);
							return false;
						});
						if (L.Browser.touch) {
							listItems.on("tap", function() {
								var theIndex = $(this).data("index");
								var sf = self._selectedFeaturesWms[ theIndex ];
								addWmsFeature(sf);
								onRowClick.call(this);
								return false;
							});
						}
						else {
							listItems
								.on("click", onRowClick);
							// .on("mouseenter", function() {
							// 	var theIndex = $(this).data("index");
							// 	var sf = self._selectedFeaturesWms[ theIndex ];
							// 	addWmsFeature(sf);
							// })
						}

						self._selectManyModal.modal("show");
						return true;
					}
					else {
						// var fs = self._selectedFeaturesWms || [];
						// var f, closest, d;
						// var minDist = 999999999;
						// var latLng = e.feature.latLng;
						// for (var i=0,len=fs.length; i<len; i++) {
						// 	f = fs[i];
						// 	if (f.geometry && f.geometry.type.search("point") > -1) {
						// 		// Find closest
						// 		d = latLng.distanceTo( L.latLng(f.geometry.coordinates[1], f.geometry.coordinates[0]) );
						// 		if (d < minDist) {
						// 			minDist = d;
						// 			closest = f;
						// 		}
						// 	}
						// 	else {
						// 		// Find interects
						// 		closest = 

						// 	}
						// }

						// TODO: Find closest feature to click instead of this...
						var fs = self._selectedFeaturesWms || [];
						var closest;
						for (var i=0,len=fs.length; i<len; i++) {
							f = fs[i];
							if (f.geometry && f.geometry.type && f.geometry.type.search(/point/gi) > -1) {
								// Prefer points because they are otherwise blocked by polygons
								closest = f;
								break;
							}
						}
						if (!closest) {
							var half = parseInt(self._selectedFeaturesWms.length / 2);
							closest = self._selectedFeaturesWms[half];
						}
						addWmsFeature(closest);
						f = closest;
					}
				}

				var html = "";
				// f = closest || f;
				var props = f.properties;
				var popupText = f.options.popup;
				if (popupText && popupText === "*" || popupText.search(/\$\{\*\}/) > -1) {
					popupText = self._extractAllAttributes(popupText, props);
				}
				html = drawPopupHtml(popupText, f.properties, f.options.displayName);
				
				html = self._processHtml(html);
				map.closePopup();
				
				// $html = $("<div />").append(html);
				// popup.setContent($html.html());

				popup.setContent(html);

				popup.setLatLng(f.latLng);

				// Wait for possible dblclick to be detected. If that happens,
				// SelectWMS will set _dblclickWasRegistered to true.
				setTimeout(function() {
					var c = smap.cmd.getControl("SelectWMS");
					if (c && c._dblclickWasRegistered === true) {
						// c._dblclickWasRegistered = false;
						console.log("Cancelling show popup");
						return false;
					}
					else {
						popup.openOn(map);
						// Add image load indicator
						var $content = $(".leaflet-popup-content:visible");
						$content.find("img").each(function() {
							utils.addImageLoadIndicator( $(this), {
								height: "100px"
							});
						});
					}
				}, 100);
			}
		});
		
		/**
		 * Apply the current param "sel" (if any).
		 */
		smap.event.on("smap.core.createparams", function(e, p) {
			/*
			 * Make SEL param. It will look like this (schematic code):
			 * var obj = {
			 * 		"theLayerId": {vals: [2,6,11,172], key: "fid"}, // For WFS
			 * 		"theLayerIdWms": {xy: [[13.1,55.2]} // For WMS
			 * }
			 */
			var selObj = {};
			
			/**
			 * Add an item to the object. Adapt key name depending on layer type
			 * (either xy or vals (for key-val)).
			 */
			function addToObject(layerId, vk, theItem) {
				if (!layerId) {
					return;
				}
				if (!selObj[layerId]) {
					selObj[layerId] = {};
				}
				if (!selObj[layerId][vk]) {
					selObj[layerId][vk] = [];
				}
				selObj[layerId][vk].push(theItem);
			};
			
			// -- Iterate through vector features --
			var f, layer, theItem, fs;
			if (self._selectedFeaturesVector && self._selectedFeaturesVector.length) {
				fs = self._selectedFeaturesVector;
				for (var i=0,len=fs.length; i<len; i++) {
					f = fs[i];
					if (f.properties && f.uniqueKey) {
						theItem = self._getVectorVal(f.properties, f.uniqueKey);
						addToObject(f.layerId, "vals", theItem);
						selObj[f.layerId]["key"] = f.uniqueKey;
					}
				}
			}
			
			// -- Iterate through WMS pseudo-features --
			if (self._selectedFeaturesWms && self._selectedFeaturesWms.length) {
				fs = self._selectedFeaturesWms;
				for (var i=0,len=fs.length; i<len; i++) {
					f = fs[i];
//					for (var typeName in f.properties) {}
//					theItem = [f.uniqueKey, f.properties[typeName][0][f.uniqueKey]];
					theItem = [f.latLng.lng, f.latLng.lat];
					addToObject(f.options.layerId, "xy", theItem);
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
					theItem, xy, layerId,
					selectMany = false;
				
				// Find out if there are more than one feature to select.
				var i = 0;
				for (var k in obj) {
					i += 1;
					if (i > 1 || (obj[k].vals && obj[k].vals.length > 1)) {
						selectMany = true;
						break;
					}
				}
				
				/**
				 * Called when the Vector layer is loaded so we can iterate through
				 * the features in order to select them.
				 */
				function onLoadWfs() {
					var thisLayer = this,
						thisLayerId = this.options.layerId,
						thisKey = this.options.uniqueKey,
						selFeature;
						
					var theItem = obj[thisLayerId];
					var valsArr = theItem["vals"],
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
								originalEvent: {shiftKey: selectMany}
							});
						}
					}
					thisLayer.off("load", onLoadWfs);
				};
				
				for (layerId in obj) {
					theItem = obj[layerId];
					if (theItem["key"]) {
						var l = smap.core.layerInst.showLayer(layerId);
						if (l) {
							l.on("load", onLoadWfs);
						}
					}
				}
			}
		}));
		
		
		
		
		
	}
	
});