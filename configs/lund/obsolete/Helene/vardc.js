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