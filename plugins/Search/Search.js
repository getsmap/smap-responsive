L.Control.Search = L.Control.extend({
	options: {
		//autocompleteScriptUrl : "http://localhost/cgi-bin/proxy.py?url=http://kartor.helsingborg.se/Hws/sok_json_fme.py?term=",
		//autocompleteScriptUrl : "http://localhost/cgi-bin/proxy.py?url=http://kartor.helsingborg.se/Hws/autocomplete_hbg.ashx?q=",
		autocompleteScriptUrl : "http://localhost/cgi-bin/proxy.py?url=http://kartor.helsingborg.se/Hws/sok.py?",
		exaktScriptUrl : "http://localhost/cgi-bin/proxy.py?url=http://kartor.helsingborg.se/Hws/sokexakkt.py",
		dummyTxt : "Sök",
		addressMarker : null,
		position : "topright"
	},

	initialize: function(options) {
		L.setOptions(this, options);
	},

	onAdd: function(map) {
		var self = this;
		self.map = map;
		self._container = L.DomUtil.create('div', 'leaflet-control-search'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		
		self.$container = $(self._container);
		self.$container.prop({"id":"smap-control-search"});
		self._makeSearchField();
		return self._container;
	},

	_rmAdressMarker: function(marker){
		if(marker != null){ 
			this.map.removeLayer(marker);
			this.addressMarker = null;
		}
	},

	_makeSearchField: function() {
		var field = $('<input id="smap-search-field" class="typeahead" data-provide="typeahead" type="text" value="Sök" />');
		this.$container.append(field);
		var self = this;

		field.on("focus", function() {
			if ($(this).val() == self.options.dummyTxt) {
				$(this).val("");
			}
		
		}).on("focusout", function(){
			if ($(this).val()=="") {
				$(this).val(self.options.dummyTxt);
			}
		});

  

	var adresser = new Bloodhound({
    	datumTokenizer: function (d) { return Bloodhound.tokenizers.whitespace(d.value); },
    	queryTokenizer: Bloodhound.tokenizers.whitespace,
    	remote: {
      		url : "http://localhost/cgi-bin/proxy.py?url=http://kartor.helsingborg.se/Hws/sok_json_fme.py?term=%QUERY",
   
        	filter: function (parsedResponse) {
            	retval = [];
            
            	for (var i = 0; i < parsedResponse.length; i++) {
	                retval.push({
	                    value: parsedResponse[i]
	                });
            	}
            return retval;
        	}
    	}
	});

	// initialize the bloodhound suggestion engine
	adresser.initialize();

	// instantiate the typeahead UI
	field.typeahead(null, {
		minLength:2,
		hint : false,
	    displayKey: 'value',
	    template: '<p>{{value}} ({{country_code}})</p>',
	    source: adresser.ttAdapter()
		}).on('typeahead:selected', function(event, datum) {
			$.ajax({
				url : "http://localhost/cgi-bin/proxy.py?url=http://kartor.helsingborg.se/Hws/sokexakt.py",
				data:{ "q" : datum.value },
				type:"POST",
				success: function( json ){
					self._rmAdressMarker(self.addressMarker);
					var p = new proj4.Point(json.features[0].geometry.coordinates[0],json.features[0].geometry.coordinates[1]);
					var src = proj4.defs["EPSG:3008"];
					var dest = proj4.defs["EPSG:4326"];			
					p = proj4(src,dest,p);
					var addressMarker = L.marker([p.y, p.x]).bindPopup("<button id=lala>Delete</button>");;
					
					addressMarker.addTo(self.map);
					
					
					$("#lala").click(function(){
						alert("");
					});
				
					self.addressMarker = addressMarker;
				}
			});
	});

	},
	

	onRemove: function(map) {
		// Do everything "opposite" of onAdd – e.g. unbind events and destroy things
		// map.off('layeradd', this._onLayerAdd).off('layerremove', this._onLayerRemove);
	},
	CLASS_NAME: "L.Control.Search"
});


// Do something when the map initializes (example taken from Leaflet attribution control)

//L.Map.addInitHook(function () {
//	if (this.options.attributionControl) {
//		this.attributionControl = (new L.Control.Template()).addTo(this);
//	}
//});


/*
 * This code just makes removes the need for
 * using "new" when instantiating the class. It
 * is a Leaflet convention and should be there.
 */
L.control.search = function (options) {
	return new L.Control.Search(options);
};