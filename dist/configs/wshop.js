var ws = {
		"localhost": {
			proxy: "http://localhost/cgi-bin/proxy.py?url="
		},
		"kartor.malmo.se": {
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

		ws: ws,

		// These are optional default parameters for the map.
		// These parameters will be overridden by any parameters after "?" in the URL.
		// For instance: http://.../smap-responsive?zoom=3 will override the zoom level specified here.
		params: {
			center: [13.0, 55.6],
			zoom: 12
		},

		// Override L.Map options
		mapConfig: {
			maxBounds: [[55.71628170645908, 12.6507568359375], [55.42589636057864, 13.34564208984375]],
			minZoom: 12,
			maxZoom: 14
		},

		// These are the overlays in the map
		ol: [

			// Ett WMS-lager från SMHI
			{
				init: "L.TileLayer.WMS",
				url: "http://opendata-view.smhi.se/klim-stat_moln/wms",
				options: {
					legend: false,
					layers: "klim-stat_moln:klara_dagar_yta",
					layerId: "smhi_klaradagar",
					displayName: "Klara dagar (år)",
					format: 'image/png',
					transparent: true,
					opacity: 1,
					attribution: "© SMHI",
					zIndex: 100,
					selectable: true,
					popup: "*",
					category: ["Min kategori", "WMS:er"]
				}
			}
			// ,
			// // Ett WFS-lager
			// {
			// 	init: "L.GeoJSON.WFS",
			// 	url: "http://localhost/geoserver/wfs",
			// 	options: {
			// 		params: {
			// 			typeName: "skane:POI_VHAMN_PT"
			// 		},
			// 		// isEditable: false,
			// 		// geomType: "point",
			// 		xhrType: "GET",
			// 		layerId: "vhamnen_pt",
			// 		displayName: "Punkter av intresse",
			// 		useProxy: false,
			// 		attribution: "Malmö stads WFS",
			// 		inputCrs: "EPSG:4326",
			// 		uniqueKey: "gid",
			// 		reverseAxis: false,
			// 		reverseAxisBbox: true
			// 		// popup: "*",
			// 		// category: ["Min kategori", "WFS:er"],
			// 		// selectable: true
			// 	}
			// }
			// ,
			// {
			// 	init: "L.TileLayer.WMS",
			// 	url: "http://localhost/geoserver/wms",
			// 	options: {
			// 		displayName: "Kvarter",
			// 		layerId: "kvarter",
			// 		layers: "malmows:SMA_SUM_KVARTER_P",
			// 		format: 'image/png',
			// 		zIndex: 150,
			// 		attribution: "@ Malmö stad",
			// 		transparent: true

			// 		// category: ["Min kategori", "WMS:er"],
			// 		// selectable: true,
			// 		// popup: '<div>${name}</div><p>Nothing else</p>',
			// 		// selectOptions: {
			// 		// 	info_format: "application/json",
			// 		// 	srs: "EPSG:3008",
			// 		// 	reverseAxis: false,
			// 		// 	reverseAxisBbox: true
			// 		// }
			// 	}
			// }


		],

		// These are the baselayers ("background" layers) of the map
		bl: [
		{
			init: "L.TileLayer",
			url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			options: {
				layerId: "osm",
				displayName: "OSM",
				attribution: '<span>Â© OpenStreetMap contributors</span>&nbsp;|&nbsp;<span>Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png"></span>',
				maxZoom: 18
			}
		},
		{
				init: "L.BingLayer",
				key: "Aotc01TwmdnnsyBwQ4h8viyuA91k-tdPIBVO0h0_2fcbgkSxUhxRZKiZ8ZzoANXp", // Get your key at: http://msdn.microsoft.com/en-us/library/ff428642.aspx
				options: {
					layerId: "bing",
					displayName: "Bing Aerial",
					subdomains: [0, 1, 2, 3],
					type: 'Aerial',
					attribution: 'Bing',
					culture: ''
				}
		},
		// ,
		// {
		// 		init: "L.TileLayer.EsriRest",
		// 		url: "http://kartor.malmo.se/arcgis/rest/services/malmo_karta_3857/MapServer",
		// 		options: {
		// 			//layers: "0",
		// 			reuseTiles: true,
		// 			transparent: true,
		// 			layerId: "malmo_karta_3857",
		// 			displayName: "Malmö stadskarta",
		// 			opacity: 1,
		// 			minZoom: 0,
		// 			maxZoom: 18,
		// 			//layer: "malmo_karta_sv_3857",
		// 			printLayer: {
		// 				init: "L.TileLayer.WMS",
		// 				url: "http://kartor.malmo.se:6080/arcgis/services/malmo_karta/MapServer/WMSServer",
		// 				//parentTag: "orto_2013",
		// 				options: {
		// 					layerId: "malmows_malmo_3857_print",
		// 					displayName: "Malmö stadskarta print",
		// 					layers: '0,2,3,4,5,7,8,9,11,12,13,14,15,16,17,19,20,21,22,23,24,25,26,28,29,30,31,33,33,34,35,37,38,39,40,41,42,43,44,45,46,48,50,52,54,56,57,59,60,62,63,65,66,67,69,70,72,73,75,76,77,78,79,80,81',
		// 					minZoom: 0,
		// 					maxZoom: 21,
		// 					format: 'image/png',
		// 					transparent: true,
		// 					opacity: 1,
		// 					attribution: " Malmö Stadsbyggnadskontor",
		// 					zIndex: 9
		// 				}
		// 			},
		// 			attribution: '<span> Malmö Stadsbyggnadskontor</span>'
		// 		}
		// }
		// ,
		// {
		// 		init: "L.TileLayer.WMS",
		// 		url: "http://kartor.malmo.se/geoserver/malmows/wms?",
		// 		//parentTag: "orto_2013",
		// 		options: {
		// 			layerId: "malmows_malmo_orto_2013",
		// 			displayName: "Fotokarta 2013",
		// 			layers: 'malmows:malmo_orto_2013',
		// 			minZoom: 0,
		// 			maxZoom: 21,
		// 			format: 'image/png',
		// 			transparent: true,
		// 			opacity: 1,
		// 			attribution: "© Malmö Stadsbyggnadskontor",
		// 			zIndex: 9
		// 		}
		// },
		],


		// These are plugins – extending the map's functionality
		plugins: [
					{
						init: "L.Control.Scale",
						options: {
							imperial: false
						}
					},
					{
						init: "L.Control.LayerSwitcher",
						options: {
							toggleSubLayersOnClick: false,
							unfoldOnClick: true,
							unfoldAll: false
						}
					},
					{
						init: "L.Control.Zoombar",
						options: {}
					},
					{
						init: "L.Control.Geolocate",
						options: {}
					},
					{
						init: "L.Control.SelectWMS",
						options: {
							buffer: 5,
							useProxy: true
						}
					},
					{
						init: "L.Control.SelectVector",
						options: {
							buffer: 5
						}
					},
					// {
					// 	init: "L.Control.Search",
					// 	options: {
					// 		gui: true,
					// 		// whitespace: "%20",
					// 		wsOrgProj: "EPSG:3008",
					// 		useProxy: true, // If set to true, the URL specified in "config.ws.proxy" will be used
					// 		wsAcUrl: "http://kartor.malmo.se/WS/search-1.0/autocomplete.ashx", // autocomplete
					// 		wsLocateUrl: "http://kartor.malmo.se/WS/search-1.0/sokexakt.ashx" // geolocate
					// 	}
					// },
					{
						init: "L.Control.Print",
						options: {
							printUrl: "http://localhost/print-servlet/leaflet_print/",
							position: "topright"
						}
					},
					{
						init: "L.Control.Editor",
						options: {
							useProxy: false
						}
					},
					// {
					//	init: "L.Control.Mapillary",
					//	options: {}
					// }
					// {
					//	init: "L.Control.DrawSmap",
					//	options: {}
					// }
					// ,
					{
						init: "L.Control.ShareLink",
						options: {
							position: "topright"
						}
					},
					{
						init : "L.Control.RedirectClick",		
						option: {
							url: "http://xyz.malmo.se/urbex/index.htm?p=true&xy=${x};${y}",
							position: "topright"
						}
					}
					// {
					//	init: "L.Control.Info",
					//	options: {
					//		position: "topright"
					//	}
					// },
					// ,
					// {
					//	init: "L.Control.ToolHandler",
					//	options: {}
					// }
					// {
					//	init: "L.Control.Add2HomeScreen",
					//	options: {}
					// },
					// {
					//	init: "L.Control.FullScreen",
					//	options: {position: 'topright'}
					// }
					// ,
					// {
					//	init: "L.Control.DrawSmap",
					//	options: {
					//		position: "topright"
					//	}
					// }
		]
};
