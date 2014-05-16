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
				  init: "L.GeoJSON.WFS",
				  url: "http://xyz.malmo.se:8081/geoserver/wfs",
				  options: {
					  layerId: "vhamnen_pt",
					  displayName: "Punkter av intresse",
					  params: {
				    	 typeName: "malmows:POI_VHAMN_PT"
		     		  },
					  attribution: "Malmö stads WFS",
					  inputCrs: "EPSG:4326",
					  uniqueKey: "gid",
					  selectable: true,
					  reverseAxis: false,
					  reverseAxisBbox: false,
					  popup:
						  '<h4>${id}: ${namn} </h4>'+
  						'<div class="gp-mediaicons">${function(p) {'+
    							'var out = "";'+
    							'var style="margin-right:.3em;";'+
    							'if (p.urlvideo) {'+
    								'    out += \'<span style="\'+style+\'" class="fa fa-film fa-lg"></span>\';'+
    								'}'+
    							'if (p.urlsound) {'+
    							'    out += \'<span style="\'+style+\'" class="fa fa-volume-up fa-lg"></span>\';'+
    							'}'+
    						'if (p.picture && p.picture.split(",").length > 1) {'+
    						'    out += \'<span style="\'+style+\'" class="fa fa-picture-o fa-lg"></span>\';'+
    						'}'+
    					'return out;'+
						'}'+
  					'}</div>'+
	  				'<img style="width:200px;max-height:200px;margin-top: 1em;" src="http://maja-k.com/promenad/vh/popup/${picture}"></img>'
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
		    			 selectable: false,
		    			 transparent: true,
		    			 attribution: "@ Malmö Stadsbyggnadskontor",
		    			 popup: "<h3>${_displayName}</h3><p>Typ: ${typ}</p><p>Geom: ${geom}</p>"
		    		 }
			     },
			     {
		    		 init: "L.TileLayer.WMS",
		    		 url: "http://xyz.malmo.se:8081/geoserver/wms",
		    		 options: {
		    			 layerId: "cykelpump",
		    			 displayName: "Cykelpumpar",
		    			 layers: 'malmows:GK_CYKELPUMP_PT',
		    			 format: 'image/png',
		    			 selectable: false,
		    			 transparent: true,
		    			 attribution: "@ Malmö Stadsbyggnadskontor",
		    			 popup: "<h3>${_displayName}</h3><p>Typ: ${typ}</p><p>Geom: ${geom}</p>"
		    		 }
			     },
		  		
		  		{
			    	 init: "L.GeoJSON.WFS",
			    	 url: "http://geoserver.smap.se/geoserver/wfs",
			    	 options: {
			    	 	layerId: "busshallplatser",
			    	 	displayName: "Busshållplatser",
			    	 	attribution: "@ Skånetrafiken",
			    	 	inputCrs: "EPSG:3006",
			    	 	reverseAxis: false,
			    	 	reverseAxisBbox: true,
			    	 	selectable: true,
			    	 	popup: '<h3>Busstation: ${caption}</h3>'+
			    	 		'<div><a type="button" class="btn btn-default" target="_blank" href="http://www.resiskane.se/start?fr_id=${externid}">Res hit</a></div>',
			    	 	uniqueKey: "externid",
			    	 	params: {
				    	 	typeName: "commonws:skanetrafiken3006"
//							version: "1.1.0",
//							maxFeatures: 10000,
//							format: "text/geojson",
//							outputFormat: "json"
			     		},
			     		style: {
	     					icon: {
				     			iconUrl: "img/legend/hallplats.png",
			     				iconSize: [19, 19],
			     				iconAnchor: [10, 10],
			     				popupAnchor: [0, -3]
			     			}
			     		},
			     		selectStyle: {
			     			radius: 8,
			     		    fillColor: "#0FF",
			     		    color: "#0FF",
			     		    weight: 1,
			     		    opacity: 1,
			     		    fillOpacity: 0.5
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
		        	   init: "L.Control.SelectWMS",
		        	   options: {
		        		   buffer: 5
		        	   }
		           },
//		           {
//		        	   init: "L.Control.SelectWMS",
//		        	   options: {
//		        		   buffer: 5
//		        	   }
//		           },
		           {
		        	   init: "L.Control.SelectVector",
		        	   options: {
		        		   buffer: 5
		        	   }
		           },
		           {
		        	   init: "L.Control.Zoombar",
		        	   options: {}
		           },
		           {
		        	   init: "L.Control.Geolocate",
		        	   options: {}
		           },
		           {
		        	   init: "L.Control.ShareLink",
		        	   options: {
		        		   addToMenu: false
		        	   }
		           },
		           {
		        	   init: "L.Control.GuideIntroScreen",
		        	   options: {
		        		   autoActivate: false
		        	   }
		           },
//                   {
//                       init: "L.Control.Menu",
//                       options: {}
//                   },
		           {
		        	   init: "L.Control.GuidePopup",
		        	   options: {
		        		   autoActivate: false,
		        		   layerId: "vhamnen_pt",
		        		   
		        		   dialogTitle: "${namn}",
		        		   
		        		   // The folder and the attribute key for fetching the filename
		        		   tabIntroFolderUrl: "http://maja-k.com/promenad/vh/text/${urltext}",
		        		   useProxy: true,
		        		   
		        		   tabAccess: '<div>'+
				   				'<p><img class="img-thumbnail" src="http://maja-k.com/promenad/vh/regisfoto/${till_bild}"></img></p>'+
								'<p><b>Parkering:</b> ${till_park}</p>'+
								'<p><b>Handikapparkering:</b> ${till_hcp}</p>'+
								'<p><b>Busshållplats:</b> ${till_buss}</p>'+
								'<p><b>Övrigt:</b> ${till_misc}</p>'+
							'</div>',
		        		   
		        		   attrId: "id",
		        		   data: {
		        	   			1: {
		        	   			// Hållbar utveckling i Malmö och omvärlden
		        	   				iconType: null,
		        	   				dialogTitle: "${namn}",
		        	   				tabIntro: "http://maja-k.com/promenad/vh/text/${urltext}",
		        	   				tabMedia: [
		        	   					{
		        	   						label: 'Om "${namn}"',
		        	   						mediaType: "audio",
		        	   						sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
		           					},
			           					{
			        	   					label: "Introduktion till Västra Hamnen-spåret",
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/00_Introtext_VO.mp3"
										}
									]
		           				},
		           				2: {
		           				// Lärande för hållbar utveckling
		           					iconType: null,
		           					dialogTitle: "${namn}",
		           					tabIntro: "http://maja-k.com/promenad/vh/text/${urltext}",
		        	   				tabMedia: [
			        	   				{
			        	   					label: 'Om "${namn}"',
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
			           					},
			           					{
			        	   					label: "Introduktion till Västra Hamnen-spåret",
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/00_Introtext_VO.mp3"
			           					}
			           					
		           					]
		           				},
		           				3: {
		           				// Västra hamnens historia
		           					iconType: null,
		           					dialogTitle: "${namn}",
		           					tabIntro: "http://maja-k.com/promenad/vh/text/${urltext}",
		        	   				tabMedia: [
			        	   				{
			        	   					label: 'Om "${namn}"',
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
			           					},
			           					{
			        	   					label: "Introduktion till Västra Hamnen-spåret",
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/00_Introtext_VO.mp3"
			           					}
			           					
		           					]
		           				},
		           				4: {
		           				// Ekonomisk hållbarhet
		           					iconType: null,
		           					dialogTitle: "${namn}",
		           					tabIntro: "http://maja-k.com/promenad/vh/text/${urltext}",
		        	   				tabMedia: [
			        	   				{
			        	   					label: 'Om "${namn}"',
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
			           					},
			           					{
			        	   					label: "Introduktion till Västra Hamnen-spåret",
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/00_Introtext_VO.mp3"
			           					}
			           					
		           					]
		           				},
		           				5: {
		           				// Social Hållbarhet
		           					iconType: null,
		           					dialogTitle: "${namn}",
		           					tabIntro: "http://maja-k.com/promenad/vh/text/${urltext}",
		        	   				tabMedia: [
			        	   				{
			        	   					label: 'Om "${namn}"',
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
			           					},
			           					{
			        	   					label: 'Se en liten film om "${namn}"',
			        	   					mediaType: "video",
			        	   					sources: "http://www.youtube.com/embed/f0r_JsnIRJY"
			           					},
			           					{
			        	   					label: "Introduktion till Västra Hamnen-spåret",
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/00_Introtext_VO.mp3"
			           					}
			           					
		           					]
		           				},
		           				6: {
		           				// Fullriggaren och Kappseglaren
		        	   				iconType: null,
		        	   				dialogTitle: "${namn}",
		        	   				tabIntro: "http://maja-k.com/promenad/vh/text/${urltext}",
		        	   				tabMedia: [
		        	   					{
		        	   						label: 'Om "${namn}"',
		        	   						mediaType: "audio",
		        	   						sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
		           					},
			           					{
			        	   					label: "Introduktion till Västra Hamnen-spåret",
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/00_Introtext_VO.mp3"
										}
									]
		           				},
		           				7: {
		           				// Varvsparken och ekologisk lekplats
		           					iconType: null,
		           					dialogTitle: "${namn}",
		           					tabIntro: "http://maja-k.com/promenad/vh/text/${urltext}",
		        	   				tabMedia: [
			        	   				{
			        	   					label: 'Om "${namn}"',
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
			           					},
			           					{
			        	   					label: 'Se en liten film om "${namn}"',
			        	   					mediaType: "video",
			        	   					sources: "http://www.youtube.com/embed/wWJHWMpHvoc"
			           					},
			           					{
			        	   					label: "Introduktion till Västra Hamnen-spåret",
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/00_Introtext_VO.mp3"
			           					}
			           					
		           					]
		           				},
		           				8: {
		           				// Det goda samtalet
		           					iconType: null,
		           					dialogTitle: "${namn}",
		           					tabIntro: "http://maja-k.com/promenad/vh/text/${urltext}",
		        	   				tabMedia: [
			        	   				{
			        	   					label: 'Om "${namn}"',
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
			           					},
			           					{
			        	   					label: "Introduktion till Västra Hamnen-spåret",
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/00_Introtext_VO.mp3"
			           					}
			           					
		           					]
		           				},
		           				9: {
		           				// Havet
		           					iconType: null,
		           					dialogTitle: "${namn}",
		           					tabIntro: "http://maja-k.com/promenad/vh/text/${urltext}",
		        	   				tabMedia: [
			        	   				{
			        	   					label: 'Om "${namn}"',
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
			           					},
			           					{
			        	   					label: 'Se en liten film om "${namn}"',
			        	   					mediaType: "video",
			        	   					sources: "http://player.vimeo.com/video/24584160"
			           					},
			           					{
			        	   					label: "Introduktion till Västra Hamnen-spåret",
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/00_Introtext_VO.mp3"
			           					}
			           					
		           					]
		           				},
		           				10: {
		           				// Cykling
		           					iconType: null,
		           					dialogTitle: "${namn}",
		           					tabIntro: "http://maja-k.com/promenad/vh/text/${urltext}",
		        	   				tabMedia: [
			        	   				{
			        	   					label: 'Om "${namn}"',
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
			           					},
			           					{
			        	   					label: 'Se en liten film om "${namn}"',
			        	   					mediaType: "video",
			        	   					sources: "http://www.youtube.com/embed/wWJHWMpHvoc"
			           					},
			           					{
			        	   					label: "Introduktion till Västra Hamnen-spåret",
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/00_Introtext_VO.mp3"
			           					}
			           					
		           					]
		           				},
		           				11: {
		           				// Turning Torso
		           					iconType: null,
		           					dialogTitle: "${namn}",
		           					tabIntro: "http://maja-k.com/promenad/vh/text/${urltext}",
		        	   				tabMedia: [
			        	   				{
			        	   					label: 'Om "${namn}"',
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
			           					},
			           					{
			        	   					label: 'Se en liten film om "${namn}"',
			        	   					mediaType: "video",
			        	   					sources: "http://www.youtube.com/embed/wWJHWMpHvoc"
			           					},
			           					{
			        	   					label: "Introduktion till Västra Hamnen-spåret",
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/00_Introtext_VO.mp3"
			           					}
			           					
		           					]
		           				},
		           				12: {
		           				// Kollektivtrafik
		           					iconType: null,
		           					dialogTitle: "${namn}",
		           					tabIntro: "http://maja-k.com/promenad/vh/text/${urltext}",
		        	   				tabMedia: [
			        	   				{
			        	   					label: 'Om "${namn}"',
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
			           					},
			           					{
			        	   					label: "Introduktion till Västra Hamnen-spåret",
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/00_Introtext_VO.mp3"
			           					}
			           					
		           					]
		           				},
		           				13: {
		           				// Marksanering
		           					iconType: null,
		           					dialogTitle: "${namn}",
		           					tabIntro: "http://maja-k.com/promenad/vh/text/${urltext}",
		        	   				tabMedia: [
			        	   				{
			        	   					label: 'Om "${namn}"',
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
			           					},
			           					{
			        	   					label: "Introduktion till Västra Hamnen-spåret",
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/00_Introtext_VO.mp3"
			           					}
			           					
		           					]
		           				},
		           				14: {
		           				// Parkerna
		           					iconType: null,
		           					dialogTitle: "${namn}",
		           					tabIntro: "http://maja-k.com/promenad/vh/text/${urltext}",
		        	   				tabMedia: [
			        	   				{
			        	   					label: 'Om "${namn}"',
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
			           					},
			           					{
			        	   					label: 'Se en liten film om "${namn}"',
			        	   					mediaType: "video",
			        	   					sources: "http://www.youtube.com/embed/WnEJ5SmJtm0"
			           					},
			           					{
			        	   					label: "Introduktion till Västra Hamnen-spåret",
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/00_Introtext_VO.mp3"
			           					}
			           					
		           					]
		           				},
		           				15: {
		           				//Skanskas trähus
		           					iconType: null,
		           					dialogTitle: "${namn}",
		           					tabIntro: "http://maja-k.com/promenad/vh/text/${urltext}",
		        	   				tabMedia: [
			        	   				{
			        	   					label: 'Om "${namn}"',
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
			           					},
			           					{
			        	   					label: "Introduktion till Västra Hamnen-spåret",
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/00_Introtext_VO.mp3"
			           					}
			           					
		           					]
		           				},
		           				16: {
		           				// Arkitektur
		        	   				iconType: null,
		        	   				dialogTitle: "${namn}",
		        	   				tabIntro: "http://maja-k.com/promenad/vh/text/${urltext}",
		        	   				tabMedia: [
		        	   					{
		        	   						label: 'Om "${namn}"',
		        	   						mediaType: "audio",
		        	   						sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
		           					},
			           					{
			        	   					label: "Introduktion till Västra Hamnen-spåret",
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/00_Introtext_VO.mp3"
										}
									]
		           				},
		           				17: {
		           				// Energisnåla hus
		           					iconType: null,
		           					dialogTitle: "${namn}",
		           					tabIntro: "http://maja-k.com/promenad/vh/text/${urltext}",
		        	   				tabMedia: [
			        	   				{
			        	   					label: 'Om "${namn}"',
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
			           					},
			           					{
			        	   					label: "Introduktion till Västra Hamnen-spåret",
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/00_Introtext_VO.mp3"
			           					}
			           					
		           					]
		           				},
		           				18: {
		           				// 100 procent lokalt förnybar energi
		           					iconType: null,
		           					dialogTitle: "${namn}",
		           					tabIntro: "http://maja-k.com/promenad/vh/text/${urltext}",
		        	   				tabMedia: [
			        	   				{
			        	   					label: 'Om "${namn}"',
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
			           					},
			           					{
			        	   					label: "Introduktion till Västra Hamnen-spåret",
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/00_Introtext_VO.mp3"
			           					}
			           					
		           					]
		           				},
		           				19: {
		           				// Konst
		           					iconType: null,
		           					dialogTitle: "${namn}",
		           					tabIntro: "http://maja-k.com/promenad/vh/text/${urltext}",
		        	   				tabMedia: [
			        	   				{
			        	   					label: 'Om "${namn}"',
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
			           					},
			           					{
			        	   					label: 'Se en liten film om "${namn}"',
			        	   					mediaType: "video",
			        	   					sources: "http://www.youtube.com/embed/wWJHWMpHvoc"
			           					},
			           					{
			        	   					label: "Introduktion till Västra Hamnen-spåret",
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/00_Introtext_VO.mp3"
			           					}
			           					
		           					]
		           				},
		           				20: {
		           				// Det gröna
		           					iconType: null,
		           					dialogTitle: "${namn}",
		           					tabIntro: "http://maja-k.com/promenad/vh/text/${urltext}",
		        	   				tabMedia: [
			        	   				{
			        	   					label: 'Om "${namn}"',
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
			           					},
			           					{
			        	   					label: 'Se en liten film om "${namn}"',
			        	   					mediaType: "video",
			        	   					sources: "http://www.youtube.com/embed/wWJHWMpHvoc"
			           					},
			           					{
			        	   					label: "Introduktion till Västra Hamnen-spåret",
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/00_Introtext_VO.mp3"
			           					}
			           					
		           					]
		           				},
		           				21: {
		           				// Öppet dagvattensystem
		        	   				iconType: null,
		        	   				dialogTitle: "${namn}",
		        	   				tabIntro: "http://maja-k.com/promenad/vh/text/${urltext}",
		        	   				tabMedia: [
		        	   					{
		        	   						label: 'Om "${namn}"',
		        	   						mediaType: "audio",
		        	   						sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
		           					},
			           					{
			        	   					label: "Introduktion till Västra Hamnen-spåret",
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/00_Introtext_VO.mp3"
										}
									]
		           				},
		           				22: {
		           				// Rättvist, ekologiskt och nära
		           					iconType: null,
		           					dialogTitle: "${namn}",
		           					tabIntro: "http://maja-k.com/promenad/vh/text/${urltext}",
		        	   				tabMedia: [
			        	   				{
			        	   					label: 'Om "${namn}"',
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
			           					},
			           					{
			        	   					label: "Introduktion till Västra Hamnen-spåret",
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/00_Introtext_VO.mp3"
			           					}
			           					
		           					]
		           				},
		           				23: {
		           				// Sol, vind och vatten
		           					iconType: null,
		           					dialogTitle: "${namn}",
		           					tabIntro: "http://maja-k.com/promenad/vh/text/${urltext}",
		        	   				tabMedia: [
			        	   				{
			        	   					label: 'Om "${namn}"',
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
			           					},
			           					{
			        	   					label: "Introduktion till Västra Hamnen-spåret",
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/00_Introtext_VO.mp3"
			           					}
			           					
		           					]
		           				},
		           				24: {
		           				//Kretslopp
		           					iconType: null,
		           					dialogTitle: "${namn}",
		           					tabIntro: "http://maja-k.com/promenad/vh/text/${urltext}",
		        	   				tabMedia: [
			        	   				{
			        	   					label: 'Om "${namn}"',
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
			           					},
			           					{
			        	   					label: "Introduktion till Västra Hamnen-spåret",
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/00_Introtext_VO.mp3"
			           					}
			           					
		           					]
		           				},
		           				25: {
		           				// Kockum Fritid
		           					iconType: null,
		           					dialogTitle: "${namn}",
		           					tabIntro: "http://maja-k.com/promenad/vh/text/${urltext}",
		        	   				tabMedia: [
			        	   				{
			        	   					label: 'Om "${namn}"',
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
			           					},
			           					{
			        	   					label: "Introduktion till Västra Hamnen-spåret",
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/00_Introtext_VO.mp3"
			           					}
			           					
		           					]
		           				},
		           				26: {
		           				// Masthusen
		        	   				iconType: null,
		        	   				dialogTitle: "${namn}",
		        	   				tabIntro: "http://maja-k.com/promenad/vh/text/${urltext}",
		        	   				tabMedia: [
		        	   					{
		        	   						label: 'Om "${namn}"',
		        	   						mediaType: "audio",
		        	   						sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
		           					},
			           					{
			        	   					label: "Introduktion till Västra Hamnen-spåret",
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/00_Introtext_VO.mp3"
										}
									]
		           				},
		           				27:  {
		           				// Varvsstaden
		           					iconType: null,
		           					dialogTitle: "${namn}",
		           					tabIntro: "http://maja-k.com/promenad/vh/text/${urltext}",
		        	   				tabMedia: [
			        	   				{
			        	   					label: 'Om "${namn}"',
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
			           					},
			           					{
			        	   					label: "Introduktion till Västra Hamnen-spåret",
			        	   					mediaType: "audio",
			        	   					sources: "http://maja-k.com/promenad/vh/mp3/00_Introtext_VO.mp3"
			           					}
			           					
		           					]
		           				}
		           		   }
		        		   
		        	   }
		           }
       ]
		
		
};

// Set proxy for WFS
L.GeoJSON.WFS.proxy = config.ws[document.domain].proxy;

// Set proxy for SelectWMS
L.Control.SelectWMS.proxy = config.ws[document.domain].proxy;