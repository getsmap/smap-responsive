L.Control.SharePosition = L.Control.extend({
	options: {
		position: 'bottomright', // just an example
		autoActivate: false,
		wfsSource: "http://xyz.malmo.se:8081/geoserver/wfs",
		wfsFeatureType: "sandbox:sharedpositions",
		wfsUri: "http://www.malmo.se/sandbox/",
		useProxy: true
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
	
	_makeFilter: function() {
		var maxAge = 5; // minutes
		
		var dNow = new Date();
		var now = dNow.getTime();
		var old = now - maxAge * 60 * 1000; // age in ms
		var dOld = new Date(old);
		
		var filter = new OpenLayers.Filter.Comparison({
				type: OpenLayers.Filter.Comparison.BETWEEN,
				property: "datetime_changed",
				lowerBoundary: dOld,
				upperBoundary: dNow
		});
		var filterFormat = new OpenLayers.Format.Filter({version: "1.1.0"}),
        	xml = new OpenLayers.Format.XML();
		var filterString = xml.write(filterFormat.write( filter ));
		return filterString;
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
				popup: '<p><strong>${text_username}</strong> was here at <span style="white-space:nowrap;">${function(p) {var d = new Date(p.datetime_changed);return d.toLocaleString();}}</span></p>',
				uniqueAttr: "id",
				hoverColor: '#FF0'
//				style: {
//					weight: 6,
//					color: '#F00',
//					dashArray: '',
//					fillOpacity: 0.5
//				},
				
			}
		});
		this.layer.params.filter = this._makeFilter();
		
		this.layer.off("load");
		this.layer.on("load", function() {
			self.layer.eachLayer(function(marker) {
				// Replace default marker with a fancy "userMarker".
				var newMarker = L.userMarker(marker.getLatLng(), {pulsing: true, smallIcon:true});
				self.layer.removeLayer(marker);
				if (marker.feature) {
					var uid = parseInt(marker.feature.id.split(".")[1]);
					if (!self.uid || (self.uid && self.uid !== uid)) {
						self.layer.addLayer(newMarker);
					}
					var html = utils.extractToHtml(self.layer.options.popup, marker.feature.properties);
					newMarker.bindLabel(html, {
						noHide: true,
						direction: "auto"
					}).showLabel();
				}
			});
			smap.cmd.loading(false);
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
		console.log("Storing position");
		$.ajax({
			url: this.options.useProxy ? smap.config.ws.proxy + encodeURIComponent( this.options.wfsSource ) : this.options.wfsSource,
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
		var dbName = this.options.wfsFeatureType.split(":")[1];
		if (oldId) {
//			deleteXml = '<wfs:Delete typeName="grp:'+dbName+'">\n'
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
			  + '  xmlns:grp="'+this.options.wfsUri+'"\n'
			  + '  xmlns:wfs="http://www.opengis.net/wfs"\n'
			  + '  xmlns:ogc="http://www.opengis.net/ogc"\n'
			  + '  xmlns:gml="http://www.opengis.net/gml"\n'
			  + '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n'
			  + '  xsi:schemaLocation="http://www.opengis.net/wfs\n'
			  + '                      http://schemas.opengis.net/wfs/1.1.0/WFS-transaction.xsd">\n'
			  + '  <wfs:Update typeName="grp:'+dbName+'">\n'
			  + '    <grp:text_username>' + uName + '</grp:text_username>\n'
			  + '    <grp:int_accuracy>' + accuracy + '</grp:int_accuracy>\n'
//			  + '    <grp:datetime_changed></grp:datetime_changed>\n'
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
				+ '  xmlns:grp="'+this.options.wfsUri+'"\n'
				+ '  xmlns:wfs="http://www.opengis.net/wfs"\n'
				+ '  xmlns:gml="http://www.opengis.net/gml"\n'
				+ '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n'
				+ '  xsi:schemaLocation="http://www.opengis.net/wfs\n'
				+ '                      http://schemas.opengis.net/wfs/1.1.0/WFS-transaction.xsd\n'
				+ '                      '+this.options.wfsSource+'/DescribeFeatureType?typename='+this.options.wfsFeatureType+'">\n'
				+ '  <wfs:Insert>\n'
				+ '    <grp:'+dbName+'>\n'
				+ '      <grp:the_geom>\n'
				+ '        <gml:Point srsDimension="2" srsName="urn:x-ogc:def:crs:EPSG:4326">\n'
				+ '          <gml:coordinates decimal="." cs="," ts=" ">' + latLng.lat + ',' + latLng.lng + '</gml:coordinates>\n'
				+ '        </gml:Point>\n'
				+ '      </grp:the_geom>\n'
				+ '      <grp:int_accuracy>' + accuracy + '</grp:int_accuracy>\n'
//				+ '  	 <grp:datetime_changed></grp:datetime_changed>\n'
				+ '      <grp:text_username>' + uName + '</grp:text_username>\n'
				+ '    </grp:'+dbName+'>\n'
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