var ws = {
		"localhost": {
			proxy: "//localhost/cgi-bin/proxy.py?url="
		},
		"xyz.malmo.se": {
			proxy: "http://xyz.malmo.se/myproxy/proxy.py?url="
		},
		"kartor.malmo.se": {
			proxy: "http://kartor.malmo.se/cgi-bin/py/proxy.py?url="
		},
		"91.123.201.52": {
			proxy: "http://91.123.201.52/cgi-bin/proxy.py?url="
		},
		"mobile.smap.se": {
			proxy: "http://mobile.smap.se/smap-mobile/ws/proxy.py?url="
		}
};
var proxy = ws.hasOwnProperty(document.domain) ? ws[document.domain].proxy : null;



var config = {
	
	params: {
		center: [12.985,55.613],
		zoom: 15
	},

	ws: {
		"localhost": {
			proxy: proxy
		},
		"xyz.malmo.se": {
			proxy: proxy
		},
		"91.123.201.52": {
			proxy: proxy
		},
		"mobile.smap.se": {
			proxy: proxy
		}
	},

	theme: "malmo",
	
	ol: [
		{
				init: "L.GeoJSON.WFS",
				url: "http://xyz.malmo.se:8081/geoserver/wfs",
				options: {
					params: {
			 	 		typeName: "malmows:POI_VHAMN_PT"
					},
					xhrType: "GET",
					layerId: "vhamnen_pt",
					displayName: "Punkter av intresse",
					proxy: proxy,
					attribution: "Malmö stads WFS",
					inputCrs: "EPSG:4326",
					uniqueKey: "gid",
					selectable: true,
					reverseAxis: false,
					reverseAxisBbox: true,
					popup:
						'<h4>${id}: ${namn} </h4>'+
						'<div class="gp-mediaicons">${function(p) {'+
							'var out = "";'+
							'var style="margin-right:.3em;";'+
							'if (p.urlvideo) {'+
								'	out += \'<span style="\'+style+\'" class="fa fa-film fa-lg"></span>\';'+
								'}'+
							'if (p.urlsound) {'+
							'	out += \'<span style="\'+style+\'" class="fa fa-volume-up fa-lg"></span>\';'+
							'}'+
						'if (p.picture && p.picture.split(",").length > 1) {'+
						'	out += \'<span style="\'+style+\'" class="fa fa-picture-o fa-lg"></span>\';'+
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
		 	 	proxy: proxy,
		 	 	xhrType: "GET",
		 	 	attribution: "@ Skånetrafiken",
		 	 	inputCrs: "EPSG:3006",
		 	 	reverseAxis: false,
		 	 	reverseAxisBbox: true,
		 	 	selectable: true,
		 	 	popup: '<h3>Busstation: ${caption}</h3>'+
		 	 		'<div><a type="button" class="btn btn-default" target="_blank" href="http://www.skanetrafiken.se?fr_id=${externid}">Res hit</a></div>',
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
				init: "L.Control.MalmoHeader",
				options: {}
			 },
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
//				 {
//					init: "L.Control.SelectWMS",
//					options: {
//						buffer: 5
//					}
//				 },
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
//				{
//					init: "L.Control.Menu",
//					options: {}
//				},
			 {
				init: "L.Control.GuidePopup",
				options: {
					autoActivate: false,
					layerId: "vhamnen_pt",					
					dialogTitle: "${namn}",
					
					// The folder and the attribute key for fetching the filename
					useProxy: true,
					attrId: "id",
					modalContent: {
						tabIntro: "http://maja-k.com/promenad/vh/text/${urltext}",
						iconType: null,
						fullScreenIntroPic: "http://maja-k.com/promenad/vh/popup/${picture}", // Used only when clicking on a media tag, opening in fullscreen
						dialogTitle: "${namn}",
						tabMedia: null,
						tabAccess: '<div>'+
							'<p><img class="img-thumbnail" src="http://maja-k.com/promenad/vh/regisfoto/${till_bild}"></img></p>'+
							'<p><b>Parkering:</b> ${till_park}</p>'+
							'<p><b>Handikapparkering:</b> ${till_hcp}</p>'+
							'<p><b>Busshållplats:</b> ${till_buss}</p>'+
							'<p><b>Övrigt:</b> ${till_misc}</p>'+
						'</div>'
					},

					modalContentOverrides: {
						1: {
						// Hållbar utveckling i Malmö och omvärlden
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



								tabMedia: [
								{
									label: 'Om "${namn}"',
									mediaType: "audio",
									sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
									},
									{
									label: 'En intervju med skejtarna Sonja och Björn',
									mediaType: "video",
									sources: "http://www.youtube.com/embed/7Wku164Ywtg"
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



								tabMedia: [
								{
									label: 'Om "${namn}"',
									mediaType: "audio",
									sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
									},
									{
									label: 'En liten film om att bo och leva i Västra Hamnen',
									mediaType: "video",
									sources: "http://www.youtube.com/embed/LxWRgvBgGZY"
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



								tabMedia: [
								{
									label: 'Om "${namn}"',
									mediaType: "audio",
									sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
									},
									{
									label: 'Intervju med Michael Palmgren från SEA-U',
									mediaType: "video",
									sources: "http://www.youtube.com/embed/8jPGRQnqgTg"
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



								tabMedia: [
								{
									label: 'Om "${namn}"',
									mediaType: "audio",
									sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
									},
									{
									label: 'En liten film om cykling',
									mediaType: "video",
									sources: "http://www.youtube.com/embed/v6vAXIXSwh4"
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



								tabMedia: [
								{
									label: 'Om "${namn}"',
									mediaType: "audio",
									sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
									},
									{
									label: 'Från soluppgång till solnedgång ur Turning Torsos perspektiv',
									mediaType: "video",
									sources: "http://www.youtube.com/embed/VTHpQbkRj98"
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



								tabMedia: [
								{
									label: 'Om "${namn}"',
									mediaType: "audio",
									sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
									},
									{
									label: 'Intervju med stadsträdgårdsmästare Ola Melin om parker',
									mediaType: "video",
									sources: "http://www.youtube.com/embed/C8v33ErJZDE"
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



								tabMedia: [
								{
									label: 'Om "${namn}"',
									mediaType: "audio",
									sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
									},
									{
									label: 'Intervju med stadsträdgårdsmästare Ola Melin om offentlig konst',
									mediaType: "video",
									sources: "http://www.youtube.com/embed/RfjkTGbovt0"
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



								tabMedia: [
								{
									label: 'Om "${namn}"',
									mediaType: "audio",
									sources: "http://maja-k.com/promenad/vh/mp3/${urlsound}"
									},
									{
									label: 'Intervju med stadsträdgårdsmästare Ola Melin om gröna tak',
									mediaType: "video",
									sources: "http://www.youtube.com/embed/5LYTo-po6_4"
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
							27:	{
							// Varvsstaden



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
