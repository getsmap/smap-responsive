var ws = {
		"localhost": {
			proxy: "http://localhost/cgi-bin/proxy.py?url="
		},
		"161.52.15.157": {
			proxy: "http://localhost/cgi-bin/proxy.py?url="
		},
		"mobile.smap.se": {
			proxy: "http://mobile.smap.se/smap-mobile/ws/proxy.py?url="
		},
		"kartor.helsingborg.se": {
			proxy: "http://kartor.helsingborg.se/cgi-bin/proxy.py?url="
		}
};

var config = {

		params: {
			center: [13.0, 55.58],
			zoom: 10
		},

		mapConfig: {
			maxZoom: 21
		},

		ws: ws,
				
		ol: [],

		bl: [

		{
			init: "L.TileLayer.WMS",
			url: "http://kartor.malmo.se/arcgis/services/malmokarta_3857_wms/MapServer/WMSServer",
			options: {
				layerId: "stadskartan",
				displayName: "Stadskarta",
				layers: '0',
				legend: null,
				minZoom: 10,
				maxZoom: 21,
				format: 'image/png',
				transparent: false,
				opacity: 1.0,
				attribution: "© Malmö Stadsbyggnadskontor",
				zIndex: 50
			}
		}

		],

		plugins: [
					{
						init: "L.Control.Scale",
						options: {
							imperial: false
						}
					},
					// {
					// 	init: "L.Control.Test",
					// 	options: {
					// 		imperial: false
					// 	}
					// },
					// {
					// 	init: "L.Control.MalmoHeader",
					// 	options: {}
					// },
					//{
					//	init: "L.Control.LayerSwitcher",
					//	options: {
					//	toggleSubLayersOnClick: false,
					//	}
					//},
					{
						init: "L.Control.Zoombar",
						options: {}
					},
					// {
					// 	init: "L.Control.Geolocate",
					// 	options: {}
					// },
					{
						init: "L.Control.SelectWMS",
						options: {
							buffer: 10,
							useProxy: false
						}
					},
					{
						init: "L.Control.SelectVector",
						options: {
							buffer: 5
						}
					},
					//{
					//	init: "L.Control.MeasureDraw",
					//	options: {
					//		position: "topright"
					//	}
					//},
					// {
					// 	init: "L.Control.SharePosition",
					// 	options: {}
					// },
					{
						init: "L.Control.Search",
						options: {
							_lang: {
								"sv": {search: "Sök adress eller plats"}
							},
							gui: false,
							zoom: 15,
							whitespace: "%20",
							wsOrgProj: "EPSG:3008",
							useProxy: false,
							wsAcUrl: "http://kartor.malmo.se/WS/search-1.0/autocomplete.ashx", // autocomplete
							wsLocateUrl: "http://kartor.malmo.se/WS/search-1.0/sokexakt.ashx" // locate
						}
					}// ,
					//{
					//	init: "L.Control.ShareLink",
					//	options: {
					//		position: "topright"
					//	}
					//},
					// {
					// 	init : "L.Control.RedirectClick", // Street view		
					// 	options: {
					// 		position: "topright",
					// 		url: "http://sbkvmgeoserver.malmo.se/cyclomedia/index.html?posx=${x}&posy=${y}",
					// 		btnClass: "fa fa-car",
					// 		cursor: "crosshair",

					// 		_lang: {
					// 			"sv": {
					// 				name: "Gatuvy",
					// 				hoverText: "Klicka i kartan för att se gatuvy",
					// 			},
								
					// 			"en": {
					// 				name: "Street view",
					// 				hoverText: "Click on the map to show street view"									
					// 			}
					// 		}
					// 	}
					// },
					// {
					// 	init : "L.Control.RedirectClick", // Pictometry
					// 	options: {
					// 		position: "topright",
					// 		url: "http://xyz.malmo.se/urbex/index.htm?p=true&xy=${x};${y}", // Malmö pictometry
					// 		//url: "http://kartor.helsingborg.se/urbex/sned_2011.html?p=true&xy=${x};${y}", //Helsingborg pictometry
					// 		btnClass: "fa fa-plane",
					// 		cursor: "crosshair",

					// 		_lang: {
					// 			"sv": {
					// 				name: "Snedbild",
					// 				hoverText: "Klicka i kartan för att se snedbild",
					// 			},
								
					// 			"en": {
					// 				name: "Pictometry",
					// 				hoverText: "Click on the map to show pictometry"									
					// 			}
					// 		}
					// 	}
					// },
					// {
 				// 		init: "L.Control.Print",
 				// 		options: {
 				// 			printUrl: "http://localhost/print-servlet/leaflet_print/", //http://kartor.malmo.se/print-servlet/leaflet_print/", // http://161.52.15.157/geoserver/pdf
 				// 			position: "topright"
 				// 		}
 				//  	},
				// 	{
				// 		init: "L.Control.ToolHandler",
				// 		options: {}
				// 	}
					//{
					//	 init: "L.Control.FullScreen",
					//		options: {position: 'topright'}
					//}
		]
};





var selectOptions = {
		info_format: "application/json",
		srs: "EPSG:3008",
		reverseAxis: false,
		reverseAxisBbox: true
};


// -- Add the overlays using a for-loop --

var ol = config.ol,
	batches = "0,1,2,3,4,5,6,7,8,9".split(","),
	terms = ["1415", "1516"], // Remember to change this when adding new layers. TODO automatically create this array based on current date
	template = {
		init: "L.NonTiledLayer.WMS",
		url: "http://kartor.malmo.se/geoserver/wms", //"http://kartor.malmo.se/geoserver/wms",
		options: {
			displayName: null,
			layerId: null,
			category: null,
			layers: "malmows:UTBILDNING_SKOLA_ARSK_{batch}_{term}_PT",
			selectOptions: selectOptions,
			selectable: true,
			popup: '*',
			format: 'image/png',
			zIndex: 150,
			attribution: "@ Malmö stad",
			transparent: true
		}
};

var tPoint, tArea, batch, term, o;

for (var i=0,len=batches.length; i<len; i++) {
	for (var j=0,lenj=terms.length; j<lenj; j++) {

		term = terms[j];
		batch = batches[i];

		// Upptagningsomraden schools
		tPoint = $.extend(true, {}, template);
		o = tPoint.options;
		o.layers = tPoint.options.layers.replace(/\{batch\}/g, batch).replace(/\{term\}/g, term);
		o.layerId = batch+"_"+term;
		o.category = ["Skola"],
		o.displayName = "Skola";
		//o.selectable = false;
		o.popup = '<div>${objektnamn}</div>\
					<div>Årskurs:&nbsp;${arskurs}</div>\
					<div>${adress}</div>\
					<div>${postnr}&nbsp;${ort}</div>\
					<div>Stadsområde:&nbsp;${stadsomr}</div>\
					<br><a target="_blank" href="${url}">Läs mer</a>\
					<br><a target="_blank" href="http://xyz.malmo.se/urbex/index.htm?p=true&xy=${easting};${northing}">Visa snedbild över skolan</a>',
		o.zIndex = 1100 + i;
		ol.push(tPoint);

		// Upptagningsomraden area
		tArea = $.extend(true, {}, template);
		o = tArea.options; //UTBILDNING_GRUNDSKOLA_UPPTAGNINGSOMR_ARSK_0_1516_P UTBILDNING_SKOLA_ARSK_2_1415_PT
		o.layers = "malmows:UTBILDNING_UPPTAGNINGSOMR_ARSK_{batch}_{term}_P".replace(/\{batch\}/g, batch).replace(/\{term\}/g, term);
		o.layerId = "AREA_"+batch+"_"+term;
		o.category = ["Upptagningsområde"],
		o.displayName = "Upptagningsområde";
		o.zIndex = 100 + i;
		o.popup = '<div>${skola}</div>\
					<div>Årskurs:&nbsp;${arskurs}</div>\
					<div>${adress}</div>\
					<div>${postnr}&nbsp;${ort}</div>\
					<div>Stadsområde:&nbsp;${stadsomr}</div>\
					<br><a target="_blank" href="${url}">Läs mer</a>\
					<br><a target="_blank" href="http://xyz.malmo.se/urbex/index.htm?p=true&xy=${easting};${northing}">Visa snedbild över skolan</a>',
		ol.push(tArea);
	}
}





