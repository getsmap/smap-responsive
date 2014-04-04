L.Control.SharePosition = L.Control.extend({
	options: {
		position: 'bottomright', // just an example
		autoActivate: false,
		wfsSource: "http://xyz.malmo.se:8081/geoserver/wfs",
		wfsFeatureType: "sandbox:sharedpositions",
		wfsUri: "http://www.malmo.se/sandbox/",
		useProxy: true,
		maxAge: 5
	},
	
	_refreshIntervalMs: 15000,
	
	_lang: {
		"sv": {
			dTitle: "Dela position",
			dShare: "Dela!",
			yourName: "Ditt namn",
			stopSharing: "Sluta dela",
			btnCancel: "Avbryt"
		},
		"en": {
			dTitle: "Share position",
			dShare: "Share!",
			yourName: "Your name",
			stopSharing: "Stop sharing",
			btnCancel: "Cancel"
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
	
	deactivate: function() {
		clearInterval( self._refreshInterval );
		
		$("#sharepos-gui button").text(this.lang.dShare).removeClass("btn-danger")
		this.dialog.find("input").val(null);
		$("#sharepos-gui").hide();
		this.map.removeLayer(this.layer);
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
		var $btnShare =	$('<button class="btn btn-default btn-lg" type="button">'+this.lang.dShare+'</button>');
		$gui.append($btnShare);
		$(".leaflet-control-Geolocate").prepend( $gui );
		$gui.hide();
		
		var bodyContent =
				'<div class="form-group">'+
					'<label>'+this.lang.yourName+'</label>'+
					'<input type="text" class="form-control" placeholder="'+this.lang.yourName+'"></input>'+
				'</div>';
		
		var footerContent =
			$(
				'<button type="button" class="btn btn-default" data-dismiss="modal">'+this.lang.btnCancel+'</button>'+
				'<button type="button" class="btn btn-primary">'+this.lang.dShare+'</button>'
			);
		this.dialog = utils.drawDialog(this.lang.dTitle, bodyContent, footerContent);
	},
	
	_makeFilter: function() {
		var maxAge = this.options.maxAge; // minutes
		
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
			init: "L.GeoJSON.WFS",
			url: this.options.wfsSource,
			options: {
				noBindZoom: true,
				noBindDrag: true,
				layerId: "shareposition",
				displayName: "Shared locations",
				featureType: this.options.wfsFeatureType,
				attribution: "Malmö stads WFS",
				inputCrs: "EPSG:4326",
				reverseAxis: true,
				selectable: true,
				popup: '<span><strong>${text_username}</strong>&nbsp;&nbsp;(<span style="white-space:nowrap;">${function(p) {var d = new Date(p.datetime_changed);var dNow = new Date(); var dDiff = new Date( Math.abs(dNow.getTime() - d.getTime()) ); return dDiff.getMinutes(); }}</span> min ago)</span>',
				uniqueAttr: null, //"id",
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
						direction: "right"
					}).showLabel();
					
				}
			});
			smap.cmd.loading(false);
		});
		this.map.addLayer(this.layer);
		var self = this;
		
	},
	
	_bindEvents: function() {
		var self = this;
		smap.event.on("smap.core.pluginsadded", function() {
			$("#smap-glocate-btn").on("click", function() {
				if ( $(this).hasClass("btn-primary") ) {
					// Show the GUI
					$("#sharepos-gui").show();
					self._addLayer();
					self._refreshInterval = setInterval($.proxy(self._refresh, self), self._refreshIntervalMs);
				}
				else {
					self.deactivate();
				}
				return false;
			});
		});
		
		this.dialog.find("input").on("click", function() {
			$(this).focus();
		});
		
		this.dialog.find(".modal-footer .btn-primary").on("click", function() {
			$("#sharepos-gui button").addClass("btn-danger").text(self.lang.stopSharing);
			self.dialog.modal("hide");
			
			var uName = $.trim( self.dialog.find("input[type='text']").val() );
			self._startShare(uName);
		});
		
//		this.dialog.find(".modal-footer .btn-default").on("click", function() {
//			$("#sharepos-gui button").addClass("btn-danger").text(self.lang.stopSharing);
//		});
		
		$("#sharepos-gui button").on("click", function() {
			var isActive = $(this).hasClass("btn-danger");
			if ( !isActive ) {
				self.dialog.modal("show");
			}
			else {
				$(this).removeClass("btn-danger");
				self._stopShare();
				$(this).text(self.lang.dShare); // Restore label 
			}
		});
	},
	
	_onLocationFound: function(e) {
//		smap.cmd.loading(false);
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
		
//		smap.cmd.loading(true);
		this.map.on("locationfound", $.proxy(this._onLocationFound, this));
		this.map.on("locationerror", $.proxy(this._onLocationError, this));
		
		this.uid = localStorage.share_uid || null;
		
		this._storeInterval = setInterval($.proxy(this._store, this), 5000);
		this._setLocateSettings();
		this.map.fire("drag");
		
	},
	
	_stopShare: function() {
		smap.cmd.loading(false);
		
		clearInterval(this._storeInterval);
		this._storeInterval = null;
		
		this.map.off("locationfound", this._onLocationFound, this);
		this.map.off("locationerror", this._onLocationError, this);
		
		this._location = null;
		this.uid = null;
		this.uName = null;
	},
	
	uid: null,
	
	_store: function() {
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
				if (!this.uid && obj && obj.TransactionSummary && parseInt(obj.TransactionSummary.totalInserted) > 0) {
					this.uid = parseInt(obj.InsertResults.Feature.FeatureId.fid.split(".")[1]);
					localStorage.share_uid = this.uid;
				}
			},
			complete: function() {
				this._working = false;
			}
		});
	},
	
	_refresh: function() {
		// Before refresh - update the age filter
		this.layer.params.filter = this._makeFilter();
		this.layer._refresh(true);
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
			  + '	 <wfs:Property><wfs:Name>text_username</wfs:Name><wfs:Value>' + uName + '</wfs:Value></wfs:Property>'
			  + '	 <wfs:Property><wfs:Name>int_accuracy</wfs:Name><wfs:Value>' + accuracy + '</wfs:Value></wfs:Property>'
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