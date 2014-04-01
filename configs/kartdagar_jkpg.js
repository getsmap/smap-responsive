
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
			},
			"karta.jonkoping.se:8080": {
				proxy: "http://xyz.malmo.se/myproxy/proxy.py?url="
			}
		},
		
		ol: [

	    	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://karta.jonkoping.se:8080/geoserver/SBK/wms?",
	    		 options: {
	    			 layerId: "detaljplaner",
	    			 displayName: "Detaljplaner",
	    			 layers: 'detaljplaner',
	    			 format: 'image/png',
	    			 selectable: true,
	    			 transparent: true,
	    			 attribution: "@ Jönköpings Stadsbyggnadskontor",
	    			 popup: "<h3>${_displayName}</h3><p>Beläggning: ${belaggning}</p><p>${shape_leng}</p>"
	    		 }
		     },	

			{
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://karta.jonkoping.se:8080/geoserver/SBK/wms?",
	    		 options: {
	    			 layerId: "elljusspar",
	    			 displayName: "Elljusspår",
	    			 layers: 'elljusspar',
	    			 format: 'image/png',
	    			 selectable: true,
	    			 transparent: true,
	    			 attribution: "@ Jönköpings Stadsbyggnadskontor",
	    			 popup: "<h3>${_displayName}</h3><p>Beläggning: ${belaggning}</p><p>${shape_leng}</p>"
	    		 }
		     },


	    	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://karta.jonkoping.se:8080/geoserver/SBK/wms?",
	    		 options: {
	    			 layerId: "miljostationer",
	    			 displayName: "Miljöstationer",
	    			 layers: 'miljostationer',
	    			 format: 'image/png',
	    			 selectable: true,
	    			 transparent: true,
	    			 attribution: "@ Jönköpings Stadsbyggnadskontor",
	    			 popup: "<h3>${_displayName}</h3><p>Beläggning: ${belaggning}</p><p>${shape_leng}</p>"
	    		 }
		     }		 
		 
			],
		     
		bl: [ 	
			{
				init: "L.TileLayer.WMS",
				url: 'http://geoserver.smap.se/geoserver/gwc/service/wms',  // gwc/service/
				options: {
					layerId: "wms-smap-jkpg",
					displayName: "Jönköpings kommunkarta",
					layers: "commonws:Jonkoping_Kommunkartan_1330",
					format: 'image/jpeg',
					transparent: true,
					minZoom: 6,
					maxZoom: 18,
					tiled: true
				}
			},
			{
				init: "L.TileLayer.WMS",
				url: 'http://karta.jonkoping.se:8080/geoserver/SBK/wms',  // gwc/service/
				options: {
					layerId: "SBK_orto_25",
					displayName: "Jönköpings ortofoto",
					layers: "commonws:SBK_orto_25",
					format: 'image/jpeg',
					transparent: true,
					minZoom: 6,
					maxZoom: 18,
					tiled: true
				}
			}
			// ,
			// {
				// init: "L.TileLayer",
				// url: "http://{s}.tile.cloudmade.com/f02f33a9158a425199542d3493b9189d/998/256/{z}/{x}/{y}.png",
				// options: {
					// layerId: "osm",
					// displayName: "OSM",
				// }
			// }
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
		        	   init: "L.Control.SharePosition",
		        	   options: {}
		           },
		           {
		        	   init: "L.Control.Info",
		        	   options: {}
		           }
       ]
		
		
};

// Set proxy for WFS
L.GeoJSON.WFS2.proxy = config.ws[document.domain].proxy;

// Set proxy for SelectWMS
L.Control.SelectWMS.proxy = config.ws[document.domain].proxy;