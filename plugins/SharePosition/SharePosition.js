L.Control.SharePosition = L.Control.extend({
	options: {
		position: 'bottomright', // just an example
		autoActivate: false,
		wfsSource: "http://localhost:8080/geoserver/wfs",
		wfsFeatureType: "local:sharedpositions"
	},
	
	_lang: {
		"sv": {
			exampleLabel: "Ett exempel"
		},
		"en": {
			exampleLabel: "An example"
		}
	},
	
	_setLang: function(langCode) {
		langCode = langCode || smap.config.langCode || navigator.language.split("-")[0] || "en";
		if (this._lang) {
			this.lang = this._lang ? this._lang[langCode] : null;			
		}
	},

	initialize: function(options) {
		L.setOptions(this, options);
		this._setLang(options.langCode);
	},

	onAdd: function(map) {
		this.map = map;
		
		this._container = L.DomUtil.create('div', 'leaflet-control-shareposition'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		
		this.$container = $(this._container);
		
		this._drawGui();
		this._bindEvents();
		
		return this._container;
	},

	onRemove: function(map) {
		// Do everything "opposite" of onAdd – e.g. unbind events and destroy things
		// map.off('layeradd', this._onLayerAdd).off('layerremove', this._onLayerRemove);
		
		map.stopLocate();
	},
	
	_drawGui: function() {
		var $gui = $('<div id="sharepos-gui" />');
		var $inpGroup =	
			$('<div class="input-group input-group-lg">'+
				'<input type="text" class="form-control" placeholder="Your name"></input>'+
				'<span class="input-group-btn">'+
					'<button class="btn btn-default" type="button">Share!</button>'+
				'</span>'+
			'</div>');
		$gui.append($inpGroup);
		$(".leaflet-control-Geolocate").prepend( $gui );
		$gui.hide();
	},
	
	_addLayer: function() {
		var self = this;
		this.layer = smap.core.layerInst._createLayer({
			init: "L.GeoJSON.WFS2",
			url: this.options.wfsSource,
			options: {
				layerId: "shareposition",
				displayName: "Shared locations",
				featureType: this.options.wfsFeatureType,
				attribution: "Malmö stads WFS",
				inputCrs: "EPSG:4326",
				reverseAxis: true,
				selectable: true,
				popup: '<p class="lead">${text_text}</p>'+
					'<p>Skrivet den: <strong>${function(p) {var d = new Date(p.dtime_updated);return d.toLocaleString();}}</strong></p>',
				uniqueAttr: null,
				hoverColor: '#FF0'
//				style: {
//					weight: 6,
//					color: '#F00',
//					dashArray: '',
//					fillOpacity: 0.5
//				},
				
			}
		});
		this.layer.on("load", function() {
//			var nbr = 0;
			self.layer.eachLayer(function(marker) {
				// Replace default marker with a fancy "userMarker".
				var newMarker = L.userMarker(marker.getLatLng(), {pulsing: true});
				self.layer.removeLayer(marker);
				var uid = parseInt(marker.feature.id.split(".")[1]);
				if (!self.uid || (self.uid && self.uid !== uid)) {
					self.layer.addLayer(newMarker);					
				}
//				nbr += 1;
			});
//			console.log(nbr);
		});
		this.map.addLayer(this.layer);
		var self = this;
		
	},
	
	_bindEvents: function() {
		smap.event.on("smap.core.pluginsadded", function() {
			$("#smap-glocate-btn").on("click", function() {
				if ( $(this).hasClass("btn-primary") ) {
					// Show the GUI
					$("#sharepos-gui").show();
				}
				else {
					$("#sharepos-gui").hide();
				}
				return false;
			});
		});
		
		$("#sharepos-gui input").on("click", function() {
			$(this).select();
		});
		
		var self = this;
		$("#sharepos-gui button").on("click", function() {
			$(this).toggleClass("btn-success");
			if ($(this).hasClass("btn-success")) {
				
				var uName = $.trim( $("#sharepos-gui input").val() );
				self._startShare(uName);
				$(this).tooltip({
					placement: "top",
					title: "Click to stop sharing"
				});
				$(this).text("Sharing...");
				$("#sharepos-gui input").prop("readonly", true);
				
				self._addLayer();
			}
			else {
				self._stopShare();
				$(this).tooltip("destroy");
				$(this).text("Share!");
				$("#sharepos-gui input").prop("readonly", false);
				
				self.map.removeLayer(self.layer);
			}
		});
	},
	
	_onLocationFound: function(e) {
		smap.cmd.loading(false);
		this._location = e;
	},
	
	_onLocationError: function(e) {
		smap.cmd.loading(false);
		console.log("Geolocate error: +"+e.message);
//		this._setLocateSettings();
	},
	
	_setLocateSettings: function() {
		var options = {
				watch: true,
				timeout: 30000,
				enableHighAccuracy: true,
				frequency: 3000
		};
		$.extend(this.map._locateOptions, options);
		
	},
	
	_startShare: function(uName) {
		this.uName = uName;
		
		smap.cmd.loading(true);
		this.map.on("locationfound", $.proxy(this._onLocationFound, this));
		this.map.on("locationerror", $.proxy(this._onLocationError, this));
		
		this._storeAndFetchInterval = setInterval($.proxy(this._storeAndFetch, this), 5000);
		this._setLocateSettings();
	},
	
	_stopShare: function() {
		smap.cmd.loading(false);
		
		clearInterval(this._storeAndFetchInterval);
		
		this.map.off("locationfound", this._onLocationFound, this);
		this.map.off("locationerror", this._onLocationError, this);
		
		this._location = null;
		this.uName = null;
	},
	
	uid: null,
	
	_storeAndFetch: function() {
		if (this._working || !this._location) {
			return false;
		}
		this._working = true;
		$.ajax({
			url: smap.config.ws.proxy + encodeURIComponent( this.options.wfsSource ),
			type: "POST",
			context: this,
			data: this._getXml(this._location.latlng, this._location.accuracy, this.uName, this.uid),
			contentType: "text/xml",
			dataType: "text",
			success: function(resp) {
				var obj = $.xml2json(resp);
				if (obj && obj.TransactionSummary && parseInt(obj.TransactionSummary.totalInserted) > 0) {
					this.uid = parseInt(obj.InsertResults.Feature.FeatureId.fid.split(".")[1]);
				}
				this.layer._refresh(true);
			},
			complete: function() {
				this._working = false;
			}
		});
		
	},
	
	_getXml: function(latLng, accuracy, uName, oldId) {
		var xml = "";
		if (oldId) {
//			deleteXml = '<wfs:Delete typeName="grp:sharedpositions">\n'
//			  + '    <ogc:Filter>\n'
//			  + '      <PropertyIsEqualTo>\n'
//			  + '        <PropertyName>id</PropertyName>\n'
//			  + '        <Literal>'+oldId+'</Literal>\n'
//			  + '      </PropertyIsEqualTo>\n'
//			  + '    </ogc:Filter>\n'
//			  + '  </wfs:Delete>\n';
			
			xml = '<wfs:Transaction\n'
			  + '  service="WFS"\n'
			  + '  version="1.1.0"\n'
			  + '  xmlns:grp="http://localhost/"\n'
			  + '  xmlns:wfs="http://www.opengis.net/wfs"\n'
			  + '  xmlns:ogc="http://www.opengis.net/ogc"\n'
			  + '  xmlns:gml="http://www.opengis.net/gml"\n'
			  + '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n'
			  + '  xsi:schemaLocation="http://www.opengis.net/wfs\n'
			  + '                      http://schemas.opengis.net/wfs/1.1.0/WFS-transaction.xsd">\n'
			  + '  <wfs:Update typeName="grp:sharedpositions">\n'
			  + '    <grp:text_username>' + uName + '</grp:text_username>\n'
			  + '    <grp:int_accuracy>' + accuracy + '</grp:int_accuracy>\n'
//			  + '    <grp:dtime_updated></grp:dtime_updated>\n'
			  + '    <wfs:Property>\n'
			  + '      <wfs:Name>the_geom</wfs:Name>\n'
			  + '      <wfs:Value>\n'
			  + '        <gml:Point srsDimension="2" srsName="urn:x-ogc:def:crs:EPSG:4326">\n'
			  + '          <gml:coordinates decimal="." cs="," ts=" ">' + latLng.lat + ',' + latLng.lng + '</gml:coordinates>\n'
			  + '        </gml:Point>\n'
			  + '      </wfs:Value>\n'
			  + '    </wfs:Property>\n'
			  + '    <ogc:Filter>\n'
			  + '      <PropertyIsEqualTo>\n'
			  + '        <PropertyName>id</PropertyName>\n'
			  + '        <Literal>' + oldId + '</Literal>\n'
			  + '      </PropertyIsEqualTo>\n'
			  + '    </ogc:Filter>\n'
			  + '  </wfs:Update>\n'
			  + '</wfs:Transaction>';
		}
		else {
			xml = '<wfs:Transaction\n'
				+ '  service="WFS"\n'
				+ '  version="1.1.0"\n'
				+ '  xmlns:grp="http://localhost/"\n'
				+ '  xmlns:wfs="http://www.opengis.net/wfs"\n'
				+ '  xmlns:gml="http://www.opengis.net/gml"\n'
				+ '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n'
				+ '  xsi:schemaLocation="http://www.opengis.net/wfs\n'
				+ '                      http://schemas.opengis.net/wfs/1.1.0/WFS-transaction.xsd\n'
				+ '                      '+this.options.wfsSource+'/DescribeFeatureType?typename='+this.options.wfsFeatureType+'">\n'
				+ '  <wfs:Insert>\n'
				+ '    <grp:sharedpositions>\n'
				+ '      <grp:the_geom>\n'
				+ '        <gml:Point srsDimension="2" srsName="urn:x-ogc:def:crs:EPSG:4326">\n'
				+ '          <gml:coordinates decimal="." cs="," ts=" ">' + latLng.lat + ',' + latLng.lng + '</gml:coordinates>\n'
				+ '        </gml:Point>\n'
				+ '      </grp:the_geom>\n'
				+ '      <grp:int_accuracy>' + accuracy + '</grp:int_accuracy>\n'
				+ '      <grp:text_username>' + uName + '</grp:text_username>\n'
//				+ '      <grp:dtime_updated>null</grp:dtime_updated>\n'
				+ '    </grp:sharedpositions>\n'
				+ '  </wfs:Insert>\n'
				+ '  </wfs:Transaction>';
		}
		return xml;
	}
	
	
	
	
	
});


// Do something when the map initializes
//L.Map.addInitHook(function () {
//	if (this.options.attributionControl) {
//		this.attributionControl = (new L.Control.SharePosition()).addTo(this);
//	}
//});


/*
 * This code just makes removes the need for
 * using "new" when instantiating the class. It
 * is a Leaflet convention and should be there.
 */
L.control.sharePosition = function (options) {
	return new L.Control.SharePosition(options);
};