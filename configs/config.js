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
	    			 displayName: "GŒngstig",
	    			 layers: 'sandboxws:regisln',
	    			 format: 'image/png',
	    			 transparent: true,
	    			 attribution: "© Malmš Stadsbyggnadskontor"
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
		]
		
		
};