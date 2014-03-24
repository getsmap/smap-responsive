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
				  init: "L.GeoJSON.WFS2",
				  url: "http://xyz.malmo.se:8081/geoserver/wfs",
				  options: {
					  layerId: "vhamnen_pt",
					  displayName: "Punkter av intresse",
					  featureType: "malmows:GUIDE_VHAMNEN_PT",
					  attribution: "Malmö stads WFS",
					  inputCrs: "EPSG:4326",
					  reverseAxis: true,
					  popup: '<h1>${namn}: ${id}</h1><p>En popup med en bild</p><img style="width:200px;max-height:200px;" src="http://maja-k.com/promenad/vh/popup/${picture}"></img>'
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
		],
		
		plugins: [
		           {
		        	   init: "L.Control.Scale",
		        	   options: {
		        		   imperial: false
		        	   }
		           },
		           {
		        	   init: "L.Control.SelectWMS",
		        	   options: {
		        		   buffer: 5
		        	   }
		           },
		           {
		        	   init: "L.Control.Geolocate",
		        	   options: {}
		           },
		           {
		        	   init: "L.Control.GuideIntroScreen",
		        	   options: {
		        		   autoActivate: false
		        	   }
		           },
		           {
		        	   init: "L.Control.GuidePopup",
		        	   options: {
		        		   autoActivate: false,
		        		   layerId: "vhamnen_pt",
		        		   
		        		   dialogTitle: "${namn}",
		        		   
		        		   // The folder and the attribute key for fetching the filename
		        		   tabIntroFolderUrl: "http://maja-k.com/promenad/vh/text/${urltext}",
		        		   useProxy: false,
		        		   
		        		   attrId: "id",
		        		   data: {
		        	   			1: {
		        	   				dialogTitle: "${namn}",
		        	   				tabIntro: "plugins/GuidePopup/testFolder/${urltext}",
		        	   				tabMedia: {
		        	   					mediaType: "audio",
		        	   					sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
		           					}
		           				},
		           				2: {
		           					dialogTitle: "${namn}",
		           					tabIntro: "plugins/GuidePopup/testFolder/${urltext}",
		        	   				tabMedia: [
			        	   				{
			        	   					label: "Lyssna på ljud",
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
			           					},
			           					{
			           						label: "Se på en bild",
			        	   					mediaType: "image",
			        	   					sources: "http://maja-k.com/promenad/vh/popup/${picture}"
			           					}
		           					]
		           				},
		           				3: {
		           					dialogTitle: "${namn}",
		        	   				tabIntro: "http://maja-k.com/promenad/vh/text/${urltext}",
		        	   				tabMedia: {
		        	   					mediaType: "audio",
		        	   					sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
		           					}
		           				},
		           				4: {
		           					dialogTitle: "${namn}",
		        	   				tabIntro: "${urltext}",
		        	   				tabMedia: {
		        	   					mediaType: "audio",
		        	   					sources: "${urlsound}"
		           					}
		           				},
		           				5: {
		           					dialogTitle: "${namn}",
		        	   				tabIntro: "${urltext}",
		        	   				tabMedia: {
		        	   					mediaType: "audio",
		        	   					sources: "${urlsound}"
		           					}
		           				},
		           				6: {
		           					dialogTitle: "${namn}",
		        	   				tabIntro: "${urltext}",
		        	   				tabMedia: {
		        	   					mediaType: "audio",
		        	   					sources: "${urlsound}"
		           					}
		           				}
		           		   }
		        		   
		        	   }
		           }
       ]
		
		
};

// Set proxy for WFS
L.GeoJSON.WFS2.proxy = config.ws[document.domain].proxy;

// Set proxy for SelectWMS
L.Control.SelectWMS.proxy = config.ws[document.domain].proxy;