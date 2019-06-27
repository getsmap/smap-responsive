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
			
			
			
			
		{
                	init: "L.TileLayer.WMS",
                	url: "http://kartor.lund.se/geoserver/wms",
                	options: 
			{
                    		//legend: true,
                    		category: ["Planer"],
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


		}
		     
		     
			 
	

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
