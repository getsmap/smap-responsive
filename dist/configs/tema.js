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

		params:{
			center: [13.0, 55.6],
			zoom: 12,
			hash: false
		},

		ws: ws,
				
		ol: [
			{
					init: "L.GeoJSON.WFS",
					url: "http://kartor.malmo.se/geoserver/wfs",
					options: {
						params: {
							typeName: "malmows:HL_FORSK_BUSS_PT_3006"
						},
						displayName: "Stadsdel",
						layerId: "stadsdel",
						xhrType: "POST",
						attribution: "Stadsbyggnadskontoret, Malmö",
						inputCrs: "EPSG:3006",
						reverseAxis: false,
						reverseAxisBbox: true,
						selectable: true,
						popup: 'Kvarter ${id}',
						uniqueKey: "id",
						style: {
							color: '#F00',
							fillOpacity: 0.3
						},
						selectStyle: {
							color: '#F0F',
							fillOpacity: 0.3
						}
				}
			},
			{
					init: "L.GeoJSON.WFS",
					url: "http://kartor.malmo.se/geoserver/wfs",
					options: {
						layerId: "Stigar",
						displayName: "Stigar",
						xhrType: "POST",
						attribution: "Stadsbyggnadskontoret, Malmö",
						inputCrs: "EPSG:3006",
						reverseAxis: false,
						reverseAxisBbox: true,
						selectable: true,
						popup: '<h3>${lokal}</h3>',
						uniqueKey: "lokal",
						params: {
							typeName: "malmows:hl_vidsidanstigen_pt_3006",
							version: "1.1.0",
							maxFeatures: 10000,
							format: "text/geojson",
							outputFormat: "json"
						}
						// ,
						// style: {
						// 	color: '#00F',
						// 	fillOpacity: 0.3
						// }
				}
			},
			{
				init: "L.TileLayer.WMS",
				url: "http://kartor.malmo.se/geoserver/wms",
				options: {
					displayName: "Kvarter",
					layerId: "kvarter",
					layers: "malmows:SMA_SUM_KVARTER_P",
					FORMAT_OPTIONS: "antialias",
					minZoom: 10,
					maxZoom: 18,
					selectable: true,
					popup: '<p><span>Kvarter: </span><span>${name}</span></p>\
							<a href="${url_snedbi}">Till snedbild</a>',
					format: 'image/png',
					attribution: "@ Malmö stad",
					transparent: true
				}
			},
			{
				init: "L.TileLayer.WMS",
				url: "http://kartor.malmo.se/geoserver/wms",
				options: {
					displayName: "Cykelväg",
					layerId: "Cykelväg",
					layers: "malmows:GK_CYKELVAG_L",
					FORMAT_OPTIONS: "antialias",
					minZoom: 10,
					maxZoom: 18,
					selectable: true,
					popup: '<p><span>Typ: </span><span>${typ}</span></p>',
					format: 'image/png',
					attribution: "@ Malmö stad",
					transparent: true
				}
			}

		],
			
		bl: [

		{
				init: "L.TileLayer.EsriRest",
				url: "http://161.52.15.157/arcgis/rest/services/malmo_karta_3857/MapServer",
				options: {
					//layers: "0",
					transparent: true,
					layerId: "malmo_karta_3857",
					displayName: "Malmö stadskarta",
					opacity: 1.0,
					minZoom: 0,
					maxZoom: 18,
					//layer: "malmo_karta_sv_3857",
					printLayer: {
						init: "L.TileLayer.WMS",
						url: "http://161.52.15.157/arcgis/services/malmo_karta_3857/MapServer/WMSServer",
						options: {
							displayName: "AGS wms",
							layers: '0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,64,65,66',
							minZoom: 0,
							maxZoom: 18,
							format: 'image/png',
							transparent: true,
							attribution: "@ Malmö Stadsbyggnadskontor"
						}
					},
					//singleTile : true,  //Funkar ej
					attribution: '<span>© Malmö Stadsbyggnadskontor</span>'
				}
		},

		{
				init: "L.TileLayer.WMS",
				url: "http://161.52.15.157/geoserver/malmows/wms?",
				//parentTag: "orto_2013",
				options: {
					layerId: "malmows_malmo_orto_2013",
					displayName: "Fotokarta 2013",
					layers: 'malmows:malmo_orto_2013',
					minZoom: 0,
					maxZoom: 21,
					format: 'image/png',
					transparent: true,
					opacity: 0.9,
					attribution: "© Malmö Stadsbyggnadskontor",
					zIndex: 9
					
				}
		},


		{
			init: "L.TileLayer",
			url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			options: {
				layerId: "osm",
				displayName: "OSM",
				attribution: '<span>© OpenStreetMap contributors</span>&nbsp;|&nbsp;<span>Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png"></span>',
				maxZoom: 18
			}
		},
		{
			init: "L.esri.BasemapLayer",
			url: "Gray",  //'Streets', 'Topographic', 'Oceans', 'NationalGeographic', 'Gray', 'GrayLabels', 'DarkGray', 'DarkGrayLabels', 'Imagery', 'ImageryLabels', 'ImageryTransportation', 'ShadedRelief' or 'ShadedReliefLabels' 
			options: {
				layerId: "esri",
				displayName: "ESRI",
				maxZoom: 18
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
						options: {}
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
							buffer: 5
						}
					},
					{
						init: "L.Control.SelectVector",
						options: {
							buffer: 5
						}
					},
					// {
					// 	init: "L.Control.SharePosition",
					// 	options: {}
					// },
					{
						init: "L.Control.Search",
						options: {
							wsOrgProj: "EPSG:3008",
							useProxy: false,
							wsAcUrl: "http://kartor.malmo.se/WS/search-1.0/autocomplete.ashx", // autocomplete
							wsLocateUrl: "http://kartor.malmo.se/WS/search-1.0/sokexakt.ashx" // locate
						}
					},
					{
						init: "L.Control.ShareLink",
						options: {
							position: "topright"
						}
					},
					// {
					// 	init : "L.Control.RedirectClick",		
					// 	option: {
					// 		url: "http://xyz.malmo.se/urbex/index.htm?p=true&xy=${x};${y}",
					// 		position: "topright"
					// 	}
					// },
					// {
 				// 		init: "L.Control.Info",
 				// 		options: {
 				// 			position: "topright"
 				// 		}
 				//  	},
					{
 						init: "L.Control.Print",
 						options: {
 							printUrl: "http://localhost/print-servlet/print", // http://161.52.15.157/geoserver/pdf
 							position: "topright"
 						}
 				 	},
 				//  	{
					// 	init: "L.Control.Opacity",
					// 	options: {
					//  		savePrefBox: true,
					//  		position: "topright"
					// 	}
					// },
					{
						init: "L.Control.ToolHandler",
						options: {}
					},
					// {
					//  	init: "L.Control.Add2HomeScreen",
					//  	options: {}
					// },
					{
						 init: "L.Control.FullScreen",
							options: {position: 'topright'}
					}
					// ,
					// {
					// 	init: "L.Control.DrawSmap",
					// 	options: {
					// 		position: "topright"
					// 	}
					// }
		]
};
