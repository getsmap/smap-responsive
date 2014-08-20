
var config = {

		params:{
			center: [12.72491455078125,56.01834293384084],
			zoom: 10
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

	    	 {
	    	 	 init: "L.GeoJSON.WFS",
	    	 	 url: "http://193.17.67.229/geos/hborg/wfs",
	    	 	 options: {
	    	 	 	xhrType: "GET",
	    	 	 	layerId: "larplatser",
	    	 	 	displayName: "Lärplatser",
	    	 	 	attribution: "IT/GIS Helsingborg stad",
	    	 	 	inputCrs: "EPSG:3008",
	    	 	 	reverseAxis: false,
	    	 	 	reverseAxisBbox: true,
	    	 	 	selectable: true,
	    	 	 	popup: "<h3>Lärplatser</h3><p><b>Plats namn:</b> ${plats}</p>",
	    	 	 	params: {
	    	 	 		typeName: "hborg:larplatser_mv", // required
	    	 	 		version: "1.1.0",
	    	 	 		maxFeatures: 10000,
	    	 	 		format: "text/geojson",
	    	 	 		outputFormat: "json",
	    	 	 		service: "WFS",
	    	 	 		request: "GetFeature",
	    	 	 		pointToLayer: "type"
	    	 	 	},
					style: {
						icon:{
							iconUrl: 'lib/leaflet-0.7.2/images/marker-icon.png',
						    shadowUrl: 'lib/leaflet-0.7.2/images/marker-shadow.png',
						}
					}
	    	 	 }
	    	 },
	    	 {
	    	 	 init: "L.GeoJSON.WFS",
	    	 	 url: "http://193.17.67.229/geos/hborg/wfs",
	    	 	 options: {
	    	 	 	xhrType: "GET",
	    	 	 	layerId: "naturpunkter_hbg",
	    	 	 	displayName: "Naturpunkter",
	    	 	 	attribution: "IT/GIS Helsingborg stad",
	    	 	 	inputCrs: "EPSG:3008",
	    	 	 	reverseAxis: false,
	    	 	 	reverseAxisBbox: true,
	    	 	 	selectable: true,
	    	 	 	popup: "<h3>Naturpunkter</h3><p><b>Plats namn:</b> ${namn}</p><p><b>Beskrivning:</b> ${beskrivning}</p>",
	    	 	 	params: {
	    	 	 		typeName: "hborg:naturpunkter_hbg", // required
	    	 	 		version: "1.1.0",
	    	 	 		maxFeatures: 10000,
	    	 	 		format: "text/geojson",
	    	 	 		outputFormat: "json",
	    	 	 		service: "WFS",
	    	 	 		request: "GetFeature",
	    	 	 		pointToLayer: "type"
	    	 	 	},
	    	 		style: {
	    	 			icon:{
	    	 				iconUrl: 'img/naturpunkt_30x38_sbf.png',
	    	 			    shadowUrl: 'lib/leaflet-0.7.2/images/marker-shadow.png',
	    	 			}
	    	 		}
	    	 	 }
	    	 }		     
		     ],
		     
		bl: [
		{
			init: "L.TileLayer",
			url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			options: {
				layerId: "osm",
				displayName: "OSM",
				attribution: '<span>© OpenStreetMap contributors</span>&nbsp;|&nbsp;<span>Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png"></span>',
				maxZoom: 18
			}
		}
//		,
//	 	{
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
//		           {
//		        	   init: "L.Control.MyPlugin",
//		        	   options: {
//		        	   		position: "bottomright"
//		        	   }
//		           },
//		           {
//		        	   init: "L.Control.ShareTweet",
//		        	   options: {}
//		           },
//		           {
//		        	   init: "L.Control.SharePosition",
//		        	   options: {}
//		           },
		           {
		        	   init: "L.Control.Search",
		        	   options: {}
		           },
                    {
                        init: "L.Control.Zoombar",
                        options: {}
                    },
//		            {
//                        init: "L.Control.ThreeD",
//                        options: {
//		        	   		
//		            		}
//                  }
                    {
                        init: "L.Control.ShareLink",
                        options: {
                    		addToMenu: false
                    	}
                    }
                    ,
//                     {
//                         init: "L.Control.Menu",
//                         options: {}
//                     },
                    {
            			init : "L.Control.RedirectClick",		
            			option: {}
            		},
//            		{
//  		        	   init: "L.Control.Info",
//  		        	   options: {}
//  		           	},
//            		{
//  		        	   init: "L.Control.Print",
//  		        	   options: {}
//  		           	},
//  		           	{
//		        	   init: "L.Control.Opacity",
//		        	   options: {
//		        	   		addToMenu: false,
//		        	   		savePrefBox: true
//		        	   }
//		            },
		            {
		        	   init: "L.Control.ToolHandler",
		        	   options: {
		        	   		addToMenu: false
		        	   }
		            }
       ]
};
