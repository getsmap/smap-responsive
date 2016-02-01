smap.core.mainConfig = {
		
		mapConfig: {
			layers: [],
			crs: L.CRS.EPSG3857,
			attributionControl: true,
			zoomControl: false,
			// maxBounds: null,  // [[north, west], [south, east]]
			maxZoom: 18,
			disabledRightClick: true
		},
		
		smapOptions: {
			title: "sMap-responsive",
			favIcon: "https://assets-cdn.github.com/favicon.ico", //"//assets.malmo.se/external/v4/favicon.ico"
			popupAutoPanPadding: [0, 70],  // left(right, top/bottom
			defaultLanguage: "sv",
			externalJsonOptions: {}
		},

		toolbarPlugin: "Menu",
		defaultTheme: "smap",

		configDirs: ["configs/", "dist/configs/", "/rest/leaf/configs-1.0/"]  // Paths where smap will try to find the config file (if no dir is specified)
};