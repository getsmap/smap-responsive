

var app = {
		options: {
			proxy: null //"http://localhost/cgi-bin/proxy.py?url="
		},

		init: function() {
			this._initAC();
			var self = this;
			this.defineProjs();

			$("form").on("submit", function(e) {
				var arr = $(this).serializeArray();
				var formData = {}, t;
				for (var i=0,len=arr.length; i<len; i++) {
					t = arr[i];
					formData[t.name] = t.value;
				}
				self._calcResult(formData).done(function(schoolName) {
					// e.text;
					var visibleBatch = "årskurs "+formData.batch;
					if (formData.batch === "0") {
						visibleBatch = "förskoleklass";
					}
					$("#result").html("Elev som är folkbokförd på <strong>"+formData.q+"</strong> har <strong>"+schoolName+"</strong> som hemskola i <strong>"+visibleBatch+"</strong>.");
					// TODO: Call script to fetch result. On fetch done – show a button
					// which toggles the map
				});
				self._addBtnToggleMap();
				self._formData = formData;
				return false;
			});

			this._appendTerms();
			var geoLocate = this._geoLocate;
			$(".schoolform").find(".addresssearch input").on("change", function() {
				self.latLng = null;
				geoLocate.call(self, $.trim($(this).val()) ).done(function(e) {
					self.okToSubmit();
				});
			});

			$(".schoolform").find('input[type="radio"]').on("change", function() {
				self.okToSubmit();
			});
		},

		_projectCoords: function(latLng) {
			
			// Project coords to web mercator
			if (window.proj4) {
				var projArr = window.proj4("EPSG:3008", "EPSG:4326", [latLng.lng, latLng.lat]);
				this.latLng = L.latLng(projArr[1], projArr[0]);
			}
		},

		_calcResult: function(formData) {
			var self = this;
			var def = $.Deferred();
			var proxy = this.options.proxy;

			var onError = function(obj, text, c) {
				// def.reject(text);
				alert(text);
			}

			// Get address's lat/lng
			var url = "http://kartor.malmo.se/WS/search-1.0/sokexakt_v.ashx?q="+encodeURIComponent(formData.q);
			$.ajax({
				url: proxy ? proxy + encodeURIComponent(url).replace(/%20/g, "%2B") : url,
				type: "GET",
				// data: {
				// 	q: formData.q
				// },
				error: onError,
				dataType: "json"
			}).done(function(resp) {
				// Result from "get coordinates script"
				if ( !(resp && resp.features && resp.features.length && resp.features[0].geometry) ) {
					return;
				}
				var coords = resp.features[0].geometry.coordinates;
				for (var i=0,len=coords.length; i<len; i++) {
					coords[i] = parseInt(Math.round(coords[i]));
				}

				var url = "http://kartor.malmo.se/api/v1/schoolname/?e="+coords[0]+"&n="+coords[1]+"&arsk="+formData.batch+"&lasar="+formData.term;
				$.ajax({
					url: proxy ? proxy + encodeURIComponent(url).replace(/%20/g, "%2B") : url,
					dataType: "json",
					type: "GET",
					error: onError
					// data: {
					// 	e: coords[0],
					// 	n: coords[1],
					// 	arsk: formData.batch
					// }
				}).done(function(resp) {
					// Result from "get school script"
					def.resolve(resp.schoolname[0].schoolname);
					// TODO: Might need to get and store coordinates here also so we can select the school when the map is showing
				});
			});

			// TODO: Ask this script: http://kartor.malmo.se/api/v1/schoolname/?e=118663&n=06165708&arsk=1
			// to get schoolname

			return def.promise();
		},

		_appendTerms: function() {
			// Append term options
			var now = new Date();
			var yearNow = now.getFullYear(),
				m = now.getMonth() + 1;

			if (yearNow < 2014) {
				alert("Din dators datuminställningar är fel. Tjänsten kan inte användas.");
			}

			// If month is earlier than June (6th month), then include "previous year's" 
			// term and the term starting after summer.
			// If later than June, then the option will be visible but disabled.
			var startYear = m < 6 ? yearNow - 1 : yearNow;
			var years = [startYear, startYear+1],
				y, tag;
			for (var i=0,len=years.length; i<len; i++) {
				y = years[i];
				tag = $('<label class="radio-inline">\
						<input type="radio" name="term" value="{yearValue}"> {yearText}\
					</label>'.replace(/\{yearText\}/g, y+"/"+(y+1) ).replace(/\{yearValue\}/g, y.toString().replace("20","")+(y+1).toString().replace("20","") ));
				if (y < yearNow && m >= 6) {
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

		_addBtnToggleMap: function() {
			var self = this;

			var btn = $("#btn-togglemap");
			if (!btn.length) {
				btn = $('<button id="btn-togglemap" class="btn btn-default btn-togglemap">Visa karta</button>');
				$(".controls").after(btn);
				btn.on("click", function() {
					var $this = $(this);
					if ( $this.hasClass("active")) {
						$this.text("Visa karta");
						self.hideMap();
						$this.removeClass("active");

					}
					else {
						$this.text("Göm karta");
						self.showMap({
							latLng: self.latLng
						});
						$this.addClass("active");
					}
					return false;
				});
			}

		},

		showMap: function(params) {
			params = params || {};

			// if (!this.okToSubmit()) {
			// 	return false;
			// }

			var latLngArr = [55.59852, 13.00232];

			// var map = L.map('map-iframe').setView(latLngArr, 11);
			// this.map = map;
			// var bg = new L.TileLayer.EsriRest("http://kartor.malmo.se/arcgis/rest/services/malmokarta_3857/MapServer", {
			// 		minZoom: 10,
			// 		maxZoom: 18,
			// 		attribution: '© Malmö Stadsbyggnadskontor'
			// });
			// var batch = this._formData.batch;
			// var schools = L.tileLayer.wms("http://kartor.malmo.se/geoserver/wms", {
			// 		layers: 'malmows:UTBILDNING_SKOLA_ARSK_{batch}_PT'.replace(/\{batch\}/g, batch),
			// 		format: 'image/png',
			// 		transparent: true,
			// 		zIndex: 350,
			// 		attribution: "Malmö stad"
			// });
			// var upptagningsArea = L.tileLayer.wms("http://kartor.malmo.se/geoserver/wms", {
			// 		layers: 'malmows:UTBILDNING_GRUNDSKOLA_UPPTAGNINGSOMR_ARSK_{batch}_P'.replace(/\{batch\}/g, batch),
			// 		format: 'image/png',
			// 		transparent: true,
			// 		zIndex: 250,
			// 		attribution: "Malmö stad"
			// });
			// map.addLayer(bg);
			// map.addLayer(schools);
			// map.addLayer(upptagningsArea);


			// if (this._marker) {
			// 	map.removeLayer(this._marker);
			// }
			// if (params.latLng) {
			// 	map.setView(params.latLng || latLngArr, params.zoom || 14);
			// 	this._marker = L.marker(params.latLng).addTo(map);
			// }
			
			var batch = this._formData.batch;
			var term = this._formData.term;
			var poi = encodeURIComponent(this._formData.q); //.replace(/%20/g, "%2B");
			var ols = [batch+"_"+term, "AREA_"+batch+"_"+term].join(","); //UTBILDNING_UPPTAGNINGSOMR_ARSK_0_1516_P UTBILDNING_SKOLA_ARSK_2_1415_PT
			var src = "http://kartor.malmo.se/init/?appid=skolupptag-v1&ol="+ols+"&poi="+poi; //"http://kartor.malmo.se/rest/leaf/1.0-dev/?config=http://kartor.malmo.se/test/upptagning/js/config_skolupptag.js&ol="+ols+"&poi="+poi;
			// window.open(src);
			$("#map-iframe").attr("src", src);
			$("#map-iframe").removeClass("hidden");
		},

		hideMap: function() {
			$("#map-iframe").addClass("hidden");
		},

		_geoLocate: function(address) {
			this.loading(true);
			var url = "http://kartor.malmo.se/WS/search-1.0/sokexakt_v.ashx?q="+encodeURIComponent(address);
			return $.ajax({
				url: this.options.proxy ? this.options.proxy + encodeURIComponent(url) : url,
				type: "GET",
				dataType: "json",
				context: this,
				success: function(resp) {
					if (resp && resp.features && resp.features.length) {
						var f = resp.features[0];
						var coords = resp.features[0].geometry.coordinates;
						var latLng = L.latLng( coords[1], coords[0] );

						// Project coords to web mercator
						if (window.proj4) {
							var projArr = window.proj4("EPSG:3008", "EPSG:4326", [latLng.lng, latLng.lat]);
							this.latLng = L.latLng(projArr[1], projArr[0]);
						}
					}
				},
				// error: function(a, text, c) {
				// 	console.log("Error response from geolocate script: "+text);
				// },
				complete: function() {
					this.loading(false);
				}
			});
		},

		okToSubmit: function() {
			if ( $("input:checked").length === 2 && this.latLng) {
				$('button[type="submit"]').removeClass("disabled").click();
				if ( $("#btn-togglemap").text() === "Göm karta") {
					$("#btn-togglemap").click();
				}
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
					url: "http://kartor.malmo.se/WS/search-1.0/autocomplete_adr.ashx?q={q}"
			};
			options = $.extend(defaultOptions, options);

			$(".typeahead").on("keypress", function() {  // keydown will capture delete press also
				self._addressFound = false;
				self.okToSubmit();
			});

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
							}
							// ,
							// error: function() {
							// 	console.log("Error response from autocomplete script");
							// }
						});
					},
					updater: function(val) {
						self._addressFound = true;
						self.okToSubmit();
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
