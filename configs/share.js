
var config = {
		 
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
			}
		},
		
		ol: [
		  		{
					  init: "L.GeoJSON.WFS",
					  url: "http://xyz.malmo.se:8081/geoserver/wfs",
					  options: {
						  layerId: "shareposition",
						  displayName: "Delade positioner",
						  attribution: "Malmö stads WFS",
						  zIndex: 50,
						  reverseAxis: false,
						  reverseAxisBbox: true,
						  selectable: true,
						  popup: '<div>User: ${text_username}</div>'+
						  		'<div>Felmarginal: ${int_accuracy} m</div>'+
						  		'<div>Registrerad: ${datetime_changed}</div>',
						  uniqueKey: "id",
						  params: {
					    	 	typeName: "sandbox:sharedpositions",
								version: "1.1.0",
								maxFeatures: 10000,
								format: "text/geojson",
								outputFormat: "json",
								filter: '<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc"><ogc:PropertyIsBetween><ogc:PropertyName>datetime_changed</ogc:PropertyName><ogc:LowerBoundary><ogc:Literal>2014-05-23T14:28:41.722Z</ogc:Literal></ogc:LowerBoundary><ogc:UpperBoundary><ogc:Literal>2014-05-23T15:05:41.722Z</ogc:Literal></ogc:UpperBoundary></ogc:PropertyIsBetween></ogc:Filter>'
				     		},
						  hoverColor: '#FF0',
						  style: {
							  weight: 2,
							  color: '#F00',
							  dashArray: '',
							  fillOpacity: 0.5
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
		},
		{
			init: "L.TileLayer",
			url: 'http://xyz.malmo.se/data_e/Tilecache/malmo/malmo_leaflet_cache_EPSG900913/{z}/{x}/{y}.jpeg',
			options: {
				layerId: "malmotile",
				displayName: "Malmö karta",
				attribution: "© Malmö Stadsbyggnadskontor",
				minZoom: 6,
				maxZoom: 18,
				tms: true
			}
		},
		{
			init: "L.TileLayer.WMS",
			url: 'http://xyz.malmo.se/geoserver/gwc/service/wms',  // gwc/service/
			options: {
				layerId: "wms-op",
				displayName: "WMS-op",
				layers: "malmows:smap-mobile-bakgrundskarta",
				format: 'image/jpeg',
				subdomains: ["xyz"],
				transparent: true,
				minZoom: 6,
				maxZoom: 18,
				tiled: true
			}
		},
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
		{
			init: "L.TileLayer.WMS",
			url: 'http://geoserver.smap.se/geoserver/gwc/service/wms',  // gwc/service/
			options: {
				layerId: "wms",
				displayName: "WMS",
				layers: "malmows:MALMO_SMA_DELOMR_P_3857_TEST2",
				format: 'image/png',
				subdomains: ["xyz"],
				transparent: true,
				minZoom: 1,
				maxZoom: 18,
				tiled: true
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
		           {
		        	   init: "L.Control.LayerSwitcher",
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
		           {
		        	   init: "L.Control.SharePosition",
		        	   options: {
		        	   		useProxy: true
		           		}
		           },
		           {
		        	   init: "L.Control.Search",
		        	   options: {}
		           },
                    {
                        init: "L.Control.Zoombar",
                        options: {}
                    }
                    ,
                    {
 		        	   init: "L.Control.Geolocate",
 		        	   options: {}
 		           	},
                    {
                        init: "L.Control.ShareLink",
                        options: {
                    		addToMenu: false
                    	}
                    },
                    {
 		        	   init: "L.Control.Info",
 		        	   options: {}
 		           	}
//                    ,
//                    {
//                        init: "L.Control.Menu",
//                        options: {}
//                    }
       ]
};
