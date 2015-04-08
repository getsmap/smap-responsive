var ws = {
		"localhost": {
			proxy: "//localhost/cgi-bin/proxy.py?url="
		},
		"161.52.15.157": {
			proxy: "//localhost/cgi-bin/proxy.py?url="
		},
		"mobile.smap.se": {
			proxy: "//mobile.smap.se/smap-mobile/ws/proxy.py?url="
		},
		"kartor.helsingborg.se": {
			proxy: "//kartor.helsingborg.se/cgi-bin/proxy.py?url="
		}
};

var config = {

		params:{
			center: [13.0, 55.58],
			zoom: $(window).width() < 600 ? 11 : 12
		},

		smapOptions: {
			title: "Malmö Stadsatlas"
			,
			favIcon: "//assets.malmo.se/external/v4/favicon.ico"
		},

		ws: ws,
				
		ol: [
			
			
			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Fastigheter",
					layerId: "fastigheter",
					category: ["Bo, bygga & miljö", "Bo & bygga"],
					layers: "malmows:SMA_TRAKT_P,malmows:SMA_FASTYTA_3D_P,malmows:SMA_SUM_FASTYTA_P",
					legend: "http://localhost/geoserver/wms?request=GetLegendGraphic&layer=malmows:SMA_SUM_FASTYTA_P&version=1.1.1&format=image/png&rule=1",
					legendBig: "http://localhost/geoserver/wms?request=GetLegendGraphic&layer=malmows:SMA_SUM_FASTYTA_P&version=1.1.1&format=image/png&scale=1&legend_options=forceLabels:on",
					selectOptions: {layers: "malmows:SMA_SUM_FASTYTA_P"},
					selectable: true,
					popup: '<div>${fastighet}</div>',
					format: 'image/png',
					zIndex: 150,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},
			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Kvarter",
					layerId: "kvarter",
					category: ["Bo, bygga & miljö", "Bo & bygga"],
					layers: "malmows:SMA_SUM_KVARTER_P",
					legend: "http://localhost/geoserver/wms?request=GetLegendGraphic&layer=malmows:SMA_SUM_KVARTER_P&version=1.1.1&format=image/png&rule=1",
					selectable: true,
					popup: '<div>${name}</div>',
					format: 'image/png',
					zIndex: 150,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},

			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Återvinningscentral",
					layerId: "atervinningscentral",
					category: ["Bo, bygga & miljö", "Miljö"],
					layers: "malmows:GK_ATERVINNINGSCENTRAL_PT",
					selectable: true,
					popup: '<div>${objektnamn}</div>\
							${beskrivning}\
							<br>\
							<br><a href="${url}">Mer information</a>',
							
					format: 'image/png',
					zIndex: 150,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},

			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Återvinningsstation",
					layerId: "atervinningsstation",
					category: ["Bo, bygga & miljö", "Miljö"],
					layers: "malmows:OP_UL_VA_ATERVINNINGSSTATIONER_PT",
					selectable: true,
					popup: '<div>${namn}</div>',
					format: 'image/png',
					zIndex: 150,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},
			
			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Planerade förskolor",
					layerId: "planfsk",
					category: ["Förskola & utbildning", "Förskolor"],
					layers: "malmows:POI_PLANERADE_FORSKOLOR_PT",
					legend: "http://localhost/geoserver/wms?request=GetLegendGraphic&layer=malmows:POI_PLANERADE_FORSKOLOR_PT&version=1.1.1&format=image/png&rule=1",
					selectable: true,
					popup: '<div>${namn}</div>\
							<div>${adr}</div>\
							<div><a href="${url}" target="_blank">Läs mer</a></div>',
					format: 'image/png',
					zIndex: 350,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},
			
			
			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Kommunala förskolor",
					layerId: "kommunal_forskola",
					category: ["Förskola & utbildning", "Förskolor"],
					layers: "malmows:V_POI_EXTENS_FORSKOLOR_KOMMUNAL_PT",
					legend: "http://localhost/geoserver/wms?request=GetLegendGraphic&layer=malmows:V_POI_EXTENS_FORSKOLOR_KOMMUNAL_PT&version=1.1.1&format=image/png&rule=1",
					selectable: true,
					popup: '<div>${namn}</div>\
							<div style="margin-top:1em;">\
								<a href="${url}">Mer information</a>\
								<a href="http://kartor.malmo.se/urbex/index.htm?p=true&xy=${easting};${northing}">Visa snedbild</a>\
							</div>',
					format: 'image/png',
					zIndex: 350,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},
			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Fristående förskolor",
					layerId: "ickekom_forskola",
					category: ["Förskola & utbildning", "Förskolor"],
					layers: "malmows:V_POI_EXTENS_FORSKOLOR_PRIVAT_PT",
					legend: "http://localhost/geoserver/wms?request=GetLegendGraphic&layer=malmows:V_POI_EXTENS_FORSKOLOR_PRIVAT_PT&version=1.1.1&format=image/png&rule=1",
					selectable: true,
					popup: '<div>${namn}</div>\
							<div style="margin-top:1em;">\
								<a href="${url}">Mer information</a>\
								<a href="http://kartor.malmo.se/urbex/index.htm?p=true&xy=${easting};${northing}">Visa snedbild</a>\
							</div>',
					format: 'image/png',
					zIndex: 350,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},

			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Öppna förskolor",
					layerId: "oppen_forskola",
					category: ["Förskola & utbildning", "Förskolor"],
					layers: "malmows:V_POI_EXTENS_FORSKOLOR_OPPEN_PT",
					legend: "http://localhost/geoserver/wms?request=GetLegendGraphic&layer=malmows:V_POI_EXTENS_FORSKOLOR_OPPEN_PT&version=1.1.1&format=image/png&rule=1",
					selectable: true,
					popup: '<div>${namn}</div>\
							<div style="margin-top:1em;">\
								<a href="${url}">Mer information</a>\
								<a href="http://kartor.malmo.se/urbex/index.htm?p=true&xy=${easting};${northing}">Visa snedbild</a>\
							</div>',
					format: 'image/png',
					zIndex: 350,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},
			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Kommunala grundskolor",
					layerId: "grundskola_kommunal",
					category: ["Förskola & utbildning", "Grundskolor"],
					layers: "malmows:V_POI_EXTENS_GRUNDSKOLA_KOMMUNAL_PT",
					selectable: true,
					popup: '<div>${objektnamn}</div>\
							Årskurs: ${arskurs}\
							<div style="margin-top:1em;">\
								<a href="${url}">Mer information</a>\
								<a href="http://kartor.malmo.se/urbex/index.htm?p=true&xy=${easting};${northing}">Visa snedbild</a>\
							</div>',
					format: 'image/png',
					zIndex: 350,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},
			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Fristående grundskolor",
					layerId: "grundskola_fristaende",
					category: ["Förskola & utbildning", "Grundskolor"],
					layers: "malmows:V_POI_EXTENS_GRUNDSKOLA_FRISTAENDE_PT",
					selectable: true,
					popup: '<div>${objektnamn}</div>\
							Årskurs: ${arskurs}\
							<div style="margin-top:1em;">\
								<a href="${url}">Mer information</a>\
								<a href="http://kartor.malmo.se/urbex/index.htm?p=true&xy=${easting};${northing}">Visa snedbild</a>\
							</div>',
					format: 'image/png',
					zIndex: 350,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},

			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Kommunala grundsärskolor",
					layerId: "grundarskola_kommunal",
					category: ["Förskola & utbildning", "Grundskolor"],
					layers: "malmows:V_POI_EXTENS_GRUNDSKOLA_SARSKOLA_KOMMUNAL_PT",
					selectable: true,
					popup: '<div>${objektnamn}</div>\
							Årskurs: ${arskurs}\
							<div style="margin-top:1em;">\
								<a href="${url}">Mer information</a>\
								<a href="http://kartor.malmo.se/urbex/index.htm?p=true&xy=${easting};${northing}">Visa snedbild</a>\
							</div>',
					format: 'image/png',
					zIndex: 350,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},
			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Fristående grundsärskolor",
					layerId: "grundsarskola_fristaende",
					category: ["Förskola & utbildning", "Grundskolor"],
					layers: "malmows:V_POI_EXTENS_GRUNDSKOLA_SARSKOLA_FRISTAENDE_PT",
					selectable: true,
					popup: '<div>${objektnamn}</div>\
							Årskurs: ${arskurs}\
							<div style="margin-top:1em;">\
								<a href="${url}">Mer information</a>\
								<a href="http://kartor.malmo.se/urbex/index.htm?p=true&xy=${easting};${northing}">Visa snedbild</a>\
							</div>',
					format: 'image/png',
					zIndex: 350,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},
			
			
			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Gymnasieskolor",
					layerId: "gymnasieskola",
					category: ["Förskola & utbildning", "Gymnasieskolor"],
					layers: "malmows:POI_SKOLOR_GYMNASIESKOLA_PT",
					selectable: true,
					popup: '<div>${objektnamn}</div>\
							<br><a href="http://kartor.malmo.se/urbex/index.htm?p=true&xy=${easting};${northing}">Visa snedbild</a>',		
					format: 'image/png',
					zIndex: 350,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},
			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Högskola & universitet",
					layerId: "hogskola_universitet",
					category: ["Förskola & utbildning", "Högskola & universitet"],
					layers: "malmows:POI_SKOLOR_HOGSKOLOR_UNIVERISITET_PT",
					selectable: true,
					popup: '<div>${objektnamn}</div>\
							<div style="margin-top:1em;">\
								<a href="${url}">Mer information</a>\
								<a href="http://kartor.malmo.se/urbex/index.htm?p=true&xy=${easting};${northing}">Visa snedbild</a>\
							</div>',
					format: 'image/png',
					zIndex: 350,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},

			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Övriga skolor",
					layerId: "ovrigskola",
					category: ["Förskola & utbildning", "Övriga skolor"],
					layers: "malmows:POI_SKOLOR_OVR_PT",
					selectable: true,
					popup: '<div>${objektnamn}</div>\
							<div style="margin-top:1em;">\
								<a href="${url}">Mer information</a>\
								<a href="http://kartor.malmo.se/urbex/index.htm?p=true&xy=${easting};${northing}">Visa snedbild</a>\
							</div>',
					format: 'image/png',
					zIndex: 350,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},


			
			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Temalekplatser",
					layerId: "temalekplatser",
					category: ["Kultur & Fritid", "Barn & unga"],
					layers: "malmows:GK_TEMALEKPLATSER_PT",
					selectable: true,
					popup: '<div>${namn}</div>'+
							'<br><img style="max-width:100%;max-height:100px;" src="${bild}"></img>'+
							'<br><a href="${bild}">Bilder</a>'+
							'<br><a href="${url}">Läs mer</a>',
					format: 'image/png',
					zIndex: 350,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},

			
			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Lekplatser",
					layerId: "lekplatser",
					category: ["Kultur & Fritid", "Barn & unga"],
					layers: "malmows:GK_LEKPLATSER_PT",
					selectable: true,
					popup: '<div>${namn}</div>\
							<br><a href="${bild}">Bilder</a>',
					zIndex: 350,
					format: 'image/png',
					attribution: "@ Malmö stad",
					transparent: true
				}
			},

			
			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Bibliotek",
					layerId: "bibliotek",
					category: ["Kultur & Fritid", "Biblioteken"],
					layers: "malmows:POI_KULTUR_BIBLIOTEK_PT",
					selectable: true,
					popup: '<div>${objektnamn}</div>\
							<br><a href="http://kartor.malmo.se/urbex/index.htm?p=true&xy=${easting};${northing}">Visa snedbild</a>',							
					format: 'image/png',
					zIndex: 350,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},

			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Bad",
					layerId: "bad",
					category: ["Kultur & Fritid", "Idrott & Fritid"],
					layers: "malmows:POI_FRITID_BAD_PT",
					selectable: true,
					popup: '<div>${objektnamn}</div>',
					format: 'image/png',
					zIndex: 350,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},

			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Fritidsgårdar & mötesplatser",
					layerId: "fritidsgardar",
					category: ["Kultur & Fritid", "Idrott & Fritid"],
					layers: "malmows:POI_FRITID_FRITIDSGARD_PT",
					selectable: true,
					popup: '<div>${objektnamn}</div>',
					format: 'image/png',
					zIndex: 350,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},

			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Golf",
					layerId: "golf",
					category: ["Kultur & Fritid", "Idrott & Fritid"],
					layers: "malmows:POI_FRITID_GOLFBANA_PT",
					selectable: true,
					popup: '<div>${objektnamn}</div>',
					format: 'image/png',
					zIndex: 350,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},

			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Idrottsplatser",
					layerId: "idrottsplatser",
					category: ["Kultur & Fritid", "Idrott & Fritid"],
					layers: "malmows:POI_FRITID_IDROTTSPLATS_PT",
					selectable: true,
					popup: '<div>${objektnamn}</div>',
					format: 'image/png',
					zIndex: 350,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},

			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Ishallar",
					layerId: "ishallar",
					category: ["Kultur & Fritid", "Idrott & Fritid"],
					layers: "malmows:POI_FRITID_ISHALL_PT",
					selectable: true,
					popup: '<div>${objektnamn}</div>',
					format: 'image/png',
					zIndex: 350,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},
			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Ridsport",
					layerId: "ridsport",
					category: ["Kultur & Fritid", "Idrott & Fritid"],
					layers: "malmows:POI_FRITID_RIDSPORT_PT",
					selectable: true,
					popup: '<div>${objektnamn}</div>',
					format: 'image/png',
					zIndex: 350,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},
			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Sporthallar",
					layerId: "sporthallar",
					category: ["Kultur & Fritid", "Idrott & Fritid"],
					layers: "malmows:POI_FRITID_SPORTHALL_PT",
					selectable: true,
					popup: '<div>${objektnamn}</div>',
					format: 'image/png',
					zIndex: 350,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},
			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Utegym",
					layerId: "utegym",
					category: ["Kultur & Fritid", "Idrott & Fritid"],
					layers: "malmows:POI_FRITID_UTEGYM_PT",
					selectable: true,
					popup: '<div>${objektnamn}</div>',
					format: 'image/png',
					zIndex: 350,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},
			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Spontanidrottsplats",
					layerId: "spontanip",
					category: ["Kultur & Fritid", "Idrott & Fritid"],
					layers: "malmows:POI_FRITID_SPONTANIDROTTSPLATS_PT",
					selectable: true,
					popup: '<div>${objektnamn}</div>',
					format: 'image/png',
					zIndex: 350,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},

			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Museum & konst",
					layerId: "museum",
					category: ["Kultur & Fritid", "Kultur & nöje"],
					layers: "malmows:POI_KULTUR_MUSEUM_OCH_KONST_PT",
					selectable: true,
					popup: '<div>${objektnamn}</div>',
					zIndex: 350,
					format: 'image/png',
					attribution: "@ Malmö stad",
					transparent: true
				}
			},

			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Teater & musik",
					layerId: "teater_och_musik",
					category: ["Kultur & Fritid", "Kultur & nöje"],
					layers: "malmows:POI_KULTUR_TEATER_OCH_MUSIK_PT",
					selectable: true,
					popup: '<div>${objektnamn}</div>',
					zIndex: 350,
					format: 'image/png',
					attribution: "@ Malmö stad",
					transparent: true
				}
			},
			
			
			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Förvaltningar & myndigheter",
					layerId: "forvaltning",
					category: ["Kommun & Politik", "Förvaltningar & myndigheter"],
					layers: "malmows:POI_KOMMUN_POLITIK_FORVALTNING_MYNDIGHET_PT",
					selectable: true,
					popup: '<div>${objekttyp3}</div>\
					${objeknamn}',
					format: 'image/png',
					zIndex: 350,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},

			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Medborgarkontor & medborgarservice",
					layerId: "medborgarkontor",
					category: ["Kommun & Politik", "Förvaltningar & myndigheter"],
					layers: "malmows:POI_KOMMUN_POLITIK_MEDBORGARKONTOR_PT",
					selectable: true,
					popup: '<div>${objektnamn}</div>',
					format: 'image/png',
					zIndex: 350,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},

			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Delområden",
					layerId: "delomraden",
					category: ["Kommun & Politik", "Stadsområden & delområden"],
					layers: "malmows:SMA_DELOMRADE_P",
					legend: "http://localhost/geoserver/wms?request=GetLegendGraphic&layer=malmows:SMA_DELOMRADE_P&version=1.1.1&format=image/png&scale=50000",
					selectable: true,
					popup: '<div>${delomr}</div>',
					format: 'image/png',
					zIndex: 150,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},
			
			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Stadsområden",
					layerId: "stadsomraden",
					category: ["Kommun & Politik", "Stadsområden & delområden"],
					layers: "malmows:SMA_STADSOMRADEN_P",
					legend: "http://localhost/geoserver/wms?request=GetLegendGraphic&layer=malmows:SMA_STADSOMRADEN_P&version=1.1.1&format=image/png&scale=50000",
					selectable: true,
					popup: '<div>${sdf_namn}</div>',
					format: 'image/png',
					zIndex: 150,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},

			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Stadsdel (tom juni 2013)",
					layerId: "stadsdel_tom",
					category: ["Kommun & Politik", "Stadsområden & delområden"],
					layers: "malmows:SMA_STADSDEL_P",
					legend: "http://localhost/geoserver/wms?request=GetLegendGraphic&layer=malmows:SMA_STADSDEL_P&version=1.1.1&format=image/png&scale=50000",
					selectable: true,
					popup: '<div>${sdfname}</div>',
					format: 'image/png',
					zIndex: 150,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},

			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Sjukhus",
					layerId: "sjukhus",
					category: ["Omsorg, vård & stöd"],
					layers: "malmows:POI_VARD_SJUKHUS_PT",
					selectable: true,
					popup: '<div>${objektnamn}</div>\
							<br><a href="${url}">Mer information</a>',
					format: 'image/png',
					zIndex: 150,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},

			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Ungdomsmottagning",
					layerId: "ungdomsmottagning",
					category: ["Omsorg, vård & stöd"],
					layers: "malmows:POI_VARD_UNGDOMSMOTTAGNING_PT",
					selectable: true,
					popup: '<div>${objektnamn}</div>\
							<br><a href="${url}">Mer information</a>',
					format: 'image/png',
					zIndex: 150,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},

			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Vårdcentral",
					layerId: "vardenheter",
					category: ["Omsorg, vård & stöd"],
					layers: "malmows:POI_VARD_VARDCENTRAL_PT",
					selectable: true,
					popup: '<div>${objektnamn}</div>\
							<br><a href="${url}">Mer information</a>',
					format: 'image/png',
					zIndex: 150,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},

			
			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Antagna planer",
					layerId: "antagna_planer",
					category: ["Stadsplanering & trafik", "Stadsplanering & visioner", "Planer"],
					layers: "malmows:SMA_DP_ADP_YTOR_P",
					legend: "http://localhost/geoserver/wms?request=GetLegendGraphic&layer=malmows:SMA_DP_ADP_YTOR_P&version=1.1.1&format=image/png&rule=1",
					selectable: true,
					popup: '<div>${plan}</div>\
							<br><a href="http://kartor.malmo.se/asp/Planer/Planer_lmv.asp?PLAN=${plan}">Mer information</a>',
					format: 'image/png',
					zIndex: 150,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},
			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Pågående planer",
					layerId: "pagaende_planer",
					category: ["Stadsplanering & trafik", "Stadsplanering & visioner", "Planer"],
					layers: "malmows:SMA_PAGAENDE_PLANER_P",
					legend: "http://localhost/geoserver/wms?request=GetLegendGraphic&layer=malmows:SMA_PAGAENDE_PLANER_P&version=1.1.1&format=image/png&rule=1",
					selectable: true,
					popup: '<div>${plan}</div>\
							<div style="margin-top:1em;">\
								<a href="${url}">Mer information</a>\
								<a href="http://kartor.malmo.se/urbex/index.htm?p=true&xy=${easting};${northing}">Visa snedbild</a>\
							</div>',
					format: 'image/png',
					zIndex: 150,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},

			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Pågående planprogram",
					layerId: "sma_pagaende_planprogam",
					category: ["Stadsplanering & trafik", "Stadsplanering & visioner", "Planer"],
					layers: "malmows:SMA_PAGAENDE_PLANPROGRAM_P",
					legend: "http://localhost/geoserver/wms?request=GetLegendGraphic&layer=malmows:SMA_PAGAENDE_PLANPROGRAM_P&version=1.1.1&format=image/png&rule=1",
					selectable: true,
					popup: '<div>${plan}</div>\
							<div>${plan2}</div>\
							<div>${plan3}</div>\
							<div style="margin-top:1em;">\
								<a href="${url}">Mer information</a>\
								<a href="http://kartor.malmo.se/urbex/index.htm?p=true&xy=${easting};${northing}">Visa snedbild</a>\
							</div>',
					format: 'image/png',
					zIndex: 150,
					attribution: "@ Malmö stad",
					transparent: true,
					opacity: 0.75,
				}
			},

			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Arkitektur från 1500-talet",
					layerId: "arkitektur1500",
					category: ["Stadsplanering & trafik", "Stadsplanering & visioner", "Arkitektur"],
					layers: "malmows:HL_ARKITEKTUR_1500_PT_3006",
					selectable: true,
					selectOptions: {
						srs: "EPSG:3006",
						reverseAxis: false,
						reverseAxisBbox: true
					},
					popup: '<div>${namn}</div>\
							<br><img src="//kartor.malmo.se/wwwroot_data/bilder/sbk/arkitektur/${bildnamn}" style="width:150px;max-height:150px;margin-top: 1em;" />\
							<div style="margin-top:1em;">\
								<a href="${url}">Mer information</a>\
								<a href="http://kartor.malmo.se/urbex/index.htm?p=true&xy=${easting};${northing}">Visa snedbild</a>\
							</div>',
					format: 'image/png',
					zIndex: 150,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},

			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Arkitektur från 1800-talet",
					layerId: "arkitektur1800",
					category: ["Stadsplanering & trafik", "Stadsplanering & visioner", "Arkitektur"],
					layers: "malmows:HL_ARKITEKTUR_1800_PT_3006",
					selectable: true,
					selectOptions: {
						srs: "EPSG:3006",
						reverseAxis: false,
						reverseAxisBbox: true
					},
					popup: '<div>${namn}</div>\
							<br><img src="//kartor.malmo.se/wwwroot_data/bilder/sbk/arkitektur/${bildnamn}" style="width:150px;max-height:150px;margin-top: 1em;" />\
							<div style="margin-top:1em;">\
								<a href="${url}">Mer information</a>\
								<a href="http://kartor.malmo.se/urbex/index.htm?p=true&xy=${easting};${northing}">Visa snedbild</a>\
							</div>',
					format: 'image/png',
					zIndex: 150,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},

			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Arkitektur från 1900-talet",
					layerId: "arkitektur1900",
					category: ["Stadsplanering & trafik", "Stadsplanering & visioner", "Arkitektur"],
					layers: "malmows:HL_ARKITEKTUR_1900_PT_3006",
					selectable: true,
					selectOptions: {
						srs: "EPSG:3006",
						reverseAxis: false,
						reverseAxisBbox: true
					},
					popup: '<div>${namn}</div>\
							<br><img src="//kartor.malmo.se/wwwroot_data/bilder/sbk/arkitektur/${bildnamn}" style="width:150px;max-height:150px;margin-top: 1em;" />\
							<br>\
							<br><a href="${url}">Mer information</a>\
							<br><a href="http://kartor.malmo.se/urbex/index.htm?p=true&xy=${easting};${northing}">Visa snedbild</a>',
					format: 'image/png',
					zIndex: 150,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},

			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Arkitektur från 2000-talet",
					layerId: "arkitektur2000",
					category: ["Stadsplanering & trafik", "Stadsplanering & visioner", "Arkitektur"],
					layers: "malmows:HL_ARKITEKTUR_2000_PT_3006",
					selectable: true,
					selectOptions: {
						srs: "EPSG:3006",
						reverseAxis: false,
						reverseAxisBbox: true
					},
					popup: '<div>${namn}</div>\
							<br><img src="//kartor.malmo.se/wwwroot_data/bilder/sbk/arkitektur/${bildnamn}" style="width:150px;max-height:150px;margin-top: 1em;" />\
							<div style="margin-top:1em;">\
								<a href="${url}">Mer information</a>\
								<a href="http://kartor.malmo.se/urbex/index.htm?p=true&xy=${easting};${northing}">Visa snedbild</a>\
							</div>',
					format: 'image/png',
					zIndex: 150,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},

	   		{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Handikapptoalett",
					layerId: "handikapp",
					category: ["Stadsplanering & trafik", "Skötsel & underhåll"],
					layers: "malmows:GK_TOA_HANDIKAPP_PT",
					selectable: true,
					popup: '<div>${namn}</div>\
						Avgift: ${avgift}\
						<br>Handikapptoalett: ${handikapptoalett}\
						<br>Skötbord: ${skotbord}\
						<br>April-sept: ${oppettider_1}\
						<br>Oktober-mars: ${oppettider_2}\
						<br><img src="${bild}" style="width:150px;max-height:150px;margin-top: 1em;" />',
					format: 'image/png',
					zIndex: 150,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},			
			
	   		{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Offentliga toaletter",
					layerId: "offentligatoaletter",
					category: ["Stadsplanering & trafik", "Skötsel & underhåll"],
					layers: "malmows:GK_TOA_PT",
					selectable: true,
					popup: '<div>${namn}</div>\
						Avgift: ${avgift}\
						<br>Handikapptoalett: ${handikapptoalett}\
						<br>Skötbord: ${skotbord}\
						<br>April-sept: ${oppettider_1}\
						<br>Oktober-mars: ${oppettider_2}\
						<br><img src="${bild}" style="width:150px;max-height:150px;margin-top: 1em;" />',
					format: 'image/png',
					zIndex: 150,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},
 
			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Offentliga toaletter (avgift)",
					layerId: "offentligatoaletterAvgift",
					category: ["Stadsplanering & trafik", "Skötsel & underhåll"],
					layers: "malmows:GK_TOA_AVGIFT_PT",
					selectable: true,
					popup: '<div>${namn}</div>\
						Avgift: ${avgift}\
						<br>Handikapptoalett: ${handikapptoalett}\
						<br>Skötbord: ${skotbord}\
						<br>April-sept: ${oppettider_1}\
						<br>Oktober-mars: ${oppettider_2}\
						<br><img src="${bild}" style="width:150px;max-height:150px;margin-top: 1em;" />',
					format: 'image/png',
					zIndex: 150,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},			

			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Skötbord",
					layerId: "skotbord",
					category: ["Stadsplanering & trafik", "Skötsel & underhåll"],
					layers: "malmows:GK_TOA_SKOTBORD_PT",
					selectable: true,
					popup: '<div>${namn}</div>\
						Avgift: ${avgift}\
						<br>Handikapptoalett: ${handikapptoalett}\
						<br>Skötbord: ${skotbord}\
						<br>April-sept: ${oppettider_1}\
						<br>Oktober-mars: ${oppettider_2}\
						<br><img src="${bild}" style="width:150px;max-height:150px;margin-top: 1em;" />',
					format: 'image/png',
					zIndex: 150,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},			
			
			
			{
				init: "L.TileLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Cykelvägar",
					layerId: "cykelvagar",
					category: ["Stadsplanering & trafik", "Trafik & hållbart resande", "Cykel"],
					layers: "malmows:GK_CYKELVAG_L",
					legend: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/cykelvag.png",
					legendBig: "http://localhost/geoserver/wms?request=GetLegendGraphic&layer=malmows:GK_CYKELVAG_L&version=1.1.1&format=image/png&scale=50000",
					electable: true,
					format: 'image/png',
					zIndex: 250,
					popup: "<p>Typ: ${typ}</p>",
					attribution: "@ Malmö stad",
					transparent: true
				}
			},
			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Cykelpumpar",
					layerId: "cykelpumpar",
					category: ["Stadsplanering & trafik", "Trafik & hållbart resande", "Cykel"],
					legend: "http://localhost/geoserver/wms?request=GetLegendGraphic&layer=malmows:GK_CYKELPUMP_PT&version=1.1.1&format=image/png&scale=50000",
					layers: "malmows:GK_CYKELPUMP_PT",
					selectable: true,
					popup: '<div>${typ}</div>',
					format: 'image/png',
					zIndex: 350,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},


			{
				init: "L.NonTiledLayer.WMS",
				url: "http://kartor.malmo.se/smap-server/geoserver/wms",
				options: {
					displayName: "Hållplatser",
					layerId: "hallplats",
					category: ["Stadsplanering & trafik", "Trafik & hållbart resande", "Buss & Tåg"],
					layers: "common:poi_hallplatser1330_malmo",
					selectable: true,
					popup: '<div>${caption}</div>\
							<br><a href="http://mobil.skanetrafiken.se/Templates/Pages/JourneyPlanner/Search.aspx?r=627">Mer information (mobil)</a>\
							<br><a href="www.skanetrafiken.se">Mer information</a>',
					format: 'image/png',
					zIndex: 150,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},

			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Busstationer",
					layerId: "buss",
					category: ["Stadsplanering & trafik", "Trafik & hållbart resande", "Buss & Tåg"],
					layers: "malmows:POI_BUSS_STATION_PT",
					legend: "http://localhost/geoserver/wms?request=GetLegendGraphic&layer=malmows:POI_BUSS_STATION_PT&version=1.1.1&format=image/png&rule=1",
					selectable: true,
					popup: '<div>${objektnamn}</div>',
					format: 'image/png',
					zIndex: 150,
					attribution: "@ Malmö stad",
					transparent: true
				}
			},			
			
			{
				init: "L.NonTiledLayer.WMS",
				url: "http://localhost/geoserver/wms",
				options: {
					displayName: "Tågstationer",
					layerId: "tag",
					category: ["Stadsplanering & trafik", "Trafik & hållbart resande", "Buss & Tåg"],
					layers: "malmows:POI_TAG_STATION_PT",
					legend: "http://localhost/geoserver/wms?request=GetLegendGraphic&layer=malmows:POI_TAG_STATION_PT&version=1.1.1&format=image/png&rule=1",
					selectable: true,
					popup: '<div>${objektnamn}</div>',
					format: 'image/png',
					zIndex: 150,
					attribution: "@ Malmö stad",
					transparent: true
				}
			}








			// -- Bränder olyckor och skador ----------------------------------------------------------------------------------------------------------------------------
			// {
			// 	"init": "L.NonTiledLayer.WMS",
			// 	"url": "//kartor.malmo.se/arcgis/services/obs/MapServer/WMSServer",
			// 	"options": {
			// 		"dialog": "//kartor.malmo.se/wwwroot_data/metadata/obs/olyckor.htm?img=//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=23",
			// 		"legend": "//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=23",
			// 		"category": [
			// 			"Bränder, olyckor & skador*",
			// 			"Olyckor 2013"
			// 		],
			// 		"format": "image/png",
			// 		"selectable": false,
			// 		"attribution": "©MalmöStadsbyggnadskontor",
			// 		"transparent": true,
			// 		"zIndex": 350,
			// 		"layerId": "fotgangare",
			// 		"displayName": "Fotgängare",
			// 		"layers": "23",
			// 		"geomType": "polygon"
			// 	}
			// },
			// {
			// 	"init": "L.NonTiledLayer.WMS",
			// 	"url": "//kartor.malmo.se/arcgis/services/obs/MapServer/WMSServer",
			// 	"options": {
			// 		"dialog": "//kartor.malmo.se/wwwroot_data/metadata/obs/olyckor.htm?img=//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=22",
			// 		"legend": "//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=22",
			// 		"category": [
			// 			"Bränder, olyckor & skador*",
			// 			"Olyckor 2013"
			// 		],
			// 		"format": "image/png",
			// 		"selectable": false,
			// 		"attribution": "©MalmöStadsbyggnadskontor",
			// 		"layers": "22",
			// 		"transparent": true,
			// 		"layerId": "cykel",
			// 		"displayName": "Cykel",
			// 		"zIndex": 350,
			// 		"geomType": "polygon"
			// 	}
			// },
			// {
			// 	"init": "L.NonTiledLayer.WMS",
			// 	"url": "//kartor.malmo.se/arcgis/services/obs/MapServer/WMSServer",
			// 	"options": {
			// 		"dialog": "//kartor.malmo.se/wwwroot_data/metadata/obs/olyckor.htm?img=//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=21",
			// 		"legend": "//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=21",
			// 		"category": [
			// 			"Bränder, olyckor & skador*",
			// 			"Olyckor 2013"
			// 		],
			// 		"format": "image/png",
			// 		"selectable": false,
			// 		"attribution": "©MalmöStadsbyggnadskontor",
			// 		"layers": "21",
			// 		"transparent": true,
			// 		"layerId": "motorf",
			// 		"displayName": "Motorfordon",
			// 		"zIndex": 350,
			// 		"geomType": "polygon"
			// 	}
			// },
			// {
			// 	"init": "L.NonTiledLayer.WMS",
			// 	"url": "//kartor.malmo.se/arcgis/services/obs/MapServer/WMSServer",
			// 	"options": {
			// 		"dialog": "//kartor.malmo.se/wwwroot_data/metadata/obs/skador_tot.htm?img=//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=19",
			// 		"legend": "//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=19",
			// 		"category": [
			// 			"Bränder, olyckor & skador*",
			// 			"Skador 2013",
			// 			"Totalt"
			// 		],
			// 		"format": "image/png",
			// 		"selectable": false,
			// 		"attribution": "©MalmöStadsbyggnadskontor",
			// 		"layers": "19",
			// 		"transparent": true,
			// 		"layerId": "s_so_tot",
			// 		"displayName": "Statistikområde Totalt",
			// 		"zIndex": 150,
			// 		"opacity": 0.8,
			// 		"geomType": "polygon"
			// 	}
			// },
			// {
			// 	"init": "L.NonTiledLayer.WMS",
			// 	"url": "//kartor.malmo.se/arcgis/services/obs/MapServer/WMSServer",
			// 	"options": {
			// 		"dialog": "//kartor.malmo.se/wwwroot_data/metadata/obs/skador_tot.htm?img=//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=18",
			// 		"legend": "//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=18",
			// 		"category": [
			// 			"Bränder, olyckor & skador*",
			// 			"Skador 2013",
			// 			"Totalt"
			// 		],
			// 		"format": "image/png",
			// 		"selectable": false,
			// 		"attribution": "©MalmöStadsbyggnadskontor",
			// 		"layers": "18",
			// 		"transparent": true,
			// 		"layerId": "s_do_tot",
			// 		"displayName": "Delområde Totalt",
			// 		"zIndex": 150,
			// 		"opacity": 0.8,
			// 		"geomType": "polygon"
			// 	}
			// },
			// {
			// 	"init": "L.NonTiledLayer.WMS",
			// 	"url": "//kartor.malmo.se/arcgis/services/obs/MapServer/WMSServer",
			// 	"options": {
			// 		"dialog": "//kartor.malmo.se/wwwroot_data/metadata/obs/skador_tot.htm?img=//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=17",
			// 		"legend": "//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=17",
			// 		"category": [
			// 			"Bränder, olyckor & skador*",
			// 			"Skador 2013",
			// 			"Totalt"
			// 		],
			// 		"format": "image/png",
			// 		"selectable": false,
			// 		"attribution": "©MalmöStadsbyggnadskontor",
			// 		"layers": "17",
			// 		"transparent": true,
			// 		"layerId": "s_sd_tot",
			// 		"displayName": "Stadsdel Totalt",
			// 		"zIndex": 150,
			// 		"opacity": 0.8,
			// 		"geomType": "polygon"
			// 	}
			// },
			// {
			// 	"init": "L.NonTiledLayer.WMS",
			// 	"url": "//kartor.malmo.se/arcgis/services/obs/MapServer/WMSServer",
			// 	"options": {
			// 		"dialog": "//kartor.malmo.se/wwwroot_data/metadata/obs/skador_tra.htm?img=//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=15",
			// 		"legend": "//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=15",
			// 		"category": [
			// 			"Bränder, olyckor & skador*",
			// 			"Skador 2013",
			// 			"Trafik"
			// 		],
			// 		"format": "image/png",
			// 		"selectable": false,
			// 		"attribution": "©MalmöStadsbyggnadskontor",
			// 		"layers": "15",
			// 		"transparent": true,
			// 		"layerId": "s_so_tra",
			// 		"displayName": "Statistikområde Trafik",
			// 		"zIndex": 150,
			// 		"opacity": 0.8,
			// 		"geomType": "polygon"
			// 	}
			// },
			// {
			// 	"init": "L.NonTiledLayer.WMS",
			// 	"url": "//kartor.malmo.se/arcgis/services/obs/MapServer/WMSServer",
			// 	"options": {
			// 		"dialog": "//kartor.malmo.se/wwwroot_data/metadata/obs/skador_tra.htm?img=//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=14",
			// 		"legend": "//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=14",
			// 		"category": [
			// 			"Bränder, olyckor & skador*",
			// 			"Skador 2013",
			// 			"Trafik"
			// 		],
			// 		"format": "image/png",
			// 		"selectable": false,
			// 		"attribution": "©MalmöStadsbyggnadskontor",
			// 		"layers": "14",
			// 		"transparent": true,
			// 		"layerId": "s_do_tra",
			// 		"displayName": "Delområde Trafik",
			// 		"zIndex": 150,
			// 		"opacity": 0.8,
			// 		"geomType": "polygon"
			// 	}
			// },
			// {
			// 	"init": "L.NonTiledLayer.WMS",
			// 	"url": "//kartor.malmo.se/arcgis/services/obs/MapServer/WMSServer",
			// 	"options": {
			// 		"dialog": "//kartor.malmo.se/wwwroot_data/metadata/obs/skador_tra.htm?img=//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=13",
			// 		"legend": "//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=13",
			// 		"category": [
			// 			"Bränder, olyckor & skador*",
			// 			"Skador 2013",
			// 			"Trafik"
			// 		],
			// 		"format": "image/png",
			// 		"selectable": false,
			// 		"attribution": "©MalmöStadsbyggnadskontor",
			// 		"layers": "13",
			// 		"transparent": true,
			// 		"layerId": "s_sd_tra",
			// 		"displayName": "Stadsdel Trafik",
			// 		"zIndex": 150,
			// 		"opacity": 0.8,
			// 		"geomType": "polygon"
			// 	}
			// },
			// {
			// 	"init": "L.NonTiledLayer.WMS",
			// 	"url": "//kartor.malmo.se/arcgis/services/obs/MapServer/WMSServer",
			// 	"options": {
			// 		"dialog": "//kartor.malmo.se/wwwroot_data/metadata/obs/skador_bos.htm?img=//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=11",
			// 		"legend": "//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=11",
			// 		"category": [
			// 			"Bränder, olyckor & skador*",
			// 			"Skador 2013",
			// 			"Bostad"
			// 		],
			// 		"format": "image/png",
			// 		"selectable": false,
			// 		"attribution": "©MalmöStadsbyggnadskontor",
			// 		"layers": "11",
			// 		"transparent": true,
			// 		"layerId": "s_so_bos",
			// 		"displayName": "Statistikområde Bostad",
			// 		"zIndex": 150,
			// 		"opacity": 0.8,
			// 		"geomType": "polygon"
			// 	}
			// },
			// {
			// 	"init": "L.NonTiledLayer.WMS",
			// 	"url": "//kartor.malmo.se/arcgis/services/obs/MapServer/WMSServer",
			// 	"options": {
			// 		"dialog": "//kartor.malmo.se/wwwroot_data/metadata/obs/skador_bos.htm?img=//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=10",
			// 		"legend": "//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=10",
			// 		"category": [
			// 			"Bränder, olyckor & skador*",
			// 			"Skador 2013",
			// 			"Bostad"
			// 		],
			// 		"format": "image/png",
			// 		"selectable": false,
			// 		"attribution": "©MalmöStadsbyggnadskontor",
			// 		"layers": "10",
			// 		"transparent": true,
			// 		"layerId": "s_do_bos",
			// 		"displayName": "Delområde Bostad",
			// 		"zIndex": 150,
			// 		"opacity": 0.8,
			// 		"geomType": "polygon"
			// 	}
			// },
			// {
			// 	"init": "L.NonTiledLayer.WMS",
			// 	"url": "//kartor.malmo.se/arcgis/services/obs/MapServer/WMSServer",
			// 	"options": {
			// 		"dialog": "//kartor.malmo.se/wwwroot_data/metadata/obs/skador_bos.htm?img=//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=9",
			// 		"legend": "//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=9",
			// 		"category": [
			// 			"Bränder, olyckor & skador*",
			// 			"Skador 2013",
			// 			"Bostad"
			// 		],
			// 		"format": "image/png",
			// 		"selectable": false,
			// 		"attribution": "©MalmöStadsbyggnadskontor",
			// 		"layers": "9",
			// 		"transparent": true,
			// 		"layerId": "s_sd_bos",
			// 		"displayName": "Stadsdel Bostad",
			// 		"zIndex": 150,
			// 		"opacity": 0.8,
			// 		"geomType": "polygon"
			// 	}
			// },
			// {
			// 	"init": "L.NonTiledLayer.WMS",
			// 	"url": "//kartor.malmo.se/arcgis/services/obs/MapServer/WMSServer",
			// 	"options": {
			// 		"dialog": "//kartor.malmo.se/wwwroot_data/metadata/obs/skador_arb.htm?img=//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=7",
			// 		"legend": "//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=7",
			// 		"category": [
			// 			"Bränder, olyckor & skador*",
			// 			"Skador 2013",
			// 			"Arbete"
			// 		],
			// 		"format": "image/png",
			// 		"selectable": false,
			// 		"attribution": "©MalmöStadsbyggnadskontor",
			// 		"layers": "7",
			// 		"transparent": true,
			// 		"layerId": "s_so_arb",
			// 		"displayName": "Statistikområde Arbete",
			// 		"zIndex": 150,
			// 		"opacity": 0.8,
			// 		"geomType": "polygon"
			// 	}
			// },
			// {
			// 	"init": "L.NonTiledLayer.WMS",
			// 	"url": "//kartor.malmo.se/arcgis/services/obs/MapServer/WMSServer",
			// 	"options": {
			// 		"dialog": "//kartor.malmo.se/wwwroot_data/metadata/obs/skador_arb.htm?img=//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=6",
			// 		"legend": "//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=6",
			// 		"category": [
			// 			"Bränder, olyckor & skador*",
			// 			"Skador 2013",
			// 			"Arbete"
			// 		],
			// 		"format": "image/png",
			// 		"selectable": false,
			// 		"attribution": "©MalmöStadsbyggnadskontor",
			// 		"layers": "6",
			// 		"transparent": true,
			// 		"layerId": "s_do_arb",
			// 		"displayName": "Delområde Arbete",
			// 		"zIndex": 150,
			// 		"opacity": 0.8,
			// 		"geomType": "polygon"
			// 	}
			// },
			// {
			// 	"init": "L.NonTiledLayer.WMS",
			// 	"url": "//kartor.malmo.se/arcgis/services/obs/MapServer/WMSServer",
			// 	"options": {
			// 		"dialog": "//kartor.malmo.se/wwwroot_data/metadata/obs/skador_arb.htm?img=//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=5",
			// 		"legend": "//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=5",
			// 		"category": [
			// 			"Bränder, olyckor & skador*",
			// 			"Skador 2013",
			// 			"Arbete"
			// 		],
			// 		"format": "image/png",
			// 		"selectable": false,
			// 		"attribution": "©MalmöStadsbyggnadskontor",
			// 		"layers": "5",
			// 		"transparent": true,
			// 		"layerId": "s_sd_arb",
			// 		"displayName": "Stadsdel Arbete",
			// 		"zIndex": 150,
			// 		"opacity": 0.8,
			// 		"geomType": "polygon"
			// 	}
			// },
			// {
			// 	"init": "L.NonTiledLayer.WMS",
			// 	"url": "//kartor.malmo.se/arcgis/services/obs/MapServer/WMSServer",
			// 	"options": {
			// 		"dialog": "//kartor.malmo.se/wwwroot_data/metadata/obs/skador_idr.htm?img=//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=3",
			// 		"legend": "//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=3",
			// 		"category": [
			// 			"Bränder, olyckor & skador*",
			// 			"Skador 2013",
			// 			"Idrott"
			// 		],
			// 		"format": "image/png",
			// 		"selectable": false,
			// 		"attribution": "©MalmöStadsbyggnadskontor",
			// 		"layers": "3",
			// 		"transparent": true,
			// 		"layerId": "s_so_idr",
			// 		"displayName": "Statistikområde Idrott",
			// 		"zIndex": 150,
			// 		"opacity": 0.8,
			// 		"geomType": "polygon"
			// 	}
			// },
			// {
			// 	"init": "L.NonTiledLayer.WMS",
			// 	"url": "//kartor.malmo.se/arcgis/services/obs/MapServer/WMSServer",
			// 	"options": {
			// 		"dialog": "//kartor.malmo.se/wwwroot_data/metadata/obs/skador_idr.htm?img=//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=2",
			// 		"legend": "//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=2",
			// 		"category": [
			// 			"Bränder, olyckor & skador*",
			// 			"Skador 2013",
			// 			"Idrott"
			// 		],
			// 		"format": "image/png",
			// 		"selectable": false,
			// 		"attribution": "©MalmöStadsbyggnadskontor",
			// 		"layers": "2",
			// 		"transparent": true,
			// 		"layerId": "s_do_idr",
			// 		"displayName": "Delområde Idrott",
			// 		"zIndex": 150,
			// 		"opacity": 0.8,
			// 		"geomType": "polygon"
			// 	}
			// },
			// {
			// 	"init": "L.NonTiledLayer.WMS",
			// 	"url": "//kartor.malmo.se/arcgis/services/obs/MapServer/WMSServer",
			// 	"options": {
			// 		"dialog": "//kartor.malmo.se/wwwroot_data/metadata/obs/skador_idr.htm?img=//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=1",
			// 		"legend": "//kartor.malmo.se/arcgis/services/obs/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=1",
			// 		"category": [
			// 			"Bränder, olyckor & skador*",
			// 			"Skador 2013",
			// 			"Idrott"
			// 		],
			// 		"format": "image/png",
			// 		"selectable": false,
			// 		"attribution": "©MalmöStadsbyggnadskontor",
			// 		"layers": "1",
			// 		"transparent": true,
			// 		"layerId": "s_sd_idr",
			// 		"displayName": "Stadsdel Idrott",
			// 		"zIndex": 150,
			// 		"opacity": 0.8,
			// 		"geomType": "polygon"
			// 	}
			// }
			
			
		],
			
		bl: [

		// {
		// 	init: "L.TileLayer",
		// 	url: '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		// 	options: {
		// 		layerId: "osm",
		// 		displayName: "OSM",
		// 		attribution: '<span>© OpenStreetMap contributors</span>&nbsp;|&nbsp;<span>Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="//developer.mapquest.com/content/osm/mq_logo.png"></span>',
		// 		maxZoom: 18
		// 	}
		// },		

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
					legend: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/stadskartan.png",
					legendBig: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/stadskartan_big.png",
					format: 'image/png',
					transparent: false,
					opacity: 1.0,
					attribution: "© Malmö Stadsbyggnadskontor",
					zIndex: 50
					// printLayer: {
					// 	init: "L.TileLayer.WMS",
					// 	url: "http://kartor.malmo.se/arcgis/services/malmokarta_3857_wms/MapServer/WMSServer",
					// 	options: {
					// 		layers: '0',
					// 		format: 'image/png',
					// 		transparent: false,
					// 		opacity: 1.0
					// 	}
					// }
				}
		},	


		{
				init: "L.TileLayer.WMS",
				url: "http://kartor.malmo.se/arcgis/services/malmokarta_sv_3857_wms/MapServer/WMSServer",
				options: {
					layerId: "stadskartan_sv",
					displayName: "Stadskarta nedtonad",
					category: ["Karta"],
					layers: '0',
					minZoom: 10,
					maxZoom: 21,
					legend: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/stadskartan_nedtonad.png",
					legendBig: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/stadskartan_nedtonad_big.png",					
					format: 'image/png',
					transparent: true,
					opacity: 1.0,
					attribution: "© Malmö Stadsbyggnadskontor",
					zIndex: 50,
					printLayer: {
						options: {
							transparent: false
						}
					}
				}
		},	
		
		
/*		
{
				init: "L.esri.DynamicMapLayer",
				url: "http://kartor.malmo.se/arcgis/rest/services/malmokarta_3857/MapServer",
				options: {
					//reuseTiles: true,  ANVÄND EJ
					transparent: true,
 					category: ["Karta"], 
					format: "png",
					singleTile: true,
					layerId: "stadskartan_esri_dyn",
					displayName: "Malmö stadskarta ESRI DYN",
					opacity: 1.0,
					minZoom: 10,
					maxZoom: 18,
					attribution: '© Malmö Stadsbyggnadskontor',
					zIndex: 50
				}
		},  
		
		
		{
				init: "L.TileLayer.EsriRest",
				url: "http://kartor.malmo.se/arcgis/rest/services/malmokarta_3857/MapServer",
				options: {
					//reuseTiles: true,  ANVÄND EJ
					transparent: true,
					layerId: "stadskartan_rest",
					displayName: "Malmö stadskarta esri rest",
					category: ["Karta"],
					opacity: 1.0,
					minZoom: 10,
					maxZoom: 18,
					attribution: '© Malmö Stadsbyggnadskontor',
					zIndex: 50
				}
		},					
*/

		{
				init: "L.TileLayer.WMS",
				url: "http://localhost/geoserver/malmows/wms?",
				options: {
					layerId: "malmo_karta_1912",
					displayName: "Häradskartan 1912",
					category: ["Karta"],
					layers: 'malmows:haradskartan',
					minZoom: 10,
					maxZoom: 21,
					legend: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/haradskartan.png",
					legendBig: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/haradskartan.png",
					format: 'image/png',
					transparent: true,
					opacity: 0.9,
					attribution: "© Malmö Stadsbyggnadskontor",
					zIndex: 50
				}
		},
		
		{
				init: "L.TileLayer.WMS",
				url: "http://localhost/geoserver/malmows/wms?",
				options: {
					layerId: "malmo_karta_1812",
					displayName: "Rekognosceringskarta 1812",
					category: ["Karta"],
					layers: 'malmows:rekognosceringskarta_malmo',
					minZoom: 10,
					maxZoom: 21,
					legend: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/rekognosceringskartan.png",
					legendBig: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/rekognosceringskartan.png",
					format: 'image/png',
					transparent: true,
					opacity: 0.9,
					attribution: "© Malmö Stadsbyggnadskontor",
					zIndex: 50
				}
		},

		
		{
				init: "L.TileLayer.WMS",
				url: "http://localhost/geoserver/malmows/wms?",
				options: {
					layerId: "malmo_ortofoto",
					displayName: "Fotokarta 2014",   
					layers: 'malmows:malmo_orto',  //senaste orto ska heta malmo_orto 
					category: ["Fotokarta"],
					minZoom: 10,
					maxZoom: 21,
					legend: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/orto2014_big.png",
					//legendBig: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/orto2014_big.png",
					format: 'image/jpeg',
					transparent: true,
					opacity: 0.9,
					attribution: "© Lantmäteriet",
					zIndex: 50
				}
		},

		{
				init: "L.TileLayer.WMS",
				url: "http://localhost/geoserver/malmows/wms?",
				options: {
					layerId: "malmo_ortofoto_2013",
					displayName: "Fotokarta 2013",
					layers: 'malmows:malmo_orto_2013',
					category: ["Fotokarta"],
					minZoom: 10,
					maxZoom: 21,
					legend: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/orto2013_big.png",
					//legendBig: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/orto2013_big.png",
					format: 'image/jpeg',
					transparent: true,
					opacity: 0.9,
					attribution: "© Malmö Stadsbyggnadskontor",
					zIndex: 50
				}
		},

		
		{
				init: "L.TileLayer.WMS",
				url: "http://localhost/geoserver/malmows/wms?",
				options: {
					layerId: "malmo_ortofoto_2012",
					displayName: "Fotokarta 2012",
					layers: 'malmows:malmo_orto_2012',
					category: ["Fotokarta"],
					minZoom: 10,
					maxZoom: 21,
					legend: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/orto2012_big.png",
					//legendBig: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/orto2012.png",
					format: 'image/jpeg',
					transparent: true,
					opacity: 0.9,
					attribution: "© Lantmäteriet",
					zIndex: 50
				}
		},

		{
				init: "L.TileLayer.WMS",
				url: "http://localhost/geoserver/malmows/wms?",
				options: {
					layerId: "malmo_ortofoto_2011",
					displayName: "Fotokarta 2011",
					layers: 'malmows:malmo_orto_2011',
					category: ["Fotokarta"],
					minZoom: 10,
					maxZoom: 21,
					legend: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/orto2011_big.png",
					//legendBig: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/orto2011.png",					
					format: 'image/jpeg',
					transparent: true,
					opacity: 0.9,
					attribution: "© Lantmäteriet",
					zIndex: 50
				}
		},

		{
				init: "L.TileLayer.WMS",
				url: "http://localhost/geoserver/malmows/wms?",
				options: {
					layerId: "malmo_ortofoto_2010",
					displayName: "Fotokarta 2010",
					layers: 'malmows:malmo_orto_2010',
					category: ["Fotokarta"],
					minZoom: 10,
					maxZoom: 21,
					legend: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/orto2010_big.png",
					//legendBig: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/orto2010.png",					
					format: 'image/jpeg',
					transparent: true,
					opacity: 0.9,
					attribution: "© Malmö Stadsbyggnadskontor",
					zIndex: 50
				}
		},

		{
				init: "L.TileLayer.WMS",
				url: "http://localhost/geoserver/malmows/wms?",
				options: {
					layerId: "malmo_ortofoto_2009",
					displayName: "Fotokarta 2009",
					layers: 'malmows:malmo_orto_2009',
					category: ["Fotokarta"],
					minZoom: 10,
					maxZoom: 21,
					legend: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/orto2009_big.png",
					//legendBig: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/orto2009.png",					
					format: 'image/jpeg',
					transparent: true,
					opacity: 0.9,
					attribution: "© Lantmäteriet",
					zIndex: 50
				}
		},		

		{
				init: "L.TileLayer.WMS",
				url: "http://localhost/geoserver/malmows/wms?",
				options: {
					layerId: "malmo_ortofoto_2004",
					displayName: "Fotokarta 2004",
					layers: 'malmows:malmo_orto_2004',
					category: ["Fotokarta"],
					minZoom: 10,
					maxZoom: 21,
					legend: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/orto2004_big.png",
					//legendBig: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/orto2004.png",					
					format: 'image/jpeg',
					transparent: true,
					opacity: 0.9,
					attribution: "© Lantmäteriet",
					zIndex: 50
				}
		},			

		{
				init: "L.TileLayer.WMS",
				url: "http://localhost/geoserver/malmows/wms?",
				options: {
					layerId: "malmo_ortofoto_2001",
					displayName: "Fotokarta 2001",
					layers: 'malmows:malmo_orto_2001',
					category: ["Fotokarta"],
					minZoom: 10,
					maxZoom: 21,
					legend: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/orto2001_big.png",
					//legendBig: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/orto2001.png",					
					format: 'image/jpeg',
					transparent: true,
					opacity: 0.9,
					attribution: "© Lantmäteriet",
					zIndex: 50
				}
		},		

		{
				init: "L.TileLayer.WMS",
				url: "http://localhost/geoserver/malmows/wms?",
				options: {
					layerId: "malmo_ortofoto_1998",
					displayName: "Fotokarta 1998",
					layers: 'malmows:malmo_orto_1998',
					category: ["Fotokarta"],
					minZoom: 10,
					maxZoom: 21,
					legend: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/orto1998_big.png",
					//legendBig: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/orto1998.png",					
					format: 'image/jpeg',
					transparent: true,
					opacity: 0.9,
					attribution: "© Lantmäteriet",
					zIndex: 50
				}
		},	
		
		{
				init: "L.TileLayer.WMS",
				url: "http://localhost/geoserver/malmows/wms?",
				options: {
					layerId: "malmo_ortofoto_1940",
					displayName: "Fotokarta 1938-47",
					layers: 'malmows:malmo_orto_1940',
					category: ["Fotokarta"],
					minZoom: 10,
					maxZoom: 21,
					legend: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/orto1940_big.png",
					//legendBig: "http://kartor.malmo.se/wwwroot_data/bilder/kartsymboler/orto1940.png",					
					format: 'image/jpeg',
					transparent: true,
					opacity: 0.9,
					attribution: "© Lantmäteriet",
					zIndex: 50
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
					// {
					// 	init: "L.Control.Test",
					// 	options: {
					// 		imperial: false
					// 	}
					// },
					{
						init: "L.Control.MalmoHeader",
						options: {}
					},
					{
						init: "L.Control.LayerSwitcher",
						options: {
							toggleSubLayersOnClick: false,
							olFirst: true
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
						init: "L.Control.SelectWMS",
						options: {
							buffer: 12,
							useProxy: false
						}
					},
					{
						init: "L.Control.SelectVector",
						options: {}
					},
					// {
					// 	init: "L.Control.SharePosition",
					// 	options: {}
					// },
					{
						init: "L.Control.Search",
						options: {
							_lang: {
								"sv": {search: "Sök adress eller plats"}
							},
							gui: true,
							whitespace: "%20",
							wsOrgProj: "EPSG:3008",
							useProxy: false,
							wsAcUrl: "//kartor.malmo.se/api/v1/addresses/autocomplete/", // autocomplete
							wsLocateUrl: "//kartor.malmo.se/api/v1/addresses/geolocate/", // geolocate
							acOptions: {
								items: 100
							}
						}
					},

					// --- Toolbar items (order here determines visual order in toolbar) ---
					{
 						init: "L.Control.Print",
 						options: {
 							printUrl: "//kartor.malmo.se/print-servlet/leaflet_print/", // //161.52.15.157/geoserver/pdf
 							position: "topright"
 						}
 				 	},
					{
						init: "L.Control.ShareLink",
						options: {
							position: "topright",
							root: location.protocol + "//malmo.se/karta?" // location.protocol + "//kartor.malmo.se/init/?appid=stadsatlas-v1&" // Link to malmo.se instead of directly to map
						}
					},
					// {
					// 	init : "L.Control.RedirectClick", // Street view		
					// 	options: {
					// 		position: "topright",
					// 		url: "http://sbkvmgeoserver.malmo.se/cyclomedia/index.html?posx=${x}&posy=${y}",
					// 		btnClass: "fa fa-car",
					// 		cursor: "crosshair",

					// 		_lang: {
					// 			"sv": {
					// 				name: "Gatuvy",
					// 				hoverText: "Klicka i kartan för att se gatuvy",
					// 			},
								
					// 			"en": {
					// 				name: "Street view",
					// 				hoverText: "Click on the map to show street view"									
					// 			}
					// 		}
					// 	}
					// },
					{
						init : "L.Control.RedirectClick", // Pictometry
						options: {
							position: "topright",
							// The following URL should be http and not protocol agnostic, because it doesn't support https
							url: "http://kartor.malmo.se/urbex/index.htm?p=true&xy=${x};${y}", // Malmö pictometry
							//url: "http://kartor.helsingborg.se/urbex/sned_2011.html?p=true&xy=${x};${y}", //Helsingborg pictometry
							btnClass: "fa fa-plane",
							cursor: "crosshair",

							_lang: {
								"sv": {
									name: "Snedbild",
									hoverText: "Klicka i kartan för att se snedbild",
								},
								
								"en": {
									name: "Pictometry",
									hoverText: "Click on the map to show pictometry"									
								}
							}
						}
					},
					// {
 				// 		init: "L.Control.Info",
 				// 		options: {
 				// 			position: "topright"
 				// 		}
 				//  	},
 				 	{
						init: "L.Control.MeasureDraw",
						options: {
							position: "topright"
						}
					},
 				//  	{
					// 	init: "L.Control.Opacity",
					// 	options: {
					//  		savePrefBox: true,
					//  		position: "topright"
					// 	}
					// },
					{
						init: "L.Control.ToolHandler",
						options: {}
					}
					// {
					//  	init: "L.Control.Add2HomeScreen",
					//  	options: {}
					// },
					//{
					//	 init: "L.Control.FullScreen",
					//		options: {position: 'topright'}
					//}
					// ,
					// {
					// 	init: "L.Control.DrawSmap",
					// 	options: {
					// 		position: "topright"
					// 	}
					// }
		]
};


function getUrlWithProtocol(url) {
	if ( !((url) && typeof(url) === "string") ) {
		return url;
	}
	if (url.substring(0, 5).toLowerCase() === "http:") {
		newUrl = location.protocol + url.substring(5);
	}
	else if (url.substring(0, 5).toLowerCase() === "https") {
		newUrl = location.protocol + url.substring(6);
	}
	else if (url.substring(0, 2) === "//") {
		newUrl = location.protocol + url;
	}
	else {
		// Nothing to change... this URL cannot be a URL as far as I understand :)
		newUrl = url;
	}
	return newUrl;
}

function preProcessConfig(c) {
	// Default select options, can be overridden by explicitly set select options
	var selectOptions = {
			info_format: "application/json",
			srs: "EPSG:3008",
			reverseAxis: false,
			reverseAxisBbox: true
	};

	var layers = c.ol.concat(c.bl),
		url, newUrl;
	for (var i=0,len=layers.length; i<len; i++) {
		t = layers[i];
		if (t.options && t.options.selectable && (t.init === "L.NonTiledLayer.WMS" || t.init === "L.TileLayer.WMS")) {
			t.options.selectOptions = $.extend({}, selectOptions, t.options.selectOptions || {});
		}
		// Convert "http://" and "//" into location.protocol + "//"
		t.url = getUrlWithProtocol(t.url);
		if (t.options && t.options instanceof Object) {
			t.options.legend = getUrlWithProtocol(t.options.legend);
			t.options.legendBig = getUrlWithProtocol(t.options.legendBig);
		}
	}
}





// -- Add hidden stuff – if you are a valid user --

var hiddenControls = [
	{
		init : "L.Control.RedirectClick", // Street view		
		options: {
			position: "topright",
			// The following URL should be http and not protocol agnostic, because it doesn't support https
			url: "http://sbkvmgeoserver.malmo.se/cyclomedia/index.html?posx=${x}&posy=${y}",
			btnClass: "fa fa-car",
			cursor: "crosshair",

			_lang: {
				"sv": {
					name: "Gatuvy",
					hoverText: "Klicka i kartan för att se gatuvy",
				},
				
				"en": {
					name: "Street view",
					hoverText: "Click on the map to show street view"									
				}
			}
		}
	}
];











