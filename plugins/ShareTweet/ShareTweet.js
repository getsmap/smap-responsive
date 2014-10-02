L.Control.ShareTweet = L.Control.extend({
	options: {
		position: 'topright',
		wfsSource: "//localhost:8080/geoserver/wfs",
		wfsFeatureType: "local:tweets"
	},
	
	_lang: {
		"sv": {
			btnAdd: "Lägg till",
			btnUnshare: "Sluta dela position",
			titleDialog: "Skriv nånting",
			btnCancel: "Avbryt",
			btnSubmit: "Skicka",
			loading: "Arbetar..."
		},
		"en": {
			btnAdd: "Add tweet",
			btnUnshare: "Stop sharing position",
			titleDialog: "Write something",
			btnCancel: "Cancel",
			btnSubmit: "Submit",
			loading: "Working..."
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
		
		this._container = L.DomUtil.create('div', 'leaflet-control-sharetweet'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		
		this.$container = $(this._container);
		
		this._drawBtn();
		this._addWfsLayer();
		
		var self = this;
		this.map.on("zoomend moveend", function() {
			self.layer._refresh();
		});
		
		return this._container;
	},

	onRemove: function(map) {},
	
	_notify: function(text, msgType) {
		switch(msgType) {
		case "success":
			msgType = "alert-success";
			break;
		case "error":
			msgType = "alert-danger";
			break;
		}
		var msg = $('<div class="alert '+msgType+' alert-dismissable"> <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+text+'</div>');
		msg.css({
			"margin-top": "20px"
		});
		$(".modal-body").find(".alert").remove();
		$(".modal-body .sharetweet-footer").before(msg);
	},
	
	_addWfsLayer: function() {
		this.cluster = new L.MarkerClusterGroup();
		this.layer = smap.core.layerInst._createLayer({
			init: "L.GeoJSON.WFS",
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
		var self = this;
		this.layer._map = this.map;
		this.layer.on("load", function(e) {
			e.layer.eachLayer(function(marker) {
				self.cluster.addLayer(marker);
			});
			e.layer.clearLayers();
			self.map.removeLayer(self.cluster);
			self.map.addLayer(self.cluster);
			smap.cmd.loading(false);
		});
		this.map.addLayer(this.cluster);
	},
	
	_onLocationFound: function(e) {
		// TODO: Send the position and the tweet to the web service.
		smap.cmd.loading(false);
		
		var dec = 6;
		
		if (this.modal) {
			this.modal.find('form td[name="easting"]').empty().text( utils.round( e.latlng.lng, dec ));
			this.modal.find('form td[name="northing"]').empty().text( utils.round( e.latlng.lat, dec ));
			this.modal.find('form td[name="accuracy"]').empty().text( utils.round( e.accuracy, 1 ) + " m");
			
			// Enable submit button
			this.modal.find(".btn-primary").button('reset');
		}
	},
	
	_onLocationError: function(e) {
		var self = this;
		
		this._notify("Your position could not be determined", "error");
		setTimeout(function() {
			self.deactivate();
		}, 3000);
	},
	
	deactivate: function() {
		if (this.modal) {
			this.modal.modal("hide");
		}			
	},
	
	shareTweet: function() {
		$("#sharetweet-btn").button(this.lang.btnUnshare);
		
		smap.cmd.loading(true);
		
		this.modal = this._showDialog();
		this.modal.find(".btn-primary").button('loading');
		
		// Deactivate locate control
		var geolocate = smap.cmd.getControl("Geolocate");
		if (geolocate) {
			geolocate.deactivate();		
		}
		
		// Bind events
		this.map.on("locationfound", $.proxy(this._onLocationFound, this));
		this.map.on("locationerror", $.proxy(this._onLocationError, this));
		
		this.map.locate({
			watch: true, // TODO: Test with phone
			setView: true,
			enableHighAccuracy: true
		});
		smap.cmd.loading(false); // Don't show loading indicator
	},
	
	unShareTweet: function() {
		$("#sharetweet-btn").button(this.lang.btnAdd);
		
		// Unbind events
		this.map.off("locationfound", $.proxy(this._onLocationFound, this));
		this.map.off("locationerror", $.proxy(this._onLocationError, this));
	},
	
	_showDialog: function() {
		var form = $(
			'<form id="sharetweet-form" role="form">'+
				'<textarea class="form-control" rows="4" name="text" minlength="5" maxlength="140" required></textarea>'+	
				'<table>'+
					'<tr><td>Easting:</td><td name="easting"></td></tr>'+
					'<tr><td>Northing:</td><td name="northing"></td></tr>'+
					'<tr style="font-weight:bold;"><td>Felmarginal:</td><td name="accuracy"></td></tr>'+
				'</table>'+
				'<div class="row sharetweet-footer">'+
					'<button type="button" class="btn btn-default" data-dismiss="modal">'+this.lang.btnCancel+'</button>'+
					'<button type="submit" class="btn btn-primary" data-loading-text="'+this.lang.loading+'">'+this.lang.btnSubmit+'</button>'+
				'</div>'+
			'</form>');
		var self = this;
		form.on("submit", function(e) {
			var arr = $(this).serializeArray(),
				out = {};
			$.each(arr, function(i, t) {
				out[t.name] = t.value;
			});
			out["easting"] = parseFloat( $(this).find('[name="easting"]').text() );
			out["northing"] = parseFloat( $(this).find('[name="northing"]').text() );
			self._save(L.latLng(out.northing, out.easting), out.text);			
			return false;
		});
		
		// Spin to all td's
		form.find("tr").each(function() {
			var td = $(this).find("td:eq(1)");
			td.text("");
			self._addSpin( td );
		});
				
		var modal = utils.drawDialog(this.lang.titleDialog, form, null, {
			size: "sm"
		});
		form.find(".btn-default").on("click", function() {
			modal.modal("hide");
			return false;
		}).find(".btn-primary").on("click", function() {
			// Submit the text and the position
			return false;
		});
		modal.modal("show");
		
		modal.on("hidden.bs.modal", function() {
			self.map.stopLocate();
			self.modal.empty().remove();
			self.modal = null;
			$("#sharetweet-btn").button(this.lang.btnAdd);
			$("#sharetweet-btn").removeClass("btn-primary");
			delete self.modal;
		});
		return modal;
	},
	
	_addSpin: function(tag) {
		var opts = {
				length: 5,
				width: 1,
				radius: 3
		};
		var spinner = new Spinner(opts).spin();
		$(tag).append(spinner.el);
	},
	
	_drawBtn: function() {
		var self = this;
		var btn = $('<button id="sharetweet-btn" class="btn btn-default btn-lg"><span class="glyphicon glyphicon-map-marker"></span>&nbsp;&nbsp;<span>'+this.lang.btnAdd+'</span></button>');
		btn.on("click", function() {
			if ( $(this).hasClass("btn-primary") ) {
				$(this).removeClass("btn-primary");
				self.unShareTweet();
			}
			else {
				$(this).addClass("btn-primary");
				self.shareTweet();
			}
		});
		this.$container.append(btn);
	},
	
	
	_createRequest: function(latLng, props) {
		
		var xml = '<wfs:Transaction\n'
			  + '  service="WFS"\n'
			  + '  version="1.1.0"\n'
			  + '  xmlns:grp="//localhost/"\n'
			  + '  xmlns:wfs="//www.opengis.net/wfs"\n'
			  + '  xmlns:gml="//www.opengis.net/gml"\n'
			  + '  xmlns:xsi="//www.w3.org/2001/XMLSchema-instance"\n'
			  + '  xsi:schemaLocation="//www.opengis.net/wfs\n'
			  + '                      //schemas.opengis.net/wfs/1.1.0/WFS-transaction.xsd\n'
			  + '                      '+this.options.wfsSource+'/DescribeFeatureType?typename='+this.options.wfsFeatureType+'">\n'
			  + '  <wfs:Insert>\n'
			  + '    <grp:tweets>\n'
			  + '      <grp:text_text>' + props.text + '</grp:text_text>\n'
			  + '      <grp:the_geom>\n'
			  + '        <gml:Point srsDimension="2" srsName="urn:x-ogc:def:crs:EPSG:4326">\n'
			  + '          <gml:coordinates decimal="." cs="," ts=" ">' + latLng.lat + ',' + latLng.lng + '</gml:coordinates>\n'
			  + '        </gml:Point>\n'
			  + '      </grp:the_geom>\n'
			  + '    </grp:tweets>\n'
			  + '  </wfs:Insert>\n'
			  + '</wfs:Transaction>';
		
		return xml;
	},
	
	_save: function(latLng, text) {
		if (this.submitting) {
			return false;
		}
		this.map.stopLocate();
		this.submitting = true;
		smap.cmd.loading(true);
		this.modal.find(".btn-primary").button('loading');
		
		var xml = this._createRequest(latLng, {text: text});
		
		$.ajax({
			url: smap.config.ws.proxy + encodeURIComponent( this.options.wfsSource ),
			type: "POST",
			context: this,
			data: xml,
			contentType: "text/xml",
			dataType: "text",
			success: function(resp) {
				smap.cmd.loading(false);
				var obj = $.xml2json(resp);
				if (parseInt(obj.TransactionSummary.totalInserted) > 0) {
					// success
					this.deactivate();
					this._reload();
//					this.marker = L.marker(latLng, {text: text});
//					this.cluster.addLayer(this.marker);
				}
				
//				if (resp.success) {
//					this._notify("Din text är sparad!", "success");
//					this.deactivate();
//					this._reload();
//				}
//				else {
//					this._notify("Kunde inte spara. Fel: <strong>"+resp.msg+"</strong>", "error");
//				}
			},
			error: function(a, text, c) {
				this._notify("Kunde inte spara. Fel: <strong>"+text+"</strong>", "error");
				smap.cmd.loading(false);
			},
			complete: function() {
				this.modal.find(".btn-primary").button('reset');
				this.submitting = false;
			}
		});
	},
	
	
	_reload: function(callbacks) {
		// TODO: Refresh features and perhaps open popup of the just added one 
		
		callbacks = callbacks || {};
		
		smap.cmd.loading(true);
		this.layer._refresh();
		
	}
});


// Do something when the map initializes (example taken from Leaflet attribution control)

//L.Map.addInitHook(function () {
//	if (this.options.attributionControl) {
//		this.attributionControl = (new L.Control.ShareTweet()).addTo(this);
//	}
//});


/*
 * This code just makes removes the need for
 * using "new" when instantiating the class. It
 * is a Leaflet convention and should be there.
 */
L.control.shareTweet = function(options) {
	return new L.Control.ShareTweet(options);
};