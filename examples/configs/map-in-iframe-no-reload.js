var ws = {
		"localhost": {
			proxy: "//localhost/cgi-bin/proxy.py?url="
		},
		"161.52.15.157": {
			proxy: "//localhost/cgi-bin/proxy.py?url="
		},
		"mobile.smap.se": {
			proxy: "//mobile.smap.se/smap-mobile/ws/proxy.py?url="
		},
		"kartor.malmo.se": {
			proxy: "//kartor.malmo.se/api/v1/proxy.py?url="
		},
		"kartor.helsingborg.se": {
			proxy: "//kartor.helsingborg.se/cgi-bin/proxy.py?url="
		}
};

var config = {

		params:{
			center: [13.0, 55.58],
			zoom: $(window).width() < 600 ? 11 : 12
		},

		smapOptions: {
			title: "Malmö Stadsatlas",
			favIcon: "//assets.malmo.se/external/v4/favicon.ico",
			popupAutoPanPadding: [0, 110]
		},

		ws: ws,
				
		ol: [
			// {
			// 	init: "L.GeoJSON.WFS",
			// 	url: "http://localhost/geoserver/wfs",
			// 	options: {
			// 		params: {
			// 			typeName: "skane:POI_VHAMN_PT"
			// 		},
			// 		displayName: "Punkter",
			// 		layerId: "punkter",
			// 		xhrType: "POST",
			// 		useProxy: false,
			// 		attribution: "Malmö stad",
			// 		inputCrs: "EPSG:4326",
			// 		uniqueKey: "gid",
			// 		selectable: true,
			// 		reverseAxis: false,
			// 		reverseAxisBbox: true,
			// 		popup: "${gid}",
			// 		style: {
			// 			fillColor: "#FF0000",
			// 			color: "#FF0000",
			// 			fillOpacity: 0.5,
			// 			radius: 6
			// 		}
			// 	}
			// }
		],
			
		bl: [	
		{
				init: "L.TileLayer.WMS",
				url: "http://kartor.malmo.se/arcgis/services/atlaskarta_3857_wms/MapServer/WMSServer",
				options: {
					layerId: "stadskartan",
					displayName: "Stadskarta",
					category: null,
					layers: '0',
					minZoom: 10,
					maxZoom: 21,
					legend: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/stadskartan.png",
					legendBig: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/stadskartan_big.png",
					format: 'image/png',
					transparent: false,
					opacity: 1.0,
					attribution: "© Malmö Stadsbyggnadskontor",
					zIndex: 50
					// printLayer: {
					// 	init: "L.TileLayer.WMS",
					// 	url: "http://kartor.malmo.se/arcgis/services/atlaskarta_3857_wms/MapServer/WMSServer",
					// 	options: {
					// 		layers: '0',
					// 		format: 'image/png',
					// 		transparent: false,
					// 		opacity: 1.0
					// 	}
					// }
				}
		},
		{
				init: "L.TileLayer.WMS",
				url: "http://kartor.malmo.se/geoserver/malmows/wms?",
				options: {
					layerId: "malmo_ortofoto",
					displayName: "Fotokarta 2014",   
					layers: 'malmows:malmo_orto',  //senaste orto ska heta malmo_orto 
					category: null,
					minZoom: 10,
					maxZoom: 21,
					legend: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/orto2014_big.png",
					//legendBig: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/orto2014_big.png",
					format: 'image/jpeg',
					transparent: true,
					opacity: 0.9,
					attribution: "© Lantmäteriet",
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
					{
						init: "L.Control.LayerSwitcher",
						options: {
							toggleSubLayersOnClick: false,
							olFirst: true
						}
					},
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
							buffer: 12,
							useProxy: false
						}
					},
					{
						init: "L.Control.SelectVector",
						options: {}
					},
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
							gui: true,
							whitespace: "%20",
							wsOrgProj: "EPSG:3008",
							useProxy: true,
							wsAcUrl: location.protocol+"//kartor.malmo.se/api/v1/addresses/autocomplete/", // autocomplete
							wsLocateUrl: location.protocol+"//kartor.malmo.se/api/v1/addresses/geolocate/", // geolocate
							acOptions: {
								items: 100
							}
						}
					},
					{
						init: "L.Control.MMP",
						options: {
							externalDataLayerOptions: {
								noParams: true
							}
						}
					}

					// --- Toolbar items (order here determines visual order in toolbar) ---
					// {
 				// 		init: "L.Control.Print",
 				// 		options: {
 				// 			printUrl: "//kartor.malmo.se/print-servlet/leaflet_print/", // //161.52.15.157/geoserver/pdf
 				// 			position: "topright"
 				// 		}
 				//  	},
					// {
					// 	init: "L.Control.ShareLink",
					// 	options: {
					// 		position: "topright",
					// 		root: location.protocol + "//malmo.se/karta?" // location.protocol + "//kartor.malmo.se/init/?appid=stadsatlas-v1&" // Link to malmo.se instead of directly to map
					// 	}
					// },
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
					// 		// The following URL should be http and not protocol agnostic, because it doesn't support https
					// 		url: "http://kartor.malmo.se/urbex/index.htm?p=true&xy=${x};${y}", // Malmö pictometry
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
 				// 		init: "L.Control.Info",
 				// 		options: {
 				// 			position: "topright"
 				// 		}
 				//  	},
 				//  	{
					// 	init: "L.Control.MeasureDraw",
					// 	options: {
					// 		position: "topright"
					// 	}
					// },
 				//  	{
					// 	init: "L.Control.Opacity",
					// 	options: {
					//  		savePrefBox: true,
					//  		position: "topright"
					// 	}
					// },
					// {
					// 	init: "L.Control.ToolHandler",
					// 	options: {}
					// },
					// {
					//  	init: "L.Control.Add2HomeScreen",
					//  	options: {}
					// },
					//{
					//	 init: "L.Control.FullScreen",
					//		options: {position: 'topright'}
					//}
					// ,
					// {
					// 	init: "L.Control.DrawSmap",
					// 	options: {
					// 		position: "topright"
					// 	}
					// }
		]
};


function getUrlWithProtocol(url) {
	if ( !((url) && typeof(url) === "string") ) {
		return url;
	}
	if (url.substring(0, 5).toLowerCase() === "http:") {
		newUrl = location.protocol + url.substring(5);
	}
	else if (url.substring(0, 5).toLowerCase() === "https") {
		newUrl = location.protocol + url.substring(6);
	}
	else if (url.substring(0, 2) === "//") {
		newUrl = location.protocol + url;
	}
	else {
		// Nothing to change... this URL cannot be a URL as far as I understand :)
		newUrl = url;
	}
	return newUrl;
}

function preProcessConfig(c) {
	// Default select options, can be overridden by explicitly set select options
	var selectOptions = {
			info_format: "application/json",
			srs: "EPSG:3008",
			reverseAxis: false,
			reverseAxisBbox: true
	};

	var layers = c.ol.concat(c.bl),
		url, newUrl;
	for (var i=0,len=layers.length; i<len; i++) {
		t = layers[i];
		if (t.options && t.options.selectable && (t.init === "L.NonTiledLayer.WMS" || t.init === "L.TileLayer.WMS")) {
			t.options.selectOptions = $.extend({}, selectOptions, t.options.selectOptions || {});
		}
		// Convert "http://" and "//" into location.protocol + "//"
		t.url = getUrlWithProtocol(t.url);
		if (t.options && t.options instanceof Object) {
			t.options.legend = getUrlWithProtocol(t.options.legend);
			t.options.legendBig = getUrlWithProtocol(t.options.legendBig);
		}
	}
}


preProcessConfig(config);







