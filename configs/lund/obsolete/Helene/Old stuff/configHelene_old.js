// These are web-services used mainly (only) for proxy. If you define a "ws"-variable on the config
// object, the framework will pick the service corresponding to your domain. E.g. if you are running
// on localhost – the proxy (e.g.) will point to another URL than if you run on kartor.malmo.se.

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

		mapConfig: {
			// maxBounds: [[55.71628170645908, 12.6507568359375], [55.42589636057864, 13.34564208984375]],
			//minZoom: 11
		},

		// Web-services can be defined here if they are to be used by the core and/or plugins.
		// Otherwise, it is adviced to set any web-services as parameters of plugins.
		ws: ws,

		// These are optional default parameters for the map.
		// These parameters will be overridden by any parameters after "?" in the URL.
		// For instance: http://.../smap-responsive?zoom=3 will override the zoom level specified here.
		params: {
			center: [13.156692,55.707421],
			zoom: 13,
			hash: false//,
			//bl: "mapboxlund"
		},

		// These are the overlays in the map
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
                    category: ["Uppleva & göra","Bibliotek"],
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
                    category: ["Uppleva & göra","Bibliotek"],
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
				url: "http://193.17.67.229/geoserver/common/wms?",
                parentTag: "service",
                options: {
                    //legend: true,
                    category: ["Trafik & infrastruktur"],
                    layerId: "hallplatser",
                    displayName: "Hållplatser",
                    layers: 'common:lund_hallplatser',
                    format: 'image/png',
					info_format: 'text/json',
                    selectable: true,
                    transparent: true,
                    opacity: 1,
                    attribution: "@ Skånetrafiken	",
                    popup: "<p>${caption}</p>",
                    zIndex: 10
                }
             },
			 
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
	    		 options: {
					 //legend: true,
		    		 category: ["Bygga, bo & miljö"],
	    			 layerId: "PlangranserWGS84",
	    			 displayName: "Pågående detaljplaner",
	    			 layers: 'INTERN.LUND.PLAN_PAGAENDE',
	    			 format: 'image/png',
	    			 featureType: "polygon",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Lunds kommun",
					 popup: "<p>${extid}</p><p><a href=${url}>länk till pågående plan</a></p>",
	    			 zIndex: 9
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
					 popup: "<p>${namn}<br/>${adress}</p><p>${info}</p><p><a href=http://${www}>hemsida</a></p>",
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
		    		 category: ["Uppleva & göra","Idrott & Fritid"],
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
		    		 category: ["Uppleva & göra","Idrott & Fritid"],
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
		    		 category: ["Uppleva & göra","Idrott & Fritid"],
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
		    		 category: ["Uppleva & göra","Idrott & Fritid"],
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
		    		 category: ["Uppleva & göra","Idrott & Fritid"],
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
			 {
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
		     },
			 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://kartor.lund.se/geoserver/wms",
				 
	    		 options: {
					 //legend: true,
		    		 category: ["Uppleva & göra","Idrott & Fritid"],
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
		    		 category: ["Uppleva & göra","Idrott & Fritid"],
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
                    category: ["Kommun & politik"],
                    layerId: "lkarta_förskola",
                    displayName: "Förskolor",
                    layers: 'lkarta_förskola',
                    format: 'image/png',
                    featureType: "polygon",
                    selectable: true,
                    transparent: true,
                    opacity: 1,
                    attribution: "@ Lunds kommun",
                    popup: "<p>${SKOLTYP}<br/>${skolnamn}</p><p>${form}</p><p><a href=${url}>läs mer</a></p>",
                    zIndex: 10
                }
            },
			    {
                init: "L.TileLayer.WMS",
                url: "http://kartor.lund.se/geoserver/wms",
                options: {
                    //legend: true,
                    category: ["Kommun & politik"],
                    layerId: "lkarta_grundskola",
                    displayName: "Grundskola",
                    layers: 'lkarta_grundskola',
                    format: 'image/png',
                    featureType: "polygon",
                    selectable: true,
                    transparent: true,
                    opacity: 1,
                    attribution: "@ Lunds kommun",
                    popup: "<p>${SKOLTYP}<br/>${skolnamn}</p><p>${form}</p><p><a href=${url}>läs mer</a></p>",
                    zIndex: 10
                }
            },
			
		     	 {
                init: "L.TileLayer.WMS",
                url: "http://kartor.lund.se/geoserver/wms",
                options: {
                    //legend: true,
                    category: ["Kommun & politik"],
                    layerId: "lkarta_gymnasie",
                    displayName: "Gymnasie",
                    layers: 'lkarta_gymnasie',
                    format: 'image/png',
                    featureType: "polygon",
                    selectable: true,
                    transparent: true,
                    opacity: 1,
                    attribution: "@ Lunds kommun",
                    popup: "<p>${SKOLTYP}<br/>${skolnamn}</p><p>${form}</p><p><a href=${url}>läs mer</a></p>",
                    zIndex: 10
                }
            },
			

			
			{
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://kartor.lund.se/geoserver/wms",
	    		 options: {
					 //legend: true,
		    		 category: ["Uppleva & göra","Kultur & nöje"],
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
		    		 category: ["Uppleva & göra","Kultur & nöje"],
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
		    		 category: ["Uppleva & göra","Kultur & nöje"],
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
		    		 category: ["Uppleva & göra","Kultur & nöje"],
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
		    		 category: ["Uppleva & göra","Kultur & nöje"],
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
		     }
			 
			
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

		// These are the baselayers ("background" layers) of the map
		bl: [
			{
				init: "L.TileLayer",
				url: 'http://api.tiles.mapbox.com/v4/lundskommun.j909n073/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibHVuZHNrb21tdW4iLCJhIjoiTGRtQW51WSJ9.f-bABPBDFFzgUc3UkBsAGA#12/55.6922/13.2732',
				options: {
					layerId: "mapboxlund",
					displayName: "Karta",
					attribution: "© Mapbox © OpenStreetMap",
					maxZoom: 18
				}
			},
			{
				init: "L.BingLayer",
				//url: 'http://api.tiles.mapbox.com/v4/lundskommun.j909n073/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibHVuZHNrb21tdW4iLCJhIjoiTGRtQW51WSJ9.f-bABPBDFFzgUc3UkBsAGA#12/55.6922/13.2732',
				key: "ArnlcFILNVTLn5NnwH731HwoKcUDS5hSbTTMq5U0Cd5jYwv7zvUPWgCJvT99krNa",
				options: {
					layerId: "binglayer",
					displayName: "Flygfoto, Bing aerial",
					category: ["Flygfoto"],
					attribution: '<a href="http://www.microsoft.com/maps/assets/docs/terms.aspx" target="_blank">Bing maps TOU</a>',
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
					category: ["Flygfoto"],
					format: 'image/jpeg',
					legend: false,
					transparent: true,
					opacity: 0.9,
					attribution: "Â© LantmÃ¤teriet",
					zIndex: 50
				}
		}
			],


		// These are plugins – extending the map's functionality
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
							toggleSubLayersOnClick: false
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
							buffer: 5,
							useProxy: true
						}
					},
					{
						init: "L.Control.SelectVector",
						options: {
							buffer: 5
						}
					},
					{
		        	   init: "L.Control.SearchLund",
		        	   options: {
						gui: true,
						useProxy: true,
						wsAcUrl : "http://kartor.lund.se/gist/objectsearch",
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
					{
						init: "L.Control.ShareLink",
						options: {
							position: "topright",
							root: "http://kartor.lund.se/lkarta?"
							}
					}//,
					// {
						// init: "L.Control.Info",
						// options: {
							// //position: "topright"
						// }
					// }
				]
		
};
