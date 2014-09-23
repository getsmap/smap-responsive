
var config = {

		params:{
			center: [-50, 40],
			zoom: 3,
			hash: false
		},
		
		
		ws: {
			"localhost": {
				proxy: "http://localhost/cgi-bin/proxy.py?url="
			},
			"xyz.malmo.se": {
				proxy: "http://xyz.malmo.se/myproxy/proxy.py?url="
			},
			"mobile.smap.se": {
				proxy: "http://mobile.smap.se/smap-mobile/ws/proxy.py?url="
			},
			"91.123.201.52": {
				proxy: "http://91.123.201.52/cgi-bin/proxy.py?url="
			},
			"kartor.helsingborg.se": {
				proxy: "http://kartor.helsingborg.se/cgi-bin/proxy.py?url="
			}
		},
		
		ol: [
			// ESRI REST Vector layer - not working so well to integrate with smap-responsive
			// {
			// 		init: "lvector.AGS",
			// 		options: {
			// 			// setMap: true,
			// 			displayName: "ArcGIS Jönköping",
			// 			url: "http://ext-geoservices.lansstyrelsen.se/ArcGIS/rest/services/Vektor/Lst_Miljodata/MapServer/2",
			// 			fields: "*",
			// 			uniqueField: "OBJECTID",
			// 			scaleRange: [9, 20],
			// 			layerId: "ArcGIS_Jonkoping",
			// 			attribution: "Stadsbyggnadskontoret, Malmö",
			// 			singlePopup: true,
   			//  		showAll: false,
			// 			popupTemplate: '<h2>Fiskväg - {FiskvTyper}</h2><table><small><tr><td valign="top"><b>Namn:</b></td>\
			// 				<td>{FiskvNamn}</td></tr>\
			// 				<tr><td valign="top"><b>Hindertyp:</b></td><td>{HinderTyp}</td></tr>\
			// 				<tr><td valign="top"><b>Kategori:</b></td><td>{Kategori}</td><tr>\
			// 				<tr><td valign="top"><b>Fallhöjd:</b></td><td>{Fallh_m} m</td><tr>\
			// 				<tr><td valign="top"><b>Längd:</b></td><td>{Langd_m} m</td></tr>\
			// 				<tr><td valign="top"><b>Mer info:</b></td><td><a href="{URL}" target="_blank">L&auml;nk</a></tr>\
			// 				<tr><td><b>Felrapportering: </b></td><td><a href="mailto:atgarderivatten@lansstyrelsen.se?subject=Felrapportering/Komplettering%20fiskv&auml;g:%20{FiskvagID}&body=Beskriv fel eller kompletteringen och bifoga g&auml;rna bilder! %0A%0ATack f%C3%B6r hj&auml;lpen">Fiskv&auml;g: {FiskvagID}</a></tr></small></table>',
			// 			selectable: true
			// 		}
			// },
			
			// ESRI REST Vector layer
			{
					init: "L.esri.FeatureLayer",
					// url: "http://ext-geoservices.lansstyrelsen.se/ArcGIS/rest/services/Vektor/Lst_Miljodata/MapServer/2",
					// url: "http://ext-geoservices.lansstyrelsen.se/ArcGIS/rest/services/Vektor/administrativa_granser/MapServer",
					url: "http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Portland_Parks/FeatureServer/0",
					options: {
						displayName: "L.esri.FeatureLayer (USA west coast)",
						layerId: "ESRI_Vector",
						attribution: "© Länsstyrelsen",
						popup: '<h2>${NAME}</h2><div><span>AREA:&nbsp;</span><span>${SHAPE_AREA}</span></div>',
						uniqueKey: "OBJECTID",
						selectable: true,
						style: {
							color: '#F00',
							fillOpacity: 0.3
						},
						selectStyle: {
							color: '#00F',
							fillOpacity: 1
						}
					}
			},

			// ESRI REST "WMS"-kind of layer
			{
					init: "L.TileLayer.EsriRest",
					url: "http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer",
					options: {
						displayName: "L.TileLayer.EsriRest (World)",
						transparent: true,
						layerId: "EsriRest_world",
						attribution: "Länsstyrelsen",
						popup: '${OBJECTID}',
						uniqueKey: "OBJECTID",
						selectable: true // select doesn't work with this ESRI layer
					}
			},

			// ESRI REST "Tile"-kind of layer
			{
					init: "L.esri.TiledMapLayer",
					url: "http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer",
					options: {
						displayName: "L.esri.TiledMapLayer (World)",
						// layers: "0,1,2,3,4,5",
						transparent: true,
						layerId: "TiledMap_world",
						// http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Portland_Parks/FeatureServer/0
						attribution: "Länsstyrelsen",
						popup: '${OBJECTID}',
						uniqueKey: "OBJECTID",
						selectable: true // select doesn't work with this ESRI layer
					}
			}

			// ----- TODO Set up examples with WFS and WMS services from ESRI. ------
			
			],
			
		bl: [
		{
			init: "L.esri.BasemapLayer",
			url: "Gray",
			options: {
				layerId: "esri",
				displayName: "ESRI",
				maxZoom: 18
			}
		},
		{
			init: "L.esri.BasemapLayer",
			// 'Streets', 'Topographic', 'Oceans', 'NationalGeographic', 'Gray', 'GrayLabels', 'DarkGray', 'DarkGrayLabels', 'Imagery', 'ImageryLabels', 'ImageryTransportation', 'ShadedRelief' or 'ShadedReliefLabels' 
			url: "Topographic",
			options: {
				layerId: "esri2",
				displayName: "ESRI2",
				maxZoom: 18
			}
		}
//		,
//		{
//			init: "L.TileLayer",
//			url: 'http://xyz.malmo.se/data_e/Tilecache/malmo/malmo_leaflet_cache_EPSG900913/{z}/{x}/{y}.jpeg',
//			options: {
//				layerId: "malmotile",
//				displayName: "Malmö karta",
//				attribution: "© Malmö Stadsbyggnadskontor",
//				minZoom: 6,
//				maxZoom: 18,
//				tms: true
//			}
//		},
//		{
//			init: "L.TileLayer.WMS",
//			url: 'http://xyz.malmo.se/geoserver/gwc/service/wms',  // gwc/service/
//			options: {
//				layerId: "wms-op",
//				displayName: "WMS-op",
//				layers: "malmows:smap-mobile-bakgrundskarta",
//				format: 'image/jpeg',
//				subdomains: ["xyz"],
//				transparent: true,
//				minZoom: 6,
//				maxZoom: 18,
//				tiled: true
//			}
//		},		
//		{
//			init: "L.TileLayer.WMS",
//			url: 'http://xyz.malmo.se/geoserver/gwc/service/wms',  // gwc/service/
//			options: {
//				layerId: "wms-topo",
//				displayName: "WMS-Topo (OBS! endast för test)",
//				layers: "malmows:smap-mobile-bakgrundskarta-topo",
//				format: 'image/jpeg',
//				subdomains: ["xyz"],
//				transparent: true,
//				minZoom: 6,
//				maxZoom: 18,
//				tiled: true
//			}
//		},
//		{
//			init: "L.TileLayer.WMS",
//			url: 'http://geoserver.smap.se/geoserver/gwc/service/wms',  // gwc/service/
//			options: {
//				layerId: "wms",
//				displayName: "WMS",
//				layers: "malmows:MALMO_SMA_DELOMR_P_3857_TEST2",
//				format: 'image/png',
//				subdomains: ["xyz"],
//				transparent: true,
//				minZoom: 1,
//				maxZoom: 18,
//				tiled: true
//			}
//		}
		],
		
		plugins: [
				  {
					  init: "L.Control.Scale",
					  options: {
						  imperial: false
					  }
				  },
				  {
					  init: "L.Control.LayerSwitcher",
					  options: {}
				  },
//				  {
//				 	  init: "L.Control.LayerSwitcherResponsive",
//				 	  options: {}
//				  },
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
//				  {
//					  init: "L.Control.MyPlugin",
//					  options: {
//					 		position: "bottomright"
//					  }
//				  },
//				  {
//					  init: "L.Control.ShareTweet",
//					  options: {}
//				  },
//				  {
//					  init: "L.Control.SharePosition",
//					  options: {}
//				  },
				  {
					  init: "L.Control.Search",
					  options: {}
				  },
					{
						init: "L.Control.Zoombar",
						options: {}
					},
				  // {
			//		  init: "L.Control.ThreeD",
			//		  options: {
					 		
				  //		}
			//	  }
					{
						init: "L.Control.ShareLink",
						options: {
							addToMenu: false
						}
					}
					,
					// {
					//	init: "L.Control.Menu",
					//	options: {}
					// },
					{
						init : "L.Control.RedirectClick",		
						option: {
							addToMenu: false,
							url: "http://xyz.malmo.se/urbex/index.htm?p=true&xy=${x};${y}"
						}
					},
					{
 					  init: "L.Control.Info",
 					  options: {}
 				 	},
					{
 					  init: "L.Control.Print",
 					  options: {}
 				 	},
 				 // 	{
					 //  init: "L.Control.Opacity",
					 //  options: {
					 // 		addToMenu: false,
					 // 		savePrefBox: true
					 //  }
				  // },
				  {
					  init: "L.Control.ToolHandler",
					  options: {
					 		addToMenu: false
					  }
				  }
				  // ,
				  // {
					 //  init: "L.Control.Add2HomeScreen",
					 //  options: {}
				  // }
				  // ,
				  // {
				  //	 init: "L.Control.FullScreen",
				  // 	  options: {position: 'topright'}
				  // }
				  // ,
				  // {
					 //  init: "L.Control.DrawSmap",
				  // 	  options: {}
				  // }
	  ]
};
