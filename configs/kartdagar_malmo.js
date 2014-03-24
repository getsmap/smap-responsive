
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
		
		mapConfig: {
			maxZoom: 17
		},
		
		ol: [
		     {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://geoserver.smap.se/geoserver/wms",
	    		 options: {
	    			 layerId: "cykelvag",
	    			 displayName: "Cykelvägar",
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
	    		 url: "http://xyz.malmo.se/geoserver/wms",
	    		 options: {
	    			 layerId: "cykelp",
	    			 displayName: "Cykelpumpar",
	    			 layers: 'malmows:GK_CYKELPUMP_PT',
	    			 format: 'image/png',
	    			 selectable: true,
	    			 transparent: true,
	    			 attribution: "@ Malmö Stadsbyggnadskontor",
	    			 popup: "<p>Typ: ${typ}</p>"
	    		 }
		     },
		     {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://xyz.malmo.se:8081/geoserver/wfs",
	    		 options: {
	    			 layerId: "malmo_dp",
	    			 displayName: "Detaljplaner",
	    			 layers: 'malmows:SMA_DP_ADP_YTOR_P',
	    			 format: 'image/png',
	    			 selectable: true,
	    			 transparent: true,
	    			 attribution: "@ Malmö Stadsbyggnadskontor",
	    			 popup: '<h3>${plan}</h3><a href="${url}">Länk</a>'
	    		 }
		     },
			 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://xyz.malmo.se:8081/geoserver/wfs",
	    		 options: {
	    			 layerId: "malmo_pdp",
	    			 displayName: "Pågende detaljplaner",
	    			 layers: 'malmows:SMA_PAGAENDE_PLANER_P',
	    			 format: 'image/png',
	    			 selectable: true,
	    			 transparent: true,
	    			 attribution: "@ Malmö Stadsbyggnadskontor",
	    			 popup: '<h3>${plan}</h3><a href="${url}">Länk</a>'
	    		 }
		     },
			 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://xyz.malmo.se:8081/geoserver/wfs",
	    		 options: {
	    			 layerId: "bibliotek",
	    			 displayName: "Bibliotek",
	    			 layers: 'malmows:POI_KULTUR_BIBLIOTEK_PT',
	    			 format: 'image/png',
	    			 selectable: true,
	    			 transparent: true,
	    			 attribution: "@ Malmö Stadsbyggnadskontor",
	    			 popup: '<h3>${objektnamn}</h3><a href="${url}">Länk</a>'
	    		 }
		     },
			 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://xyz.malmo.se:8081/geoserver/wfs",
	    		 options: {
	    			 layerId: "kom_fsk",
	    			 displayName: "Kommunala förskolor",
	    			 layers: 'malmows:V_POI_EXTENS_FORSKOLOR_KOMMUNAL_PT',
	    			 format: 'image/png',
	    			 selectable: true,
	    			 transparent: true,
	    			 attribution: "@ Malmö Stadsbyggnadskontor",
	    			 popup: '<h3>${namn}</h3><a href="${url}">Länk</a>'
	    		 }
		     },
			 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://xyz.malmo.se:8081/geoserver/wfs",
	    		 options: {
	    			 layerId: "ej_kom_fsk",
	    			 displayName: "Icke kommunala förskolor",
	    			 layers: 'malmows:V_POI_EXTENS_FORSKOLOR_PRIVAT_PT',
	    			 format: 'image/png',
	    			 selectable: true,
	    			 transparent: true,
	    			 attribution: "@ Malmö Stadsbyggnadskontor",
	    			 popup: '<h3>${namn}</h3><a href="${url}">Länk</a>'
	    		 }
		     },
			 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://xyz.malmo.se:8081/geoserver/wfs",
	    		 options: {
	    			 layerId: "temalekp",
	    			 displayName: "Temalekplatser",
	    			 layers: 'malmows:POI_FRITID_TEMALEKPLATS_PT',
	    			 format: 'image/png',
	    			 selectable: true,
	    			 transparent: true,
	    			 attribution: "@ Malmö Stadsbyggnadskontor",
	    			 popup: '<h3>${objektnamn}</h3><a href="${url}">Länk</a>'
	    		 }
		     },
			 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://xyz.malmo.se:8081/geoserver/wfs",
	    		 options: {
	    			 layerId: "lekp",
	    			 displayName: "Lekplatser",
	    			 layers: 'malmows:POI_FRITID_LEKPLATS_PT',
	    			 format: 'image/png',
	    			 selectable: true,
	    			 transparent: true,
	    			 attribution: "@ Malmö Stadsbyggnadskontor",
	    			 popup: '<h3>${objektnamn}</h3><a href="${url}">Länk</a>'
	    		 }
		     },
			 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://xyz.malmo.se:8081/geoserver/wfs",
	    		 options: {
	    			 layerId: "stadsomr",
	    			 displayName: "Stadsområden",
	    			 layers: 'malmows:SMA_STADSOMRADEN_P',
	    			 format: 'image/png',
	    			 selectable: false,
	    			 transparent: true,
	    			 attribution: "@ Malmö Stadsbyggnadskontor"
	    		 }
		     },
			 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://geoserver.smap.se/geoserver/wfs",
	    		 options: {
	    			 layerId: "offtoa",
	    			 displayName: "Offentliga toaletter",
	    			 layers: 'malmows:V_GK_TOA_PT',
	    			 format: 'image/png',
	    			 selectable: true,
	    			 transparent: true,
	    			 attribution: "@ Malmö Stadsbyggnadskontor",
	    			 popup: "<h3>${namn}</h3><p>Avgift: ${avgift}</p><p>Handikapptoalett: ${handikapptoalett}</p><p>Skötbord: ${skotbord}</p>"
	    		 }
		     },
			 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://geoserver.smap.se/geoserver/wfs",
	    		 options: {
	    			 layerId: "hallp",
	    			 displayName: "Hållplatser",
	    			 layers: 'commonws:skanetrafiken3008',
	    			 format: 'image/png',
	    			 selectable: true,
	    			 transparent: true,
	    			 attribution: "@ Malmö Stadsbyggnadskontor",
	    			 popup: '<h3>${caption}</h3><a href="http://www.skanetrafiken.se">www.skanetrafiken.se</a>'
	    		 }
		     },
			 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://xyz.malmo.se:8081/geoserver/wfs",
	    		 options: {
	    			 layerId: "bad",
	    			 displayName: "Bad",
	    			 layers: 'malmows:POI_FRITID_BAD_PT',
	    			 format: 'image/png',
	    			 selectable: true,
	    			 transparent: true,
	    			 attribution: "@ Malmö Stadsbyggnadskontor",
	    			 popup: '<h3>${objektnamn}</h3><p>${objekttyp3}</p><a href="${url}">Länk</a>'
	    		 }
		     },
			 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://xyz.malmo.se:8081/geoserver/wfs",
	    		 options: {
	    			 layerId: "ip",
	    			 displayName: "Idrottsplatser",
	    			 layers: 'malmows:POI_FRITID_IDROTTSPLATS_PT',
	    			 format: 'image/png',
	    			 selectable: true,
	    			 transparent: true,
	    			 attribution: "@ Malmö Stadsbyggnadskontor",
	    			 popup: '<h3>${objektnamn}</h3><p>${objekttyp2}</p><a href="${url}">Länk</a>'
	    		 }
		     },
			 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://xyz.malmo.se:8081/geoserver/wfs",
	    		 options: {
	    			 layerId: "sporth",
	    			 displayName: "Sporthallar",
	    			 layers: 'malmows:POI_FRITID_SPORTHALL_PT',
	    			 format: 'image/png',
	    			 selectable: true,
	    			 transparent: true,
	    			 attribution: "@ Malmö Stadsbyggnadskontor",
	    			 popup: '<h3>${objektnamn}</h3><p>${objekttyp3}</p><a href="${url}">Länk</a>'
	    		 }
		     },
			 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://xyz.malmo.se:8081/geoserver/wfs",
	    		 options: {
	    			 layerId: "ish",
	    			 displayName: "Ishallar",
	    			 layers: 'malmows:POI_FRITID_ISHALL_PT',
	    			 format: 'image/png',
	    			 selectable: true,
	    			 transparent: true,
	    			 attribution: "@ Malmö Stadsbyggnadskontor",
	    			 popup: '<h3>${objektnamn}</h3><p>${objekttyp2}</p><a href="${url}">Länk</a>'
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
		}
		
		,
				
		{
			init: "L.TileLayer.WMS",
			url: 'http://xyz.malmo.se/geoserver/gwc/service/wms',  // gwc/service/
			options: {
				layerId: "fotokarta",
				displayName: "Malmö fotokarta",
				layers: "malmows:ortofoto_2012",
				format: 'image/jpeg',
				subdomains: ["xyz"],
				transparent: false,
				minZoom: 6,
				maxZoom: 18,
				tiled: false
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
