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
					  attribution: "Malmö stads WFS",
					  params: {
		    	 			typeName: "malmows:GUIDE_VHAMNEN_PT",
							version: "1.1.0",
							maxFeatures: 10000,
							format: "text/geojson",
							outputFormat: "json"
			 		  },
			 		  reverseAxis: false,
			 		  reverseAxisBbox: true,
			 		  uniqueKey: "id",
			 		  selectable: true,
					  inputCrs: "EPSG:4326",
					  popup: 
						  '<div>${function(p) {'+
							    'var out = "";'+
							    'var style="margin-right:.3em;";'+
							    'if (p.urlvideo) {'+
							    '    out += \'<span style="\'+style+\'" class="fa fa-video-camera fa-2x"></span>\';'+
							    '}'+
							    'if (p.urlsound) {'+
							    '    out += \'<span style="\'+style+\'" class="fa fa-volume-up fa-2x"></span>\';'+
							    '}'+
							    'if (p.picture && p.picture.split(",").length > 1) {'+
							    '    out += \'<span style="\'+style+\'" class="fa fa-picture-o fa-2x"></span>\';'+
							    '}'+
							    'return out;'+
							'}'+
						  '}</div>'+
						  
						  '<h4>${id}: ${namn} </h4><img style="width:200px;max-height:200px;" src="http://maja-k.com/promenad/vh/popup/${picture}"></img>'
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
		        		   useProxy: true,
		        		   
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
		           					iconType: "video",
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
		           					iconType: "video",
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
		           					iconType: "video",
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
		           					iconType: "video",
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
		           					iconType: "video",
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
		           					iconType: "video",
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
		           					iconType: "video",
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
		           					iconType: "video",
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