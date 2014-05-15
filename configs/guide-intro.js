var config = {
		
		ws: {
			"localhost": {
				proxy: "http://localhost/cgi-bin/proxy.py?url="
			},
			"xyz.malmo.se": {
				proxy: "http://xyz.malmo.se/myproxy/proxy.py?url="
			},
			"91.123.201.52": {
				proxy: "http://91.123.201.52/cgi-bin/proxy.py?url="
			}
		},
		
		ol: [],
			
		bl: [
//  	 	{
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
//		}
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
		],
		
		plugins: [
		           {
		        	   init: "L.Control.GuideIntroScreen",
		        	   options: {
		        		   autoActivate: true,
		        		   bgSrc: "img/GuideIntroScreen/element-alfa-grey.png"
		        	   }
		           }
       ]
		
		
};

// Set proxy for WFS
L.GeoJSON.WFS.proxy = config.ws[document.domain].proxy;

// Set proxy for SelectWMS
L.Control.SelectWMS.proxy = config.ws[document.domain].proxy;