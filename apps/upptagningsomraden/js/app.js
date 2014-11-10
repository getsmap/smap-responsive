

var app = {
		options: {
			proxy: null //http://localhost/cgi-bin/proxy.py?url="
		},

		init: function() {
			this._initAC();
			var self = this;
			this.defineProjs();

			$("form").on("submit", function(e) {
				return false;
			});
			$('button[type="submit"]').on("click", function(e) {
				self.showMap({
					latLng: self.latLng
				});
				return false;
			});

			this._appendTerms();

			$(".schoolform").find("input").on("change", function() {
				self.okToSubmit();
			});
		},

		_appendTerms: function() {
			// Append term options
			var now = new Date();
			var yearNow = now.getFullYear(),
				m = now.getMonth() + 1;

			// If month is earlier than June (6th month), then include "previous year's" term.
			// If later, then the option will be visible but disabled.
			var startYear = m < 6 ? yearNow - 1 : yearNow;
			var years = [startYear, startYear+1],
				y, tag;
			for (var i=0,len=years.length; i<len; i++) {
				y = years[i];
				tag = $('<label class="radio-inline">\
						<input type="radio" name="term" value="{yearText}"> {yearText}\
					</label>'.replace(/\{yearText\}/g, y+"/"+(y+1) ));
				if (y < yearNow) {
					tag.addClass("disabled").find("input").prop("disabled", true);
				}
				$(".termselect").append(tag);
			}
		},

		defineProjs: function() {
			if (window.proj4) {
				proj4 = window.proj4;
				proj4.defs([
					["EPSG:4326", "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"],
					["EPSG:3857", "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs"],
					["EPSG:3008", "+proj=tmerc +lat_0=0 +lon_0=13.5 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"],
					["EPSG:3006", "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"],
					["EPSG:3021", "+proj=tmerc +lat_0=0 +lon_0=15.8062845294444 +k=1.00000561024+x_0=1500064.274 +y_0=-667.711 +ellps=GRS80 +units=m"]
				]);
			}
		},

		loading: function(show) {
			// show = show || false;

			// if (show === true) {
			// 	$('button[type="submit"]').button("loading");
			// }
			// else {
			// 	$('button[type="submit"]').button("reset");
			// }
		},

		showMap: function(params) {
			params = params || {};

			// if (!this.okToSubmit()) {
			// 	return false;
			// }

			var latLngArr = [55.59852, 13.00232];

			if (this.map) {

			}
			else {
				this.map = L.map('mapdiv').setView(latLngArr, 11);
				var layer = new L.TileLayer.EsriRest("http://kartor.malmo.se/arcgis/rest/services/malmokarta_3857/MapServer", {
						minZoom: 10,
						maxZoom: 18,
						attribution: '© Malmö Stadsbyggnadskontor'
				});
				this.map.addLayer(layer);
			}
			if (this._marker) {
				this.map.removeLayer(this._marker);
			}
			if (params.latLng) {
				this.map.setView(params.latLng || latLngArr, params.zoom || 11);
				this._marker = L.marker(params.latLng).addTo(this.map);
			}

			$("#mapdiv").removeClass("hidden");
			this.map.invalidateSize();
		},

		hideMap: function() {
			$("#mapdiv").addClass("hidden");
		},

		_geoLocate: function(address) {
			this.loading(true);
			var url = "http://kartor.malmo.se/WS/search-1.0/sokexakt_v.ashx?q="+encodeURIComponent(address);
			$.ajax({
				url: this.options.proxy ? this.options.proxy + encodeURIComponent(url) : url,
				type: "GET",
				dataType: "json",
				context: this,
				success: function(json) {
					if (json && json.features && json.features.length) {
						
						var f = json.features[0];
						var coords = json.features[0].geometry.coordinates;
						var latLng = L.latLng( coords[1], coords[0] );

						// Project coords to web mercator
						var projArr = window.proj4("EPSG:3008", "EPSG:4326", [latLng.lng, latLng.lat]);
						this.latLng = L.latLng(projArr[1], projArr[0]);
					}
				},
				complete: function() {
					this.loading(false);
				},
			});
		},

		okToSubmit: function() {
			if ( $("input:checked").length === 2 && this.latLng) {
				$('button[type="submit"]').removeClass("disabled");
				return true;
			}
			else {
				$('button[type="submit"]').addClass("disabled");
				return false;
			}
		},

		_initAC: function(options) {
			options = options || {};

			var self = this;

			var defaultOptions = {
					url: "http://kartor.malmo.se/WS/search-1.0/autocomplete_v.ashx?q={q}"
			};
			options = $.extend(defaultOptions, options);

			$(".typeahead").on("keypress", function() {  // keydown will capture delete press also
				self._addressFound = false;
				self.okToSubmit();
			});

			var geoLocate = this._geoLocate;
			var typeheadOptions = {
					items: 5,
					minLength: 2,
					highlight: true,
					hint: true,
					source: function(q, process) {
						q = encodeURIComponent(q);
						if (self._ajax) {
							self._ajax.abort();
						}
						var url = options.url.replace("{q}", q);
						self._ajax = $.ajax({
							type: "GET",
							url: self.options.proxy ? self.options.proxy + encodeURIComponent(url) : url,
							dataType: "text",
							success: function(resp) {
								var arr = resp.split("\n");
								process(arr);
							},
							error: function() {}
						});
					},
					updater: function(val) {
						self._addressFound = true;
						self.okToSubmit();
						geoLocate.call(self, val);
						return val;
					}
		//		   displayKey: 'value',
		//		   source: bHound.ttAdapter(),
			};

			$('.typeahead').typeahead(typeheadOptions);

		}
};



$(document).ready(function() {
	app.init();
});
