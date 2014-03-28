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
		
		if ( windowWidth < 950 ) {
			// iPad or small desktop
			this.hideTheTag();
		}
		else {
			this.showTheTag();
		}
	},
	
	
	_onPopupClick: function(e) {
		var props = $("#gp-btn-show").data("props");
		var t = this.options.data[ props[this.options.attrId] ] || {};
		var mediaArr = t.tabMedia,
			tabIntro = t.tabIntro;
		if (tabIntro) {   //mediaArr && mediaArr instanceof Array) {
			this.createPopup(props);
		}
		else if (mediaArr && mediaArr instanceof Object) {
			// Show media in full-screen at once
			var content = this._makeMediaContent(mediaArr.mediaType, utils.extractToHtml(mediaArr.sources, props).split(","));
			this.showFullScreen(content);
		}
		return false;
	},
	
	_onPopupOpen: function(e) {
		if (e.popup._source.feature) {
			var props = e.popup._source.feature.properties;
//			this.layerId = e.popup.layerId;
//			this.properties = props; // properties for filling the dialog
			
			var t = this.options.data[ props[this.options.attrId] ];
			if (t && t instanceof Object) {
				var btn = $('<button style="margin-top:10px;" id="gp-btn-show" class="btn btn-primary">Visa mer</button>');
				$(".leaflet-popup-content").append(btn);
				btn.data("props", props);
				btn.on("touchstart click", $.proxy(this._onPopupClick, this));
			}
			
		}
	},
	
	_onPopupClose: function(e) {
		$(e.popup._wrapper).off("touchstart", this.onPopupClick);
	},
	
	_activate: function() {
		var self = this;
			
		var icons = {
				audio: {
					icon:L.icon({
					    iconUrl: "img/glyphish-icons/PNG-icons/120-headphones.png",
					    iconSize:     [22, 21],
					    iconAnchor:   [11, 10],
					    popupAnchor:  [0, -8]
					})
				},
				video: {
					icon:L.icon({
						iconUrl: "img/glyphish-icons/PNG-icons/46-movie-2.png",
						iconSize:     [20, 25],
						iconAnchor:   [10, 12],
						popupAnchor:  [0, -9]
					})
				},
				image: {
					icon:L.icon({
						iconUrl: "img/glyphish-icons/PNG-icons/121-landscape.png",
					    iconSize:     [22, 21],
					    iconAnchor:   [11, 10],
					    popupAnchor:  [0, -8]
					})
				}
				
		};
	
		var layerConfig = smap.cmd.getLayerConfig(this.options.layerId);
		layerConfig.options.pointToLayer = function(f, latLng) {
			var props = f.properties || {};
			var t = self.options.data[ props[self.options.attrId] ] || {};
			var m = t.tabMedia;
			if (t.iconType && icons[t.iconType]) {
				return L.marker(latLng, icons[t.iconType]);
			}
			else {
				return L.marker(latLng);
			}
		};
		var layer = smap.cmd.addLayerWithConfig(layerConfig);
		
		this.map.on("popupopen", $.proxy(this._onPopupOpen, this));
		this.map.on("popupclose", $.proxy(this._onPopupClose, this));
	},
	
	_deactivate: function() {
		this.map.off("popupopen", $.proxy(this._onPopupOpen, this));
		this.map.off("popupclose", $.proxy(this._onPopupClose, this));
	},
	
	_makeCarousel: function(arrImageSources) {
		arrImageSources = arrImageSources || [];
		
		var $carousel = $('<div id="guide-carousel" class="carousel slide">'),
			src,
			$indicators = $('<ol class="carousel-indicators" />'),
			$inner = $('<div class="carousel-inner" />'),
			$controls = $(
					'<a class="left carousel-control" href="#guide-carousel" data-slide="prev"><span class="icon-prev"></span></a>'+
			'<a class="right carousel-control" href="#guide-carousel" data-slide="next"><span class="icon-next"></span></a>');
			
		for (var i=0,len=arrImageSources.length; i<len; i++) {
			src = arrImageSources[i];
			$indicators.append('<li data-target="#guide-carousel" data-slide-to="'+i+'"></li>');
			$inner.append('<div class="item"><img src="'+src+'"></img></div>');
		}
		
		// Render first image as active
		$inner.find(".item:first").add($indicators.find("li:first")).addClass("active");
		
		// Append everything
		$carousel.append($indicators).append($inner).append($controls);
		
		$carousel
			.swiperight(function() {  
				$(this).carousel('prev');
			})
			.swipeleft(function() {  
				$(this).carousel('next');  
			});
		
		$(document).on("orientationchange", function() {
			var ih = window.innerHeight;
			$(".gp-fullscreen").height(ih);
		});
		
		
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
		
		
		var w = $(window).width() - 2,
			h = $(window).height() - 65;
		if (h > w) {
			// swap
			var _w = w;
			w = h;
			h = _w;
		}
		h /= 2;
		w /= 2;
		
		var src = arrVideoSources[0];
		var $tagVideo;
		if (src.search(/youtu.be|youtube/i) > -1) {
			$tagVideo = $('<iframe src="'+src+'" width="100%" height="80%" frameborder="0" allowfullscreen></iframe>');			
		}
		else if (src.search(/vimeo.com/i)) {
			$tagVideo = $('<iframe src="'+src+'" width="100%" height="80%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
		}
		
//		var src,
//			ext,
//			type,
//			$tagVideo = $('<video controls autoplay width="320" height="180" />'),
//			tagSrc;
//		for (var i=0,len=arrVideoSources.length; i<len; i++) {
//			src = arrVideoSources[i];
//			ext = src.substring(src.length-3).toUpperCase();
//			switch (ext) {
//			case "M4V":
//				type = 'video/mp4';
//				break;
//			case "OGG":
//				type = 'video/ogg';
//				break;
//			default:
//				continue;
//			}
//			tagSrc = '<source src="'+src+'" type="'+type+'" />';
//			$tagVideo.append(tagSrc);
//		}
//		$tagVideo.append('<span title="No video playback capabilities, please download the video below">Download video</span>');
		
		return $tagVideo;
	},
	
	_makeMediaList: function(arrMedia, props) {
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
			li = $('<a href="#" class="list-group-item"><span class="glyphicon glyphicon-'+glyphs[t.mediaType]+'"></span>&nbsp;&nbsp;&nbsp;'+ utils.extractToHtml(t.label, props) +'</a>');
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
		  		// Add loading icon here
			'</div>'+
		  '<div class="tab-pane" id="gp-moreinfo"></div>'+
		'</div>';
		
//		content = utils.extractToHtml(content, props);
		content = $(content);
		
		var featureId = props[this.options.attrId];
		// Fetch bigpopup config for this feature
		var data = self.options.data[featureId];
		
		// Fill media-tab content
		var list = this._makeMediaList(data.tabMedia, props);
		content.find("#gp-moreinfo").append(list);
		
		var dialogTitle = utils.extractToHtml(data.dialogTitle || props[this.options.dialogTitle], props);
		
		this.dialog = utils.drawDialog(
				dialogTitle,
				content
		);
		this.dialog.on("hidden.bs.modal", function() {
			$(this).empty().remove();
			self.dialog = null;
			delete self.dialog;
		});
		this.dialog.attr("id", "gp-popup");
		
		function onLiTap(e) {
			var index = $(this).index(); // The tag's order corresponds to index in tabMedia array
			var t = data.tabMedia[index];
			var sources = utils.extractToHtml(t.sources, props);
			var content = self._makeMediaContent(t.mediaType, sources.split(","));
			self.showFullScreen(content);
			return false;
		};
		this.dialog.find("#gp-listmoreinfo").find(".list-group-item").on("tap click", onLiTap);
		$("body").append(this.dialog);
		this.dialog.modal();
		
		// Fill intro-tab content after modal dialog has already opened
		var url;
		if (data.tabIntro) {
			// If a path is specified explicitly for this feature
			url = utils.extractToHtml( data.tabIntro, props);			
		}
		else {
			// Use the general path for intro text
			url = utils.extractToHtml(this.options.tabIntroFolderUrl, props);
		}
		this._getIntroContent(url);
	},
	
	_getIntroContent: function(url, props) {
		var div = $('<div />');
		
		smap.cmd.loading(true);
//		utils.extractToHtml(html, props)
		url = this.options.useProxy ? smap.config.ws.proxy + encodeURIComponent(url) : url;
		div.load(url, function() {
			$("#gp-intro").append( utils.extractToHtml($(this).html(), props) );
			smap.cmd.loading(false);
		});
	},
	
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