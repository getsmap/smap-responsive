
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
		
		ol: [
		     {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://geoserver.smap.se/geoserver/wms",
	    		 options: {
	    			 layerId: "cykelvag",
	    			 displayName: "WMS (Cykelväg)",
	    			 layers: 'malmows:GK_CYKELVAG_L',
	    			 format: 'image/png',
	    			 selectable: true,
	    			 transparent: true,
	    			 attribution: "@ Malmö Stadsbyggnadskontor",
	    			 popup: "<h3>${_displayName}</h3><p>Typ: ${typ}</p><p>Geom: ${geom}</p>"
	    		 }
		     },
		     {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://xyz.malmo.se:8081/geoserver/wfs",
	    		 options: {
	    			 layerId: "malmo_dp",
	    			 displayName: "WMS (Detaljplan)",
	    			 layers: 'malmows:SMA_DP_ADP_YTOR_P',
	    			 format: 'image/png',
	    			 selectable: true,
	    			 transparent: true,
	    			 attribution: "@ Malmö Stadsbyggnadskontor",
	    			 popup: '<h3>${plan}</h3><a href="${url}">Länk</a>'
	    		 }
		     }
		     

		     ],
		     
		bl: [
  	 	
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
				layerId: "wms-topo",
				displayName: "WMS-Topo (OBS! endast för test)",
				layers: "malmows:smap-mobile-bakgrundskarta-topo",
				format: 'image/jpeg',
				subdomains: ["xyz"],
				transparent: true,
				minZoom: 6,
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
		        	   init: "L.Control.Search",
		        	   options: {
							wsAcUrl: "http://xyz.malmo.se/WS/mKarta/autocomplete.ashx",  
							wsLocateUrl: "http://xyz.malmo.se/WS/mKarta/sokexakt.ashx",  
							whitespace: "%2B",
							wsOrgProj: "EPSG:3008", 
							pxDesktop: 992
					   }
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
