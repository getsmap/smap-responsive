var config = {
		
		ws: {
			"localhost": {
				proxy: "http://localhost/cgi-bin/proxy.py?url="
			},
			"xyz.malmo.se": {
				proxy: "http://xyz.malmo.se/myproxy/proxy.py?url="
			}
		},
		
		ol: [
	    	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://geoserver.smap.se/geoserver/wms",
	    		 options: {
	    			 layerId: "gangstig",
	    			 displayName: "Gångstig",
	    			 layers: 'sandboxws:regisln',
	    			 format: 'image/png',
	    			 transparent: true,
	    			 attribution: "@ Malmö Stadsbyggnadskontor"
	    		 }
		     },
		     {
				  init: "L.GeoJSON.WFS2",
				  url: "http://geoserver.smap.se/geoserver/wfs",
				  options: {
					  layerId: "intressepunkter",
					  displayName: "Intressepunkter",
					  featureType: "sandboxws:regispt",
					  attribution: "Malmö stads WFS",
					  inputCrs: "EPSG:3008",
					  reverseAxis: true,
					  popupHtml: '<h1>${namn}</h1><p>En popup med en bild</p><img style="width:200px;max-height:200px;" src="${picture}"></img>',
					  bigPopup: {
						  headerHtml: "${namn}",
						  srcVideo: '<video controls="controls" autoplay width="240" height="135">' +
				        	   			'<source src="http://geoserver.smap.se/~cleber/regis1330/video/video_061.m4v" type="video/mp4" />' +
				        	   			'<source src="http://geoserver.smap.se/~cleber/regis1330/video/video_061.webm" type="video/webm" />' +
				        	   			'<source src="http://geoserver.smap.se/~cleber/regis1330/video/video_061.ogg" type="video/ogg" />' +
			        	   			'</video>',
			        	   	srcImage: '${pictures}',
			        	   	srcAudio: '${video}'
			        }
		  		}
		     }
		     ],
			
		bl: [
  	 	{
			init: "L.TileLayer",
			url: 'http://xyz.malmo.se/data_e/Tilecache/malmo/malmo_leaflet_cache_EPSG900913/{z}/{x}/{y}.jpeg',
			options: {
				attribution: "© Malmö Stadsbyggnadskontor",
				minZoom: 6,
				maxZoom: 18,
				tms: true
			}
		}
//		    {
//				init: "L.TileLayer",
//				url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//				options: {
//					layerId: "osm",
//					displayName: "OSM",
//					attribution: '<span>© OpenStreetMap contributors</span>&nbsp;|&nbsp;<span>Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png"></span>',
//					maxZoom: 18
//				}
//			}
		],
		
		plugins: [
		           {
		        	   init: "L.Control.Scale",
		        	   options: {
		        		   imperial: false
		        	   }
		           }
       ]
		
		
};

// Set proxy
L.GeoJSON.WFS2.proxy = config.ws[document.domain].proxy;