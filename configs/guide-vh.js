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
	    			 layerId: "gangstig",
	    			 displayName: "Gångstig",
	    			 layers: 'sandboxws:regisln',
	    			 format: 'image/png',
	    			 selectable: true,
	    			 transparent: true,
	    			 attribution: "@ Malmö Stadsbyggnadskontor",
	    			 popup: "<h3>${_displayName}</h3><p>Beläggning: ${belaggning}</p><p>${shape_leng}</p>"
	    		 }
		     },
		     {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://geoserver.smap.se/geoserver/wms",
	    		 options: {
	    			 layerId: "gangstig2",
	    			 displayName: "Gångstig2",
	    			 layers: 'sandboxws:regisln',
	    			 format: 'image/png',
	    			 selectable: true,
	    			 transparent: true,
	    			 attribution: "@ Malmö Stadsbyggnadskontor",
	    			 popup: "<h3>${_displayName}</h3><p>Beläggning: ${belaggning}</p><p>${shape_leng}</p>"
	    		 }
		     },
		     {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://geoserver.smap.se/geoserver/wms",
	    		 options: {
	    			 layerId: "cykelvag",
	    			 displayName: "Cykelväg",
	    			 layers: 'malmows:GK_CYKELVAG_L',
	    			 format: 'image/png',
	    			 selectable: true,
	    			 transparent: true,
	    			 attribution: "@ Malmö Stadsbyggnadskontor",
	    			 popup: "<h3>${_displayName}</h3><p>Typ: ${typ}</p><p>Geom: ${geom}</p>"
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
					  popup: '<h1>${namn}</h1><p>En popup med en bild</p><img style="width:200px;max-height:200px;" src="${picture}"></img>',
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
				layerId: "malmotile",
				displayName: "Malmö karta",
				attribution: "© Malmö Stadsbyggnadskontor",
				minZoom: 6,
				maxZoom: 18,
				tms: true
			}
		}
//	    {
//			init: "L.TileLayer",
//			url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//			options: {
//				layerId: "osm",
//				displayName: "OSM",
//				attribution: '<span>© OpenStreetMap contributors</span>&nbsp;|&nbsp;<span>Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png"></span>',
//				maxZoom: 18
//			}
//		}
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
//		           {
//		        	   init: "L.Control.GuideIntroScreen",
//		        	   options: {
//		        		   autoActivate: false
//		        	   }
//		           },
		           {
		        	   init: "L.Control.GuidePopup",
		        	   options: {
		        		   autoActivate: false,
		        		   layerId: "intressepunkter",
		        		   attrTxtTitle: "namn",
		        		   attrTxtIntro: "starttext",
		        		   attrImgStart: "picture",
		        		   attrId: "namn",
		        		   
		        		   media: {
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