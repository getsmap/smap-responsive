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
					  popup: '<h1>${namn}</h1><p>En popup med en bild</p><img style="width:200px;max-height:200px;" src="http://maja-k.com/promenad/vh/popup/${picture}"></img>'
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
		        		   attrTxtTitle: "namn",
		        		   attrTxtIntro: "starttext",
		        		   attrImgStart: "picture",
		        		   attrId: "namn",
		        		   
		        		   // The folder and the attribute key for fetching the filename
		        		   tabIntroFolderUrl: "http://maja-k.com/promenad/vh/text/",
		        		   attrTabIntro: "urltext",
		        		   
		           		   tabMedia: {
		        			   "Jörgen Kocks hus": {
		        				   mediaType: "audio",
		        				   sources: [
		        				             "http://xyz.malmo.se/temp/regis1330/video/video1.mp3"
		        				   ]
		        			   },
		        			   "Frans Suell staty": {
		        				   mediaType: "video",
		        				   sources: [
		        				             "http://www.youtube.com/embed/FvnGKI_rEoo"
		        				   ]
		        			   },
		        			   "\"Pitta huset\"": {
		        				   mediaType: "video",
		        				   sources: [
	        				             "//player.vimeo.com/video/62057084"
		        				   ]
		        			   },
		        			   "Stora Nygatan": {
		        				   mediaType: "image",
		        				   sources: [
										"http://xyz.malmo.se/temp/regis1330/images/img616.jpg",
										"http://xyz.malmo.se/temp/regis1330/images/img604.jpg"
		        				   ]
		        				   
		        			   },
		        			   "Stortorget": [
									{
										label: "Alla bilder från Stortorget",
										mediaType: "image",
										sources: [
										          "http://xyz.malmo.se/temp/regis1330/images/img616.jpg",
										          "http://xyz.malmo.se/temp/regis1330/images/img604.jpg"
									    ]
									},
									{
										label: "Lyssna på en häst",
										mediaType: "audio",
										sources: [
										          "http://xyz.malmo.se/temp/regis1330/audio/horse.mp3",
										          "http://xyz.malmo.se/temp/regis1330/audio/horse.ogg"
									    ]
									},
									{
										label: "Se en film från Stortorget",
										mediaType: "video",
										sources: [
										          "http://vimeo.com/62057084"
									    ]
									}
									
								]
		        		   }
		        	   }
		           }
       ]
		
		
};

// Set proxy for WFS
L.GeoJSON.WFS2.proxy = config.ws[document.domain].proxy;

// Set proxy for SelectWMS
L.Control.SelectWMS.proxy = config.ws[document.domain].proxy;