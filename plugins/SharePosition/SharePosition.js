L.Control.SharePosition = L.Control.extend({
	options: {
		position: 'bottomright', // just an example
		autoActivate: false,
		wfsSource: "http://localhost:8080/geoserver/wfs",
		wfsFeatureType: "local:shared_positions"
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
		this.layer = smap.core.layerInst._createLayer({
			init: "L.GeoJSON.WFS2",
			url: this.options.wfsSource,
			options: {
				layerId: "sharetweet-wfstlayer",
				displayName: "Tweets",
				featureType: this.options.wfsFeatureType,
				attribution: "Malmö stads WFS",
				inputCrs: "EPSG:4326",
				reverseAxis: true,
				selectable: true,
				popup: '<p class="lead">${text_text}</p>'+
					'<p>Skrivet den: <strong>${function(p) {var d = new Date(p.dtime_created);return d.toLocaleString();}}</strong></p>',
				uniqueAttr: null,
				hoverColor: '#FF0',
				style: {
					weight: 6,
					color: '#F00',
					dashArray: '',
					fillOpacity: 0.5
				}
			}
		});
		this.map.addLayer(this.layer);
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
				
				this._addLayer();
			}
			else {
				$(this).tooltip("destroy");
				$(this).text("Share!");
				$("#sharepos-gui input").prop("readonly", false);
				
				this.map.removeLayer(this.layer);
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
	},
	
	_startShare: function(uName) {
		this.uName = uName;
		
		smap.cmd.loading(true);
		this.map.on("locationfound", $.proxy(this._onLocationFound, this));
		this.map.on("locationerror", $.proxy(this._onLocationError, this));
		
		this.storeAndFetchInterval = setInterval($.proxy(this._storeAndFetch, this), 5000);
	},
	
	_stopShare: function() {
		smap.cmd.loading(false);
		
		clearInterval(this.storeAndFetchInterval);
		
		this.map.off("locationfound", this._onLocationFound, this);
		this.map.off("locationerror", this._onLocationError, this);
		
		this._location = null;
		this.uName = null;
	},
	
	_storeAndFetch: function() {
		$.ajax({
			url: smap.config.ws.proxy + encodeURIComponent( this.options.wfsSource ),
			type: "POST",
			context: this,
			data: this._getXml(),
			contentType: "text/xml",
			dataType: "text",
			success: function(resp) {
				var obj = $.xml2json(resp);
				if (parseInt(obj.TransactionSummary.totalInserted) > 0) {
					
				}
				this.layer._refresh(true);
			}
		});
		
	},
	
	_getXml: function(oldId) {
		var deleteXml = "";
		if (oldId) {
			deleteXml = '<wfs:Delete typeName="grp:shared_positions">\n'
			  + '    <ogc:Filter>\n'
			  + '      <PropertyIsEqualTo>\n'
			  + '        <PropertyName>id</PropertyName>\n'
			  + '        <Literal>'+oldId+'</Literal>\n'
			  + '      </PropertyIsEqualTo>\n'
			  + '    </ogc:Filter>\n'
			  + '  </wfs:Delete>\n';
		}

		var xml = '<wfs:Transaction\n'
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
			  + '    <grp:shared_positions>\n'
			  + '      <grp:text_text>' + props.text + '</grp:text_text>\n'
			  + '      <grp:the_geom>\n'
			  + '        <gml:Point srsDimension="2" srsName="urn:x-ogc:def:crs:EPSG:4326">\n'
			  + '          <gml:coordinates decimal="." cs="," ts=" ">' + latLng.lat + ',' + latLng.lng + '</gml:coordinates>\n'
			  + '        </gml:Point>\n'
			  + '      </grp:the_geom>\n'
			  + '    </grp:shared_positions>\n'
			  + '  </wfs:Insert>\n'
			  
			  +		deleteXml
			  
			  + '  </wfs:Transaction>';
		
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