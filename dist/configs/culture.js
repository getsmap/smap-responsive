
var config = {

		params:{
			center: [12.72491455078125,56.01834293384084],
			zoom: 10
		},

		ws: {
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
			},
			"kartor.helsingborg.se": {
				proxy: "http://kartor.helsingborg.se/cgi-bin/proxy.py?url="
			}
		},
		
		ol: [
			{
		    	 init: "L.GeoJSON.WFS",
		    	 url: "http://localhost/cgi-bin/cultMap/getGeoData.py",
		    	 options: {
		    	 	layerId: "hembygdsgard",
		    	 	displayName: "Hembygdsgårdar",
		    	 	attribution: "Stadsbyggnadskontoret, Malmö",
		    	 	inputCrs: "EPSG:4326",
		    	 	reverseAxis: false,
		    	 	reverseAxisBbox: false,
		    	 	selectable: true,
		    	 	popup: '<h4>${txt_name}</h4>',
		    	 	uniqueKey: "id",
		    	 	params: {
		    	 		q: "hembygdsgard"
		     		},
		     		style: {
		     			radius: 8,
		     		    fillColor: "#ff7800",
		     		    color: "#000",
		     		    weight: 1,
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
		    	 url: "http://localhost/cgi-bin/cultMap/getGeoData.py",
		    	 options: {
		    	 	layerId: "Kulturen",
		    	 	displayName: "Kulturen",
		    	 	attribution: "Stadsbyggnadskontoret, Malmö",
		    	 	inputCrs: "EPSG:4326",
		    	 	reverseAxis: false,
		    	 	reverseAxisBbox: false,
		    	 	selectable: true,
		    	 	popup: '<h4>${txt_name}</h4>',
		    	 	uniqueKey: "id",
		    	 	params: {
		    	 		q: "kulturen"
		     		},
		     		style: {
		     			radius: 8,
		     		    fillColor: "#ff7800",
		     		    color: "#000",
		     		    weight: 1,
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
		        	   options: {}
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
		        	   options: {}
		           },
                    {
                        init: "L.Control.Zoombar",
                        options: {}
                    },
                    {
                        init: "L.Control.ShareLink",
                        options: {
                    		addToMenu: false
                    	}
                    },
            		{
  		        	   init: "L.Control.Print",
  		        	   options: {}
  		           	},
  		           	{
		        	   init: "L.Control.Opacity",
		        	   options: {
		        	   		addToMenu: false,
		        	   		savePrefBox: true
		        	   }
		           },
		           {
		        	   init: "L.Control.ToolHandler",
		        	   options: {
		        	   		addToMenu: false
		        	   }
		           }
       ]
};
