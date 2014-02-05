L.Control.Geolocate = L.Control.extend({
	options: {
		position: 'bottomright',
		_btnImageSrc: "img/glyphish-icons/PNG-icons/193-location-arrow.png"
	},

	initialize: function(options) {
		L.setOptions(this, options);
	},

	onAdd: function(map) {
		this.map = map;
		
		this._container = L.DomUtil.create('div', 'leaflet-control-Geolocate'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		
		this.$container = $(this._container);
		this._drawButton();
		return this._container;
	},

	onRemove: function(map) {
		
	},
	
	_drawButton: function() {
		var btn = $('<button id="smap-glocate-btn" class="btn btn-default btn-lg"><img class="glyphicon icon-locate" src="'+this.options._btnImageSrc+'"></img></button>');
		this.$container.append(btn);
		this.btn = btn;
		btn.on("click", $.proxy(function() {
			// Toggle the geolocation on btn click
			if (this.active) {
				this.deactivate();				
			}
			else {
				this.activate();
			}
			return false;
		}, this));
	},
	
	activate: function() {
		if (this.active) {
			return false;
		}
		this.active = true;
		this.btn.addClass("btn-primary");
		smap.cmd.loading(true);
		
		var defaultOptions = {
				watch: true,
				setView: true,
				enableHighAccuracy: false
		};
		var options = $.extend(defaultOptions, this.options.locateOptions || {});
		
		this.map.on("locationfound", $.proxy(this._onLocationFound, this));
		this.map.on("locationerror", $.proxy(this._onLocationError, this));
		
		this.map.locate(options);
	},
	
	deactivate: function() {
		if (!this.active) {
			return false;
		}
		this.active = false;
		smap.cmd.loading(false);
		this.btn.removeClass("btn-primary");
		
		this.map.stopLocate();
		if (this.marker) {
			this.map.removeLayer(this.marker);
			this.marker = null;
		}
	},
	
	_onLocationFound: function(e) {
		smap.cmd.loading(false);
		this.marker = this.marker || L.userMarker(e.latlng, {pulsing:true}).addTo(this.map);
		this.marker.setLatLng(e.latlng);
		this.marker.setAccuracy(e.accuracy);
	},
	
	_onLocationError: function(e) {
		smap.cmd.loading(false);
		console.log("Geolocate error: +"+e.message);
	}
	
});


// Do something when the map initializes (example taken from Leaflet attribution control)

//L.Map.addInitHook(function () {
//	if (this.options.attributionControl) {
//		this.attributionControl = (new L.Control.Geolocate()).addTo(this);
//	}
//});


/*
 * This code just makes removes the need for
 * using "new" when instantiating the class. It
 * is a Leaflet convention and should be there.
 */
L.control.geolocate = function (options) {
	return new L.Control.Geolocate(options);
};