L.Control.GuideIntroScreen = L.Control.extend({
	options: {
		position: 'bottomright',
		prefix: '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>',
		
		langs: {
			"sv": "Svenska",
			"en": "English"
		},
		header: {
			"sv": {
				title: "Promenadstaden",
				subHeaders: ["Malmö museer", "Science Center"]
			},
			"en": {
				title: "The walking city",
				subHeaders: ["Malmö museums", "Science Center"]
			}
		},
		
		configs: [
		          {
		        	  configName: "guide-industri.js",
		        	  
	        		  "sv": {
	        			  title: "Industristaden",
	        			  description: "Industrispåret guidar dig genom de gamla industrierna i Malmös innerstad."		        			  
	        		  },
	        		  "en": {
	        			  title: "The industrial city",
	        			  description: "This tour guides you to some old industrial buildings of Malmö"
	        		  }
		          },
		          {
		        	  configName: "guide-vh.js",
	        		  "sv": {
	        			  title: "Västra hamnen",
			        	  description: "Västra hamnen guidar dig genom Malmös modernaste och fräsigaste stadsdel."
	        		  },
	        		  "en": {
	        			  title: "Western harbor",
			        	  description: "This tour guides you through the most modern part of Malmö."
	        		  }
		          }
          ]
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
		
		var $content = this._makeContent("sv"),
			$container = $('<div class="guide-introscreen" />');
		$container.append( $content );
		
		$("body").append( $container );

		return this._container;
	},

	onRemove: function(map) {
		
	},
	
	_setLang: function(langCode) {
		
	},
	
	
	_makeContent: function(langCode) {
		var self = this;
		var goToConfig = function() {
			var configName = $(this).data("configName");
			// TODO: Apply config to map
			alert("Apply this config: "+configName);
			return false;
		};
		
		var h = this.options.header[langCode],
			shs = "";
		for (var i=0,len=h.subHeaders.length; i<len; i++) {
			shs += '<p class="lead">'+h.subHeaders[i]+'</p>';
		}
		
		var headerHtml = '<div class="container"><h1 style="margin-bottom:20px;">'+h.title+'</h1>'+shs+'</div>';
		var classActive = "btn-danger";
		
		// Make lang buttons
		var langs = this.options.langs,
			label = "", btn,
			langBtns = $('<div style="margin-top:30px;" class="btn-group" />');
		for (var _langCode in langs) {
			label = langs[_langCode];
			btn = $('<button type="button" class="guideintro-btn-option btn btn-default">'+label+'</button>');
			if (_langCode === langCode) {
				btn.addClass(classActive);
			}
			btn.data("langCode", _langCode);
			langBtns.append(btn);
		}
		var $content = $('<div class="guide-content" />');
		$content.append(headerHtml);
		$content.append(langBtns);
		
		var c, row, cTag,
			configName,
			configs = this.options.configs;
		for (var i=0,len=configs.length; i<len; i++) {
			c = configs[i];
			configName = c.configName;
			c = c[langCode];
			if (i % 2 === 0) {
				row = $('<div class="row" />');
				$content.append(row);
			}
			cTag = $('<div class="col-xs-5 col-xs-offset-1 col-md-4 col-md-offset-2 text-left">'+
			  		'<h3>'+c.title+'</h3>'+
			  		'<div style="margin-bottom:20px;">'+
			  			'<p class="lead text-muted">'+c.description+'</p>'+
			  			'<button class="btn btn-default btn-sm gintro-btn-configoption">'+c.title+'</button>'+
			  		'</div>'+
		  		'</div>');
			
			var b = cTag.find("button");
			b.data("configName", configName);
			row.append(cTag);
		}
		
		$content.find(".guideintro-btn-option").on("click", function() {
			var _langCode = $(this).data("langCode");
			if (langCode !== _langCode) {
				$(this).addClass(classActive).siblings().removeClass(classActive).addClass("btn-default");
				var $newContent = self._makeContent( _langCode );
				$(".guide-introscreen").empty().append( $newContent );				
			}
			return false;
			
		});
		$content.find(".gintro-btn-configoption").on("click", goToConfig);
		
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