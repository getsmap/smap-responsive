var ws = {
	"localhost": {
		proxy: "http://localhost:8080/proxy.py?url="
		//proxy: "http://localhost/cgi-bin/proxy.py?url="
	},
	"kartor.lund.se": {
		proxy: "http://kartor.lund.se/proxy.py?url="
	}
};
var config = {

	// These params are default and can be overridden by calling the map with e.g. http://mymap?center=13.1,55.6&zoom=17
	params: {
		// The map's centering from start. Coordinates should be in WGS 84 and given like [easting, northing] i.e. [longitude, latitude]
		center: [13.156692, 55.707421],

		// The initial zoom of the map, In this example I zoom out slightly if the screen is smaller than given number of pixels
		zoom: $(window).width() < 600 ? 11 : 13
	},
	ws: ws,

	// Optional configuration object for the Leaflet map object. You can use all options specified here: http://leafletjs.com/reference.html#map-class
	// mapConfig: {
	// 	maxBounds: [	// Optional. Limit panning of the map. Given as [[north, west], [south, east]]
	// 		[55.71628170645908, 12.6507568359375],
	// 		[55.42589636057864, 13.34564208984375]
	// 	],	
	// 	minZoom: 11,	// Optional. Limit how much you can zoom out. 0 is maximum zoomed out.
	// 	maxZoom: 18 	// Optional. Limit how much you can zoom in. 18 is usually the maximum zoom.
	// },

	smapOptions: {
		// The text of the <title>-tag
		title: "Lunds kommun",

		// The favicon to be used
		favIcon: "img/lund-favicon.ico"
	},

	// -- Baselayers (background layers) --

	// -- Baselayers (background layers) --
	bl: [
		// -- An openstreetmap layer. Note that all layer types used as overlays can also be used as baselayers, and vice versa (see more layers below). --
		{
			init: "L.TileLayer",
			url: 'http://api.tiles.mapbox.com/v4/lundskommun.j909n073/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibHVuZHNrb21tdW4iLCJhIjoiTGRtQW51WSJ9.f-bABPBDFFzgUc3UkBsAGA#12/55.6922/13.2732',
			options: {
				layerId: "mapboxlund",
				displayName: "OpenStreetMap",
				attribution: "© Mapbox © OpenStreetMap",
				maxZoom: 18
			}
		},
		// {
		// 	init: "L.BingLayer",
		// 	//url: 'http://api.tiles.mapbox.com/v4/lundskommun.j909n073/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibHVuZHNrb21tdW4iLCJhIjoiTGRtQW51WSJ9.f-bABPBDFFzgUc3UkBsAGA#12/55.6922/13.2732',
		// 	key: "ArnlcFILNVTLn5NnwH731HwoKcUDS5hSbTTMq5U0Cd5jYwv7zvUPWgCJvT99krNa",
		// 	options: {
		// 		layerId: "binglayer",
		// 		displayName: "Flygfoto, Bing aerial",
		// 		category: ["Flygfoto"],
		// 		attribution: '<a href="http://www.microsoft.com/maps/assets/docs/terms.aspx" target="_blank">Bing maps TOU</a>',
		// 		maxZoom: 18
		// 	}
		// },
		{
			init: "L.TileLayer.WMS",
			url: "http://kartor.lund.se/geoserver/wms?",
			options: {
				layerId: "orto2014",
				displayName: "Flygfoto, Lund 2014",
				layers: 'lund:orto14wgs84',
				// category: ["Flygfoto"],
				format: 'image/jpeg',
				legend: false,
				transparent: true,
				opacity: 0.9,
				attribution: "Â© LantmÃ¤teriet",
				zIndex: 50
			}
		}
	],

	// -- Overlays --
	ol: [
		// {
		// init: "L.TileLayer.WMS",
		// url: "http://kartor.lund.se/geoserver/wms",
		// options: {
		// // legend: false,
		// //category: ["Uppleva & göra","Bibliotek"],
		// layerId: "lkarta_kommungrans",
		// displayName: "Kommungräns",
		// layers: 'lkarta_kommungrans',
		// format: 'image/png',
		// featureType: "polygon",
		// selectable: false,
		// transparent: true,
		// opacity: 1,
		// attribution: "@ Lunds kommun",
		// //popup: "<p>${namn_verks} <br/> ${adress}</p><p>${beskr}</p><p><a href=${url}>läs mer</a></p>",
		// zIndex: 10
		// }
		// },
		{
			init: "L.TileLayer.WMS",
			url: "http://kartor.lund.se/geoserver/wms",
			options: {
				//legend: true,
				category: ["Uppleva & göra", "Bibliotek"],
				layerId: "lkarta_bibliotek",
				displayName: "Bibliotek",
				layers: 'lkarta_bibliotek',
				format: 'image/png',
				featureType: "polygon",
				selectable: true,
				transparent: true,
				opacity: 1,
				attribution: "@ Lunds kommun",
				popup: "<p>${namn_verks} <br/> ${adress}</p><p>${beskr}</p><p><a href=${url}>läs mer</a></p>",
				zIndex: 10
			}
		},
		{
			init: "L.TileLayer.WMS",
			url: "http://kartor.lund.se/geoserver/wms",
			options: {
				//legend: true,
				category: ["Uppleva & göra", "Bibliotek"],
				layerId: "lkarta_biblbussen",
				displayName: "Biblioteksbussen",
				layers: 'lkarta_biblbussen',
				format: 'image/png',
				featureType: "polygon",
				selectable: true,
				transparent: true,
				opacity: 1,
				attribution: "@ Lunds kommun",
				popup: "<p>Hållplats:<br/>${adress}</p><p><a href=${url}>Tidtabell</a></p>",
				zIndex: 10
			}
		},
		{
			init: "L.TileLayer.WMS",
			url: "http://kartor.lund.se/geoserver/wms",

			parentTag: "service",
			options: {
				category: ["Trafik & infrastruktur"],
				layerId: "cykelpump",
				displayName: "Cykelpumpar",
				layers: 'lkarta_cykelpumpar',
				// selectLayers:"polka_fastigheter",
				format: 'image/png',
				featureType: "polygon",
				selectable: true,
				transparent: true,
				attribution: "@ Lunds kommun",
				popup: "<p>${adress}</p>"
				//zIndex: 9
			}
		},
		{
			init: "L.TileLayer.WMS",
			url: "http://kartor.lund.se/geoserver/wms",
			parentTag: "service",
			options: {
				category: ["Trafik & infrastruktur"],
				layerId: "offentliga_toaletter",
				displayName: "Offentliga toaletter",
				layers: 'offentliga_toaletter',
				// selectLayers:"polka_fastigheter",
				format: 'image/png',
				featureType: "polygon",
				selectable: true,
				transparent: true,
				attribution: "@ Lunds kommun",
				popup: "<p>${plats}</p><p>Öppet: ${tider}</p><p>Handikappanpassad: ${handikappanpassad}</p><p><a href=${url}>Läs mer</a></p>",
				//zIndex: 9
			}
		},
		//  {
		//     init: "L.TileLayer.WMS",
		// 	url: "http://193.17.67.229/geoserver/common/wms?",
		//     parentTag: "service",
		//     options: {
		//         //legend: true,
		//         category: ["Trafik & infrastruktur"],
		//         layerId: "hallplatser",
		//         displayName: "Hållplatser",
		//         layers: 'common:lund_hallplatser',
		//         format: 'image/png',
		// 		info_format: 'text/json',
		//         selectable: true,
		//         transparent: true,
		//         opacity: 1,
		//         attribution: "@ Skånetrafiken	",
		//         popup: "<p>${caption}</p>",
		//         zIndex: 10
		//     }
		//  },

		{
			init: "L.esri.dynamicMapLayer",
			url: "http://arcgisserver.lund.se/arcgis/rest/services/extern/Registerkarta_Lund/MapServer",
			options: {
				legend: "img/legend/fastinfo.png",
				category: ["Bygga, bo & miljö"],
				displayName: "Fastigheter",
				transparent: true,
				layerId: "registerkartadyn",
				attribution: "Stadsbyggnadskontoret, Lund",
				popup: '${OBJECTID}',
				uniqueKey: "OBJECTID",
				selectable: true // select doesn't work with this ESRI layer
			}
		},
		{

			init: "L.TileLayer.WMS",
			url: "http://kartor.lund.se/geoserver/wms",
			options: {

				category: ["Bygga, bo & miljö"],
				layerId: "fastytor",
				displayName: "Fastighetsinformation",
				layers: 'polka_fastigheter',
				format: 'image/png',
				featureType: "polygon",
				selectable: true,
				transparent: true,
				opacity: 1,
				attribution: "@ Lunds kommun",
				popup: "<p>${fastighet}</p><p><a href=${url1}>FIR</a></p>",
				zIndex: 9
			}
		},
		{

			init: "L.TileLayer.WMS",
			url: "http://kartor.lund.se/geoserver/wms",
			options: {
				//legend: true,
				category: ["Bygga, bo & miljö"],
				layerId: "PlangranserWGS84",
				displayName: "Gällande detaljplaner",
				layers: 'PlangranserWGS84Extern',
				format: 'image/png',
				featureType: "polygon",
				selectable: true,
				transparent: true,
				opacity: 1,
				attribution: "@ Lunds kommun",
				popup: "<p>${extid}</p><p><a href=${url}>länk till plan</a></p>",
				zIndex: 9
			}
		},	
		{
                	init: "L.TileLayer.WMS",
                	url: "http://kartor.lund.se/geoserver/wms",
                	options: 
			{
                    		//legend: true,
                    	    category: ["Bygga, bo & miljö"],
                    		layerId: "plan_pagaende",
                    		displayName: "Pågående planer",
                    		layers: 'plan_pagaende',
                    		format: 'image/png',
                    		featureType: "polygon",
                    		selectable: true,
                    		transparent: true,
                    		opacity: 1,
                    		attribution: "@ Lunds kommuns",
                    		popup: "<p>Plan: ${popularnamn}</p><p>Nummer: ${pa}</p><p>Skede: ${status}</p><p><a href=http://www.lund.se/${pa}>läs mer</a></p>",
                    		zIndex: 10,
				
           		}


		},
		{
			init: "L.TileLayer.WMS",
			url: "http://kartor.lund.se/geoserver/wms",
			options:
			{
				//legend: true,
				category: ["Bygga, bo & miljö"],
				layerId: "plan_pagaende",
				displayName: "Pågående planer",
				layers: 'plan_pagaende',
				format: 'image/png',
				featureType: "polygon",
				selectable: true,
				transparent: true,
				opacity: 1,
				attribution: "@ Lunds kommuns",
				popup: "<p>Plan: ${popularnamn}</p><p>Nummer: ${pa}</p><p>Skede: ${status}</p><p><a href=http://www.lund.se/${pa}>läs mer</a></p>",
				zIndex: 10,

			}


		},
		{
			init: "L.TileLayer.WMS",
			url: "http://kartor.lund.se/geoserver/wms",
			options: {
				//legend: true,
				category: ["Bygga, bo & miljö"],
				layerId: "stomnat",
				displayName: "Stomnät",
				layers: 'STOMNAT',
				format: 'image/png',
				featureType: "polygon",
				selectable: true,
				transparent: true,
				opacity: 1,
				attribution: "@ Lunds kommun",
				popup: "<p>${punkttyp}</p><p>${punktnummer}</p>",
				zIndex: 9
			}
		},



		{
			init: "L.TileLayer.WMS",
			url: "http://kartor.lund.se/geoserver/wms",
			options: {
				//legend: true,
				category: ["Trafik & infrastruktur"],
				layerId: "vagnatPlaneradHastighet",
				displayName: "Hastighet, kommunal väg",
				layers: 'vagnatPlaneradHastighet',
				format: 'image/png',
				featureType: "polygon",
				selectable: true,
				transparent: true,
				opacity: 1,
				attribution: "@ Lunds kommun",
				popup: "<p>30 km/h <font size=14 color=#CA1817>__</font></p><p>40 km/h <font size=14 color=#1CA8E1>__</font></p><p>60 km/h <font size=14 color=#E49703>__</font></p>",
				zIndex: 9
			}
		},

		{
			init: "L.TileLayer.WMS",
			url: "http://kartor.lund.se/geoserver/wms",
			options: {
				//legend: true,
				category: ["Bygga, bo & miljö"],
				layerId: "lkarta_studentbo",
				displayName: "Studentboende",
				layers: 'lkarta_studentbo',
				format: 'image/png',
				featureType: "polygon",
				selectable: true,
				transparent: true,
				opacity: 1,
				attribution: "@ Lunds kommun",
				popup: "<p>${namn}<br/>${adress}</p><p><a href=http://${www}>hemsida</a></p>",
				zIndex: 10
			}
		},
		{
			init: "L.TileLayer.WMS",
			url: "http://kartor.lund.se/geoserver/wms",

			parentTag: "service",
			options: {
				category: ["Bygga, bo & miljö"],
				layerId: "atervinnings",
				displayName: "Återvinning i Lund",
				layers: 'lkarta_atervinnings',
				// selectLayers:"polka_fastigheter",
				format: 'image/png',
				featureType: "polygon",
				selectable: true,
				transparent: true,
				attribution: "@ Lunds kommun",
				popup: "<p>${typ}</p><p>${namn}</p><p>${adress}</p><p>${postadress}</p><p>${extras}</p><p><a href=${url}>läs mer</a></p>"
				//zIndex: 9
			}
		},


		{
			init: "L.TileLayer.WMS",
			url: "http://kartor.lund.se/geoserver/wms",
			options: {
				//legend: true,
				category: ["Uppleva & göra", "Idrott & Fritid"],
				layerId: "lkarta_idrott_fritid_bad",
				displayName: "Bad",
				layers: 'lkarta_idrott_fritid_bad',
				format: 'image/png',
				featureType: "polygon",
				selectable: true,
				transparent: true,
				opacity: 1,
				attribution: "@ Lunds kommun",
				popup: "<p>${namn_verks}</p><p>${beskr}</p><p><a href=${url}>hemsida</a></p>",
				zIndex: 10
			}
		},
		{
			init: "L.TileLayer.WMS",
			url: "http://kartor.lund.se/geoserver/wms",
			options: {
				//legend: true,
				category: ["Uppleva & göra", "Idrott & Fritid"],
				layerId: "lkarta_idrott_fritid_camping",
				displayName: "Camping",
				layers: 'lkarta_idrott_fritid_camping',
				format: 'image/png',
				featureType: "polygon",
				selectable: true,
				transparent: true,
				opacity: 1,
				attribution: "@ Lunds kommun",
				popup: "<p>${namn_verks}</p><p><a href=${url}>hemsida</a></p>",
				zIndex: 10
			}
		},
		{
			init: "L.TileLayer.WMS",
			url: "http://kartor.lund.se/geoserver/wms",
			options: {
				//legend: true,
				category: ["Uppleva & göra", "Idrott & Fritid"],
				layerId: "lkarta_idrott_fritid_riding",
				displayName: "Ridsport",
				layers: 'lkarta_idrott_fritid_riding',
				format: 'image/png',
				featureType: "polygon",
				selectable: true,
				transparent: true,
				opacity: 1,
				attribution: "@ Lunds kommun",
				popup: "<p>${namn_verks}</p><p>${beskr}</p><p><a href=${url}>hemsida</a></p>",
				zIndex: 10
			}
		},
		{
			init: "L.TileLayer.WMS",
			url: "http://kartor.lund.se/geoserver/wms",
			options: {
				//legend: true,
				category: ["Uppleva & göra", "Idrott & Fritid"],
				layerId: "lkarta_idrott_fritid_idrhall",
				displayName: "Idrottshallar",
				layers: 'lkarta_idrott_fritid_idrhall',
				format: 'image/png',
				featureType: "polygon",
				selectable: true,
				transparent: true,
				opacity: 1,
				attribution: "@ Lunds kommun",
				popup: "<p>${namn_verks}</p><p>${beskr}</p><p><a href=${url}>hemsida</a></p>",
				zIndex: 10
			}
		},
		{
			init: "L.TileLayer.WMS",
			url: "http://kartor.lund.se/geoserver/wms",

			options: {
				//legend: true,
				category: ["Uppleva & göra", "Idrott & Fritid"],
				layerId: "lkarta_idrott_fritid_idrottsplatser",
				displayName: "Idrottsplatser",
				layers: 'lkarta_idrott_fritid_idrottsplatser',
				format: 'image/png',
				featureType: "polygon",
				selectable: true,
				transparent: true,
				opacity: 1,
				attribution: "@ Lunds kommun",
				popup: "<p>${namn_verks}</p><p>${beskr}</p><p><a href=${url}>hemsida</a></p>",
				zIndex: 10
			}
		},
		/* {
			 init: "L.TileLayer.WMS",
			 url: "http://kartor.lund.se/geoserver/wms",
			 
			 options: {
				 //legend: true,
				 category: ["Uppleva & göra","Idrott & Fritid"],
				 layerId: "lkarta_idrott_fritid_faltgruppen",
				 displayName: "Fältgruppen",
				 layers: 'lkarta_idrott_fritid_faltgruppen',
				 format: 'image/png',
				 featureType: "polygon",
				 selectable: true,
				 transparent: true,
				 opacity: 1,
				 attribution: "@ Lunds kommun",
				 popup: "<p><a href=${url}>hemsida</a></p>",
				 zIndex: 10
			 }
		 },
				{
			 init: "L.TileLayer.WMS",
			 url: "http://kartor.lund.se/geoserver/wms",
			 
			 options: {
				 //legend: true,
				 category: ["Uppleva & göra","Idrott & Fritid"],
				 layerId: "lkarta_idrott_fritid_ungpolitik",
				 displayName: "Ungdomspolitik",
				 layers: 'lkarta_idrott_fritid_ungpolitik',
				 format: 'image/png',
				 featureType: "polygon",
				 selectable: true,
				 transparent: true,
				 opacity: 1,
				 attribution: "@ Lunds kommun",
				 popup: "<p>${namn_verks}</p><p>${beskr}</p><p><a href=${url}>hemsida</a></p>",
				 zIndex: 10
			 }
		 }, 
		{
			 init: "L.TileLayer.WMS",
			 url: "http://kartor.lund.se/geoserver/wms",
			 
			 options: {
				 //legend: true,
				 category: ["Uppleva & göra","Idrott & Fritid"],
				 layerId: "lkarta_idrott_fritid_aventyr",
				 displayName: "Äventyrspedagogik",
				 layers: 'lkarta_idrott_fritid_aventyr',
				 format: 'image/png',
				 featureType: "polygon",
				 selectable: true,
				 transparent: true,
				 opacity: 1,
				 attribution: "@ Lunds kommun",
				 popup: "<p>${beskr}</p><p><a href=${url}>hemsida</a></p>",
				 zIndex: 10
			 }
		 },*/
		{
			init: "L.TileLayer.WMS",
			url: "http://kartor.lund.se/geoserver/wms",

			options: {
				//legend: true,
				category: ["Uppleva & göra", "Idrott & Fritid"],
				layerId: "lkarta_fritidshem",
				displayName: "Fritidshem",
				layers: 'lkarta_fritidshem',
				format: 'image/png',
				featureType: "polygon",
				selectable: true,
				transparent: true,
				opacity: 1,
				attribution: "@ Lunds kommun",
				popup: "<p>${namn_verks}</p><p>${beskr}</p><p><a href=${url}>hemsida</a></p>",
				zIndex: 10
			}
		},
		{
			init: "L.TileLayer.WMS",
			url: "http://kartor.lund.se/geoserver/wms",

			options: {
				//legend: true,
				category: ["Uppleva & göra", "Idrott & Fritid"],
				layerId: "lkarta_fritidsgard",
				displayName: "Fritidsgård",
				layers: 'lkarta_fritidsgard',
				format: 'image/png',
				featureType: "polygon",
				selectable: true,
				transparent: true,
				opacity: 1,
				attribution: "@ Lunds kommun",
				popup: "<p>${namn_verks}</p><p>${beskr}</p><p><a href=${url}>hemsida</a></p>",
				zIndex: 9
			}
		},
		//

		{
			init: "L.TileLayer.WMS",
			url: "http://kartor.lund.se/geoserver/wms",
			options: {
				category: ["Uppleva & göra", "Idrott & Fritid"],
				layerId: 'mountainbikeslingor',
				displayName: "Mountainbike",
				layers: 'mountainbikeslingor',
				format: 'image/png',
				featureType: "line",
				selectable: true,
				transparent: true,
				opacity: 1,
				attribution: "© Lunds kommun",
				popup: '<p>${plats}<br/></p>',
				zIndex: 110,
			}
		},



		//

		{
			init: "L.TileLayer.WMS",
			url: "http://kartor.lund.se/geoserver/wms",
			options: {
				//legend: true,
				category: ["Kommun & politik"],
				layerId: "lkarta_bibl_medbkontor",
				displayName: "Medborgarkontor",
				layers: 'lkarta_medbkontor',
				format: 'image/png',
				featureType: "polygon",
				selectable: true,
				transparent: true,
				opacity: 1,
				attribution: "@ Lunds kommun",
				popup: "<p>${namn_verks}<br/>${adress}</p><p>${beskr}</p><p><a href=${url}>läs mer</a></p>",
				zIndex: 10
			}
		},
		{
			init: "L.TileLayer.WMS",
			url: "http://kartor.lund.se/geoserver/wms",
			options: {
				//legend: true,
				category: ["Uppleva & göra", "Kultur & nöje"],
				layerId: "lkarta_kultur_bilj_info",
				displayName: "Biljetter och information",
				layers: 'lkarta_kultur_bilj_info',
				format: 'image/png',
				featureType: "polygon",
				selectable: true,
				transparent: true,
				opacity: 1,
				attribution: "@ Lunds kommun",
				popup: "<p>${namn_verks}<br/>${adress}</p><p>${beskr}</p><p><a href=${url}>läs mer</a></p>",
				zIndex: 9
			}
		},
		{
			init: "L.TileLayer.WMS",
			url: "http://kartor.lund.se/geoserver/wms",
			options: {
				//legend: true,
				category: ["Uppleva & göra", "Kultur & nöje"],
				layerId: "lkarta_kultur_konst",
				displayName: "Konst",
				layers: 'lkarta_kultur_konst',//lkarta_offentligkonst',
				format: 'image/png',
				featureType: "polygon",
				selectable: true,
				transparent: true,
				opacity: 1,
				attribution: "@ Lunds kommun",
				popup: "<p>${namn_verks}<br/>${adress}</p><p>${beskr}</p><p><a href=${url}>läs mer</a></p>",
				zIndex: 9
			}
		},

		{
			init: "L.TileLayer.WMS",
			url: "http://kartor.lund.se/geoserver/wms",
			options: {
				//legend: true,
				category: ["Uppleva & göra", "Kultur & nöje"],
				layerId: "lkarta_kultur_kulturverks",
				displayName: "Kulturverksamhet",
				layers: 'lkarta_kultur_kulturverks',
				format: 'image/png',
				featureType: "polygon",
				selectable: true,
				transparent: true,
				opacity: 1,
				attribution: "@ Lunds kommun",
				popup: "<p>${namn_verks}<br/>${adress}</p><p>${beskr}</p><p><a href=${url}>läs mer</a></p>",
				zIndex: 9
			}
		},
		{
			init: "L.TileLayer.WMS",
			url: "http://kartor.lund.se/geoserver/wms",
			options: {
				//legend: true,
				category: ["Uppleva & göra", "Kultur & nöje"],
				layerId: "lkarta_kultur_musik",
				displayName: "Musik",
				layers: 'lkarta_kultur_musik',
				format: 'image/png',
				featureType: "polygon",
				selectable: true,
				transparent: true,
				opacity: 1,
				attribution: "@ Lunds kommun",
				popup: "<p>${namn_verks}<br/>${adress}</p><p>${beskr}</p><p><a href=${url}>läs mer</a></p>",
				zIndex: 9
			}
		},
		{
			init: "L.TileLayer.WMS",
			url: "http://kartor.lund.se/geoserver/wms",
			options: {
				//legend: true,
				category: ["Uppleva & göra", "Kultur & nöje"],
				layerId: "lkarta_kultur_teater",
				displayName: "Teater",
				layers: 'lkarta_kultur_teater',
				format: 'image/png',
				featureType: "polygon",
				selectable: true,
				transparent: true,
				opacity: 1,
				attribution: "@ Lunds kommun",
				popup: "<p>${namn_verks}<br/>${adress}</p><p>${beskr}</p><p><a href=${url}>läs mer</a></p>",
				zIndex: 9
			}
		},
		//------------------SKOLOR--------------------------------------------------------------------------
		{
			init: "L.TileLayer.WMS",
			url: "http://kartor.lund.se/geoserver/wms",
			options: {
				//legend: true,
				category: ["Kommun & politik", "Skolor"],
				layerId: "lkarta_skolor_gymnasie",
				displayName: "Gymnasieskola",
				layers: 'lkarta_skolor_gymnasie',
				format: 'image/png',
				featureType: "polygon",
				selectable: true,
				transparent: true,
				opacity: 1,
				attribution: "@ Lunds kommuns",
				popup: "<p>${form}&nbsp;${skoltyp}</p><p>${skolnamn}</p><p><a href='${url}'>läs mer</a></p>",
				zIndex: 10
			}
		},
		{
			init: "L.TileLayer.WMS",
			url: "http://kartor.lund.se/geoserver/wms",
			options: {
				//legend: true,
				category: ["Kommun & politik", "Skolor"],
				layerId: "lkarta_skolor_forskola",
				displayName: "Förskola",
				layers: 'lkarta_skolor_forskola',
				format: 'image/png',
				featureType: "polygon",
				selectable: true,
				transparent: true,
				opacity: 1,
				attribution: "@ Lunds kommun",
				popup: "<p>${form}&nbsp;${skoltyp}</p><p>${skolnamn}</p><p><a href='${url}'>läs mer</a></p>",
				zIndex: 10
			}
		},
		{
			init: "L.TileLayer.WMS",
			url: "http://kartor.lund.se/geoserver/wms",
			options: {
				//legend: true,
				category: ["Kommun & politik", "Skolor"],
				layerId: "lkarta_skolor_grundskola",
				displayName: "Grundskola",
				layers: 'lkarta_skolor_grundskola',
				format: 'image/png',
				featureType: "polygon",
				selectable: true,
				transparent: true,
				opacity: 1,
				attribution: "@ Lunds kommun",
				popup: "<p>${form}&nbsp;${skoltyp}</p><p>${skolnamn}</p><p><a href='${url}'>läs mer</a></p>",
				zIndex: 10
			}
		}

		//------------------------------------TOALETTER---------------------------------------------------------------		
		//,
		// {
		// init: "L.TileLayer.WMS",
		// url: "http://kartor.lund.se/geoserver/wms",
		// parentTag: "service",
		// options: {
		// //legend: true,
		// category: ["Trafik & Service"],
		// layerId: "toaletterTM",
		// displayName: "Toaletter",
		// layers: 'lkarta_toaletterTM',
		// format: 'image/png',
		// featureType: "polygon",
		// selectable: true,
		// transparent: true,
		// opacity: 1,
		// attribution: "@ Lunds kommun",
		// popup: "<p>${namn}</p><p>${oppetdagar}</p><p>${oppettider}</p><p>${oppetolik}</p>",
		// zIndex: 10
		// }
		// }

	],

	// <><><><><><><><><><><><><><><><><><><><><><><><><><>
	// Plugins are Leaflet controls. The options of a control
	// given here, will override the options in the control.
	// Thereby, you can manage everything the control lets
	// you manage from this config file – without having to
	// edit the plugin itself.
	// <><><><><><><><><><><><><><><><><><><><><><><><><><>

	plugins: [
		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		// Lets the user adjust the opacity of most layers added 
		// to the map.
		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		// {
		// 	init: "L.Control.Opacity",
		// 	options: {
		// 		position: 'topright',	// Leaflet container (default is topright)
		// 		showTitle: false,		// Show the popover title
		// 		btnReset: true			// Show a reset button and a "zero" button
		// 	}
		// },
		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		// Creates a button e.g. in the toolbar which simply redirects
		// the user to another URL. You can create several version of this
		// plugin for the same map.
		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		// {
		// 	init: "L.Control.Redirect",
		// 	options: {
		// 		position: 'topright',		// Leaflet container (default is topright)
		// 		url: '//malmo.se/kartor',	// Where to redirect
		// 		target: 'newTab',			// How to open the link: sameWindow or newTab
		// 		btnClass: "fa fa-home",		// The icon class (e.g. fa or glyphicon)
		// 		_lang: {						
		// 			sv: {
		// 				name: "Länk till Malmös kartor"			// Optional custom tooltip
		// 			},
		// 			en: {
		// 				name: "Link to Malmö's maps"			// Optional custom tooltip
		// 			}
		// 		}
		// 	}
		// },
		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		// RedirectClick opens a new browser tab when the user clicks on the map.
		// The easting ${x} and northing ${y} is sent along to the url. See example below.
		// You can create several version of this plugin for the same map.
		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		// {
		// 	init : "L.Control.RedirectClick", // Pictometry
		// 	options: {
		// 		position: "topright",		// Button's position
		// 		url: "http://www.malmo.se/karta?xy=${x},${y},This%20is%20where%20you%20clicked", 	// Where to get linked to (including coordinates)
		// 		btnClass: "fa fa-plane",	// Button's icon class
		// 		cursor: "crosshair",		// Cursor shown in map before click
		// 		destProj: "EPSG:4326",		// Optional. Convert the clicked coordinates to this coordinate system before inserting into URL
		// 		reverseAxisDest: false,		// Optional. Some projections have inverted the x and y axis (applies to destination projection)
		// 		_lang: {
		// 			en: {
		// 				name: "Click the map to be redirected" // tooltip for the button in English
		// 			},
		// 			sv: {
		// 				name: "Klicka i kartan och länkas vidare" // tooltip for the button in Swedish
		// 			}
		// 		}
		// 	}
		// },
		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		// Opacity lets the user change the opacity of currently visible layers.
		// <><><><><><><><><><><><><><><><><><><><><><><><><><>

		// {
		// 	init: "L.Control.Opacity",
		// 	options: {
		// 		addToMenu: true
		// 	}
		// },
		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		// Scale is Leaflet's in-built scale bar control. See options: http://leafletjs.com/reference.html#control-scale
		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		{
			init: "L.Control.Scale",
			options: {
				imperial: false
			}
		},

		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		// LayerSwitcher is a responsive layer menu for both overlays and baselayers.
		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		{
			init: "L.Control.LayerSwitcher",
			options: {
				toggleSubLayersOnClick: false,			// If true, all layers below this header will be turned on when expanding it.
				unfoldOnClick: true,					// If true, clicking anywhere on a header will unfold it. If false, user has to click on the icon next the header text.
				unfoldAll: false,						// If true, all subheaders will be unfolded when unfolding a header.
				olFirst: false,							// If true, the overlays panel is shown at the top
				pxDesktop: 992,							// Breakpoint for switching between mobile and desktop switcher
				btnHide: true,							// Show a hide button at the top header
				catIconClass: "fa fa-chevron-right",		// Icon class for foldable headers
				showTooltip: false, // If true (or a number - milliseconds), then an initial tooltip will be shown over the toggle button. The duration can be set by providing a number here (in milliseconds).
				hoverTooltip: true // Shows the tooltip on hover (non-touch interaction only)
			}
		},
		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		// Zoombar creates a custom zoombar with [+] and [-] buttons.
		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		{
			init: "L.Control.Zoombar",
			options: {}
		},

		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		// Geolocate shows the users position. Based on the HTML5 geolocation API.
		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		{
			init: "L.Control.Geolocate",
			options: {
				position: 'bottomright',		// Button's position
				locateOptions: {
					maxZoom: 17,				// Maximum auto-zoom after finding location
					enableHighAccuracy: true	// true: Will turn on GPS if installed (better accuracy but uses more battery)
				}
			}
		},

		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		// SelectVector is needed to make WMS layers selectable 
		// using getfeatureinfo requests.
		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		{
			init: "L.Control.SelectWMS",
			options: {
				wmsVersion: "1.3.0",		// The WMS version to use in the getfeatureinfo request
				info_format: "text/plain",	// The default (fallback) info format to fetch from the WMS service. Overridden by layer's info_format in layer's selectOptions.
				maxFeatures: 20,			// Max features to fetch on click
				buffer: 12,					// Buffer around click (a larger number makes it easier to click on lines and points)
				useProxy: false				// If you want call the URL with a prepended proxy URL (defined in ws above)
			}
		},

		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		// SelectVector is needed in order to make vector (e.g. WFS) layers selectable.
		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		{
			init: "L.Control.SelectVector",
			options: {
				// The select style.
				selectStyle: {
					weight: 5,
					color: '#00FFFF',
					fillColor: '#00FFFF',
					opacity: 1,
					fillOpacity: .5
				}
			}
		},

		{
			init: "L.Control.SearchLund",
			options: {
				gui: true,
				useProxy: true,
				wsAcUrl: "http://kartor.lund.se/gist/objectsearch",
				wsLocateUrl: "http://kartor.lund.se/gist/getobject",
				//wsAcUrl : "http://kartor.lund.se/gist/multisearch",
				//wsLocateUrl: "http://kartor.lund.se/gist/multisearch",
				//wsAcUrl : "http://kartor.lund.se/lkarta_sokproxy/auto_lund.ashx",
				//wsLocateUrl: "http://kartor.lund.se/lkarta_sokproxy/sokexakt_lund.ashx",
				//wsAcUrl : "http://nominatim.openstreetmap.org/search",
				//wsLocateUrl : "http://nominatim.openstreetmap.org/search",
				wsOrgProj: "EPSG:4326"
			}
		},

		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		// Search connects to an autocomplete and geolocate service and places a marker
		// at the geolocated location.
		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		// {
		// 	init: "L.Control.Search",
		// 	options: {
		// 		_lang: {
		// 			// Watermark/placeholder for text entry. Language dependent.
		// 			"en": { search: "Search address or place" },	// english
		// 			"sv": { search: "Sök adress eller plats" }	// swedish
		// 		},
		// 		wsAcUrl: "//kartor.malmo.se/api/v1/addresses/autocomplete/", // Required. Autocomplete service.
		// 		wsLocateUrl: "//kartor.malmo.se/api/v1/addresses/geolocate/", // Required. Geolocate service.
		// 		gui: true,					// If false, entry is not shown but the plugin can still take the POI URL parameter
		// 		whitespace: "%20",			// How to encode whitespace.
		// 		wsOrgProj: "EPSG:3008",		// The projection of the returned coordinates from the web service
		// 		useProxy: false,			// If you want call the URL with a prepended proxy URL (defined in ws above)
		// 		acOptions: {				// typeahead options (Bootstrap's autocomplete library)
		// 			items: 100				// Number of options to display on autocomplete
		// 		}
		// 	}
		// },

		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		// Print creates a downloadable image server-side. Requires Geoserver and the plugin "Mapfish print".
		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		// {
		// 		init: "L.Control.Print",
		// 		options: {
		// 			printUrl: "//kartor.malmo.se/print-servlet/leaflet_print/",		// The print service URL
		// 			position: "topright"											// Button's position
		// 		}
		// 	},

		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		// ShareLink adds a button which, on click, will create a
		// URL which recreates the map, more or less how it looked like.
		// It is up to other plugins to add and receive URL parameters by 
		// listening to the events:
		// 		- Create params:	"smap.core.createparams"
		// 		- Apply params:	 	"smap.core.beforeapplyparams" or "smap.core.applyparams"
		// 	For instance:
		// 	
		// 	smap.event.on("smap.core.createparams", function(e, paramsObject) {
		// 		paramsObject.myparameter = 3;
		// 	});
		// 	smap.event.on("smap.core.applyparams", function(e, paramsObject) {
		// 		alert(paramsObject.myparameter);
		// 	});
		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		{
			init: "L.Control.ShareLink",
			options: {
				position: "topright",
				root: location.protocol + "//lund.se/lkarta?" // location.protocol + "//kartor.malmo.se/init/?appid=stadsatlas-v1&" // Link to malmo.se instead of directly to map
			}
		},

		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		// Info simply creates a toggleable Bootstrap modal which you can fill with any info below.
		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		// {
		// 	init: "L.Control.Info",
		// 	options: {
		// 		addToMenu: true,				// Creates a button that toggles the info dialog (if autoActivate is false this should probably be set to true)
		// 		autoActivate: true,				// If you want the Info dialog to open from start, set this to true
		// 		dontShowAgainBox: true,			// Requires autoActivate: true. Allows the user to check the box to not show this box again (using localStorage)
		// 		dateLastUpdated: "2016-03-31",	// Requires dontShowAgainBox: true. Setting a date here means dontShowAgain checkbox checked by user before this date will expire.
		// 		daysExpired: 90,				// Requires dontShowAgainBox: true. If set, the dontShowAgain choice will expire after this many days.
		// 		position: "topright",			// Requires addToMenu: true. Button's position.

		// 		// Here follows the content of the modal – language dependent!
		// 		_lang: {
		// 			"en": {
		// 				titleInfo: "<h4>A test header</h4>",
		// 				bodyContent:
		// 					'<p>Some test content</p>'
		// 			},
		// 			"sv": {
		// 				titleInfo: "<h4>En testrubrik</h4>",
		// 				bodyContent:
		// 					'<p>Lite testinnehåll</p>'
		// 			}
		// 		}
		// 	}
		// },

		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		// MeasureDraw is a combined measure and drawing tool. The created
		// markers, lines or polygons can be shared with others 
		// (geometries and attributes sent along as a URL parameter).
		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		// {
		// 	init: "L.Control.MeasureDraw",
		// 	options: {
		// 		position: "topright",		// Button's position
		// 		saveMode: "url",			// So far url is the only option
		// 		layerName: "measurelayer",	// The internal layerId for the draw layer

		// 		stylePolygon: {				// Draw style for polygons
		// 			color: '#0077e2',
		// 			weight: 3
		// 		},
		// 		stylePolyline: {			// Draw style for polylines
		// 			color: '#0077e2',
		// 			weight: 9
		// 		}
		// 	}
		// },

		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		// ToolHandler takes care of making all buttons inside the top-right div responsive.
		// When the screen width is smaller than the defined breakpoint, the buttons are contained 
		// within a Bootstrap popover which can be toggled by a single button.
		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		// {
		// 	init: "L.Control.ToolHandler",
		// 	options: {
		// 		showPopoverTitle: false 	// Show title (header) in the popover
		// 	}
		// }
		// ,
		{
			init: "L.Control.HistoryBack",
			options: {
				position: "topright",
				btnClass: "glyphicon glyphicon-home",
				_lang: {
					en: {
						name: "lund.se",
						hoverText: "back to lund.se"
					},
					sv: {
						name: "lund.se",
						hoverText: "tillbaks till lund.se"
					}
				}
			},

		},


		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		// Add2HomeScreen creates a popover on iOS devices supporting
		// "Add To Homescreen", which advices the user to add the website
		// to the homescreen, making it look almost like a native app.
		// <><><><><><><><><><><><><><><><><><><><><><><><><><>
		// {
		//	init: "L.Control.Add2HomeScreen",
		//	options: {}
		// }
		{
			init: "L.Control.LundHeader",
			options: {
			},
		},
	]
};









