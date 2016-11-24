
L.Control.MMP = L.Control.extend({
	options: {
		statusColors: { // Available colors: 'red', 'darkred', 'orange', 'green', 'darkgreen', 'blue', 'purple', 'darkpuple', 'cadetblue'
			ej_registrerat: 	'darkred',
			registrerat: 		'orange',
			pagaende: 			'cadetblue',
			avslutat: 			'black',
			avvisat: 			'black',
			vidarebefordrat: 	'darkpurple',
			atgardat: 			'green',
			senare_behandling: 	'black'
		},
		userMarker: {
			color: 'black',
			icon: 'arrows'
		},
		geolocateMoveUserMarker: true,
		geoJsonUniqueKey: 'ID',
		position: 'bottomright',
		zoomLevelToLoadData: 15, // for loading the data
		minZoom: 15, // for clustering
		disableClusteringAtZoom: 13,
		externalDataLayerOptions: null,
		// forcedDomain: null,
		wsSave: {
			dev: location.protocol+"//gkkundservice.test.malmo.se/KartService.svc/saveGeometry",
			prod: location.protocol+"//gkkundservice.malmo.se/KartService.svc/saveGeometry"
		}
	},
	
	_lang: {
		"sv": {
			btnLabel: "Spara",
			clickHereToSave: "Klicka här för att spara positionen",
			dragInfo: '<div style="font-size:1.2em;"><strong style="font-size:1.3em;">Instruktioner</strong><ol style="margin:0;padding-left:1.65em;margin-top:0.5em;"><li>Zooma in i kartan så mycket som möjligt</li><li>Klicka i kartan för att markera platsen för ärendet<br />(pekskärm: peka och håll kvar fingret på en plats)</li></ol></div>',
			youCanDragMeOrClick: "<strong>Klicka i kartan</strong> igen eller <strong>dra i markören</strong> för att ändra positionen",
			btnSave: "Spara aktuell position",
			btnSaved: "Position sparad",
			zoomInMore: "Du måste zooma in mer i kartan för att kunna lägga till markör"
			// dragMe: '<ol><li>Dra markören till platsen som ärendet avser</li>'+
			// 	'<li>Zooma in så långt som möjligt</li>'+
			// 	'<li>Tryck sen på <b><span class="fa fa-save" style="margin-right: 4px;"></span>Spara</b></li></ol>'
		},
		"en": {
			btnLabel: "Save",
			clickHereToSave: "Click here to save new position",
			dragInfo: '<h1>Instructions</h1><ol><li>Zoom the map as much as possible</li><li>Then click once in the map to set the location of the incident</li></ol>',
			youCanDragMeOrClick: "Click on the map again or drag the marker to adjust the location",
			btnSave: "Save current position",
			btnSaved: "Position saved",
			zoomInMore: "You must zoom the map more before you can add a marker"
			// dragMe: 'Drag the marker and then press <b>"Save"</b>.'
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
		// if (document.domain === "kartor.malmo.se" && this.options.forcedDomain) {
		// 	// Solve cross-domain issue between iframe and parent
		// 	document.domain = this.options.forcedDomain;
		// }
		this.map = map;
		this._container = L.DomUtil.create('div', 'leaflet-control-mmp');
		L.DomEvent.disableClickPropagation(this._container);
		this.$container = $(this._container);

		this._bindEvents();
		this._mmpExternalLayers = [];

		this._cluster = L.markerClusterGroup({
			disableClusteringAtZoom: this.options.disableClusteringAtZoom || this.map.options.maxZoom+1
		});

		this._bindClusterEvents(this._cluster);
		this.map.addLayer(this._cluster);

		return this._container;
	},

	onRemove: function(map) {
		this._unbindEvents();
		this.$btn.empty().remove();

		this._mmpExternalLayers = null;

		this.map.removeLayer(this._cluster);

		this.map.off("zoomend dragend", this._refreshCluster);
		this._cluster = null;
	},

	_bindClusterEvents: function(c) {
		this.map.on("zoomend dragend", this._refreshCluster, this);
	},

	_refreshCluster: function() {
		var self = this;
		var c = this._cluster;
		this._mmpExternalLayers.forEach(function(lay) {
			if (lay._refresh) {
				// c.removeLayer(lay);
				lay._map = self.map;
				lay._refresh();
				delete lay._map;
				// c.addLayer(lay);
				
			}
		});
	},

	activateAddMarker: function() {
		this._editingIsActive = true;
		this._createBtn();
		var eventName;
		if (utils.isTouchOnly()) {
			eventName = "contextmenu";
		}
		else {
			eventName = "click";
		}
		this.map.on(eventName, this.onMapClick, this);
		console.log(eventName+" event bound");
	},

	deactivateAddMarker: function() {
		this._editingIsActive = false;
		var eventName;
		if (utils.isTouchOnly()) {
			eventName = "contextmenu";
		}
		else {
			eventName = "click";
		}
		this.map.off(eventName, this.onMapClick);
		$("#smap-mmp-btn").empty().remove();
		this.$btn = null;
	},

	onMapClick: function(e) {
		console.log("map was clicked");
		if (this.map.getZoom() < this.options.minZoom) {
			smap.cmd.notify(this.lang.zoomInMore, "error", {fadeOut: 5000});
			return;
		}
		if (this._marker) {
			this.map.removeLayer(this._marker);
			this._marker = null;
		}
		this._toggleBtn(false);
		this._addMarker(e.latlng);
		
	},

	onHashChange: function(e, originalEvent) {
		var self = this;

		// Add external data
		var hash = location.hash.substring(1);
		var p = utils.paramsStringToObject(hash, true);
		if (p && p.MMP_DATA) {
			// // Get URLs as an array
			// var urls = p.MMP_DATA instanceof Array ? p.MMP_DATA : p.MMP_DATA.split(","), //.split(";"),
			// 	url;
			this._dataAdded = false;
			var url = p.MMP_DATA;

			url = this._adaptUrl(url);

			url = decodeURIComponent(url);
			this._counterLayerId = this._counterLayerId || 0;
			this._clearExternalData();
			
			this._counterLayerId += 1;

			var options = $.extend({
					layerId: "mmp-extlayer-"+this._counterLayerId
				}, this.options.externalDataLayerOptions);


			// The following code is a hack to solve the issue where hovering 
			// a cluster during map start up disables the previously bound map 
			// click event used for adding the "incident marker". With the below
			// solution, geojson data is only loaded after zooming in at least one
			// step from initial zoom.
			function isZoomOkForLoadingData() {
				var minZoom = self.options.zoomLevelToLoadData;
				return self.map.getZoom() >= minZoom;
			}

			if (isZoomOkForLoadingData() === true ) {
				this._addExternalData(url, options);
				this._dataAdded = true;
			}
			else {
				this.map.on("zoomend", function() {
					if (!self._dataAdded && isZoomOkForLoadingData() === true) {
						this._addExternalData(url, options);
						self._dataAdded = true;
					}
				}, this);
				
			}
		}
	},

	_bindEvents: function() {

		var self = this;
		smap.event.on("smap.core.beforeapplyparams", function(e, p) {
			// Make the category layer visible so we can snap to it
			var ol = p.OL || "";
			ol = ol.split(",");
			ol.push(p.CATEGORY);
			ol = ol.join(",");
			p.OL = ol;
		});
		smap.event.on("smap.core.applyparams", function(e, p) {
			// self._snapLayer = smap.cmd.getLayer(p.CATEGORY);
			// if (self._snapLayer) {
			// 	self._addEditInterface();
			// }
			if (self.options.wsSave instanceof Object) {
				var isProd = p.ISPROD && p.ISPROD.length ? p.ISPROD.toUpperCase() : "FALSE";
				var wsSave = {
					"FALSE": self.options.wsSave.dev,
					"TRUE": self.options.wsSave.prod
				};
				self.options.wsSave = wsSave[isProd];
			}
			if (p.MMP_EDIT && p.MMP_EDIT.toUpperCase() === "TRUE" ) {
				self.activateAddMarker();
			}

			var xy3008 = null,
				latLng = null;
			if (p.MMP_XY) {
				var xy3008 = p.MMP_XY instanceof Array ? p.MMP_XY : p.MMP_XY.split(",");

				// Convert items into floats
				xy3008 = $.map(xy3008, function(val) {
					return parseFloat(val);
				});
				latLng = utils.projectLatLng(L.latLng(xy3008), "EPSG:3008", "EPSG:4326", true, false);
			}
			else {
				if (this._editingIsActive) {
					// We need give instruction only if "add marker" is active
					smap.cmd.notify(self.lang.dragInfo, "info");
				}
			}
			if (p.MMP_ID) {
				// This id is used by MMP to connect the report with the map data we return to them
				self._tempId = p.MMP_ID; // parseInt needed?
			}
			if (latLng) {
				self._addMarker(latLng);
			}
			self.onHashChange();
		});

		// this.map.on("featureclick", function(e) {

		// 	console.log('deactivating');
		// 	self._editingIsActive = false;
		// 	// e.originalEvent.stopImmediatePropagation();
		// 	// self.deactivateAddMarker();
		// 	self.map.off('click', self.onMapClick);
		// });

		smap.event.on("hashchange", this.onHashChange.bind(this));

	},

	_clearExternalData: function() {
		var arr = this._mmpExternalLayers;
		for (var i = 0; i < arr.length; i++) {
			smap.cmd.hideLayer(arr[i]);
		}
		this._mmpExternalLayers = [];
	},

	_addExternalData: function(url, options) {
		function adapt(s){
			return s
				.toLowerCase()
				.replace(/ /g, '_')
				.replace(/å/g, 'a')
				.replace(/ä/g, 'a')
				.replace(/ö/g, 'o');
		}

		options = options || {};
		// var icon = L.AwesomeMarkers.icon({icon: 'warning', markerColor: 'black', prefix: "fa"});
		// L.marker([55.6, 13], {icon: icon}).addTo(this.map);
		var t = {
				url: url,
				init: "L.GeoJSON.WFS",
				options: $.extend(true, {
					layerId: L.stamp(this),
					displayName: "Incidenter",
					xhrType: this.options.xhrType ? this.options.xhrType : "GET",
					attribution: "Malmö stad",
					inputCrs: "EPSG:3008",
					uniqueKey: false, //this.options.geoJsonUniqueKey, // TODO: Check this once
					selectable: true,
					reverseAxis: false,
					showInLayerSwitcher: true,
					reverseAxisBbox: true,
					geomType: "POINT",
					includeParams: ["bbox"],
					separator: "&",
					noParams: options.noParams || false,
					popup: '*',
					pointToLayer: function (feat, latlng) {
						var markerIcon = L.AwesomeMarkers.icon({
						    icon: 'warning',
						    prefix: 'fa',
						    markerColor: self.options.statusColors[adapt(feat.properties.Status)] || 'white'
						  });

				        var m = L.marker(latlng, {icon: markerIcon});
				        m.options.icon.options.className += " easyincident-smallmarker"; // So that we can style the div of the marker
				        return m;
				    }
					
					
				}, options)
			};
		// t.options.layerId = L.stamp(t);
		// t.options.displayName = t.options.layerId;
		
		var layer,
			layerSwitcherInst = smap.cmd.getControl("LayerSwitcher");
		// if (layerSwitcherInst) {
		// 	var $row = layerSwitcherInst._addRow(t);
		// 	$row.trigger("tap");
		// 	layer = smap.cmd.getLayer(t.layerId);
		// }
		// else {
		// layer = smap.cmd.addLayerWithConfig(t);	
		// this.map.removeLayer(layer);
		layer = smap.core.layerInst._createLayer(t);
		// layer._bindEvents(this.map);

		this._mmpExternalLayers.push(layer); // so that we can clear/remove layers when called again
		var self = this;
		layer.on("load", function(e) {
			// self._cluster.addLayer(e.target);
			e.target.eachLayer(function(lay) {
				self._cluster.addLayer(lay);
			});
		});
		this.map.fire("layeradd", {layer: layer, target: layer});
		this._refreshCluster();
		// layer._refresh();
		

	},




	_unbindEvents: function() {
		this.map.off("click", this.onMapClick);
	},

	_adaptUrl: function(url) {
		if (!url || !url.length || !(typeof url === "string")) {
			return url;
		}
		if (document.domain === "localhost") {
			// For debug
			url = url
						.replace("gkkundservice.malmo.se", "localhost/gkkundservicedev")
						.replace("gkkundservice.test.malmo.se", "localhost/gkkundservicedev")
						.replace("kartor.malmo.se", "localhost");
			// url = 'http://localhost/smap-responsive/examples/data/mmpsave.json';
		}
		else if (document.domain === "kartor.malmo.se") {
			// While testing, and maybe keep after deploy
			url = url
					.replace("gkkundservice.test.malmo.se/", "kartor.malmo.se/gkkundservicedev/")
					.replace("gkkundservice.malmo.se/", "kartor.malmo.se/gkkundservice/");
		}
		return url;
	},

	_save: function(data, xhrOptions) {

		var url = this.options.wsSave;
		url = this._adaptUrl(url);
		smap.cmd.loading(true);
		$.ajax($.extend({
			url: url,  //smap.config.ws.proxy + encodeURIComponent(url),
			type: "GET",
			data: data,
			context: this,
			cache: false,
			dataType: "json",
			success: function(resp) {
				if (resp.success && JSON.parse(resp.success)) {
					// Save successful
					// alert("Success, indeed yes");
					console.log('Saved position successfully. Code: ' + resp.code + '. Msg: ' + resp.msg);
					this._toggleBtn(true);
				}
				else {
					alert("Could not save because "+resp.msg+". Error code: "+resp.code);
				}
				// "Reset" the map
				// this._tempId = null;
			},
			error: function(a, b, c) {
				alert("Could not save because: "+b);
			},
			complete: function() {
				smap.cmd.loading(false);
			}
		}, xhrOptions));
	},

	save: function() {
		var self = this;
		// var p = this.map.getCenter();

		// setTimeout(function() {
		// 	var data = {easting: self._latLng.lng, northing: self._latLng.lat};
		// 	parent.$("body").trigger("smap:updatedata", data);
		// 	smap.cmd.loading(false);
		// }, 1000);

		// -- Create params --

		var p3008 = utils.projectPoint(this._latLng.lng, this._latLng.lat, "EPSG:4326", "EPSG:3008");
		var east = p3008[0],
			north = p3008[1],
			data = {
					x: Math.round(east),
					y: Math.round(north),
					tempId: this._tempId || null
			};
		console.log('Skickar: ' + JSON.stringify(data));
		this._save(data);

	

	},

	_createBtn: function() {
		var self = this;

		this.$btn = $('<button id="smap-mmp-btn" class="btn btn-primary btn-lg hidden"> '+this.lang.btnSave+'</button>');
		this.$btn.on("click", function (e) {
			e.stopPropagation();
			self.save();
			return false;
		});
		$("#mapdiv").append(this.$btn);
	},

	_toggleBtn: function(state) {
		if (state){
			this.$btn.removeClass('btn-primary').addClass('btn-success').html('<span class="fa fa-check"></span> ' + this.lang.btnSaved)
		}
		else {
			this.$btn.removeClass('btn-success').addClass('btn-primary').html(this.lang.btnSave)
		}
	},

	// _addSnapping: function(marker) {
	// 	marker.snapediting = new L.Handler.MarkerSnap(this.map, marker);
	// 	marker.snapediting.addGuideLayer(this._snapLayer);
	// 	marker.snapediting.enable();
	// },

	_addMarker: function(latLng) {
		var self = this;
		if (!latLng) {

			// latLng = this.map.getCenter();
		}
		else {
			this._latLng = latLng;
		}
		var icon = L.AwesomeMarkers.icon({icon: this._editingIsActive ? self.options.userMarker.icon : "lock", markerColor: self.options.userMarker.color, prefix: "fa", extraClasses: "mmpmarker"});
		var marker = L.marker(latLng, {
				draggable: this._editingIsActive || false,
				icon: icon
				,
				zIndexOffset: 999
		});
			// marker.bindPopup(this.lang.dragMe);
			marker.on("dragstart", function(e) {
				e.target.closePopup();
			});
			marker.on("dragend", function(e) {
				// $("#smap-mmp-btn").prop("disabled", false).tooltip({
				// 	// title: self.lang.clickHereToSave,
				// 	placement: "bottom"
				// }).tooltip("show");

				// e.target.openPopup();
				self._toggleBtn(false);
				self._latLng = e.target.getLatLng();
			});
			if (self.options.geolocateMoveUserMarker) {
				self.map.on("locationfound", function(e) {
					locationLatLng = L.latLng(e.latlng.lat, e.latlng.lng)
					self._toggleBtn(false);
					self._marker.setLatLng(locationLatLng);
				});
			}
			this.map.addLayer(marker);
			// this._addSnapping(marker);
			marker.openPopup();
			this._marker = marker;

			if (this.$btn) {
				this.$btn.removeClass("hidden");
				$(".alert").remove(); // Dont let a message cover the button
			}

		// smap.cmd.notify(this.lang.youCanDragMeOrClick, "info");
	}
});





















//L.control.template = function (options) {
//	return new L.Control.Template(options);
//};