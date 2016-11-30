var ws = {
	"localhost": {
		proxy: "http://kartor.lund.se/proxy.py?url="
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
				category: ["Trafik & stadsplanering"],
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
				category: ["Trafik & stadsplanering"],
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

		// {
		// 	init: "L.esri.dynamicMapLayer",
		// 	url: "http://arcgisserver.lund.se/arcgis/rest/services/extern/Registerkarta_Lund/MapServer",
		// 	options: {
		// 	//	legend: "img/legend/fastinfo.png",
		// 		category: ["Bygga, bo & miljö"],
		// 		displayName: "Fastigheter",
		// 		transparent: true,
		// 		layerId: "registerkartadyn",
		// 		attribution: "Stadsbyggnadskontoret, Lund",
		// 		popup: '${OBJECTID}',
		// 		uniqueKey: "OBJECTID",
		// 		selectable: true // select doesn't work with this ESRI layer
		// 	}
		// },

		
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
				popup: "<p>${fastighet}</p>",
				zIndex: 9
			}
		},
		{

			init: "L.TileLayer.WMS",
			url: "http://kartor.lund.se/geoserver/wms",
			options: {
				//legend: true,
				category: ["Trafik & stadsplanering"],
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
				category: ["Trafik & stadsplanering"],
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
				category: ["Trafik & stadsplanering"],
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
                    category: ["Bygga, bo & miljö","Värdefulla miljöer"],
                    layerId: "bevaringsprogram_byggnadsinventering",
                    displayName: "Bevaringsprogrammet",
                    layers: 'bevaringsprogram_byggnadsinventering',
                    format: 'image/png',
                    featureType: "polygon",
                    selectable: true,
                    transparent: true,
                    opacity: 1,
                    attribution: "@ Lunds kommuns",
                    popup: "<p>${klass}</p><p><a href='${url}'>läs mer</a></p>",
                    zIndex: 10
           		 }
		     },

			{
                init: "L.TileLayer.WMS",
                url: "http://kartor.lund.se/geoserver/wms",
                options: {
                    //legend: true,
                    category: ["Bygga, bo & miljö","Värdefulla miljöer"],
                    layerId: "annan_kulturhistorisk_miljo",
                    displayName: "Kulturhistorisk miljö",
                    layers: 'annan_kulturhistorisk_miljo',
                    format: 'image/png',
                    featureType: "polygon",
                    selectable: true,
                    transparent: true,
                    opacity: 1,
                    attribution: "@ Lunds kommuns",
                    popup: "<p>${typ}</p><p>${namn}</p><p>Den här miljön ingår i kulturmiljöprogrammet för Lunds kommun. Kontakta gärna stadsantikvarie Henrik Borg, henrik.borg@lund.se, för mer information.</p>",
                    zIndex: 10
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
				featureType: "point",
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
				layerId: "lkarta_fritidshem",
				displayName: "Fritidshem",
				layers: 'lkarta_fritidshem',
				format: 'image/png',
				featureType: "point",
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
				featureType: "point",
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
		// 			{
		// 	init: "L.TileLayer.WMS",
		// 	url: "http://arcgisserver.lund.se/arcgis/services/extern/Skolor/MapServer/WMSServer",
		// 	options: {
		// 	//	legend: "img/legend/fastinfo.png",
		// 		category: ["Kommun & politik", "Skolor"],
		// 		displayName: "Skolval",
		// 		transparent: true,
		// 		layerId: "Skolor",
		// 		layers: "1",
		// 		format: 'image/png',
		// 		selectable: true,
		// 		transparent: true,
		// 		opacity: 1,
		// 		//attribution: "@ Lunds kommun",
		// 		popup: "<p>${namn}</p>",
		// 		zIndex: 9
		// 	}
		// },
			{
			init: "L.TileLayer.WMS",
			url: "http://kartor.lund.se/geoserver/wms",
			options: {
				//legend: true,
				category: ["Kommun & politik", "Skolor"],
				layerId: "lkarta_skolor_skolval",
				displayName: "Skolval",
				layers: 'lkarta_skolor_skolval',
				format: 'image/png',
				featureType: "point",
				selectable: true,
				transparent: true,
				opacity: 1,
				attribution: "@ Lunds kommuns",
				popup: "${skolnamn}</p><p><a href='${url}'>läs mer</a></p>",
				zIndex: 10
			}
		},
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
				popup: "<p>${form}<p>${skolnamn}</p><p><a href='${url}'>läs mer</a></p>",
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
				popup: "<p>${form}<p>${skolnamn}</p><p><a href='${url}'>läs mer</a></p>",
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
				popup: "<p>${form}<p>${skolnamn}</p><p><a href='${url}'>läs mer</a></p>",
				zIndex: 10
			}
		},
		// Spårväg
			{
                	init: "L.TileLayer.WMS",
                	url: "http://kartor.lund.se/geoserver/wms",
                	options: 
			{
                    		//legend: true,
                    		category: ["Trafik & stadsplanering", "Kunskapsstråket"],
                    		layerId: "kunskapsstraket_delomrade",
                    		displayName: "Delområden",
                    		layers: 'kunskapsstraket_delomrade ',
                    		format: 'image/png',
                    		featureType: "polygon",
                    		selectable: true,
                    		transparent: true,
                    		opacity: 1,
                    		attribution: "@ Lunds kommuns",
                    		popup: "<p>${namn}</p><p>${text}</p><p><a href='${url}'>läs mer</a></p>",
                    		zIndex: 10,
				
           		}


		},
		{
                	init: "L.TileLayer.WMS",
                	url: "http://kartor.lund.se/geoserver/wms",
                	options: 
			{
                    		//legend: true,
                    		category: ["Trafik & stadsplanering", "Kunskapsstråket"],
                    		layerId: "kunskapsstraket_ramomraden",
                    		displayName: "Ramprogram",
                    		layers: 'kunskapsstraket_ramomraden',
                    		format: 'image/png',
                    		featureType: "polygon",
                    		selectable: true,
                    		transparent: true,
                    		opacity: 1,
                    		attribution: "@ Lunds kommuns",
                    		popup: "<p>${namn}</p><p>${text}</p><p><a href='${url}'>läs mer</a></p>",
                    		zIndex: 10,
				
           		}


		},

 
{
                	init: "L.TileLayer.WMS",
                	url: "http://kartor.lund.se/geoserver/wms",
                	options: 
			{
                    		//legend: true,
                    		category: ["Trafik & stadsplanering", "Kunskapsstråket"],
                    		layerId: "kunskapsstraket_pagaendeplaner",
                    		displayName: "Pågående planer",
                    		layers: 'kunskapsstraket_pagaendeplaner',
                    		format: 'image/png',
                    		featureType: "polygon",
                    		selectable: true,
                    		transparent: true,
                    		opacity: 1,
                    		attribution: "@ Lunds kommuns",
                    		popup: "<p>${pa}</p><p>Typ: ${typavplan}</p><p>Status: ${status}</p><p><a href='http://www.lund.se/${pa}'>läs mer</a></p>",
                    		zIndex: 10,
				
           		}


		},

		{
                	init: "L.TileLayer.WMS",
                	url: "http://kartor.lund.se/geoserver/wms",
                	options: 
			{
                    		//legend: true,
                    		category: ["Trafik & stadsplanering", "Kunskapsstråket"],
                    		layerId: "kunskapsstraket_sparvagstrackning",
                    		displayName: "Spåväg, sträckning",
                    		layers: 'kunskapsstraket_sparvagstrackning',
                    		format: 'image/png',
                    		featureType: "line",
                    		selectable: true,
                    		transparent: true,
                    		opacity: 1,
                    		attribution: "@ Lunds kommuns",
                    		popup: "<p>${pa}</p><p>${text}</p><p><a href='${url}'>läs mer</a></p>",
                    		zIndex: 10,
				
           		}


		},
		{
                	init: "L.TileLayer.WMS",
                	url: "http://kartor.lund.se/geoserver/wms",
                	options: 
			{
                    		//legend: true,
                    		category: ["Trafik & stadsplanering", "Kunskapsstråket"],
                    		layerId: "kunskapsstraket_sparvaghallplatser",
                    		displayName: "Spåväg, hållplatser",
                    		layers: "kunskapsstraket_sparvaghallplatser",
                    		format: 'image/png',
                    		featureType: "point",
                    		selectable: true,
                    		transparent: true,
                    		opacity: 1,
                    		attribution: "@ Lunds kommuns",
                    		popup: "<p>${pa}</p><p>${hallplat}</p><p>Status: ${text}</p><p><a href='${url}'>läs mer</a></p>",
                    		zIndex: 10,
				
           		}


		},
		// ---------------------------------- Äldreboende
		{
                init: "L.TileLayer.WMS",
                url: "http://kartor.lund.se/geoserver/wms",
                options: {
                    //legend: true,
                    category: ["Kommun & politik", "Senior & äldreboende"],
                    layerId: "voo_lunchrest_style",
                    displayName: "Lunchrestaurang",
                    layers: 'voo_lunchrest',
                    format: 'image/png',
                    featureType: "polygon",
                    selectable: true,
                    transparent: true,
                    opacity: 1,
                    attribution: "@ Lunds kommun",
                    popup: "<p>${namn}<br/></p><p><a href='${url}'>Mer information</a></p>",
                    zIndex: 10
                }
            },
			{
                init: "L.TileLayer.WMS",
                url: "http://kartor.lund.se/geoserver/wms",
                options: {
                    //legend: true,
                    category: ["Senior & äldreboende",],
                    layerId: "voo_traffpunkt_style",
                    displayName: "Träffpunkt",
                    layers: 'voo_traffpunkt',
                    format: 'image/png',
                    featureType: "polygon",
                    selectable: true,
                    transparent: true,
                    opacity: 1,
                    attribution: "@ Lunds kommun",
                    popup: "<p>${namn}<br/></p><p><a href='${url}'>Mer information</a></p>",
                    zIndex: 10
                }
            },
			//{
            //  init: "L.TileLayer.WMS",
            //  url: "http://kartor.lund.se/geoserver/wms",
            //  options: {
                    //legend: true,
            //      category: ["Senior & äldreboende","Äldreboende & demensboende"],
            //      layerId: "voo_aldreboende_style",
            //      displayName: "Äldreboende",
            //      layers: 'voo_aldreboende',
            //      format: 'image/png',
            //      featureType: "polygon",
            //      selectable: true,
            //      transparent: true,
            //      opacity: 1,
            //      attribution: "@ Lunds kommun",
            //      popup: "<p>${namn}<br/></p><p><a href='${url}'>Mer information</a></p>",
            //      zIndex: 10
            //  }
            // },
			{
                init: "L.TileLayer.WMS",
                url: "http://kartor.lund.se/geoserver/wms",
                options: {
                    //legend: true,
                    category: ["Senior & äldreboende"],
                    layerId: "voo_aldredemensboende_style",
                    displayName: "Äldreboende",
                    layers: 'voo_aldredemensboende',
                    format: 'image/png',
                    featureType: "polygon",
                    selectable: true,
                    transparent: true,
                    opacity: 1,
                    attribution: "@ Lunds kommun",
                    popup: "<p>${namn}<br/></p><p><a href='${url}'>Mer information</a></p>",
                    zIndex: 10
                }
            }, 
			{
                init: "L.TileLayer.WMS",
                url: "http://kartor.lund.se/geoserver/wms",
                options: {
                    //legend: true,
                    category: ["Senior & äldreboende"],
                    layerId: "voo_demensboende_style",
                    displayName: "Demensboende",
                    layers: 'voo_demensboende',
                    format: 'image/png',
                    featureType: "polygon",
                    selectable: true,
                    transparent: true,
                    opacity: 1,
                    attribution: "@ Lunds kommun",
                    popup: "<p>${namn}<br/></p><p><a href='${url}'>Mer information</a></p>",
                    zIndex: 10
                }
            },
			//Fnuttarna i href='${url}' i  popup: "<p><br/>${namn}</p><p><a href='${url}'>Mer information</a></p>", görvid en dålig länk att den påverkas ej, använd
			//{
            //     init: "L.TileLayer.WMS",
            //    url: "http://kartor.lund.se/geoserver/wms",
            //    options: {
            //      //legend: true,
            //      category: ["Senior & äldreboende","Områdesindelning"],
            //      layerId: "voo_omradesindelning_style",
            //      displayName: "Områdesindelning",
            //        layers: 'voo_omradesindelning',
            //        format: 'image/png',
            //        featureType: "polygon",
            //        selectable: true,
            //        transparent: true,
            //        opacity: 1,
            //        attribution: "@ Lunds kommun",
            //        popup: "<p>Område:<br/>${omrade}, ${omrade_2}</p><p>Team:<br/>${omrade_team}</p><p><a href='${url}'></a></p>",
            //        zIndex: 10
            //    }
            // },

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
				btnHide: false,							// Show a hide button at the top header
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
			init: "L.Control.LundSearch",
			options: {
				gui: true,
				useProxy: true,
				wsAcUrl: "http://kartor.lund.se/gist/objectsearch",
				wsLocateUrl: "http://kartor.lund.se/gist/getobject",
				wsOrgProj: "EPSG:4326",
			}
		},

	
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
				position: "topright"
			}
		},

		
		// {
		// 	init: "L.Control.HistoryBack",
		// 	options: {
		// 		position: "topright",
		// 		btnClass: "glyphicon glyphicon-home",
		// 		_lang: {
		// 			en: {
		// 				name: "lund.se",
		// 				hoverText: "back to lund.se"
		// 			},
		// 			sv: {
		// 				name: "lund.se",
		// 				hoverText: "tillbaks till lund.se"
		// 			}
		// 		}
		// 	},

		// },

		{
			init: "L.Control.LundHeader",
			options: {
			},
		},
	]
};









