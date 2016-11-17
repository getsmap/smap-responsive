
// These are web-services used mainly (only) for proxy. If you define a "ws"-variable on the config

// object, the framework will pick the service corresponding to your domain. E.g. if you are running
// on localhost – the proxy (e.g.) will point to another URL than if you run on kartor.malmo.se.

var ws = {
		"localhost": {
				proxy: "http://localhost:8080/proxy.py?url="
				//proxy: "http://localhost/cgi-bin/proxy.py?url="
			},
			"A020917": {
				proxy: "http://A020917:8080/proxy.py?url="
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
			center: [13.3717,55.66209],
			zoom: 10,
			hash: false,
			// Vilka lager som ska vara tända vid start
		ol: ["Avrinningsområde", "Vattendrag-huvud", "Vattendrag-mellan", "Vattendrag-sma", "Kommungränser"]
		},

		// These are the overlays in the map
		
		// BASKARTA
		// BASKARTA
		// BASKARTA
		
		ol: [
	
			
		 	  {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["BASKARTA"],
	    			 layerId: "Avrinningsområde",
	    			 displayName: "Avrinningsområde",
	    			 layers: 'Avrinningsomrade',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi&VERSION=1.3.0&REQUEST=GetLegendGraphic&LAYER=Kvr-haro&FORMAT=image/png&STYLE=default&SLD_VERSION=1.1.0",
					 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 //attribution: "@ Lunds kommun",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 999
	    		 }
		     },
			    {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["BASKARTA"],
	    			 layerId: "VATTENDRAG",
	    			 displayName: "Vattendrag",
	    			 layers: 'VATTENDRAG',
	    			 format: 'image/png',
	    			 featureType: "point",
					 //legend: "http://opendata-view.smhi.se/SMHI_vatten/ows&request=GetLegendGraphic&format=image/png&width=20&height=20&layer=smhi_kustvatten_och_havsomraden_SVAR_2012_2",
	    			 selectable: false,
	    			 transparent: true,
					 opacity: 0.9,
	    			 attribution: "@ KVR",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 200,
					 //minZoom: 11
	    		 }
		     },			  
			 
			    // {
	    		 // init: "L.TileLayer.WMS",
	    		 // url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 // options: {
					 // //legend: true,
		    		 // category: ["BASKARTA"],
	    			 // layerId: "Vattendrag-huvud",
	    			 // displayName: "Vattendrag, huvud",
	    			 // layers: 'Vattendrag-huvud',
	    			 // format: 'image/png',
	    			 // featureType: "point",
					 // legend: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi&request=GetLegendGraphic&format=image/png&layer=Vattendrag-huvud",
	    			 // selectable: false,
	    			 // transparent: true,
					 // opacity: 0.8,
	    			 // attribution: "@ KVR",
					 // //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 // zIndex: 200
	    		 // }
		     // },			  
			 
			   // {
	    		 // init: "L.TileLayer.WMS",
	    		 // url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 // options: {
					 // //legend: true,
		    		 // category: ["BASKARTA"],
	    			 // layerId: "Vattendrag-mellan",
	    			 // displayName: "Vattendrag, mellan",
	    			 // layers: 'Vattendrag-mellan',
	    			 // format: 'image/png',
	    			 // featureType: "point",
					 // //legend: "http://opendata-view.smhi.se/SMHI_vatten/ows&request=GetLegendGraphic&format=image/png&width=20&height=20&layer=smhi_kustvatten_och_havsomraden_SVAR_2012_2",
	    			 // selectable: false,
	    			 // transparent: true,
					 // opacity: 0.9,
	    			 // attribution: "@ KVR",
					 // //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 // zIndex: 200,
					 // minZoom: 11
	    		 // }
		     // },			  
			 
			   // {
	    		 // init: "L.TileLayer.WMS",
	    		 // url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 // options: {
					 // //legend: true,
		    		 // category: ["BASKARTA"],
	    			 // layerId: "Vattendrag-sma",
	    			 // displayName: "Vattendrag, små",
	    			 // layers: 'Vattendrag-sma',
	    			 // format: 'image/png',
	    			 // featureType: "point",
					 // //legend: "http://opendata-view.smhi.se/SMHI_vatten/ows&request=GetLegendGraphic&format=image/png&width=20&height=20&layer=smhi_kustvatten_och_havsomraden_SVAR_2012_2",
	    			 // selectable: false,
	    			 // transparent: true,
					 // opacity: 1,
	    			 // attribution: "@ KVR",
					 // //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 // zIndex: 200,
					 // minZoom: 13
	    		 // }
		     // },			  
			 
			  // {
	    		 // init: "L.TileLayer.WMS",
	    		 // url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 // options: {
					 // //legend: true,
		    		 // category: ["BASKARTA"],
	    			 // layerId: "Huvudavrinningsomraden",
	    			 // displayName: "Huvudavrinningsområden",
	    			 // layers: 'Huvudavrinningsområden', // För visning av etiketter
	    			 // format: 'image/png',
	    			 // featureType: "point",
					 // //legend: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi&VERSION=1.3.0&REQUEST=GetLegendGraphic&LAYER=Kvr-haro&FORMAT=image/png&STYLE=default&SLD_VERSION=1.1.0",
					 // selectable: false,
	    			 // transparent: true,
					 // opacity: 1,
	    			 // //attribution: "@ Lunds kommun",
					 // //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 // zIndex: 999
	    		 // }
		     // },
			 
			 			 
			 	  {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["BASKARTA"],
	    			 layerId: "Kommungränser",
	    			 displayName: "Kommungräns",
	    			 layers: 'Kommungranser',
	    			 format: 'image/png',
	    			 featureType: "point",
					 //legend: false,
	    			 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 //attribution: "@ Lunds kommun",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 110
	    		 }
		     },
			 
			 	  {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["BASKARTA"],
	    			 layerId: "HOJDKURVOR",
	    			 displayName: "Höjdkurvor",
	    			 layers: 'HOJDKURVOR',
	    			 format: 'image/png',
	    			 featureType: "point",
					 //legend: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi&VERSION=1.3.0&REQUEST=GetLegendGraphic&LAYER=NNH-Hk-5m-enfarg&FORMAT=image/png&WIDTH=20&HEIGHT=20&SLD_VERSION=1.1.0",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 0.9,
	    			 attribution: "@ KVR",
					 popup: "<p>${z}</p>",
	    			 zIndex: 150
	    		 }
		     },
			 
			 	  // {
	    		 // init: "L.TileLayer.WMS",
	    		 // url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 // options: {
					 // //legend: true,
		    		 // category: ["BASKARTA"],
	    			 // layerId: "Höjdkurva5mfärg",
	    			 // displayName: "Höjdkurva 5 m, färgkod",
	    			 // layers: 'NNH-Hk-5m-flerfarg',
	    			 // format: 'image/png',
	    			 // featureType: "point",
					 // legend: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi&request=GetLegendGraphic&format=image/png&width=20&height=80&layer=NNH-Hk-5m-lean flerfarg",
	    			 // selectable: true,
	    			 // transparent: true,
					 // opacity: 1,
	    			 // attribution: "@ KVR",
					 // popup: "<p>${z}</p>",
	    			 // zIndex: 150
	    		 // }
		     // },
			 
			   {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["BASKARTA"],
	    			 layerId: "Marktäcke",
	    			 displayName: "Marktäcke",
	    			 layers: 'Svenska-Marktackedata-SMD',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://gis-services.metria.se/arcgis/rest/services/nv/InspireNV_Marktacke/MapServer/exts/InspireView/SWE/service?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=0",
	    			 selectable: false,
	    			 transparent: true,
					 opacity: 0.8,
	    			 attribution: "@ Naturvårdsverket",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 50
	    		 }
		     },
			 
			 
			 
			   {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["BASKARTA"],
	    			 layerId: "TERRANGKARTAN",
	    			 displayName: "Terrängkartan",
	    			 layers: 'TERRANGKARTAN',
	    			 format: 'image/png',
	    			 featureType: "point",
					 //legend: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi&VERSION=1.3.0&REQUEST=GetLegendGraphic&LAYER=Kvr-haro&FORMAT=image/png&STYLE=default&SLD_VERSION=1.1.0",
					 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Lantmäteriet",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 50
	    		 }
		     },
		
			 		
		// HYDROLOGI
		// HYDROLOGI
		// HYDROLOGI
		// Ta fram nya vattenlinjer utifrån DEM. Använd fler nivåer så att varje zoomnivå ger mer detalj
		// Zoom 10 huvudfåra (order 9), Zoom 11=order 8, 12=7, 13=6, 14=5, 15=4, 16=3.

		 
			 
			
			 
			  {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["HYDROLOGI","SMHI"],
	    			 layerId: "Kustvatten-och-havsområden",
	    			 displayName: "Kustvatten och havsområden",
	    			 layers: 'Kustvatten- och havsområden SVAR 2012_2',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://opendata-view.smhi.se/SMHI_vatten/ows&request=GetLegendGraphic&format=image/png&width=20&height=20&layer=smhi_kustvatten_och_havsomraden_SVAR_2012_2",
	    			 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ SMHI",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 105
	    		 }
		     },			  
			 
			  {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["HYDROLOGI","SMHI"],
	    			 layerId: "HuvudavrinningsområdenSMHI",
	    			 displayName: "Huvudavrinningsområden",
	    			 layers: 'Huvudavrinningsområden SVAR 2012_2',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://opendata-view.smhi.se/SMHI_vatten/ows&request=GetLegendGraphic&format=image/png&width=20&height=20&layer=smhi_huvudavrinningsomraden_SVAR_2012_2",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ SMHI",
					 popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },			  
			 
			  {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["HYDROLOGI","SMHI"],
	    			 layerId: "DelavrinningsområdenSMHI",
	    			 displayName: "Delavrinningsområden",
	    			 layers: 'Delavrinningsområden SVAR 2012_2',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://opendata-view.smhi.se/SMHI_vatten/ows&request=GetLegendGraphic&format=image/png&width=20&height=20&layer=smhi_delavrinningsomraden_SVAR_2012_2",
	    			 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ SMHI",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },			  
			 
			 	  {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["HYDROLOGI","SMHI"],
	    			 layerId: "VattenförekomsterSMHI",
	    			 displayName: "Vattenförekomster",
	    			 layers: 'Vattenförekomster vattendrag SVAR 2012_2,Vattenförekomster vattenytor SVAR 2012_2',
	    			 format: 'image/png',
	    			 featureType: "polygon",
					 legend: "http://opendata-view.smhi.se/SMHI_vatten/ows&request=GetLegendGraphic&format=image/png&width=20&height=20&layer=smhi_vattenforekomster_vattenytor_SVAR2012_2",
	    			 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ SMHI",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },			  
			 
						 
			  {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["HYDROLOGI","DIKNINGSFÖRETAG"],
	    			 layerId: "Dikning-Lm-linje",
	    			 displayName: "Dikningsföretag före 1920",
	    			 layers: 'Dikning-Lm-linje',
	    			 format: 'image/png',
	    			 featureType: "point",
					 //legend: false,
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Länsstyrelsen",
					 popup: '<p>'+
					 'Namn:${namn}<br/>'+
					 'Akt:${aktnamn}<br/>'+
					 '<a href=${url}>Länk</a>'+
					 '</p>',
	    			 zIndex: 100
	    		 }
		     },
			 
		 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["HYDROLOGI","DIKNINGSFÖRETAG"],
	    			 layerId: "Dikning-Lst-linje",
	    			 displayName: "Dikningsföretag efter 1920",
	    			 layers: 'Dikning-Lst-linje',
	    			 format: 'image/png',
	    			 featureType: "point",
					 //legend: false,
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Länsstyrelsen",
					 popup: '<p>'+
					 'Namn:${namn}<br/>'+
					 'Akt:${aktnamn}<br/>'+
					 '<a href=${url}>Länk</a>'+
					 '</p>',
	    			 zIndex: 100
	    		 }
		     },
			 	
				{
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["HYDROLOGI","DIKNINGSFÖRETAG"],
	    			 layerId: "Dikning-Lm-yta",
	    			 displayName: "Båtnadsområde före 1920",
	    			 layers: 'Dikning-Lm-yta',
	    			 format: 'image/png',
	    			 featureType: "point",
					 //legend: false,
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Länsstyrelsen",
					 popup: '<p>'+
					 'Namn:${namn}<br/>'+
					 'Akt:${aktnamn}<br/>'+
					 '<a href=${url}>Länk</a>'+
					 '</p>',
	    			 zIndex: 100
	    		 }
		     },
			  		  {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["HYDROLOGI","DIKNINGSFÖRETAG"],
	    			 layerId: "Dikning-Lst-yta",
	    			 displayName: "Båtnadsområde efter 1920",
	    			 layers: 'Dikning-Lst-yta',
	    			 format: 'image/png',
	    			 featureType: "point",
					 //legend: false,
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Länsstyrelsen",
					 popup: '<p>'+
					 'Namn:${namn}<br/>'+
					 'Akt:${aktnamn}<br/>'+
					 '<a href=${url}>Länk</a>'+
					 '</p>',
	    			 zIndex: 100
	    		 }
		     },
			 
			   {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["HYDROLOGI","HISTORISK"],
	    			 layerId: "Rekognoseringskarta-våtmark",
	    			 displayName: "Våtmark 1860",
	    			 layers: 'Rekognoseringskarta-vatmark',
	    			 format: 'image/png',
	    			 featureType: "point",
					 //legend: false,
	    			 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Riksarkivet",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			    {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["HYDROLOGI"],
	    			 layerId: "Vattenkraftverk",
	    			 displayName: "Vattenkraftverk",
	    			 layers: 'Vattenkraftverk',
	    			 format: 'image/png',
	    			 featureType: "point",
					 //legend: false,
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Länsstyrelsen",
					 popup: '<p>'+
					 'Namn: ${namn}<br/>'+
					 'Tillstånd: ${tillst}<br/>'+
					 'Drift: ${drift}'+
					 '</p>',
	    			 zIndex: 100
	    		 }
		     },
			  
		// VATTENFÖRVALTNING
		// VATTENFÖRVALTNING
		// VATTENFÖRVALTNING
		
			 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["VATTENFÖRVALTNING","STATUSKLASSNING"],
	    			 layerId: "Ekologisk-status",
	    			 displayName: "Ekologisk status",
	    			 layers: 'EKOLOGISK_STATUS',
	    			 format: 'image/png',
	    			 featureType: "polygon",
					 legend: "http://ext-geoservices.lansstyrelsen.se/ArcGIS/services/VISS/statusklassningar/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&width=200&height=200&layer=26",
					 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Vattenmyndigheten",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 110
	    		 }
		     },	 
			 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["VATTENFÖRVALTNING","STATUSKLASSNING"],
	    			 layerId: "Kemisk-status",
	    			 displayName: "Kemisk status",
	    			 layers: 'KEMISK_STATUS',
	    			 format: 'image/png',
	    			 featureType: "polygon",
					 legend: "http://ext-geoservices.lansstyrelsen.se/ArcGIS/services/VISS/statusklassningar/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=18",
	    			 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Vattenmyndigheten",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 110
	    		 }
		     },
			 
			
			 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["VATTENFÖRVALTNING","MILJÖKVALITETSNORMER"],
	    			 layerId: "Mkn-ekologisk-status",
	    			 displayName: "MKN ekologisk status",
	    			 layers: 'MKN_EKOLOGISK_STATUS',
	    			 format: 'image/png',
	    			 featureType: "polygon",
					 legend: "http://ext-geoservices.lansstyrelsen.se/ArcGIS/services/VISS/miljokvalitetsnormer/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=8",
	    			 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Vattenmyndigheten",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 110
	    		 }
		     },
			 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["VATTENFÖRVALTNING","MILJÖKVALITETSNORMER"],
	    			 layerId: "Mkn-kemisk-status",
	    			 displayName: "MKN kemisk status",
	    			 layers: 'MKN_KEMISK_STATUS',
	    			 format: 'image/png',
	    			 featureType: "polygon",
					 legend: "http://ext-geoservices.lansstyrelsen.se/ArcGIS/services/VISS/miljokvalitetsnormer/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=4",
					 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Vattenmyndigheten",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 110
	    		 }
		     },

		// MILJÖÖVERVAKNING	
		// MILJÖÖVERVAKNING	
		// MILJÖÖVERVAKNING	
		
				 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MILJÖÖVERVAKNING","VATTENKATEGORIER"],
	    			 layerId: "Vattendrag",
	    			 displayName: "Vattendrag",
	    			 layers: 'Vattendrag',
	    			 format: 'image/png',
	    			 featureType: "polygon",
					 legend: "http://ext-geoservices.lansstyrelsen.se/ArcGIS/services/VISS/Overvakning/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=22",
					 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Vattenmyndigheten",
					 popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 110
	    		 }
		     },
			 
			 	 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MILJÖÖVERVAKNING","VATTENKATEGORIER"],
	    			 layerId: "Sjö",
	    			 displayName: "Sjö",
	    			 layers: 'Sjö',
	    			 format: 'image/png',
	    			 featureType: "polygon",
					 legend: "http://ext-geoservices.lansstyrelsen.se/ArcGIS/services/VISS/Overvakning/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=21",
					 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Vattenmyndigheten",
					 popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 110
	    		 }
		     },
			 
			 	 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MILJÖÖVERVAKNING","VATTENKATEGORIER"],
	    			 layerId: "Grundvatten",
	    			 displayName: "Grundvatten",
	    			 layers: 'Grundvatten',
	    			 format: 'image/png',
	    			 featureType: "polygon",
					 legend: "http://ext-geoservices.lansstyrelsen.se/ArcGIS/services/VISS/Overvakning/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=23",
					 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Vattenmyndigheten",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 110
	    		 }
		     },
			 
			 	 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MILJÖÖVERVAKNING","VATTENKATEGORIER"],
	    			 layerId: "Badvatten",
	    			 displayName: "Badvatten",
	    			 layers: 'Badvattendirektivet',
	    			 format: 'image/png',
	    			 featureType: "polygon",
					 legend: "http://ext-geoservices.lansstyrelsen.se/ArcGIS/services/VISS/Overvakning/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=15",
					 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Vattenmyndigheten",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 110
	    		 }
		     },
			 
			 	 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MILJÖÖVERVAKNING","VATTENKATEGORIER"],
	    			 layerId: "Fiskvatten",
	    			 displayName: "Fiskvatten",
	    			 layers: 'Fiskvatten',
	    			 format: 'image/png',
	    			 featureType: "polygon",
					 legend: "http://ext-geoservices.lansstyrelsen.se/ArcGIS/services/VISS/Overvakning/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=16",
					 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Vattenmyndigheten",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 110
	    		 }
		     },
			 
			 	 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MILJÖÖVERVAKNING","BIOLOGISKA FAKTORER"],
	    			 layerId: "Bottenfauna",
	    			 displayName: "Bottenfauna",
	    			 layers: 'Bottenfauna',
	    			 format: 'image/png',
	    			 featureType: "polygon",
					 legend: "http://ext-geoservices.lansstyrelsen.se/ArcGIS/services/VISS/Overvakning/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=27",
					 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Vattenmyndigheten",
					 //popup: "<p>${Namn}<br/>${OBJECTID}</p>",
	    			 zIndex: 110
	    		 }
		     },
			 
			 	 	 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MILJÖÖVERVAKNING","BIOLOGISKA FAKTORER"],
	    			 layerId: "Växtplankton",
	    			 displayName: "Växtplankton",
	    			 layers: 'Växtplankton',
	    			 format: 'image/png',
	    			 featureType: "polygon",
					 legend: "http://ext-geoservices.lansstyrelsen.se/ArcGIS/services/VISS/Overvakning/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=28",
					 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Vattenmyndigheten",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 110
	    		 }
		     },
			 
			 	 	 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MILJÖÖVERVAKNING","BIOLOGISKA FAKTORER"],
	    			 layerId: "Makroalger-och-gömfröiga-växter",
	    			 displayName: "Makroalger och gömfröiga växter",
	    			 layers: 'Makroalger och gömfröiga växter',
	    			 format: 'image/png',
	    			 featureType: "polygon",
					 legend: "http://ext-geoservices.lansstyrelsen.se/ArcGIS/services/VISS/Overvakning/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=26",
					 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Vattenmyndigheten",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 110
	    		 }
		     },
			 
			 	 	 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MILJÖÖVERVAKNING","BIOLOGISKA FAKTORER"],
	    			 layerId: "Makrofyter",
	    			 displayName: "Makrofyter",
	    			 layers: 'Makrofyter',
	    			 format: 'image/png',
	    			 featureType: "polygon",
					 legend: "http://ext-geoservices.lansstyrelsen.se/ArcGIS/services/VISS/Overvakning/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=29",
					 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Vattenmyndigheten",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 110
	    		 }
		     },
			 
			 	 	 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MILJÖÖVERVAKNING","BIOLOGISKA FAKTORER"],
	    			 layerId: "Påväxt-kiselalger",
	    			 displayName: "Påväxt-kiselalger",
	    			 layers: 'Påväxt-kiselalger',
	    			 format: 'image/png',
	    			 featureType: "polygon",
					 legend: "http://ext-geoservices.lansstyrelsen.se/ArcGIS/services/VISS/Overvakning/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=30",
					 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Vattenmyndigheten",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 110
	    		 }
		     },
			 
			  	 	 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MILJÖÖVERVAKNING","BIOLOGISKA FAKTORER"],
	    			 layerId: "Fisk",
	    			 displayName: "Fisk",
	    			 layers: 'Fisk',
	    			 format: 'image/png',
	    			 featureType: "polygon",
					 legend: "http://ext-geoservices.lansstyrelsen.se/ArcGIS/services/VISS/Overvakning/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=31",
					 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Vattenmyndigheten",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 110
	    		 }
		     },
			 
			 	 	 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MILJÖÖVERVAKNING","FYSIKALISKA KEMISKA FAKTORER"],
	    			 layerId: "Näringsämnen",
	    			 displayName: "Näringsämnen",
	    			 layers: 'Näringsämnen',
	    			 format: 'image/png',
	    			 featureType: "polygon",
					 legend: "http://ext-geoservices.lansstyrelsen.se/ArcGIS/services/VISS/Overvakning/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=37",
					 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Vattenmyndigheten",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 110
	    		 }
		     },
			 
			 	 	 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MILJÖÖVERVAKNING","FYSIKALISKA KEMISKA FAKTORER"],
	    			 layerId: "Försurning",
	    			 displayName: "Försurning",
	    			 layers: 'Försurning',
	    			 format: 'image/png',
	    			 featureType: "polygon",
					 legend: "http://ext-geoservices.lansstyrelsen.se/ArcGIS/services/VISS/Overvakning/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=36",
					 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Vattenmyndigheten",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 110
	    		 }
		     },
			 
			 	 	 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MILJÖÖVERVAKNING","FYSIKALISKA KEMISKA FAKTORER"],
	    			 layerId: "Syrgasförhållande",
	    			 displayName: "Syrgasförhållande",
	    			 layers: 'Syrgasförhållande',
	    			 format: 'image/png',
	    			 featureType: "polygon",
					 legend: "http://ext-geoservices.lansstyrelsen.se/ArcGIS/services/VISS/Overvakning/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=35",
					 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Vattenmyndigheten",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 110
	    		 }
		     },
			 
			 	 	 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MILJÖÖVERVAKNING","FYSIKALISKA KEMISKA FAKTORER"],
	    			 layerId: "Ljusförhållande",
	    			 displayName: "Ljusförhållande",
	    			 layers: 'Ljusförhållande',
	    			 format: 'image/png',
	    			 featureType: "polygon",
					 legend: "http://ext-geoservices.lansstyrelsen.se/ArcGIS/services/VISS/Overvakning/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=34",
					 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Vattenmyndigheten",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 110
	    		 }
		     },
			 
			 	 	 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MILJÖÖVERVAKNING","FYSIKALISKA KEMISKA FAKTORER"],
	    			 layerId: "Övriga-kemiska-ämnen",
	    			 displayName: "Övriga kemiska ämnen",
	    			 layers: 'Övriga kemiska ämnen',
	    			 format: 'image/png',
	    			 featureType: "polygon",
					 legend: "http://ext-geoservices.lansstyrelsen.se/ArcGIS/services/VISS/Overvakning/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=33",
					 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Vattenmyndigheten",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 110
	    		 }
		     },
			 
			 	 	 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MILJÖÖVERVAKNING","FYSIKALISKA KEMISKA FAKTORER"],
	    			 layerId: "Prioriterade-ämnen",
	    			 displayName: "Prioriterade ämnen",
	    			 layers: 'Prioriterade ämnen',
	    			 format: 'image/png',
	    			 featureType: "polygon",
					 legend: "http://ext-geoservices.lansstyrelsen.se/ArcGIS/services/VISS/Overvakning/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=39",
					 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Vattenmyndigheten",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 110
	    		 }
		     },
			 		
			 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MILJÖÖVERVAKNING"],
	    			 layerId: "SLU-Elfiskeregister",
	    			 displayName: "SLU Elfiskeregister",
	    			 layers: 'SLU Elfiskeregistret',
	    			 format: 'image/png',
	    			 featureType: "polygon",
					 legend: "http://ext-geoservices.lansstyrelsen.se/ArcGIS/services/VISS/Overvakning/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=1",
					 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ SLU",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 110
	    		 }
		     },
			 
			 	 // {
	    		 // init: "L.TileLayer.WMS",
	    		 // url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 // options: {
					 // //legend: true,
		    		 // category: ["MILJÖÖVERVAKNING"],
	    			 // layerId: "SLU-Sjöprovfiske",
	    			 // displayName: "SLU Sjöprovfiske",
	    			 // layers: 'SLU Sjöprovfiske NORS',
	    			 // format: 'image/png',
	    			 // featureType: "polygon",
					 // legend: "http://ext-geoservices.lansstyrelsen.se/ArcGIS/services/VISS/Overvakning/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=0",
					 // selectable: false,
	    			 // transparent: true,
					 // opacity: 1,
	    			 // attribution: "@ SLU",
					 // //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 // zIndex: 110
	    		 // }
		     // },
			
		// VA & DAGVATTEN
		// VA & DAGVATTEN
		// VA & DAGVATTEN
		
			 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["VA & DAGVATTEN","VERKSAMHETSOMRÅDE"],
	    			 layerId: "VA_verksamhetsområde",
	    			 displayName: "Verksamhetsområde, dricksvatten",
	    			 layers: 'VA_verksamhetsområde',
	    			 format: 'image/png',
	    			 featureType: "point",
					 //legend: false,
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 0.8,
	    			 attribution: "@ Kävlingeåns kommuner",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			  {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["VA & DAGVATTEN","VERKSAMHETSOMRÅDE"],
	    			 layerId: "VA_spillvattenområde",
	    			 displayName: "Verksamhetsområde, spillvatten",
	    			 layers: 'VA_spillvattenområde',
	    			 format: 'image/png',
	    			 featureType: "point",
					 //legend: false,
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 0.8,
	    			 attribution: "@ Kävlingeåns kommuner",
					 //popup: "<p>Typ${typ}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["VA & DAGVATTEN","VERKSAMHETSOMRÅDE"],
	    			 layerId: "VA_dagvattenområde",
	    			 displayName: "Verksamhetsområde, dagvatten",
	    			 layers: 'VA_dagvattenområde',
	    			 format: 'image/png',
	    			 featureType: "point",
					 //legend: false,
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 0.8,
	    			 attribution: "@ Kävlingeåns kommuner",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
		
		 
			  {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["VA & DAGVATTEN"],
	    			 layerId: "VA_utlopp",
	    			 displayName: "Utloppspunkt",
	    			 layers: 'VA_utlopp',
	    			 format: 'image/png',
	    			 featureType: "point",
					 //legend: false,
	    			 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Kävlingeåns kommuner",
					 //popup: "<p>Typ${typ}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			 	  {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["VA & DAGVATTEN"],
	    			 layerId: "VA_braddavlopp",
	    			 displayName: "Bräddavlopp",
	    			 layers: 'VA_braddpunkt',
	    			 format: 'image/png',
	    			 featureType: "point",
					 //legend: false,
	    			 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Kävlingeåns kommuner",
					 //popup: "<p>Typ${typ}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			 	  {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["VA & DAGVATTEN"],
	    			 layerId: "VA_reningsverk",
	    			 displayName: "Reningsverk",
	    			 layers: 'VA_reningsverk',
	    			 format: 'image/png',
	    			 featureType: "point",
					 //legend: false,
	    			 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Kävlingeåns kommuner",
					 //popup: "<p>Typ${typ}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			 	  {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["VA & DAGVATTEN"],
	    			 layerId: "VA_reningsdamm",
	    			 displayName: "Reningsdamm",
	    			 layers: 'VA_reningsdamm',
	    			 format: 'image/png',
	    			 featureType: "point",
					 //legend: false,
	    			 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Kävlingeåns kommuner",
					 //popup: "<p>Typ${typ}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 	
				 	  {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["VA & DAGVATTEN"],
	    			 layerId: "VA_vattenskyddsområde",
	    			 displayName: "Vattenskyddsområde",
	    			 layers: 'VA_vattenskyddsområde',
	    			 format: 'image/png',
	    			 featureType: "point",
					 //legend: false,
	    			 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Kävlingeåns kommuner",
					 //popup: "<p>Typ${typ}</p>",
	    			 zIndex: 100
	    		 }
		     },
 			 
		
			 
		// SAMHÄLLSPLANERING & KRISBEREDSKAP
		// SAMHÄLLSPLANERING & KRISBEREDSKAP
		// SAMHÄLLSPLANERING & KRISBEREDSKAP
			 
			    {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["FYSISK PLANERING"],
	    			 layerId: "Planerad-mark",
	    			 displayName: "Planerad mark",
	    			 layers: 'Plan-gällande',
	    			 format: 'image/png',
	    			 featureType: "point",
					 //legend: false,
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Kävlingeåns kommuner",
					 popup: "<p>Akt nr: ${akt}<br/>Årtal: ${årtal}<br/><a href='${url}'>Länk till plan</a></p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			     {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["FYSISK PLANERING"],
	    			 layerId: "Plan-pågående",
	    			 displayName: "Pågående planarbete",
	    			 layers: 'Plan-pågående',
	    			 format: 'image/png',
	    			 featureType: "point",
					 //legend: false,
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Kävlingeåns kommuner",
					 //popup: "<p>Etikett: <br/>${pa}<br/>${status}</p>",
	    			 zIndex: 100
	    		 }
		     },
	
			    {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["FYSISK PLANERING"],
	    			 layerId: "OP_nybyggnad",
	    			 displayName: "Översiktsplan, nybyggnad",
	    			 layers: 'OP_nybyggnad',
	    			 format: 'image/png',
	    			 featureType: "point",
					 // legend: false,
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Kävlingeåns kommuner",
					 popup: "<p>Typ: ${typ}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			    {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["FYSISK PLANERING"],
	    			 layerId: "OP_omvandling",
	    			 displayName: "Översiktsplan, omvandling",
	    			 layers: 'OP_omvandling',
	    			 format: 'image/png',
	    			 featureType: "point",
					 // legend: false,
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Kävlingeåns kommuner",
					 popup: "<p>Typ: ${typ}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			   {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["FYSISK PLANERING"],
	    			 layerId: "OP_linje",
	    			 displayName: "Översiktsplan, linje",
	    			 layers: 'OP_linje',
	    			 format: 'image/png',
	    			 featureType: "point",
					 // legend: false,
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Kävlingeåns kommuner",
					 popup: "<p>Typ: ${typ}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			   {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["FYSISK PLANERING"],
	    			 layerId: "Samlad_bebyggelse",
	    			 displayName: "Samlad bebyggelse",
	    			 layers: 'Samlad_bebyggelse',
	    			 format: 'image/png',
	    			 featureType: "point",
					 // legend: false,
	    			 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Kävlingeåns kommuner",
					 //popup: "<p>Typ: ${typ}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			 	    {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["FYSISK PLANERING"],
	    			 layerId: "Havsnivåökning1m",
	    			 displayName: "Havsnivåhöjning 1m",
	    			 layers: 'Lst-havsokning-1m',
	    			 format: 'image/png',
	    			 featureType: "point",
					 //legend: false,
	    			 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Länsstyrelsen",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			 	 	    {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["FYSISK PLANERING"],
	    			 layerId: "Havsnivåökning3m",
	    			 displayName: "Havsnivåhöjning 3m",
	    			 layers: 'Lst-havsokning-3m',
	    			 format: 'image/png',
	    			 featureType: "point",
					 //legend: false,
	    			 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Länsstyrelsen",
					 //popup: "<p>Hållplats:<br/>${adress}</p><p><a href=${url}>Tidtabell</a></p>",
	    			 zIndex: 100
	    		 }
		     },
			 
		// MILJÖFÖRVALTNING
		// MILJÖFÖRVALTNING
		// MILJÖFÖRVALTNING
			 
			 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MILJÖFÖRVALTNING"],
	    			 layerId: "Miljo-verksamhet",
	    			 displayName: "Miljöverksamhet",
	    			 layers: 'Miljo-verksamhet',
	    			 format: 'image/png',
	    			 featureType: "point",
					 //legend: false,
	    			 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Kävlingeåns kommuner",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			  	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MILJÖFÖRVALTNING"],
	    			 layerId: "Miljo-enskilt-avlopp",
	    			 displayName: "Enskilt avlopp",
	    			 layers: 'Miljo-enskilt-avlopp',
	    			 format: 'image/png',
	    			 featureType: "point",
					 //legend: false,
	    			 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Kävlingeåns kommuner",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			  	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MILJÖFÖRVALTNING"],
	    			 layerId: "Miljo-nerlagd-deponi",
	    			 displayName: "Nerlagd deponi",
	    			 layers: 'Miljo-nerlagd-deponi',
	    			 format: 'image/png',
	    			 featureType: "point",
					 //legend: false,
	    			 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Kävlingeåns kommuner",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			  	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MILJÖFÖRVALTNING"],
	    			 layerId: "Miljo-djurhållning",
	    			 displayName: "Djurhållning",
	    			 layers: 'Miljo-djurhållning',
	    			 format: 'image/png',
	    			 featureType: "point",
					 //legend: false,
	    			 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Kävlingeåns kommuner",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MILJÖFÖRVALTNING"],
	    			 layerId: "SE.PF.Täkter",
	    			 displayName: "Produktion & industri: Täkt",
	    			 layers: 'SE.PF.Täkter',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://ext-geoservices.lansstyrelsen.se/ArcGIS/services/Inspire/SE_PF_WMS/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=3",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Länsstyrelsen",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			  {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MILJÖFÖRVALTNING"],
	    			 layerId: "SE.PF.Tillverkning",
	    			 displayName: "Produktion & industri: Tillverkning",
	    			 layers: 'SE.PF.Tillverkning',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://ext-geoservices.lansstyrelsen.se/ArcGIS/services/Inspire/SE_PF_WMS/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=2",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Länsstyrelsen",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			  {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MILJÖFÖRVALTNING"],
	    			 layerId: "SE.PF.Energi",
	    			 displayName: "Produktion & industri: Energi",
	    			 layers: 'SE.PF.Energi',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://ext-geoservices.lansstyrelsen.se/ArcGIS/services/Inspire/SE_PF_WMS/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=1",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Länsstyrelsen",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			  {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MILJÖFÖRVALTNING"],
	    			 layerId: "SE.US.Miljöförvaltningsanläggningar",
	    			 displayName: "Miljöförvaltningsanläggning",
	    			 layers: 'SE.US.Miljöförvaltningsanläggningar',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://ext-geoservices.lansstyrelsen.se/ArcGIS/services/Inspire/SE_US_WMS/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=0",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Länsstyrelsen",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			  {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MILJÖFÖRVALTNING"],
	    			 layerId: "Seveso",
	    			 displayName: "Seveso verksamhet",
	    			 layers: 'Seveso Verksamheter',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://gis-services.metria.se/arcgis/rest/services/msb/InspireMSB_Seveso/MapServer/exts/InspireView/SWE/service?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=verksamheter",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Länsstyrelsen",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
		// ÅTGÄRDSARBETE
		// ÅTGÄRDSARBETE
		// ÅTGÄRDSARBETE
			 
			 		  {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["ÅTGÄRDSARBETE"],
	    			 layerId: "Dammdatabas",
	    			 displayName: "Anlagda dammar",
	    			 layers: 'Dammdatabas',
	    			 format: 'image/png',
	    			 featureType: "point",
					 //legend: "http://gis-services.metria.se/arcgis/rest/services/msb/InspireMSB_Seveso/MapServer/exts/InspireView/SWE/service?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=verksamheter",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 0.7,
	    			 attribution: "@ KVR",
					 popup: '<p>'+
					 'Namn: ${dammnamn}<br/>'+
					 'Yta: ${dammyta} ha<br/>'+
					 'Anlagd: ${färdigställandedatum}<br/>'+
					 'Tillrinningsarea: ${tillrinnstorlek}<br/>'+
					 'Volym (min-max): ${volym_min}-${volym_max}<br/>'+
					 'Dammtyp: ${dammtyp}'+
					 '</p>',
	    			 zIndex: 190
	    		 }
		     },
			 
		// MARKFÖRHÅLLANDEN
		// MARKFÖRHÅLLANDEN
		// MARKFÖRHÅLLANDEN
			 
	 		  {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MARKFÖRHÅLLANDEN"],
	    			 layerId: "Berggrundsytor",
	    			 displayName: "Berggrund",
	    			 layers: 'Berggrundsytor',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://maps3.sgu.se:80/geoserver/berg/ows&request=GetLegendGraphic&format=image/png&width=20&height=20&layer=SE.GOV.SGU.BERGGRUND_NA10",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ SGU",
					 popup: "<p>Litologi: ${litologi}</p>",
	    			 zIndex: 90
	    		 }
		     },

			 	  {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MARKFÖRHÅLLANDEN"],
	    			 layerId: "Berggrundslinjer",
	    			 displayName: "Berggrund, linjer",
	    			 layers: 'Berggrundslinjer',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://maps3.sgu.se:80/geoserver/berg/ows&request=GetLegendGraphic&format=image/png&width=20&height=20&layer=SE.GOV.SGU.BERGGRUND_NA10_LINJER",
	    			 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ SGU",
					 // popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 95
	    		 }
		     },
			 
			 	  {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MARKFÖRHÅLLANDEN"],
	    			 layerId: "Deformationszoner",
	    			 displayName: "Deformationszoner",
	    			 layers: 'Deformationszoner',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://maps3.sgu.se:80/geoserver/berg/ows&request=GetLegendGraphic&format=image/png&width=20&height=20&layer=SE.GOV.SGU.BERGGRUND_NA10_DFZ",
	    			 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ SGU",
					 // popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 95
	    		 }
		     },
			 
	 		  {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MARKFÖRHÅLLANDEN"],
	    			 layerId: "Jordart",
	    			 displayName: "Jordart",
	    			 layers: 'Jordart',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://maps3.sgu.se:80/geoserver/jord/ows&request=GetLegendGraphic&format=image/png&width=20&height=20&layer=SE.GOV.SGU.JORD.GRUNDLAGER.25K",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ SGU",
					 // popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 90
	    		 }
		     },

	 		  {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MARKFÖRHÅLLANDEN"],
	    			 layerId: "Raviner",
	    			 displayName: "Raviner",
	    			 layers: 'Raviner',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://maps3.sgu.se:80/geoserver/jord/SE.GOV.SGU.JORD.RAVINER/ows&request=GetLegendGraphic&format=image/png&width=20&height=20&layer=SE.GOV.SGU.JORD.RAVINER",
	    			 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ SGU",
					 // popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 95
	    		 }
		     },

	 	
			 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MARKFÖRHÅLLANDEN"],
	    			 layerId: "Åkermarksklass",
	    			 displayName: "Åkermarksklass",
	    			 layers: 'Akermarksklass',
	    			 format: 'image/png',
	    			 featureType: "point",
					 //legend: "http://gis-services.metria.se/arcgis/rest/services/msb/InspireMSB_Seveso/MapServer/exts/InspireView/SWE/service?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=verksamheter",
	    			 selectable: false,
	    			 transparent: true,
					 opacity: 0.7,
	    			 attribution: "@ Länsstyrelsen",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 90
	    		 }
		     },
			 
			 	 		  {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["MARKFÖRHÅLLANDEN"],
	    			 layerId: "HB.Angs-och_betesmarksinventeringen",
	    			 displayName: "Ängs- och betesmarksinventeringen",
	    			 layers: 'HB.Angs-och_betesmarksinventeringen',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://epub.sjv.se:80/inspire/inspire/wms?request=GetLegendGraphic&format=image/png&width=20&height=20&layer=HB.Angs-och_betesmarksinventeringen",
	    			 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Jordbruksverket",
					 // popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 93
	    		 }
		     },
			 
							 
		// SKYDDADE OMRÅDEN
		// SKYDDADE OMRÅDEN
		// SKYDDADE OMRÅDEN
			 
			 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["SKYDDADE OMRÅDEN"],
	    			 layerId: "Naturreservat",
	    			 displayName: "Naturreservat",
	    			 layers: 'PS.Naturreservat',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://gis-services.metria.se/arcgis/rest/services/nv/InspireNV_NVR/MapServer/exts/InspireView/SWE/service?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=PS.NR",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Naturvårdsverket",
					 popup: "<p>http://gis-services.metria.se/arcgis/rest/services/nv/InspireNV_NVR/MapServer/exts/InspireView/SWE/service?</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["SKYDDADE OMRÅDEN"],
	    			 layerId: "Kulturreservat",
	    			 displayName: "Kulturreservat",
	    			 layers: 'PS.Kulturreservat',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://gis-services.metria.se/arcgis/rest/services/nv/InspireNV_NVR/MapServer/exts/InspireView/SWE/service?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=PS.KR",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Naturvårdsverket",
					 popup: "<p>${namn}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["SKYDDADE OMRÅDEN"],
	    			 layerId: "Biotopskydd",
	    			 displayName: "Biotopskydd",
	    			 layers: 'PS.Biotopskyddsområden',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://gis-services.metria.se/arcgis/rest/services/nv/InspireNV_NVR/MapServer/exts/InspireView/SWE/service?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=PS.OBO",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Naturvårdsverket",
					 popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["SKYDDADE OMRÅDEN"],
	    			 layerId: "Natura-2000-habitat",
	    			 displayName: "Natura 2000 habitatdirektiv",
	    			 layers: 'PS.N2K.Habitatdirektivet',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://gis-services.metria.se/arcgis/rest/services/nv/InspireNV_N2K/MapServer/exts/InspireView/SWE/service?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=PS.N2K.Habitatdirektivet",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Naturvårdsverket",
					 popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["SKYDDADE OMRÅDEN"],
	    			 layerId: "Natura-2000-fågel",
	    			 displayName: "Natura 2000 fågeldirektiv",
	    			 layers: 'PS.N2K.Fageldirektivet',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://gis-services.metria.se/arcgis/rest/services/nv/InspireNV_N2K/MapServer/exts/InspireView/SWE/service?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=PS.N2K.Fageldirektivet",

	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Naturvårdsverket",
					 popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["SKYDDADE OMRÅDEN"],
	    			 layerId: "Ramsar",
	    			 displayName: "Ramsar",
	    			 layers: 'PS.RAMSAR',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://gis-services.metria.se/arcgis/rest/services/nv/InspireNV_Ramsar/MapServer/exts/InspireView/SWE/service?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=PS.RAMSAR",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Naturvårdsverket",
					 popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			 	 	 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["SKYDDADE OMRÅDEN"],
	    			 layerId: "Strandskydd",
	    			 displayName: "Strandskydd",
	    			 layers: 'Strandskydd',
	    			 format: 'image/png',
	    			 featureType: "point",
					 // legend: "http://gis-services.metria.se/arcgis/rest/services/nv/InspireNV_NVR/MapServer/exts/InspireView/SWE/service?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=PS.DVO",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Länsstyrelsen",
					 // popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			 	 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["SKYDDADE OMRÅDEN"],
	    			 layerId: "Djurochväxtskydd",
	    			 displayName: "Djur- och växtskyddsområde",
	    			 layers: 'PS.Djur- och växtskyddsområde',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://gis-services.metria.se/arcgis/rest/services/nv/InspireNV_NVR/MapServer/exts/InspireView/SWE/service?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=PS.DVO",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Naturvårdsverket",
					 popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
	  	 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["SKYDDADE OMRÅDEN"],
	    			 layerId: "Fornminne",
	    			 displayName: "Fornminne",
	    			 layers: 'Fornminne',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://geodata.raa.se/deegree/services/inspire_wms?request=GetLegendGraphic&version=1.1.1&format=image/png&layer=PS.ProtectedSite",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Riksantikvarieämbetet",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },			  	

				{
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["SKYDDADE OMRÅDEN"],
	    			 layerId: "NaturminnePunkt",
	    			 displayName: "Naturminne punkt",
	    			 layers: 'PS.Naturminnen punkter',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://gis-services.metria.se/arcgis/rest/services/nv/InspireNV_NVR/MapServer/exts/InspireView/SWE/service?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=PS.POINT",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Naturvårdsverket",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			  	 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["SKYDDADE OMRÅDEN"],
	    			 layerId: "NaturminneYta",
	    			 displayName: "Naturminne yta",
	    			 layers: 'PS.Naturminnen ytor',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://gis-services.metria.se/arcgis/rest/services/nv/InspireNV_NVR/MapServer/exts/InspireView/SWE/service?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=PS.NM",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Naturvårdsverket",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			  	 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["SKYDDADE OMRÅDEN"],
	    			 layerId: "Nyckelbiotop",
	    			 displayName: "Nyckelbiotop",
	    			 layers: 'Nyckelbiotop_Skogsstyrelsen',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://geodpags.skogsstyrelsen.se/arcgis/services/Geodataportal/GeodataportalVisaNyckelbiotop/MapServer/WmsServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=Nyckelbiotop_Skogsstyrelsen",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Skogsstyrelsen",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["SKYDDADE OMRÅDEN"],
	    			 layerId: "Sumpskog",
	    			 displayName: "Sumpskog",
	    			 layers: 'Sumpskog_Skogsstyrelsen',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://geodpags.skogsstyrelsen.se/arcgis/services/Geodataportal/GeodataportalVisaSumpskog/MapServer/WmsServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=Sumpskog_Skogsstyrelsen",
	    			 selectable: false,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Skogsstyrelsen",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
		// RIKSINTRESSEN
		// RIKSINTRESSEN
		// RIKSINTRESSEN
			 
			{
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["RIKSINTRESSEN"],
	    			 layerId: "Riksintresse-Naturvård",
	    			 displayName: "Riksintresse naturvård, 3:6",
	    			 layers: 'RI_NATURVARD',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://ext-geoservices.lansstyrelsen.se/arcgis/services/riksintressen/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=62",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Naturvårdsverket",
					 popup: "<p>Hej</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["RIKSINTRESSEN"],
	    			 layerId: "Riksintresse-Friluftsliv",
	    			 displayName: "Riksintresse friluftsliv, 3:6",
	    			 layers: 'RI_FRILUFTSLIV',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://ext-geoservices.lansstyrelsen.se/arcgis/services/riksintressen/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=61",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Naturvårdsverket",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["RIKSINTRESSEN"],
	    			 layerId: "Riksintresse-kulturmiljövård",
	    			 displayName: "Riksintresse kulturmiljövård, 3:6",
	    			 layers: 'RI_KULTURMILJOVARD',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://ext-geoservices.lansstyrelsen.se/arcgis/services/riksintressen/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=63",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ RAÄ",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["RIKSINTRESSEN"],
	    			 layerId: "Riksintresse-vardefulla-amnen",
	    			 displayName: "Riksintresse värdefulla ämnen, 3:7",
	    			 layers: 'RI_VARDEFULLA_AMNEN',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://ext-geoservices.lansstyrelsen.se/ArcGIS/services/riksintressen/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=59",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ SGU",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["RIKSINTRESSEN","VÄG"],
	    			 layerId: "RIVägbefintlig",
	    			 displayName: "Väg",
	    			 layers: 'Väg - befintlig',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://ext-geoservices.lansstyrelsen.se/arcgis/services/riksintressen/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=27",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Trafikverket",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["RIKSINTRESSEN","VÄG"],
	    			 layerId: "RIVägplanerad",
	    			 displayName: "Väg, planerad",
	    			 layers: 'Väg - planerad',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://ext-geoservices.lansstyrelsen.se/arcgis/services/riksintressen/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=26",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Trafikverket",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["RIKSINTRESSEN","VÄG"],
	    			 layerId: "RIVägframtida",
	    			 displayName: "Väg, framtida",
	    			 layers: 'Väg - framtida',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://ext-geoservices.lansstyrelsen.se/arcgis/services/riksintressen/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=25",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Trafikverket",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["RIKSINTRESSEN","JÄRNVÄG"],
	    			 layerId: "RIJärnvägbefintlig",
	    			 displayName: "Järnväg",
	    			 layers: 'Järnväg - befintlig',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://ext-geoservices.lansstyrelsen.se/arcgis/services/riksintressen/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=35",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Trafikverket",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["RIKSINTRESSEN","JÄRNVÄG"],
	    			 layerId: "RIJärnvägplanerad",
	    			 displayName: "Järnväg, planerad",
	    			 layers: 'Järnväg - planerad',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://ext-geoservices.lansstyrelsen.se/arcgis/services/riksintressen/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=34",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Trafikverket",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["RIKSINTRESSEN","JÄRNVÄG"],
	    			 layerId: "RIJärnvägframtida",
	    			 displayName: "Järnväg, framtida",
	    			 layers: 'Järnväg - framtida',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://ext-geoservices.lansstyrelsen.se/arcgis/services/riksintressen/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=33",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Trafikverket",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
		
			 
			 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["RIKSINTRESSEN","ÖVRIGA"],
	    			 layerId: "Yrkesfiske",
	    			 displayName: "Yrkesfiske",
	    			 layers: 'YRKESFISKE',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://ext-geoservices.lansstyrelsen.se/arcgis/services/riksintressen/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=67",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Länsstyrelsen",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			 // {
	    		 // init: "L.TileLayer.WMS",
	    		 // url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 // options: {
					 // //legend: true,
		    		 // category: ["RIKSINTRESSEN","ÖVRIGA"],
	    			 // layerId: "RIIndustri",
	    			 // displayName: "Industriell produktion, 3:8",
	    			 // layers: 'LST Riksintresse Industriell produktion',
	    			 // format: 'image/png',
	    			 // featureType: "point",
					 // legend: "http://ext-geoservices.lansstyrelsen.se/arcgis/services/riksintressen/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=57",
	    			 // selectable: true,
	    			 // transparent: true,
					 // opacity: 1,
	    			 // attribution: "@ Länsstyrelsen",
					 // //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 // zIndex: 100
	    		 // }
		     // },
			 
			 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["RIKSINTRESSEN","ÖVRIGA"],
	    			 layerId: "RIKustTurism",
	    			 displayName: "Kust, turism- och friluftsliv, 4:2",
	    			 layers: 'RI_KUST_TURISM',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://ext-geoservices.lansstyrelsen.se/arcgis/services/riksintressen/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=8",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Länsstyrelsen",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
			
			 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["RIKSINTRESSEN","ÖVRIGA"],
	    			 layerId: "Militär",
	    			 displayName: "Militär",
	    			 layers: 'RI_FORSVAR',
	    			 format: 'image/png',
	    			 featureType: "point",
					 legend: "http://ext-geoservices.lansstyrelsen.se/arcgis/services/riksintressen/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=16",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Länsstyrelsen",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 100
	    		 }
		     },
			 
		// REKREATION
		// REKREATION
		// REKREATION
		
			  {
                init: "L.TileLayer.WMS",
				url: "http://193.17.67.229/geoserver/common/wms?",
                parentTag: "service",
                options: {
                    //legend: true,
                    category: ["REKREATION"],
                    layerId: "Hallplatser",
                    displayName: "Hållplatser",
                    layers: 'common:lund_hallplatser',
                    format: 'image/png',
					info_format: 'text/json',
                    selectable: true,
                    transparent: true,
                    opacity: 0.8,
                    attribution: "@ Skånetrafiken",
                    //popup: "<p>${caption}</p>",
                    zIndex: 100
                }
             },
			 
			 	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://193.17.67.229/qgis/lund/vspu2/qgis_mapserv.fcgi",
	    		 options: {
					 //legend: true,
		    		 category: ["REKREATION"],
	    			 layerId: "Fiskeforbud",
	    			 displayName: "Fiskeförbud",
	    			 layers: 'Fiskeforbud',
	    			 format: 'image/png',
	    			 featureType: "point",
					 //legend: "http://ext-geoservices.lansstyrelsen.se/arcgis/services/riksintressen/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=16",
	    			 selectable: true,
	    			 transparent: true,
					 opacity: 1,
	    			 attribution: "@ Länsstyrelsen",
					 //popup: "<p>${NAMN}<br/>${GENBESKR}</p>",
	    			 zIndex: 110
	    		 }
		     },
			
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
					displayName: "Flygfoto",
					// category: ["Flygfoto"],
					attribution: "Bing aerial",
					maxZoom: 18
				}
			}
	
		
			],


		// These are plugins – extending the map's functionality
		plugins: [
					{
						init: "L.Control.VspuHeaderLund",
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
							buffer: 10,
							useProxy: true
						}
					},
					
					{
						init: "L.Control.Print",
						options: {
								position:"topright"
						}
					},
					{
						init: "L.Control.MeasureDraw",
						options: {}
					},
					{
						init: "L.Control.SelectVector",
						options: {
							buffer: 5
						}
					},
					
					{
						init: "L.Control.ShareLink",
						options: {
							position: "topright"
							}
					},
					{
						init: "L.Control.Info",
						options: {
						}
					}
				]
		
};

