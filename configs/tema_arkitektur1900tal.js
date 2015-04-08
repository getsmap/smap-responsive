
var ws = {
		"localhost": {
			proxy: "//localhost/cgi-bin/proxy.py?url="
		},
		"xyz.malmo.se": {
			proxy: "//xyz.malmo.se/myproxy/proxy.py?url="
		},
		"kartor.malmo.se": {
			proxy: "//kartor.malmo.se/api/v1/proxy.py?url="
		},
		"91.123.201.52": {
			proxy: "//91.123.201.52/cgi-bin/proxy.py?url="
		},
		"mobile.smap.se": {
			proxy: "//mobile.smap.se/smap-mobile/ws/proxy.py?url="
		}
};

var guideLayerName = "guidelayer";

var config = {
	
	params: {
		zoom: 12,
		center: [12.983, 55.614],
		ol: guideLayerName
	},

	ws: ws,
	
	ol: [
			{
				init: "L.GeoJSON.WFS",
				url: "http://localhost/geoserver/wfs",
				options: {
					params: {
						typeName: "skane:POI_ARKITEKTUR_1900_PT"
					},
					displayName: "Hus i Malmö 1914-2014",
					layerId: guideLayerName,
					xhrType: "POST",
					attribution: "Malmö stad",
					inputCrs: "EPSG:4326",
					uniqueKey: "fid",
					selectable: true,
					reverseAxis: false,
					reverseAxisBbox: true,
					geomType: "POINT",
					popup:
						'<h4>${fid}: ${title} </h4>'+
						'<div class="gp-mediaicons">${function(p) {'+
								'var out = "";'+
								'var style="margin-right:.3em;";'+
								'if (p.video) {'+
									'	out += \'<span style="\'+style+\'" class="fa fa-film fa-lg"></span>\';'+
									'}'+
								'if (p.audio) {'+
								'	out += \'<span style="\'+style+\'" class="fa fa-volume-up fa-lg"></span>\';'+
								'}'+
							'if (p.pics && p.pics.split(",").length > 1) {'+
							'	out += \'<span style="\'+style+\'" class="fa fa-picture-o fa-lg"></span>\';'+
							'}'+
						'return out;'+
						'}'+
						'}</div>'+
						'${function(p) {'+
								'var out = "";'+
								'var pics = p.pics || "",'+
									'pic;'+
								'pics = pics ? pics.split(",") : [];'+
								'if (pics.length > 1 && pics[0].length) {'+
									'pic = pics[0];'+
								'}'+
								'else if (pics.length === 1) {'+
									'pic = pics;'+
								'}'+
								'else {return "";}'+
								'pic = decodeURIComponent($.trim(pic));'+
								'return "<img style=\'width:100%;max-height:200px;margin-top: 1em;\' src=\'"+pic+"\'></img>";'+
							'}}'
						//kartor.malmo.se/rest/resources/vara_fotspar/${pics}"></img>'
				}
			}
		],
		
	bl: [
			{
				init: "L.TileLayer.WMS",
				url: "http://kartor.malmo.se/arcgis/services/malmokarta_3857_wms/MapServer/WMSServer",
				options: {
					layerId: "stadskartan",
					displayName: "Stadskarta",
					category: ["Karta"],
					layers: '0',
					minZoom: 10,
					maxZoom: 21,
					format: 'image/png',
					transparent: false,
					opacity: 1.0,
					attribution: "© Malmö Stadsbyggnadskontor",
					zIndex: 50
				}
			}
			// ,
			// {
			// 	init: "L.TileLayer.WMS",
			// 	url: "http://kartor.malmo.se/arcgis/services/malmokarta_sv_3857_wms/MapServer/WMSServer",
			// 	options: {
			// 		layerId: "stadskartan_sv",
			// 		displayName: "Stadskarta nedtonad",
			// 		category: ["Karta"],
			// 		layers: '0',
			// 		minZoom: 10,
			// 		maxZoom: 21,
			// 		format: 'image/png',
			// 		transparent: false,
			// 		opacity: 1.0,
			// 		attribution: "© Malmö Stadsbyggnadskontor",
			// 		zIndex: 50
			// 	}
			// }
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
				// {
				// 	init: "L.Control.LayerSwitcher",
				// 	options: {}
				// },
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
					init: "L.Control.Search",
					options: {
						gui: true,
						whitespace: "%20",
						wsOrgProj: "EPSG:3008",
						zoom: 18,
						useProxy: true, // If set to true, the URL specified in "config.ws.proxy" will be used
						wsAcUrl: "http://kartor.malmo.se/api/v1/addresses/autocomplete/", // autocomplete
						wsLocateUrl: "http://kartor.malmo.se/api/v1/addresses/geolocate/", // geolocate
						acOptions: {
							items: 100
						}
						// ,
						// markerIcon: $.extend({}, (new L.Icon.Default()).options, {
						// 	iconUrl: "img/marker-icon-green.png"
						// })
					}
				},
				// {
				// 	init: "L.Control.GuideIntroScreen",
				// 	options: {
				// 		autoActivate: false
				// 	}
				// },
//						{
//							init: "L.Control.Menu",
//							options: {}
//						},
				{
					init: "L.Control.GuidePopup",
					options: {
						autoActivate: false,
						layerId: guideLayerName,
						dialogTitle: "${title}",
						useProxy: false,
						attrId: "fid",
						
						// This object specifies how to fill the big popup (the modal window).
						// The modalContent parameters can be overridden by individual parameters for each feature.
						modalContent: {
							iconType: null,
							dialogTitle: "${title}",
							fullScreenIntroPic: "${pics, 1}", // Used only when clicking on a media tag, opening in fullscreen
							tabIntro: 	'${function(p) {'+
											'var out = "";'+
											'var pics = p.pics || "",'+
												'pic;'+
											'pics = pics ? pics.split(",") : [];'+
											'if (pics.length > 1 && pics[0].length) {'+
												'pic = pics[0];'+
											'}'+
											'else if (pics.length === 1) {'+
												'pic = pics;'+
											'}'+
											'else {return "";}'+
											'pic = decodeURIComponent( $.trim(pic) );'+
											'return "<img style=\'max-width: 100%; max-height: 200px; margin-top: 1em;\' src=\'"+pic+"\'></img>";'+
										'}}'+
										'<p>År:&nbsp;${year_origin}</p>'+
										'<p>Arkitekt:&nbsp;${architect}</p>'+
										'<p>Byggherre:&nbsp;${byggherre}</p>'+
										'<p>Adress:&nbsp;${address}</p>'+
										'<p>${description}</p>',
							tabMedia: [{
								condition: function(p) {
									return p.pics && p.pics.split(",").length > 1;
								},
								label: 'Fler bilder av "${title}"',
								mediaType: "image",
								sources: '${function(p){var pics = p.pics.split(","); '+
										'var out = [];'+
										'for (var i=0,len=pics.length; i<len; i++) {'+
											'out.push($.trim(pics[i]));'+
										'}'+
										'return out.join(",");'+
									'}}'
							},
							{
								condition: function(p) {
									return p.video && p.video.length > 0;
								},
								label: 'Kort film om "${title}"',
								mediaType: "video",
								sources: '${video}'
							}

							],
							tabAccess: '<div>'+
								'${function(p) {'+
										'var out = "";'+
										'var pics = p.pics || "",'+
											'pic;'+
										'pics = pics ? pics.split(",") : [];'+
										'if (pics.length > 1 && pics[0].length) {'+
											'pic = pics[0];'+
										'}'+
										'else if (pics.length === 1) {'+
											'pic = pics;'+
										'}'+
										'else {return "";}'+
										'pic = decodeURIComponent( $.trim(pic) );'+
										'return "<img style=\'max-width:100%;max-height:100px;margin-top: 1em;\' src=\'"+pic+"\'></img>";'+
									'}}'+
								'<p><b>Parkering:</b> ${till_park}</p>'+
								'<p><b>Handikapparkering:</b> ${till_hcp}</p>'+
								'<p><b>Busshållplats:</b> ${till_buss}</p>'+
								'<p><b>Övrigt:</b> ${till_misc}</p>'+
							'</div>'
						},

						modalContentOverrides: {
							
						}
					}
				}
	]
};
