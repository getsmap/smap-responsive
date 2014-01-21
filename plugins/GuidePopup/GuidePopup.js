L.Control.GuidePopup = L.Control.extend({
	options: {},

	initialize: function(options) {
		L.setOptions(this, options);
	},

	onAdd: function(map) {
		this.map = map;
		
		this._container = L.DomUtil.create('div', 'leaflet-control-guidepopup'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		
		// Use $ prefix for all jQuery objects to make it easier to sort out all
		// jQuery dependencies when sharing the code in future.
		this.$container = $(this._container);
		
		this._activate();

		return this._container;
	},

	onRemove: function(map) {
		this._deactivate();
	},
	
	
	_onPopupClick: function(e) {
		var props = $("#gp-btn-show").data("props");
		var mediaArr = this.options.media[ props[this.options.attrId] ];
		if (mediaArr && mediaArr instanceof Array) {
			this.createPopup(props);
		}
		else if (mediaArr && mediaArr instanceof Object) {
			// Show media in full-screen at once
			var content = this._makeMediaContent(mediaArr.mediaType, mediaArr.sources);
			this.showFullScreen(content);
		}
		return false;
	},
	
	_onPopupOpen: function(e) {
		if (e.popup._source.feature) {
			var props = e.popup._source.feature.properties;
			self.layerId = e.popup.layerId;
			self.properties = props; // properties for filling the dialog
			
			var btn = $('<button style="margin-top:10px;" id="gp-btn-show" class="btn btn-primary">Läs mer</button>');
			$(".leaflet-popup-content").append(btn);
			
//			$(".leaflet-popup-content-wrapper").css("cursor", "pointer");
//			$(".leaflet-popup-content-wrapper").on("touchstart click", onPopupClick);
			btn.data("props", props);
			btn.on("touchstart click", $.proxy(this._onPopupClick, this));
		}
	},
	
	_onPopupClose: function(e) {
		$(e.popup._wrapper).off("touchstart", this.onPopupClick);
	},
	
	_activate: function() {
		var self = this;
		
		var layer;
		for (var i=0,len=this.map._layers.length; i<len; i++) {
			layer = this.map._layers[i];
			if (layer.options.layerId === this.options.layerId) {
				break;
			}
		}
		if (!this.options.layerId || !layer) {
			alert("No layerId specified for GuidePopup plugin OR vector layer not found.");
			return false;
		}
		
		var icons = {
				audio: {
					icon:L.icon({
					    iconUrl: 'leaf-green.png',
					    shadowUrl: 'leaf-shadow.png',
	
					    iconSize:     [38, 95], // size of the icon
					    shadowSize:   [50, 64], // size of the shadow
					    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
					    shadowAnchor: [4, 62],  // the same for the shadow
					    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
					})
				}
		};
		layer.setStyle(function(f) {
			var m = self.options.media[ props[self.options.attrId] ];
			if (m instanceof Object && !(m instanceof Array)) {
				
				
				m.mediaType
			}
			
	        switch (f.properties.party) {
	            case 'Republican': return {color: "#ff0000"};
	            case 'Democrat':   return {color: "#0000ff"};
	        }
		});
			
		this.map.on("popupopen", $.proxy(this._onPopupOpen, this));
		this.map.on("popupclose", $.proxy(this._onPopupClose, this));
	},
	
	_deactivate: function() {
		this.map.off("popupopen", $.proxy(this._onPopupOpen, this));
		this.map.off("popupclose", $.proxy(this._onPopupClose, this));
	},
	
	_makeCarousel: function(arrImageSources) {
		arrImageSources = arrImageSources || [];
		
		var $carousel = $('<div id="carousel-example-generic" class="carousel slide">'),
			src,
			$indicators = $('<ol class="carousel-indicators" />'),
			$inner = $('<div class="carousel-inner" />'),
			$controls = $(
					'<a class="left carousel-control" href="#carousel-example-generic" data-slide="prev"><span class="icon-prev"></span></a>'+
			'<a class="right carousel-control" href="#carousel-example-generic" data-slide="next"><span class="icon-next"></span></a>');
			
		for (var i=0,len=arrImageSources.length; i<len; i++) {
			src = arrImageSources[i];
			$indicators.append('<li data-target="#carousel-example-generic" data-slide-to="'+i+'"></li>');
			$inner.append('<div class="item"><img src="'+src+'"></img></div>');
		}
		
		// Render first image as active
		$inner.find(".item:first").add($indicators.find("li:first")).addClass("active");
		
		// Append everything
		$carousel.append($indicators).append($inner).append($controls);
		
		return $carousel;
		
	},
	
	_makeAudioTag: function(arrAudioSources) {
		arrAudioSources = arrAudioSources || [];
		
		var src,
			ext,
			type,
			$tagAudio = $('<audio controls />'),
			tagSrc;
		for (var i=0,len=arrAudioSources.length; i<len; i++) {
			src = arrAudioSources[i];
			ext = src.substring(src.length-3).toUpperCase();
			switch (ext) {
			case "OGG":
				type = 'audio/ogg';
				break;
			case "MP3":
				type = 'audio/mpeg';
				break;
			}
			tagSrc = '<source src="'+src+'" type="'+type+'" />';
			$tagAudio.append(tagSrc);
		}
		
		return $tagAudio;
	},
	
	_makeVideoTag: function(arrVideoSources) {
		arrVideoSources = arrVideoSources || [];
		
		var src,
			ext,
			type,
			$tagVideo = $('<video controls autoplay width="320" height="180" />'),
			tagSrc;
		for (var i=0,len=arrVideoSources.length; i<len; i++) {
			src = arrVideoSources[i];
			ext = src.substring(src.length-3).toUpperCase();
			switch (ext) {
			case "M4V":
				type = 'video/mp4';
				break;
			case "OGG":
				type = 'video/ogg';
				break;
			default:
				continue;
			}
			tagSrc = '<source src="'+src+'" type="'+type+'" />';
			$tagVideo.append(tagSrc);
		}
		$tagVideo.append('<span title="No video playback capabilities, please download the video below">Download video</span>');
		
		return $tagVideo;
	},
	
	_makeMediaList: function(arrMedia) {
		arrMedia = arrMedia || [];
		
		var glyphs = {
				image: "picture",
				audio: "volume-up",
				video: "facetime-video"
				
		};
		var t,i,li,
			list = $('<div id="gp-listmoreinfo" class="list-group" />');
		for (i=0,len=arrMedia.length; i<len; i++) {
			t = arrMedia[i];
			li = $('<a href="#" class="list-group-item"><span class="glyphicon glyphicon-'+glyphs[t.mediaType]+'"></span>&nbsp;&nbsp;&nbsp;'+t.label+'</a>');
			list.append(li);
		}
		return list;
	},
	
	showFullScreen: function(content) {
		var div = $('<div class="gp-fullscreen"></div>');
		
		function onKeyDown(e) {
			if (e.which === 27) {
				// Escape
				close();
			}
		};
		function close() {
			$("body").off("keydown", onKeyDown);
			$(".gp-fullscreen").removeClass("gp-fs-visible");
			setTimeout(function() {
				$(".gp-fullscreen").empty().remove();
			}, 500);
			return false;
		};
		
		$("body").on("keydown", onKeyDown);
		
		var btnClose = $('<button type="button" class="btn btn-default">Stäng</button>');
		btnClose.on("click", function() {
			close();
			return false;
		});
		div.append(content);
		div.append(btnClose);
		btnClose.css("z-index", 3000);
		$("body").append(div);
		setTimeout(function() {
			div.addClass("gp-fs-visible");			
		}, 1);
	},
	
	
	_makeMediaContent: function(mediaType, sources) {
		switch (mediaType.toLowerCase()) {
		case "image":
			// Make a slideshow
			content = this._makeCarousel(sources);
			break;
		case "audio":
			content = this._makeAudioTag(sources);
			break;
		case "video":
			content = this._makeVideoTag(sources);
			break;
		default:
			break;
		}
		return content;
	},
	
	createPopup: function(props) {
		props = props || {};
		
		var self = this;
		
		var content = 
		'<ul class="nav nav-tabs">' +
			'<li class="active"><a href="#gp-intro" data-toggle="tab">Intro</a></li>'+
			'<li><a href="#gp-moreinfo" data-toggle="tab">Mer info</a></li>'+
		'</ul>'+
		'<div class="tab-content gp-popup">'+
		  '<div class="tab-pane active" id="gp-intro">'+
//		  		'<h1>${'+this.attrTxtTitle+'}</h1>'+
	  			'<img src="${'+this.options.attrImgStart+'}">'+
		  		'<p>${'+this.options.attrTxtIntro+'}</p>'+
			'</div>'+
		  '<div class="tab-pane" id="gp-moreinfo"></div>'+
		'</div>';
		
		content = utils.extractToHtml(content, props);
		var featureId = props[this.options.attrId];
		var list = this._makeMediaList(this.options.media[featureId]);
		
		content = $(content);
		content.find("#gp-moreinfo").append(list);
		
		this.dialog = utils.drawDialog(
				props[this.options.attrTxtTitle],
				content
		);
		this.dialog.on("hidden.bs.modal", function() {
			$(this).empty().remove();
			self.dialog = null;
			delete self.dialog;
		});
		this.dialog.attr("id", "gp-popup");
		
		var media = self.options.media;
		
		function onLiTap(e) {
			var index = $(this).index(); // The tag's order corresponds to index in media array
			var t = media[featureId][index];
			var content = self._makeMediaContent(t.mediaType, t.sources);
			self.showFullScreen(content);
			return false;
		};
		this.dialog.find("#gp-listmoreinfo").find(".list-group-item").on("tap click", onLiTap);
		$("body").append(this.dialog);
		
		this.dialog.modal();
	}
});


// Do something when the map initializes (example taken from Leaflet attribution control)

//L.Map.addInitHook(function () {
//	if (this.options.attributionControl) {
//		this.attributionControl = (new L.Control.GuidePopup()).addTo(this);
//	}
//});


/*
 * This code just makes removes the need for
 * using "new" when instantiating the class. It
 * is a Leaflet convention and should be there.
 */
L.control.guidePopup = function (options) {
	return new L.Control.GuidePopup(options);
};