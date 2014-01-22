L.Control.GuideIntroScreen = L.Control.extend({
	options: {
		position: 'bottomright',
		prefix: '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'
	},

	initialize: function(options) {
		L.setOptions(this, options);
	},

	onAdd: function(map) {
		this.map = map;
		
		this._container = L.DomUtil.create('div', 'leaflet-control-guideintroscreen'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		
		// Use $ prefix for all jQuery objects to make it easier to sort out all
		// jQuery dependencies when sharing the code in future.
		this.$container = $(this._container);
		
		var content = this._makeContent();
		$("body").append(content);

		return this._container;
	},

	onRemove: function(map) {
		
	},
	
	
	_makeContent: function() {
		var classActive = "btn-danger";
		var $content = $('<div class="guide-introscreen">'+
				'<div class="container">'+
					'<h1>Promenadstaden</h1>'+
					'<p style="margin-top:20px;" class="lead">Malmö museer</p>'+
					'<p class="lead">Science Center</p>'+
				'</div>'+
				'<div style="margin-top:30px;" class="btn-group">'+
					'<button type="button" class="guideintro-btn-option btn '+classActive+'">Svenska</button>'+
					'<button type="button" class="guideintro-btn-option btn btn-default">English</button>'+
				'</div>'+
				'<div class="row">'+
					'<div class="col-xs-5 col-xs-offset-1 col-md-4 col-md-offset-2 text-left">'+
				  		'<h3>Industristaden</h3>'+
				  		'<div style="margin-bottom:20px;">'+
				  			'<p class="lead text-muted">Industrispåret guidar dig genom de gamla industrierna i Malmös innerstad.</p>'+
				  			'<button class="btn btn-default btn-sm">Industristaden</button>'+
				  		'</div>'+
			  		'</div>'+
			  		'<div class="col-xs-5 col-md-4 text-left">'+
				  		'<h3>Västra hamnen</h3>'+
				  		'<div style="margin-bottom:20px;">'+
				  			'<p class="lead text-muted">Västra hamnen guidar dig genom Malmös mest välkända och omtalade stadsdel.</p>'+
				  			'<button class="btn btn-default btn-sm">Industristaden</button>'+
				  		'</div>'+
			  		'</div>'+
				'</div>'+
					
					
		'</div>');
		$content.find(".guideintro-btn-option").on("click", function() {
			$(this).addClass(classActive).siblings().removeClass(classActive).addClass("btn-default");
		});
		return $content;
	}
});


// Do something when the map initializes (example taken from Leaflet attribution control)

//L.Map.addInitHook(function () {
//	if (this.options.attributionControl) {
//		this.attributionControl = (new L.Control.GuideIntroScreen()).addTo(this);
//	}
//});


/*
 * This code just makes removes the need for
 * using "new" when instantiating the class. It
 * is a Leaflet convention and should be there.
 */
L.control.guideIntroScreen = function (options) {
	return new L.Control.GuideIntroScreen(options);
};