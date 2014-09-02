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
			proxy: "http://91.123.201.52/cgi-bin/proxy.py?url="
		}
};


var config = {
		 
		ws: ws,
		
		ol: [
		  		{
					  init: "L.GeoJSON.WFS",
					  url: "http://xyz.malmo.se:8081/geoserver/wfs",
					  options: {
						  layerId: "shareposition",
						  displayName: "Delade positioner",
						  proxy: ws[document.domain].proxy,
						  attribution: "Malmö stads WFS",
						  zIndex: 50,
						  reverseAxis: false,
						  reverseAxisBbox: true,
						  selectable: true,
						  popup: '<div>User: ${text_username}</div>'+
						  		'<div>Felmarginal: ${int_accuracy} m</div>'+
						  		'<div>Registrerad: ${datetime_changed}</div>',
						  uniqueKey: "id",
						  params: {
					    	 	typeName: "sandbox:sharedpositions",
								version: "1.1.0",
								maxFeatures: 10000,
								format: "text/geojson",
								outputFormat: "json"
				     		},
						  hoverColor: '#FF0',
						  style: {
							  weight: 2,
							  color: '#F00',
							  dashArray: '',
							  fillOpacity: 0.5
						  }
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
		        	   init: "L.Control.SharePosition",
		        	   options: {
		        	   		useProxy: true
		           		}
		           },
		           {
		        	   init: "L.Control.Search",
		        	   options: {}
		           },
                    {
                        init: "L.Control.Zoombar",
                        options: {}
                    }
                    ,
                    {
 		        	   init: "L.Control.Geolocate",
 		        	   options: {}
 		           	}
 		           	// ,
               //      {
               //          init: "L.Control.ShareLink",
               //          options: {
               //      		addToMenu: false
               //      	}
               //      },
               //      {
 		        	   // init: "L.Control.Info",
 		        	   // options: {}
 		           	// }
//                    ,
//                    {
//                        init: "L.Control.Menu",
//                        options: {}
//                    }
       ]
};
