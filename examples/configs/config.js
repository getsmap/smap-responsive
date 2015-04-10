
var config = {

		// These params are default and can be overridden by calling the map with e.g. http://mymap?center=13.1,55.6&zoom=17
		params: {
			// The map's centering from start. Coordinates should be in WGS 84 and given like [easting, northing] i.e. [longitude, latitude]
			center: [13.0, 55.58],

			// The initial zoom of the map, In this example I zoom out slightly if the screen is smaller than given number of pixels
			zoom: $(window).width() < 600 ? 11 : 12
		},

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
			title: "Malmö Stadsatlas",

			// The favicon to be used
			favIcon: "//assets-cdn.github.com/favicon.ico"
		},

		// -- Baselayers (background layers) --
		bl: [
			// -- An openstreetmap layer. Note that all layer types used as overlays can also be used as baselayers, and vice versa (see more layers below). --
			{
				init: "L.TileLayer",
				url: '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
				options: {
					layerId: "osm",
					displayName: "OSM",
					attribution: '<span>© OpenStreetMap contributors</span>&nbsp;|&nbsp;<span>Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="//developer.mapquest.com/content/osm/mq_logo.png"></span>',
					maxZoom: 18
				}
			}

		],
		
		// -- Overlays --
		ol: [

			// <><><><><><><><><><><><><><><><><><><><><><><><><><>
			// A WMS layer (none tiled)
			// <><><><><><><><><><><><><><><><><><><><><><><><><><>
			{
				init: "L.NonTiledLayer.WMS", 					// The constructor. Replace with "L.TileLayer.WMS" for a normal tiled WMS, which is the default WMS-layer in Leaflet: http://leafletjs.com/reference.html#tilelayer-wms
				url: "http://kartor.malmo.se/geoserver/wms",	// The URL sent in when instantiating the constructor class
				options: {
					displayName: "Districts of Malmö", 			// The name visible to users
					layerId: "districts_malmo", 				// Internal name (must be unique). Used e.g. when creating a link to the map.
					category: ["Raster layers", "Sub category"],// Decides the categories for the LayerSwitcher plugin (any number of sub-categories can in theory be used)
					layers: "malmows:SMA_DELOMRADE_P", 			// Required WMS-parameter
					legend: null,								// Optional legend (otherwise tries to create based on layer's url)
					legendBig: null,							// Optional hover legend (displayed on legend hover). If not provided, the value of legend is used.
					selectable: true,							// Make the layer selectable (requires Select plugin, see plugins section further down)

					// Note! Select requires the data service to be on same domain as the map – or setting up a proxy
					selectOptions: {
						// If you want map click to go to a different layer than the one visualised, these parameters
						// will override the layer's paramters (given above)
						url: null,								// (a null value here means the url set above will be used)
						layers: null, 							// The given layer will be used instead of layers given above (here null value means layers, as set above, will be used)

						info_format: "application/json",		// The format to be returned on click (first check if your WMS-service supports application/json or text/plain which are supported here)
						srs: "EPSG:3008"						// In case your data service serves data in a different projection than EPSG:3857, give the original projection here
					},

					popup: '<div>${delomr}</div>',				// HTML template for popup. You can extract properties by writing the column name inside brackets, like this: ${the_column_name}
					format: 'image/png',						// The format of the images returned from the WMS-service
					zIndex: 150,								// The z-index of the layer
					attribution: "@ Malmö stad", 				// Copyright visible at the bottom-left of the map
					transparent: true							// A WMS-parameter which makes all white cells transparent (this parameter should in most cases be true)
				}
			},

			// <><><><><><><><><><><><><><><><><><><><><><><><><><>
			// A WFS layer. Note! If you are using a WFS service,
			// it must be located at the same domain or reachable
			// through a proxy).
			// <><><><><><><><><><><><><><><><><><><><><><><><><><>
			{
				init: "L.GeoJSON.WFS",
				url: "http://kartor.malmo.se/geoserver/wfs",
				options: {
					params: {
						typeName: "skane:POI_VHAMN_PT" 			// Required WFS parameter
					},
					category: ["Vector layers"],				// Category
					displayName: "Western Harbour (cross domain)",	// Name visible to users
					layerId: "western_harbour",					// A required unique id
					xhrType: "POST",							// The request method (using jquery ajax)
					attribution: "Malmö stad",					// Copyright
					inputCrs: "EPSG:4326",						// The projection to request for. If not EPSG:4326 it will be projected on the fly.
					uniqueKey: "gid",							// Important! WFS layers must have a unique id (used for caching already fetched features)
					selectable: true,							// Selectable or not
					reverseAxis: false,							// If WFS service returns coordinates as [northing, easting] then set this to true
					reverseAxisBbox: true,						// If WFS service expects coordinates as [north, west, south, east] then set this to true
					geomType: "POINT",							// geometry type (used so far only by the Editor plugin)
					popup: 										// HTML template for popup. Extract properties by writing the column name inside brackets ${}
						'<h4>${namn} </h4>'+
						'<p>Some nonsense info</p>'
				}
			},

			// <><><><><><><><><><><><><><><><><><><><><><><><><><>
			// A WFS layer using local GeoJSON data.
			// <><><><><><><><><><><><><><><><><><><><><><><><><><>
			{
				init: "L.GeoJSON.WFS",
				url: document.URL.search(/dev.html?/) > 0 ? "examples/data/vastra_hamnen_malmo.geojson" : "../examples/data/vastra_hamnen_malmo.geojson",
				options: {
					displayName: "Western Harbour - local file",	// Name visible to users
					category: ["Vector layers"],				// Category
					layerId: "western_harbour_local",				// A required unique id
					attribution: "Malmö stad",					// Copyright
					inputCrs: "EPSG:4326",						// The projection to request for. If not EPSG:4326 it will be projected on the fly.
					uniqueKey: "gid",							// Important! WFS layers must have a unique id (used for caching already fetched features)
					selectable: true,							// Selectable or not
					reverseAxis: false,							// If WFS service returns coordinates as [northing, easting] then set this to true
					reverseAxisBbox: true,						// If WFS service expects coordinates as [north, west, south, east] then set this to true
					geomType: "POINT",							// geometry type (used so far only by the Editor plugin)
					popup: 										// HTML template for popup. Extract properties by writing the column name inside brackets ${}
						'<h4>${namn} </h4>'+
						'<p>Some nonsense info</p>'
				}
			}



		

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
							btnHide: true,							// Show a hide button at the top header
							catIconClass: "fa fa-chevron-right"		// Icon class for foldable headers
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
							info_format: "text/plain",	// The fallback info format to fetch from the WMS service. Overridden by layer's info_format in layer's selectOptions.
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

					// <><><><><><><><><><><><><><><><><><><><><><><><><><>
					// Search connects to a autocomplete and geolocate service and places a marker
					// at the geolocated location.
					// <><><><><><><><><><><><><><><><><><><><><><><><><><>
					{
						init: "L.Control.Search",
						options: {
							_lang: {
								// Watermark/placeholder for text entry. Language dependent.
								"en": {search: "Search address or place"},	// english
								"sv": {search: "Sök adress eller plats"}	// swedish
							},
							gui: true,					// If false, entry is not shown but the plugin can still take the POI URL parameter
							whitespace: "%20",			// How to encode whitespace.
							wsOrgProj: "EPSG:3008",		// The projection of the returned coordinates from the web service
							useProxy: false,			// If you want call the URL with a prepended proxy URL (defined in ws above)
							wsAcUrl: "//kartor.malmo.se/api/v1/addresses/autocomplete/", // Required. Autocomplete service.
							wsLocateUrl: "//kartor.malmo.se/api/v1/addresses/geolocate/", // Required. Geolocate service.
							acOptions: {				// typeahead options (Bootstrap's autocomplete library)
								items: 100				// Number of options to display on autocomplete
							}
						}
					},

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
							root: location.protocol + "//malmo.se/karta?" // location.protocol + "//kartor.malmo.se/init/?appid=stadsatlas-v1&" // Link to malmo.se instead of directly to map
						}
					},

					// <><><><><><><><><><><><><><><><><><><><><><><><><><>
					// RedirectClick opens a new browser tab when the user clicks on the map.
					// The easting ${x} and northing ${y} is sent along to the url. See example below.
					// <><><><><><><><><><><><><><><><><><><><><><><><><><>
					{
						init : "L.Control.RedirectClick", // Pictometry
						options: {
							position: "topright",		// Button's position
							url: "http://kartor.malmo.se/urbex/index.htm?p=true&xy=${x};${y}", 	// Malmö pictometry
							btnClass: "fa fa-plane",	// Button's icon class
							cursor: "crosshair"			// Cursor shown in map before click
						}
					},

					// <><><><><><><><><><><><><><><><><><><><><><><><><><>
					// Info simply creates a toggleable Bootstrap modal which you can fill with any info below.
					// <><><><><><><><><><><><><><><><><><><><><><><><><><>
					{
 						init: "L.Control.Info",
 						options: {
 							addToMenu: false,			// Create toggle button or not
 							position: "topright",		// Button's position (requires addToMenu == true)
							autoActivate: false,		// Open from start

							// Here follows the content of the modal – language dependent!
							_lang: {
								"en": {
									titleInfo: "<h4>A header</h4>",
									bodyContent:
										'<p>Some content</p>'
								},
								"sv": {
									titleInfo: "<h4>En rubrik</h4>",
									bodyContent:
										'<p>Lite innehåll</p>'
								}
							}
 						}
 				 	},

 				 	// <><><><><><><><><><><><><><><><><><><><><><><><><><>
 				 	// MeasureDraw is a combined measure and drawing tool. The created
 				 	// markers, lines or polygons can be shared with others 
 				 	// (geometries and attributes sent along as a URL parameter).
 				 	// <><><><><><><><><><><><><><><><><><><><><><><><><><>
 				 	{
						init: "L.Control.MeasureDraw",
						options: {
							position: "topright",		// Button's position
							saveMode: "url",			// So far url is the only option
							layerName: "measurelayer",	// The internal layerId for the draw layer

							stylePolygon: {				// Draw style for polygons
								color: '#0077e2',
								weight: 3
							},
							stylePolyline: {			// Draw style for polylines
								color: '#0077e2',
								weight: 9
							}
						}
					},

					// <><><><><><><><><><><><><><><><><><><><><><><><><><>
					// ToolHandler takes care of making all buttons inside the top-right div responsive.
					// When the screen width is smaller than the defined breakpoint, the buttons are contained 
					// within a Bootstrap popover which can be toggled by a single button.
					// <><><><><><><><><><><><><><><><><><><><><><><><><><>
					{
						init: "L.Control.ToolHandler",
						options: {
							showPopoverTitle: false 	// Show title (header) in the popover
						}
					}

					// <><><><><><><><><><><><><><><><><><><><><><><><><><>
					// Add2HomeScreen creates a popover on iOS devices supporting
					// "Add To Homescreen", which advices the user to add the website
					// to the homescreen, making it look almost like a native app.
					// <><><><><><><><><><><><><><><><><><><><><><><><><><>
					// {
					//	init: "L.Control.Add2HomeScreen",
					//	options: {}
					// }
		]
};









