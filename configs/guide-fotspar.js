
var ws = {
		"localhost": {
			proxy: "//localhost/cgi-bin/proxy.py?url="
		},
		"xyz.malmo.se": {
			proxy: "http://xyz.malmo.se/myproxy/proxy.py?url="
		},
		"91.123.201.52": {
			proxy: "http://91.123.201.52/cgi-bin/proxy.py?url="
		},
		"mobile.smap.se": {
			proxy: "http://mobile.smap.se/smap-mobile/ws/proxy.py?url="
		}
};
var proxy = ws[document.domain].proxy;


var config = {
	
	params: {
		center: [13.0212, 55.59387],
		zoom: 13
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
						typeName: "malmows:POI_VARAFOTSPAR_PT",
					},
					displayName: "Våra fotspår",
					layerId: "guidelayer",
					xhrType: "GET",
					proxy: proxy,
					attribution: "Malmö stad",
					inputCrs: "EPSG:4326",
					uniqueKey: "gid",
					selectable: true,
					reverseAxis: false,
					reverseAxisBbox: true,
					popup:
						'<h4>${gid}: ${titel} </h4>'+
						'<div class="gp-mediaicons">${function(p) {'+
								'var out = "";'+
								'var style="margin-right:.3em;";'+
								'if (p.video) {'+
									'	out += \'<span style="\'+style+\'" class="fa fa-film fa-lg"></span>\';'+
									'}'+
								'if (p.audio) {'+
								'	out += \'<span style="\'+style+\'" class="fa fa-volume-up fa-lg"></span>\';'+
								'}'+
							'if (p.bilder && p.bilder.split(",").length > 1) {'+
							'	out += \'<span style="\'+style+\'" class="fa fa-picture-o fa-lg"></span>\';'+
							'}'+
						'return out;'+
						'}'+
						'}</div>'+
						'${function(p) {'+
								'var out = "";'+
								'var pics = p.bilder || "",'+
									'pic;'+
								'pics = pics ? pics.split(",") : [];'+
								'if (pics.length > 1 && pics[0].length) {'+
									'pic = pics[0];'+
								'}'+
								'else if (pics.length === 1) {'+
									'pic = pics;'+
								'}'+
								'else {return "";}'+
								'pic = $.trim(pic);'+
								'return "<img style=\'width:200px;max-height:200px;margin-top: 1em;\' src=\'//xyz.malmo.se/rest/resources/vara_fotspar/"+pic+"\'></img>";'+
							'}}'
						//xyz.malmo.se/rest/resources/vara_fotspar/${bilder}"></img>'
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
					proxy: proxy,
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
				// {
				// 	init: "L.Control.MalmoHeader",
				// 	options: {}
				// },
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
//					{
//					init: "L.Control.SelectWMS",
//					options: {
//						buffer: 5
//					}
//					},
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
//						{
//							init: "L.Control.Menu",
//							options: {}
//						},
				{
					init: "L.Control.GuidePopup",
					options: {
						autoActivate: false,
						layerId: "guidelayer",
						dialogTitle: "${titel}",
						useProxy: true,
						attrId: "gid",
						
						// This object specifies how to fill the big popup (the modal window).
						// The modalContent parameters can be overridden by individual parameters for each feature.
						modalContent: {
							iconType: null,
							dialogTitle: "${titel}",
							fullScreenIntroPic: "${bilder}", // Used only when clicking on a media tag, opening in fullscreen
							tabIntro: "${beskrivning}",
							tabMedia: [{
								condition: function(p) {
									return p.bilder && p.bilder.split(",").length > 1;
								},
								label: 'Om "${titel}"',
								mediaType: "image",
								sources: '${function(p){var pics = p.bilder.split(","); '+
										'var baseUrl = "//xyz.malmo.se/rest/resources/vara_fotspar/";'+
										'var out = [];'+
										'for (var i=0,len=pics.length; i<len; i++) {'+
											'out.push(baseUrl + $.trim(pics[i]));'+
										'}'+
										'return out.join(",");'+
									'}}'
							},
							{
								condition: function(p) {
									return p.video && p.video.length > 0;
								},
								label: 'Kort video om "${titel}"',
								mediaType: "video",
								sources: '${video}'
							}

							]
							// ,
							// tabAccess: '<div>'+

							// 	'<p>'+
							// 		'${function(p){var pics = p.bilder && p.bilder.length ? p.bilder.split(",") : []; '+
							// 			'if (pics.length) {'+
							// 				'return "<img height=\'25%\' width=\'25%\' class=\'img-thumbnail\' src=\'//xyz.malmo.se/rest/resources/vara_fotspar/"+$.trim(pics[0])+"\'></img>";'+
							// 			'} else {return "";}'+
							// 		'}}'+
							// 	'"</p>'+
							// '</div>'
						},

						modalContentOverrides: {
							
						}
					}
				}
	]
};
