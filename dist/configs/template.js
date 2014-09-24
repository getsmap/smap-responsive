
var config = {

		params:{
			center: [13.0, 55.6],
			zoom: 14,
			hash: false
		},
				
		ol: [],
			
		bl: [
		{
			init: "L.TileLayer",
			url: 'http://kartor.malmo.se/wwwroot_data/tilecache/malmo/malmo_leaflet_cache_EPSG900913/{z}/{x}/{y}.jpeg',
			options: {
				layerId: "malmotileKartor",
				displayName: "Malmö karta",
				attribution: "© Malmö Stadsbyggnadskontor",
				minZoom: 6,
				extension: "jpeg",
				maxZoom: 18,
				tms: true
			}
		},
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
			init: "L.esri.BasemapLayer",
			url: "Gray",  //'Streets', 'Topographic', 'Oceans', 'NationalGeographic', 'Gray', 'GrayLabels', 'DarkGray', 'DarkGrayLabels', 'Imagery', 'ImageryLabels', 'ImageryTransportation', 'ShadedRelief' or 'ShadedReliefLabels' 
			options: {
				layerId: "esri",
				displayName: "ESRI",
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
						options: {}
					},
					{
						init: "L.Control.Search",
						options: {}
					},
					{
						init: "L.Control.ShareLink",
						options: {
							position: "topright"
						}
					},
					{
						init : "L.Control.RedirectClick",		
						option: {
							url: "http://xyz.malmo.se/urbex/index.htm?p=true&xy=${x};${y}",
							position: "topright"
						}
					},
					{
 						init: "L.Control.Info",
 						options: {
 							position: "topright"
 						}
 				 	},
					{
 						init: "L.Control.Print",
 						options: {
 							printUrl: "http://localhost/geoserver/pdf", // http://localhost/geoserver/pdf
 							position: "topright"
 						}
 				 	},
 				 	{
						init: "L.Control.Opacity",
						options: {
					 		savePrefBox: true,
					 		position: "topright"
						}
					},
					{
						init: "L.Control.ToolHandler",
						options: {}
					},
					// {
					//  	init: "L.Control.Add2HomeScreen",
					//  	options: {}
					// },
					{
						 init: "L.Control.FullScreen",
							options: {position: 'topright'}
					}
					// ,
					// {
					// 	init: "L.Control.DrawSmap",
					// 	options: {
					// 		position: "topright"
					// 	}
					// }
		]
};
