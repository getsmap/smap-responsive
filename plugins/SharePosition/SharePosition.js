L.Control.SharePosition = L.Control.extend({
	options: {
		position: 'topright' // just an example
	},
	
	_lang: {
		"sv": {
			btnShare: "Dela position",
			btnUnshare: "Sluta dela position",
			titleDialog: "Skriv nånting",
			btnCancel: "Avbryt",
			btnSubmit: "Skicka",
			loading: "Hämtar din position..."
		},
		"en": {
			btnShare: "Share position",
			btnUnshare: "Stop sharing position",
			titleDialog: "Write something",
			btnCancel: "Cancel",
			btnSubmit: "Submit",
			loading: "Loading your position..."
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
		
		this._drawBtn();
		
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
		$(".modal-body .sharepos-footer").before(msg);
	},
	
	_onLocationFound: function(e) {
		// TODO: Send the position and the tweet to the web service.
		smap.cmd.loading(false);
		
		var dec = 6;
		
		this.modal.find('form td[name="easting"]').text( utils.round( e.latlng.lng, dec ));
		this.modal.find('form td[name="northing"]').text( utils.round( e.latlng.lat, dec ));
		this.modal.find('form td[name="accuracy"]').text( utils.round( e.accuracy, 1 ) + " m");
		this.modal.find("table").show();
		
		// Enable submit button
		this.modal.find(".btn-primary").removeAttr("disabled").button('reset');
//		this._onLocationError();
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
	
	sharePosition: function() {
		$("#sharepos-btn").button(this.lang.btnUnshare);
		
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
			watch: false,
			setView: true,
			enableHighAccuracy: true
		});
		smap.cmd.loading(false); // Don't show loading indicator
	},
	
	unSharePosition: function() {
		$("#sharepos-btn").button(this.lang.btnShare);
		
		// Unbind events
		this.map.off("locationfound", $.proxy(this._onLocationFound, this));
		this.map.off("locationerror", $.proxy(this._onLocationError, this));
	},
	
	_showDialog: function() {
		var form = $(
			'<form id="sharepos-form" role="form">'+
				'<textarea class="form-control" rows="4" name="text" minlength="5" maxlength="140" required></textarea>'+	
				'<table style="display:none;">'+
					'<tr><td>Easting:</td><td name="easting"></td></tr>'+
					'<tr><td>Northing:</td><td name="northing"></td></tr>'+
					'<tr style="font-weight:bold;"><td>Felmarginal:</td><td name="accuracy"></td></tr>'+
				'</table>'+
				'<div class="row sharepos-footer">'+
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
			self._save(out.text, L.latLng(out.northing, out.easting));			
			return false;
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
			self.modal.empty().remove();
			self.modal = null;
			$("#sharepos-btn").button(this.lang.btnShare);
			$("#sharepos-btn").removeClass("btn-primary");
			delete self.modal;
		});
		return modal;
	},
	
	_drawBtn: function() {
		var self = this;
		var btn = $('<button id="sharepos-btn" class="btn btn-default btn-lg"><span class="glyphicon glyphicon-eye-open"></span>  <span>'+this.lang.btnShare+'</span></button>');
		btn.on("click", function() {
			if ( $(this).hasClass("btn-primary") ) {
				$(this).removeClass("btn-primary");
				self.unSharePosition();
			}
			else {
				$(this).addClass("btn-primary");
				self.sharePosition();
			}
		});
		this.$container.append(btn);
	},
	
	
	_save: function(text, latLng) {
		smap.cmd.loading(true);
		
		$.ajax({
			url: smap.config.ws.sharePosStore,
			type: "POST",
			context: this,
			dataType: "json",
			success: function(resp) {
				if (resp.success) {
					this._notify("Din text är sparad!", "success");
					this.deactivate();
					this._reload();
				}
				else {
					this._notify("Kunde inte spara. Fel: <strong>"+resp.msg+"</strong>", "error");
				}
			},
			error: function(a, text, c) {
				this._notify("Kunde inte spara. Fel: <strong>"+text+"</strong>", "error");
			},
			complete: function() {
				smap.cmd.loading(false);
			}
		});
	},
	
	
	_reload: function(callbacks) {
		// TODO: Refresh features and perhaps open popup of the just added one 
		
		callbacks = callbacks || {};
		
	}
});


// Do something when the map initializes (example taken from Leaflet attribution control)

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
L.control.sharePosition = function(options) {
	return new L.Control.SharePosition(options);
};