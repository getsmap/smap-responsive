L.Control.SideBars = L.Control.extend({
	options:{
		position: 'topright',
	   	title: "SidBar Control - sMap-mobile, sportlov 2014",
	   	//The content below is just for test purpose but can be configure in different ways.
	   	content: {
	   		imgSrc: "//www.helsingborg.se/ImageVaultFiles/id_47947/cf_1320/sportlov2014_238x200px.JPG",
	   		text: '<p class="lorem">Aktiviteterna är sorterade alfabetiskt efter kategori. Du kan också göra en sökning på en särskild aktivitet (exempelvis judo, tennis) eller plats (exempelvis Dunkers, Jutan). Klicka på aktiviteten för att få mer information om tid, ålder, anmälan med mera. Förutom aktiviteterna nedan har även fritidsgårdarna i Helsingborg mängder av aktiviteter under sportlovet.</p><p class="lorem">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p><p><a title="Platsen Helsingborg spellista på Youtube" href="//www.youtube.com/playlist?list=PLu9mjaI-BuKiE0eZHtKj_N5EAsG_IQpHy" target="_blank"><img class="alignnone size-medium wp-image-148" alt="youtube" src="//blogg.helsingborg.se/platsen/files/2013/12/youtube-300x169.png" width="300" height="169"></a></p><p class="lorem">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p><p class="lorem">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>'
	   	}
	},	

	initialize: function(options) {
		L.setOptions(this, options);
		
	},

	onAdd: function(map) {
		var self = this;
		this.map = map;
		
		this._container = L.DomUtil.create('div', 'leaflet-control-SideBars'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		
		// Use $ prefix for all jQuery objects to make it easier to sort out all
		// jQuery dependencies when sharing the code in future.
		
		self.$container = $(self._container);
		self.$container.prop({"id":"smap-control-sidebars"});
		
		self.createSideBars();
		self.createMarker(); //comment this line to take out the example marker
		
		this.$container = $(this._container);
		
		// Binding an event (example)
		// this.map.on('layeradd', this._onLayerAdd, this).on('layerremove', this._onLayerRemove, this);

		return this._container;
	},

	onRemove: function(map) {
		// Do everything "opposite" of onAdd – e.g. unbind events and destroy things
		// map.off('layeradd', this._onLayerAdd).off('layerremove', this._onLayerRemove);
	},
	
	createSideBars: function(){
		var self = this;
				
		var sbcontainer = $('<div id="sidebar" />');
		self.sbHeader = $('<h3>'+self.options.title+'</h3><div>'+
		   '<img src="'+self.options.content.imgSrc+'" id="test-img" style="width:150px;height:160px;vertical-align:middle;float:left;margin: 7px 10px 0px 0px;">'+
		   '<span style="">'+self.options.content.text+'</span>'+
		'</div>');
	
		sbcontainer.append(this.sbHeader);

		$("body").append(sbcontainer);

		self.sidebar = L.control.sidebar('sidebar', {
		    closeButton: true,
		    position: 'right'
		});

		self.map.addControl(self.sidebar);
		
		$('.smap-control-sidebars').append(sbcontainer);
		
		//TODO
//		$( "#test-img" ).bind( "click", function(evt) {
//		  
//		});
	},
	
	createMarker: function(coords){
		var self = this;
		var coords = arguments.length ? coords : [56.04422, 12.75044];
		var marker = L.marker( [coords[0], coords[1] ]);
				
		marker.addTo(self.map).on('click', function (evt) {
			self.sidebar.toggle();
		            		            
		});
				
        self.map.on('click', function () {
            self.sidebar.hide();
            $('.lswitch-panel').show();
        })

        self.sidebar.on('show', function () {
            //console.log('Sidebar visible.');
    		$('.lswitch-panel').hide();
        });

        self.sidebar.on('hide', function () {
            //console.log('Sidebar hidden.');
			$('.lswitch-panel').show();
        });

        L.DomEvent.on(self.sidebar.getCloseButton(), 'click', function () {
            //console.log('Close button clicked.');
        });
	}

});


L.control.SideBars = function (options) {
	return new L.Control.SideBars(options);
};