
L.Control.MMP = L.Control.extend({
	options: {
		position: 'bottomright',
		// minZoom: 14,
		// forcedDomain: null,
		wsSave: location.protocol+"//gkkundservice.test.malmo.se/KartService.svc/saveGeometry" // location.protocol+"//gkkundservice.test.malmo.se/KartService.svc/saveGeometry"
	},
	
	_lang: {
		"sv": {
			btnLabel: "Spara",
			clickHereToSave: "Klicka här för att spara positionen",
			dragInfo: '<div style="font-size:1.2em;"><strong style="font-size:1.3em;">Instruktioner</strong><ol style="margin:0;padding-left:1.65em;margin-top:0.5em;"><li>Zooma in i kartan så mycket som möjligt</li><li>Klicka i kartan för att markera platsen för ärendet<br />(pekskärm: peka och håll kvar fingret på en plats)</li></ol></div>',
			youCanDragMeOrClick: "<strong>Klicka i kartan</strong> igen eller <strong>dra i markören</strong> för att ändra positionen",
			btnSave: "Bekräfta position",
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
			btnSave: "Confirm position",
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

		return this._container;
	},

	onRemove: function(map) {
		this._unbindEvents();
		this.$btn.empty().remove();

		this._mmpExternalLayers = null;
	},

	activateAddMarker: function() {
		this._editingIsActive = true;
		this._createBtn();
		var eventName;
		if (L.Browser.touch) {
			eventName = "contextmenu";
		}
		else {
			eventName = "click";
		}
		this.map.on(eventName, this.onMapClick, this);
	},

	deactivateAddMarker: function() {
		this._editingIsActive = false;
		var eventName;
		if (L.Browser.touch) {
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

			if (this.map.getZoom() < this.options.minZoom) {
				smap.cmd.notify(this.lang.zoomInMore, "error", {fadeOut: 5000});
				return;
			}
			if (this._marker) {
				this.map.removeLayer(this._marker);
				this._marker = null;
			}
			this._addMarker(e.latlng);
		
		
	},

	onHashChange: function(e) {
		// Add external data
		var hash = location.hash.substring(1);
		var p = utils.paramsStringToObject(hash, true);
		if (p && p.MMP_DATA) {
			// // Get URLs as an array
			// var urls = p.MMP_DATA instanceof Array ? p.MMP_DATA : p.MMP_DATA.split(","), //.split(";"),
			// 	url;
			
			var url = p.MMP_DATA;
			url = decodeURIComponent(url);
			this._counterLayerId = this._counterLayerId || 0;
			this._clearExternalData();
			
			this._counterLayerId += 1;
			this._addExternalData(url, {
				layerId: "mmp-extlayer-"+this._counterLayerId
			});
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

		this._onHashChange = $.proxy(this.onHashChange, this)
		$(window).on("hashchange", this._onHashChange);

	},

	_clearExternalData: function() {
		var arr = this._mmpExternalLayers;
		for (var i = 0; i < arr.length; i++) {
			smap.cmd.hideLayer(arr[i]);
		}
		this._mmpExternalLayers = [];
	},

	_addExternalData: function(url, options) {
		options = options || {};
		var icon = L.AwesomeMarkers.icon({icon: 'warning', markerColor: 'black', prefix: "fa"});
		// L.marker([55.6, 13], {icon: icon}).addTo(this.map);
		var t = {
				url: url,
				init: "L.GeoJSON.WFS",
				options: $.extend(true, {
					layerId: L.stamp(this),
					displayName: "Incidenter",
					xhrType: "GET",
					attribution: "Malmö stad",
					inputCrs: "EPSG:3008",
					uniqueKey: "ArendeId", // TODO: Check this once
					selectable: true,
					reverseAxis: false,
					showInLayerSwitcher: true,
					reverseAxisBbox: true,
					geomType: "POINT",
					includeParams: ["bbox"],
					separator: "&",
					// noParams: true,
					popup: '*',
					// noBbox: true,
					style: {
							icon: icon
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
			layer = smap.cmd.addLayerWithConfig(t);	
		// }

		this._mmpExternalLayers.push(layer); // so that we can clear/remove layers when called again
		
	},

	_unbindEvents: function() {
		this.map.off("click", this.onMapClick);
	},

	_adaptUrl: function(url) {
		if (document.domain === "localhost") {
			// For debug
			url = url.replace("gkkundservice.test.malmo.se", "localhost").replace("kartor.malmo.se", "localhost");
			// url = 'http://localhost/smap-responsive/examples/data/mmpsave.json';
		}
		else if (document.domain === "kartor.malmo.se") {
			// While testing, and maybe keep after deploy
			url = url
					.replace("gkkundservice.test.malmo.se/", "kartor.malmo.se/gkkundservicedev/")
					.replace("gkkundservice.malmo.se/", "kartor.malmo.se/gkkundservicedev/");
		}
		return url;
	},

	_save: function(data) {

		var url = this.options.wsSave;
		url = this._adaptUrl(url);
		smap.cmd.loading(true);
		$.ajax({
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
		});
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

		// var selectWmsInst = smap.cmd.getControl("SelectWMS");
		// if (!selectWmsInst) {
		// 	alert("MMP plugin requires plugin SelectWMS");
		// 	return false;
		// }

		// function getFeatureInfo(typeName, latLng) {
		// 	var wsGeoserver = "//kartor.malmo.se/geoserver/malmows/wms";
		// 	wsGeoserver = self._adaptUrl(wsGeoserver);
		// 	var wfsParams = selectWmsInst._makeParams({
		// 			layers: typeName,
		// 			version: "1.1.0", 
		// 			info_format: "application/json",
		// 			latLng: latLng,
		// 			srs: "EPSG:4326",
		// 			buffer: 1,
		// 			feature_count: 1
		// 	});
		// 	return $.ajax({
		// 		url: wsGeoserver,
		// 		data: wfsParams,
		// 		context: this,
		// 		dataType: "json"
		// 	});
		// }

		// http://gkkundservice.test.malmo.se/KartService.svc/saveGeometry?
		// tempId=9d6f1fd5-142b-4151-94e9-c7c95ce529ed&
		// x=119488.939393&
		// y=6161920.23645&
		// namn=nm&delomrade=do&
		// stadsdel=sd&
		// stadsomrade=stadsomr&
		// entromrade=entromr

		// tempId=9d6f1fd5-142b-4151-94e9-c7c95ce529ed&
		// x=119155&
		// y=6162071&
		// namn=Ystadv%C3%A4gen+19
		// stadsdel=FOSIE&
		// stadsomrade=S%C3%96DER&

		// The requests/extractions is to be made from these layers, using given attributes.
		// var arrInfoLayers = [
			// {
			// 	typeName: "malmows:SMA_DELOMRADE_P",
			// 	keyVals: {
			// 		delomr: "delomrade"
			// 	}
			// },
			// {
			// 	typeName: "malmows:gk_entreprenorsomr_p",
			// 	keyVals: {
			// 		namn: "entromrade"
			// 	}
			// }
		// 	{
		// 		typeName: "malmows:SMA_STADSDEL_P",
		// 		keyVals: {
		// 			sdfname: "stadsdel"
		// 		}
		// 	},
		// 	{
		// 		typeName: "malmows:SMA_STADSOMRADEN_P",
		// 		keyVals: {
		// 			sdf_namn: "stadsomrade"
		// 		}
		// 	}

		// ];

		// Create one deferred object for each layer to be requested.
		// When all deferreds are done, the when-function further done 
		// will process the resolved result from each deferred.

		//TODO: Resolve and save to MMP even when user clicked outside city limits.
		// var t, defs = [];
		// for (var i=0,len=arrInfoLayers.length; i<len; i++) {
		// 	t = arrInfoLayers[i];
		// 	defs.push( $.Deferred() );
		// 	getFeatureInfo(t.typeName, this._latLng).done(function(resp) {
		// 		// TODO if features array < 1, delomr = null
		// 		var fs = resp.features || [];
		// 		var f = fs[0];
		// 		var tt, keyVals,
		// 			def = defs[0];
		// 			// Get the correct config object by checking which request we are dealing with
		// 			for (var j = 0; j < arrInfoLayers.length; j++) {
		// 				tt = arrInfoLayers[j];
		// 				if(f) {
		// 					if (tt.typeName.split(":")[1] === f.id.split(".")[0]) {
		// 						keyVals = tt.keyVals;
		// 						def = defs[j];
		// 						break;
		// 					}
		// 				}
		// 			}	

		// 			var p = f ? f.properties : [],
		// 				out = {},
		// 				keyVals = tt.keyVals,
		// 				kv;
		// 			for (kv in keyVals) {
		// 				out[keyVals[kv]] = p[kv] || '';
		// 				}
					
		// 			def.resolve(out);

		// 	}).fail(function(a, b, c) {
		// 		defs[i].reject({});
		// 	});
		// }

		// -- Get-nearest-address deferred object --
		
		// var dAddress = $.Deferred();  // Nearest address
		// defs.push(dAddress);
		// var wsAddressLocate = "//kartor.malmo.se/api/v1/nearest_address/";
		// wsAddressLocate = this._adaptUrl(wsAddressLocate);

		// $.ajax({
		// 	url: wsAddressLocate,
		// 	data: {
		// 		e: east,
		// 		n: north
		// 	},
		// 	context: this,
		// 	dataType: "json",
		// 	success: function(resp) {
		// 		var t = resp.address[0];
		// 		dAddress.resolve({
		// 			namn: t.address
		// 			// address_distm: t.distance
		// 		});
		// 	},
		// 	error: function(a, b, c) {
		// 		dAddress.reject({});
		// 	}
		// });

		// http://kartor.malmo.se:8080/geoserver/malmows/wms?service=WMS&version=1.1.0&request=GetMap&layers=malmows:gk_entreprenorsomr_p&styles=&bbox=111087.4296875,6153218.0,128122.8046875,6168696.5&width=512&height=465&srs=EPSG:3008&format=application/openlayers
		// http://kartor.malmo.se/api/v1/gk_entreprenorsomr/?e=119139&n=6164197
		// http://kartor.malmo.se/api/v1/nearest_address/?e=119149&n=6164197


		// 3. Merge the requests into one. Save into MMPs service when done.
		// smap.cmd.loading(true);
		// $.when.apply($, defs).done(function() {

		// $.when.apply($, defs).done(function() {
		// 	var data = {
		// 			tempId: self._tempId || null,
		// 			x: parseInt(east),
		// 			y: parseInt(north)
		// 	};
		// 	// Extend the output object with responses from the ajax calls
		// 	for (var i=0,len=arguments.length; i<len; i++) {
		// 		$.extend(data, arguments[i]);
		// 	}
		// 	alert(JSON.stringify(data));
		// 	self._save(data);

		// }).always(function() {
		// 	smap.cmd.loading(false);
		// }).fail(function(a, b) {
		// 	console.log("Could not save location because: None or erroneous response from one or more services.");
		// });

	},

	_createBtn: function() {
		var self = this;

		this.$btn = $('<button id="smap-mmp-btn" class="btn btn-primary btn-lg hidden"><span class="fa fa-check"></span> '+this.lang.btnSave+'</button>');
		this.$btn.on("click", function (e) {
			e.stopPropagation();
			self.save();
			return false;
		});
		$("#mapdiv").append(this.$btn);
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
		var icon = L.AwesomeMarkers.icon({icon: this._editingIsActive ? 'arrows' : "lock", markerColor: 'darkred', prefix: "fa", extraClasses: "mmpmarker"});
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
				self._latLng = e.target.getLatLng();
			});
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