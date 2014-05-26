
var config = {
		
		/**
		 * Web services that are accessed a little here and there can be added here.
		 * It is possible to adapt the URL depending on domain (the domain is where
		 * the client code is accessed/executed – e.g. "www.malmo.se".
		 */ 
		ws: {
			"localhost": {
				proxy: "http://localhost/cgi-bin/proxy.py?url="
			},
			"xyz.malmo.se": {
				proxy: "http://xyz.malmo.se/myproxy/proxy.py?url="
			}
		},
		
		ol: [

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
		],
		
		plugins: [

		]
		

// <><><><><><><><><><><><> Övning 1 – Skapa en karta <><><><><><><><><><><><><><><><><><><><><><><><><><><><>		

//			----- WMS-lager ------------------------------------------------------------------------

//			----- WMS-lager: Stadsområden -----
//			{
//				init: "L.TileLayer.WMS",
//				url: 'http://xyz.malmo.se/geoserver/wms',
//				options: {
//					layerId: "stadsomraden",
//					displayName: "Stadsområden",
//					layers: "malmows:SMA_STADSOMRADEN_P",
//					format: 'image/png',
//					transparent: true,
//					tiled: true,
//					minZoom: 6,
//					maxZoom: 18
//				}
//			}

//			----- WMS-lager: Årsmedeltemperatur -----
//			{
//	    		 init: "L.TileLayer.WMS",
//	    		 url: "http://opendata-view.smhi.se/klim-stat_temperatur/wms",
//	    		 options: {
//	    			 layerId: "arsmedeltemperatur",
//	    			 displayName: "Årsmedeltemperatur",
//	    			 layers: 'arsmedeltemperatur',
//	    			 format: 'image/png',
//	    			 selectable: true,
//	    			 transparent: true,
//	    			 attribution: "@ Malmö Stadsbyggnadskontor"
//	    		 }
//		     },
	
//			----- WMS-lager: Markanvändning -----
//			{
//				init: "L.TileLayer.WMS",
//				url: 'http://xyz.malmo.se/geoserver/gwc/service/wms',
//				options: {
//					layerId: "mark",
//					displayName: "Markanvändning",
//					layers: "malmows:uli_group",
//					format: 'image/png',
//					transparent: true,
//					tiled: true,
//					minZoom: 6,
//					maxZoom: 18
//				}
//			}
		
//			----- Plugins ---------------------------------------------------------------------------

//        {
//      	  init: "L.Control.LayerSwitcher",
//      	  options: {}
//        },
//        {
//        	init: "L.Control.Scale",
//        	options: {
//        	imperial: false
//        }
//        },
//        {
//      	  init: "L.Control.Geolocate",
//      	  options: {}
//        },
//        {
//      	  init: "L.Control.Zoombar",
//      	  options: {}
//        },
//        {
//      	  init: "L.Control.ShareLink",
//      	  options: {}
//        }
		

		
		
		

// <><><><><><><><><><><><> Övning 2 – Göra en cachad bakgrundskarta (Ulf Minör) <><><><><><><><><><><><><><><><><><><><><><><><><><><><>
		
//		----- WMS-lager: Markanvändning som Ulf lägger upp och cachar live på visningen! -----
//				{
//					init: "L.TileLayer.WMS",
//					url: 'http://xyz.malmo.se/geoserver/gwc/service/wms',
//					options: {
//						layerId: "uli",
//						displayName: "Markanvändning",
//						layers: "malmows:uli_group",
//						format: 'image/png',
//						subdomains: ["xyz"],
//						transparent: true,
//						minZoom: 6,
//						maxZoom: 18,
//						tiled: true
//					}
//				}

		
		
		
		
		
		
// <><><><><><><><><><><><> Övning 3 – Gör en plugin för smap <><><><><><><><><><><><><><><><><><><><><><><><><><><><>

//		{
//    	  init: "L.Control.PluginULI",
//    	  options: {}
//      }

		

// Färdig kod för pluginen finns i plugins/PluginULI/PluginULI.js
		
};
