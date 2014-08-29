var ws = {
		"localhost": {
			proxy: "http://localhost/cgi-bin/proxy.py?url="
		},
		"xyz.malmo.se": {
			proxy: "http://xyz.malmo.se/myproxy/proxy.py?url="
		},
		"mobile.smap.se": {
			proxy: "http://mobile.smap.se/smap-mobile/ws/proxy.py?url="
		},
		"91.123.201.52": {
			proxy: "http://localhost/cgi-bin/proxy.py?url="
		},
		"kartor.helsingborg.se": {
			proxy: "http://kartor.helsingborg.se/cgi-bin/proxy.py?url="
		}
};

var config = {

		params:{
			center: [14.0, 56.0],
			zoom: 8
		},

		ws: ws,
		
		ol: [
			{
				init: "L.GeoJSON.WFS",
				url: "http://91.123.201.52/cgi-bin/cultmap/getGeoData.py",
				options: {
					layerId: "Kulturen",
					proxy: ws[document.domain].proxy,
					displayName: "Kulturen",
					category: ["Museum"],
					attribution: "© Regis",
					inputCrs: "EPSG:4326",
					reverseAxis: false,
					reverseAxisBbox: false,
					selectable: true,
					popup: '<h4>${txt_name}</h4><p>${}txt_access</p><img src="http://xyz.malmo.se/rest/resources/cultmap/${txt_pic}" style="width:200px;max-height:300px;"></img><br/>' +
							'<a href="${txt_link}" target="_blank">Länk</a>',
					uniqueKey: "id",
					params: {
						q: "Kulturen"
					},
					style: {
						radius: 8,
						fillColor: "#F00",
						color: "#00F",
						weight: 2,
						opacity: 1,
						fillOpacity: 0.8
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
			},
			{
				init: "L.GeoJSON.WFS",
				url: "http://91.123.201.52/cgi-bin/cultmap/getGeoData.py",
				options: {
					layerId: "Fornminne",
					proxy: ws[document.domain].proxy,
					displayName: "Fornminne",
					category: ["Uråldriga ting"],
					attribution: "© Regis",
					inputCrs: "EPSG:4326",
					reverseAxis: false,
					reverseAxisBbox: false,
					selectable: true,
					popup: '<h4>${txt_name}</h4><p>${}txt_access</p><img src="http://xyz.malmo.se/rest/resources/cultmap/${txt_pic}" style="width:200px;max-height:300px;"></img><br/>' +
							'<a href="${txt_link}" target="_blank">Länk</a>',
					uniqueKey: "id",
					params: {
						q: "Fornminne"
					},
					style: {
						radius: 8,
						fillColor: "#F00",
						color: "#00F",
						weight: 2,
						opacity: 1,
						fillOpacity: 0.8
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
			},
			{
					init: "L.GeoJSON.WFS",
					url: "http://91.123.201.52/cgi-bin/cultmap/getGeoData.py",
					options: {
						layerId: "Konst",
						displayName: "Konst",
						proxy: ws[document.domain].proxy,
						attribution: "© Regis",
						category: ["Konst"],
						inputCrs: "EPSG:4326",
						reverseAxis: false,
						reverseAxisBbox: false,
						selectable: true,
						popup: '<h4>${txt_name}</h4><p>${}txt_access</p><img src="http://xyz.malmo.se/rest/resources/cultmap/${txt_pic}" style="width:200px;max-height:300px;"></img><br/>' +
								'<a href="${txt_link}" target="_blank">Länk</a>',
						uniqueKey: "id",
						params: {
							q: "Konst"
						},
						style: {
							radius: 8,
							fillColor: "#F00",
							color: "#00F",
							weight: 2,
							opacity: 1,
							fillOpacity: 0.8
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
			},
			{
					init: "L.GeoJSON.WFS",
					url: "http://91.123.201.52/cgi-bin/cultmap/getGeoData.py",  //"http://localhost/cherrypy/cultmap/getdata",
					options: {
						// xhrType: "GET",
						layerId: "Mölla",
						proxy: ws[document.domain].proxy,
						displayName: "Mölla",
						category: ["Uråldriga ting"],
						attribution: "© Regis",
						inputCrs: "EPSG:4326",
						reverseAxis: false,
						reverseAxisBbox: false,
						selectable: true,
						popup: '<h4>${txt_name}</h4><p>${}txt_access</p><img src="http://xyz.malmo.se/rest/resources/cultmap/${txt_pic}" style="width:200px;max-height:300px;"></img><br/>' +
								'<a href="${txt_link}" target="_blank">Länk</a>',
						uniqueKey: "id",
						params: {
							q: "Mölla"
						}
						// style: {
						// 	radius: 8,
						// 	fillColor: "#ff7800",
						// 	color: "#000",
						// 	weight: 1,
						// 	opacity: 1,
						// 	fillOpacity: 0.8
						// },
						// selectStyle: {
						// 	radius: 8,
						// 	fillColor: "#0FF",
						// 	color: "#0FF",
						// 	weight: 1,
						// 	opacity: 1,
						// 	fillOpacity: 0.5
						// }
					}
				},
				{
					init: "L.GeoJSON.WFS",
					url: "http://91.123.201.52/cgi-bin/cultmap/getGeoData.py",  //"http://localhost/cherrypy/cultmap/getdata",
					options: {
						// xhrType: "GET",
						layerId: "Sjöfartsmuseum",
						proxy: ws[document.domain].proxy,
						displayName: "Sjöfartsmuseum",
						category: ["Museum"],
						attribution: "© Regis",
						inputCrs: "EPSG:4326",
						reverseAxis: false,
						reverseAxisBbox: false,
						selectable: true,
						popup: '<h4>${txt_name}</h4><p>${}txt_access</p><img src="http://xyz.malmo.se/rest/resources/cultmap/${txt_pic}" style="width:200px;max-height:300px;"></img><br/>' +
								'<a href="${txt_link}" target="_blank">Länk</a>',
						uniqueKey: "id",
						params: {
							q: "Sjöfartsmuseum"
						}
						// style: {
						// 	radius: 8,
						// 	fillColor: "#ff7800",
						// 	color: "#000",
						// 	weight: 1,
						// 	opacity: 1,
						// 	fillOpacity: 0.8
						// },
						// selectStyle: {
						// 	radius: 8,
						// 	fillColor: "#0FF",
						// 	color: "#0FF",
						// 	weight: 1,
						// 	opacity: 1,
						// 	fillOpacity: 0.5
						// }
					}
				},
				{
					init: "L.GeoJSON.WFS",
					url: "http://91.123.201.52/cgi-bin/cultmap/getGeoData.py",  //"http://localhost/cherrypy/cultmap/getdata",
					options: {
						// xhrType: "GET",
						layerId: "Malmö museer",
						proxy: ws[document.domain].proxy,
						displayName: "Malmö museer",
						category: ["Museum"],
						attribution: "© Regis",
						inputCrs: "EPSG:4326",
						reverseAxis: false,
						reverseAxisBbox: false,
						selectable: true,
						popup: '<h4>${txt_name}</h4><p>${}txt_access</p><img src="http://xyz.malmo.se/rest/resources/cultmap/${txt_pic}" style="width:200px;max-height:300px;"></img><br/>' +
								'<a href="${txt_link}" target="_blank">Länk</a>',
						uniqueKey: "id",
						params: {
							q: "Malmö museer"
						}
						// style: {
						// 	radius: 8,
						// 	fillColor: "#ff7800",
						// 	color: "#000",
						// 	weight: 1,
						// 	opacity: 1,
						// 	fillOpacity: 0.8
						// },
						// selectStyle: {
						// 	radius: 8,
						// 	fillColor: "#0FF",
						// 	color: "#0FF",
						// 	weight: 1,
						// 	opacity: 1,
						// 	fillOpacity: 0.5
						// }
					}
				},
				{
					init: "L.GeoJSON.WFS",
					url: "http://91.123.201.52/cgi-bin/cultmap/getGeoData.py",  //"http://localhost/cherrypy/cultmap/getdata",
					options: {
						// xhrType: "GET",
						layerId: "Friluftsmuseum",
						proxy: ws[document.domain].proxy,
						displayName: "Friluftsmuseum",
						category: ["Museum"],
						attribution: "© Regis",
						inputCrs: "EPSG:4326",
						reverseAxis: false,
						reverseAxisBbox: false,
						selectable: true,
						popup: '<h4>${txt_name}</h4><p>${}txt_access</p><img src="http://xyz.malmo.se/rest/resources/cultmap/${txt_pic}" style="width:200px;max-height:300px;"></img><br/>' +
								'<a href="${txt_link}" target="_blank">Länk</a>',
						uniqueKey: "id",
						params: {
							q: "Friluftsmuseum"
						}
						// style: {
						// 	radius: 8,
						// 	fillColor: "#ff7800",
						// 	color: "#000",
						// 	weight: 1,
						// 	opacity: 1,
						// 	fillOpacity: 0.8
						// },
						// selectStyle: {
						// 	radius: 8,
						// 	fillColor: "#0FF",
						// 	color: "#0FF",
						// 	weight: 1,
						// 	opacity: 1,
						// 	fillOpacity: 0.5
						// }
					}
				},
				{
					init: "L.GeoJSON.WFS",
					url: "http://91.123.201.52/cgi-bin/cultmap/getGeoData.py",  //"http://localhost/cherrypy/cultmap/getdata",
					options: {
						// xhrType: "GET",
						layerId: "Regionmuseet",
						proxy: ws[document.domain].proxy,
						displayName: "Regionmuseet",
						category: ["Museum"],
						attribution: "© Regis",
						inputCrs: "EPSG:4326",
						reverseAxis: false,
						reverseAxisBbox: false,
						selectable: true,
						popup: '<h4>${txt_name}</h4><p>${}txt_access</p><img src="http://xyz.malmo.se/rest/resources/cultmap/${txt_pic}" style="width:200px;max-height:300px;"></img><br/>' +
								'<a href="${txt_link}" target="_blank">Länk</a>',
						uniqueKey: "id",
						params: {
							q: "Regionmuseet"
						}
						// style: {
						// 	radius: 8,
						// 	fillColor: "#ff7800",
						// 	color: "#000",
						// 	weight: 1,
						// 	opacity: 1,
						// 	fillOpacity: 0.8
						// },
						// selectStyle: {
						// 	radius: 8,
						// 	fillColor: "#0FF",
						// 	color: "#0FF",
						// 	weight: 1,
						// 	opacity: 1,
						// 	fillOpacity: 0.5
						// }
					}
				},
				{
					init: "L.GeoJSON.WFS",
					url: "http://91.123.201.52/cgi-bin/cultmap/getGeoData.py",  //"http://localhost/cherrypy/cultmap/getdata",
					options: {
						// xhrType: "GET",
						layerId: "Järnvägsmuseum",
						proxy: ws[document.domain].proxy,
						displayName: "Järnvägsmuseum",
						category: ["Museum"],
						attribution: "© Regis",
						inputCrs: "EPSG:4326",
						reverseAxis: false,
						reverseAxisBbox: false,
						selectable: true,
						popup: '<h4>${txt_name}</h4><p>${}txt_access</p><img src="http://xyz.malmo.se/rest/resources/cultmap/${txt_pic}" style="width:200px;max-height:300px;"></img><br/>' +
								'<a href="${txt_link}" target="_blank">Länk</a>',
						uniqueKey: "id",
						params: {
							q: "Järnvägsmuseum"
						}
						// style: {
						// 	radius: 8,
						// 	fillColor: "#ff7800",
						// 	color: "#000",
						// 	weight: 1,
						// 	opacity: 1,
						// 	fillOpacity: 0.8
						// },
						// selectStyle: {
						// 	radius: 8,
						// 	fillColor: "#0FF",
						// 	color: "#0FF",
						// 	weight: 1,
						// 	opacity: 1,
						// 	fillOpacity: 0.5
						// }
					}
				},
				{
					init: "L.GeoJSON.WFS",
					url: "http://91.123.201.52/cgi-bin/cultmap/getGeoData.py",  //"http://localhost/cherrypy/cultmap/getdata",
					options: {
						// xhrType: "GET",
						layerId: "Lantbruksmuseum",
						proxy: ws[document.domain].proxy,
						displayName: "Lantbruksmuseum",
						category: ["Museum"],
						attribution: "© Regis",
						inputCrs: "EPSG:4326",
						reverseAxis: false,
						reverseAxisBbox: false,
						selectable: true,
						popup: '<h4>${txt_name}</h4><p>${}txt_access</p><img src="http://xyz.malmo.se/rest/resources/cultmap/${txt_pic}" style="width:200px;max-height:300px;"></img><br/>' +
								'<a href="${txt_link}" target="_blank">Länk</a>',
						uniqueKey: "id",
						params: {
							q: "Lantbruksmuseum"
						}
						// style: {
						// 	radius: 8,
						// 	fillColor: "#ff7800",
						// 	color: "#000",
						// 	weight: 1,
						// 	opacity: 1,
						// 	fillOpacity: 0.8
						// },
						// selectStyle: {
						// 	radius: 8,
						// 	fillColor: "#0FF",
						// 	color: "#0FF",
						// 	weight: 1,
						// 	opacity: 1,
						// 	fillOpacity: 0.5
						// }
					}
				},
				{
					init: "L.GeoJSON.WFS",
					url: "http://91.123.201.52/cgi-bin/cultmap/getGeoData.py",  //"http://localhost/cherrypy/cultmap/getdata",
					options: {
						// xhrType: "GET",
						layerId: "Slott",
						proxy: ws[document.domain].proxy,
						displayName: "Slott",
						category: ["Sevärda platser"],
						attribution: "© Regis",
						inputCrs: "EPSG:4326",
						reverseAxis: false,
						reverseAxisBbox: false,
						selectable: true,
						popup: '<h4>${txt_name}</h4><p>${}txt_access</p><img src="http://xyz.malmo.se/rest/resources/cultmap/${txt_pic}" style="width:200px;max-height:300px;"></img><br/>' +
								'<a href="${txt_link}" target="_blank">Länk</a>',
						uniqueKey: "id",
						params: {
							q: "Slott"
						}
						// style: {
						// 	radius: 8,
						// 	fillColor: "#ff7800",
						// 	color: "#000",
						// 	weight: 1,
						// 	opacity: 1,
						// 	fillOpacity: 0.8
						// },
						// selectStyle: {
						// 	radius: 8,
						// 	fillColor: "#0FF",
						// 	color: "#0FF",
						// 	weight: 1,
						// 	opacity: 1,
						// 	fillOpacity: 0.5
						// }
					}
				},
				{
					init: "L.GeoJSON.WFS",
					url: "http://91.123.201.52/cgi-bin/cultmap/getGeoData.py",  //"http://localhost/cherrypy/cultmap/getdata",
					options: {
						// xhrType: "GET",
						layerId: "Trädgård",
						proxy: ws[document.domain].proxy,
						displayName: "Trädgård",
						category: ["Sevärda platser"],
						attribution: "© Regis",
						inputCrs: "EPSG:4326",
						reverseAxis: false,
						reverseAxisBbox: false,
						selectable: true,
						popup: '<h4>${txt_name}</h4><p>${}txt_access</p><img src="http://xyz.malmo.se/rest/resources/cultmap/${txt_pic}" style="width:200px;max-height:300px;"></img><br/>' +
								'<a href="${txt_link}" target="_blank">Länk</a>',
						uniqueKey: "id",
						params: {
							q: "Trädgård"
						}
						// style: {
						// 	radius: 8,
						// 	fillColor: "#ff7800",
						// 	color: "#000",
						// 	weight: 1,
						// 	opacity: 1,
						// 	fillOpacity: 0.8
						// },
						// selectStyle: {
						// 	radius: 8,
						// 	fillColor: "#0FF",
						// 	color: "#0FF",
						// 	weight: 1,
						// 	opacity: 1,
						// 	fillOpacity: 0.5
						// }
					}
				},
				{
					init: "L.GeoJSON.WFS",
					url: "http://91.123.201.52/cgi-bin/cultmap/getGeoData.py",  //"http://localhost/cherrypy/cultmap/getdata",
					options: {
						// xhrType: "GET",
						layerId: "Staty",
						proxy: ws[document.domain].proxy,
						displayName: "Staty",
						category: ["Uråldriga ting"],
						attribution: "© Regis",
						inputCrs: "EPSG:4326",
						reverseAxis: false,
						reverseAxisBbox: false,
						selectable: true,
						popup: '<h4>${txt_name}</h4><p>${}txt_access</p><img src="http://xyz.malmo.se/rest/resources/cultmap/${txt_pic}" style="width:200px;max-height:300px;"></img><br/>' +
								'<a href="${txt_link}" target="_blank">Länk</a>',
						uniqueKey: "id",
						params: {
							q: "Staty"
						}
						// style: {
						// 	radius: 8,
						// 	fillColor: "#ff7800",
						// 	color: "#000",
						// 	weight: 1,
						// 	opacity: 1,
						// 	fillOpacity: 0.8
						// },
						// selectStyle: {
						// 	radius: 8,
						// 	fillColor: "#0FF",
						// 	color: "#0FF",
						// 	weight: 1,
						// 	opacity: 1,
						// 	fillOpacity: 0.5
						// }
					}
				},
				{
					init: "L.GeoJSON.WFS",
					url: "http://91.123.201.52/cgi-bin/cultmap/getGeoData.py",  //"http://localhost/cherrypy/cultmap/getdata",
					options: {
						// xhrType: "GET",
						layerId: "Brons",
						proxy: ws[document.domain].proxy,
						displayName: "Brons",
						category: ["Uråldriga ting"],
						attribution: "© Regis",
						inputCrs: "EPSG:4326",
						reverseAxis: false,
						reverseAxisBbox: false,
						selectable: true,
						popup: '<h4>${txt_name}</h4><p>${}txt_access</p><img src="http://xyz.malmo.se/rest/resources/cultmap/${txt_pic}" style="width:200px;max-height:300px;"></img><br/>' +
								'<a href="${txt_link}" target="_blank">Länk</a>',
						uniqueKey: "id",
						params: {
							q: "Brons"
						}
						// style: {
						// 	radius: 8,
						// 	fillColor: "#ff7800",
						// 	color: "#000",
						// 	weight: 1,
						// 	opacity: 1,
						// 	fillOpacity: 0.8
						// },
						// selectStyle: {
						// 	radius: 8,
						// 	fillColor: "#0FF",
						// 	color: "#0FF",
						// 	weight: 1,
						// 	opacity: 1,
						// 	fillOpacity: 0.5
						// }
					}
				},
				{
					init: "L.GeoJSON.WFS",
					url: "http://91.123.201.52/cgi-bin/cultmap/getGeoData.py",  //"http://localhost/cherrypy/cultmap/getdata",
					options: {
						// xhrType: "GET",
						layerId: "Skulptur",
						proxy: ws[document.domain].proxy,
						displayName: "Skulptur",
						category: ["Uråldriga ting"],
						attribution: "© Regis",
						inputCrs: "EPSG:4326",
						reverseAxis: false,
						reverseAxisBbox: false,
						selectable: true,
						popup: '<h4>${txt_name}</h4><p>${}txt_access</p><img src="http://xyz.malmo.se/rest/resources/cultmap/${txt_pic}" style="width:200px;max-height:300px;"></img><br/>' +
								'<a href="${txt_link}" target="_blank">Länk</a>',
						uniqueKey: "id",
						params: {
							q: "Skulptur"
						}
						// style: {
						// 	radius: 8,
						// 	fillColor: "#ff7800",
						// 	color: "#000",
						// 	weight: 1,
						// 	opacity: 1,
						// 	fillOpacity: 0.8
						// },
						// selectStyle: {
						// 	radius: 8,
						// 	fillColor: "#0FF",
						// 	color: "#0FF",
						// 	weight: 1,
						// 	opacity: 1,
						// 	fillOpacity: 0.5
						// }
					}
				},
				{
					init: "L.GeoJSON.WFS",
					url: "http://91.123.201.52/cgi-bin/cultmap/getGeoData.py",  //"http://localhost/cherrypy/cultmap/getdata",
					options: {
						// xhrType: "GET",
						layerId: "Fasadkonst",
						proxy: ws[document.domain].proxy,
						displayName: "Fasadkonst",
						category: ["Uråldriga ting"],
						attribution: "© Regis",
						inputCrs: "EPSG:4326",
						reverseAxis: false,
						reverseAxisBbox: false,
						selectable: true,
						popup: '<h4>${txt_name}</h4><p>${}txt_access</p><img src="http://xyz.malmo.se/rest/resources/cultmap/${txt_pic}" style="width:200px;max-height:300px;"></img><br/>' +
								'<a href="${txt_link}" target="_blank">Länk</a>',
						uniqueKey: "id",
						params: {
							q: "Fasadkonst"
						}
						// style: {
						// 	radius: 8,
						// 	fillColor: "#ff7800",
						// 	color: "#000",
						// 	weight: 1,
						// 	opacity: 1,
						// 	fillOpacity: 0.8
						// },
						// selectStyle: {
						// 	radius: 8,
						// 	fillColor: "#0FF",
						// 	color: "#0FF",
						// 	weight: 1,
						// 	opacity: 1,
						// 	fillOpacity: 0.5
						// }
					}
				},
				{
					init: "L.GeoJSON.WFS",
					url: "http://91.123.201.52/cgi-bin/cultmap/getGeoData.py",  //"http://localhost/cherrypy/cultmap/getdata",
					options: {
						// xhrType: "GET",
						layerId: "Porträtt",
						proxy: ws[document.domain].proxy,
						displayName: "Porträtt (testar utan kategori)",
						category: null,
						attribution: "© Regis",
						inputCrs: "EPSG:4326",
						reverseAxis: false,
						reverseAxisBbox: false,
						selectable: true,
						popup: '<h4>${txt_name}</h4><p>${}txt_access</p><img src="http://xyz.malmo.se/rest/resources/cultmap/${txt_pic}" style="width:200px;max-height:300px;"></img><br/>' +
								'<a href="${txt_link}" target="_blank">Länk</a>',
						uniqueKey: "id",
						params: {
							q: "Porträtt"
						}
						// style: {
						// 	radius: 8,
						// 	fillColor: "#ff7800",
						// 	color: "#000",
						// 	weight: 1,
						// 	opacity: 1,
						// 	fillOpacity: 0.8
						// },
						// selectStyle: {
						// 	radius: 8,
						// 	fillColor: "#0FF",
						// 	color: "#0FF",
						// 	weight: 1,
						// 	opacity: 1,
						// 	fillOpacity: 0.5
						// }
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
			},
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
						options: {
							toggleSubLayersOnClick: true,
							unfoldOnClick: false,
							unfoldAll: false
						}
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
						init: "L.Control.SelectVector",
						options: {
							buffer: 5
						}
					},
					{
						init: "L.Control.Search",
						options: {
							wsAcLocal: ["Hembygdsgard", "Kulturen", "Museum"],
							wsLocateUrl: "http://91.123.201.52/cgi-bin/cultmap/getGeoData.py",
							wsOrgProj: "EPSG:4326"
						}
					},
					{
						init: "L.Control.Zoombar",
						options: {}
					},
					{
						init: "L.Control.ShareLink",
						options: {
							position: 'topright'
						}
					},
					{
 						init: "L.Control.Print",
 						options: {
 							position: 'topright'
 						}
 					},
 					{
 						init: "L.Control.Info",
 						options: {
 							position: 'topright'
 						}
 					},
 					{
						init: "L.Control.Opacity",
						options: {
							position: 'topright',
							savePrefBox: true
						}
					},
					{
						init: "L.Control.ToolHandler",
						options: {
							
						}
					}
		]
};
