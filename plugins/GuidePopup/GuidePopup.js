L.Control.GuidePopup = L.Control.extend({
	options: {},

	initialize: function(options) {
		L.setOptions(this, options);
		this._setLang();
	},
	
	_lang: {
		"sv": {
			introHeader: "Info",
			mediaHeader: "Media",
			accessHeader: "Tillgänglighet",
			close: "Stäng",
			showMore: "Visa mer",
			clickToSee: "Klicka för mer info",
			loadingPic: "Hämtar bild",
			tipClickForFullScreen: "Klicka för fullskärmsbild"
		},
		"en": {
			introHeader: "About",
			mediaHeader: "Media",
			accessHeader: "Accessibility",
			close: "Close",
			showMore: "Read more",
			loadingPic: "Loading photo",
			clickToSee: "Click for more info",
			picFullScreenTitle: "Slideshow",
			tipClickForFullScreen: "Click for full-screen photo"
		}
	},
	
	_setLang: function(langCode) {
		langCode = langCode || smap.config.langCode || navigator.language.split("-")[0] || "en";
		if (this._lang) {
			this.lang = this._lang ? this._lang[langCode] : null;
		}
	},

	onAdd: function(map) {
		this.map = map;
		
		this._container = L.DomUtil.create('div', 'leaflet-control-guidepopup'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		
		// Use $ prefix for all jQuery objects to make it easier to sort out all
		// jQuery dependencies when sharing the code in future.
		this.$container = $(this._container);
		
		// Define proxy functions
		this.__onPopupClick = this.__onPopupClick || $.proxy(this._onPopupClick, this);
		
		var self = this;
		self._activate();
		// smap.event.on("smap.core.applyparams", function() {
		// });

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
		var t = this._getFeatureData(props[this.options.attrId]);
		var tabMedia = t.tabMedia,
			tabIntro = t.tabIntro;
		if (tabIntro) {   //tabMedia && tabMedia instanceof Array) {
			this.createPopup(props);
		}
		else if (tabMedia && tabMedia instanceof Object) {
			// Show media in full-screen at once
			var content = this._makeMediaContent(tabMedia.mediaType, utils.extractToHtml(tabMedia.sources, props).split(","));
			var mediaPic;
			if (t.mediaType !== "image") {
				mediaPic = utils.extractToHtml(t.fullScreenIntroPic, props);
			}
			this.showFullScreen(content, utils.extractToHtml(tabMedia.label, props), mediaPic);
		}
		
		// On media icons click - open media tab when dialog opens
		if ($(e.target).hasClass("gp-mediaicons") || $(e.target).parent().hasClass("gp-mediaicons")) {
			$('[href="#gp-moreinfo"]').click();
		}
		return false;
	},
	
	
	_onPopupOpen: function(e) {
		// This is essentially what binds a WFS layer to this module.
		// Currently, all vector layers will be bound since no check
		// against any "guideLayerId" is done.
		if (e.popup._source && e.popup._source.feature) {
			var layerId = e.popup._source.feature.layerId;
			// if (layerId !== this.options.layerId) {
			// 	return;
			// }
			var props = e.popup._source.feature.properties;
			e.popup.options.autoPanPaddingTopLeft = [0, 60]; // Does this work?

//			this.layerId = e.popup.layerId;
//			this.properties = props; // properties for filling the dialog
			
			$(".leaflet-popup-content").find(".gp-mediaicons").on("touchstart click", this.__onPopupClick);
			var t = this._getFeatureData(props[this.options.attrId]);
			if (t && t instanceof Object) {
				var btn = $('<button style="margin-top:10px;" id="gp-btn-show" class="btn btn-default">'+this.lang.showMore+'</button>');
				$(".leaflet-popup-content").append(btn);
				btn.data("props", props);
				btn.on("touchstart click", this.__onPopupClick);
				$(".leaflet-popup-content img").on("touchstart click", this.__onPopupClick).css("cursor", "pointer").tooltip({
					title: this.lang.clickToSee
				});
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
						iconSize:	 [22, 21],
						iconAnchor:   [11, 10],
						popupAnchor:  [0, -8]
					})
				},
				video: {
					icon:L.icon({
						iconUrl: "img/glyphish-icons/PNG-icons/46-movie-2.png",
						iconSize:	 [20, 25],
						iconAnchor:   [10, 12],
						popupAnchor:  [0, -9]
					})
				},
				image: {
					icon:L.icon({
						iconUrl: "img/glyphish-icons/PNG-icons/121-landscape.png",
						iconSize:	 [22, 21],
						iconAnchor:   [11, 10],
						popupAnchor:  [0, -8]
					})
				}
		};

		var icons = {
				audio: {
					icon:L.icon({
						iconUrl: "img/glyphish-icons/PNG-icons/120-headphones.png",
						iconSize:	 [22, 21],
						iconAnchor:   [11, 10],
						popupAnchor:  [0, -8]
					})
				},
				video: {
					icon:L.icon({
						iconUrl: "img/glyphish-icons/PNG-icons/46-movie-2.png",
						iconSize:	 [20, 25],
						iconAnchor:   [10, 12],
						popupAnchor:  [0, -9]
					})
				},
				image: {
					icon:L.icon({
						iconUrl: "img/glyphish-icons/PNG-icons/121-landscape.png",
						iconSize:	 [22, 21],
						iconAnchor:   [11, 10],
						popupAnchor:  [0, -8]
					})
				}
		};

		var o, t;
		var ols = smap.config.ol || [];
		for (var i=0,len=ols.length; i<len; i++) {
			o = ols[i].options;
			if (o.params && o.params.q) {
				// Our definition of a guide layer...
				o.pointToLayer = function(f, latLng) {
					var props = f.properties || {};
					var t = self.options.modalContentOverrides[ props[self.options.attrId] ] || {};
					var m = t.tabMedia;
					if (t.iconType && icons[t.iconType]) {
						return L.marker(latLng, icons[t.iconType]);
					}
					else {
						return L.marker(latLng);
					}
				};
			}
		}
		// var layerId = layer.options.layerId;
		// var layerConfig = smap.cmd.getLayerConfig(layerId);
		
		// layerConfig.options.pointToLayer = function(f, latLng) {
		// 	var props = f.properties || {};
		// 	var t = self.options.modalContentOverrides[ props[self.options.attrId] ] || {};
		// 	var m = t.tabMedia;
		// 	if (t.iconType && icons[t.iconType]) {
		// 		return L.marker(latLng, icons[t.iconType]);
		// 	}
		// 	else {
		// 		return L.marker(latLng);
		// 	}
		// };


		// this.map.on("layeradd", this._onLayerAdd, this);
	
		// var layerConfig = smap.cmd.getLayerConfig(this.options.layerId);
		// layerConfig.options.pointToLayer = function(f, latLng) {
		// 	var props = f.properties || {};
		// 	var t = self.options.modalContentOverrides[ props[self.options.attrId] ] || {};
		// 	var m = t.tabMedia;
		// 	if (t.iconType && icons[t.iconType]) {
		// 		return L.marker(latLng, icons[t.iconType]);
		// 	}
		// 	else {
		// 		return L.marker(latLng);
		// 	}
		// };
		// var layer = smap.cmd.addLayerWithConfig(layerConfig);


		// this.__onPopupOpen = this.__onPopupOpen || $.proxy(this._onPopupOpen, this);
		// this.__onPopupClose = this.__onPopupClose || $.proxy(this._onPopupClose, this);
		
		this.map.on("popupopen", this._onPopupOpen, this);
		this.map.on("popupclose", this._onPopupClose, this);
	},
	
	_deactivate: function() {
		this.map.off("popupopen", this.__onPopupOpen);
		this.map.off("popupclose", this.__onPopupClose);
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
		
		// Append everything…
		$carousel.append($inner);
		
		if (arrImageSources.length > 1) {
			// … but only append swipe controls if more than one pic
			$carousel.prepend($indicators);
			$carousel.append($controls);
			$carousel
				.swiperight(function() {  
					$(this).carousel('prev');
				})
				.swipeleft(function() {  
					$(this).carousel('next');  
				});
		}
		
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
			$tagAudio = $('<audio controls="controls" />'),
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
			$tagVideo = $('<iframe src="'+src+'?rel=0" width="100%" height="80%" frameborder="0" allowfullscreen></iframe>');			
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
	
	_makeAccessContent: function(props) {
		var d = this._getFeatureData(props[this.options.attrId])
		return utils.extractToHtml(d.tabAccess, props);
	},
	
	_makeMediaList: function(arrMedia, props) {
		arrMedia = arrMedia || [];

		if (!arrMedia.length) {
			return null;
		}
		
		var glyphs = {
				image: "fa fa-picture-o fa-lg",
				audio: "fa fa-volume-up fa-lg",
				video: "fa fa-film fa-lg"
				
		};
		var t,i,li,
			list = $('<div id="gp-listmoreinfo" class="list-group" />');
		for (i=0,len=arrMedia.length; i<len; i++) {
			t = arrMedia[i];
			if (!t.condition || (t.condition && t.condition(props) === true)) {
				li = $('<a href="#" class="list-group-item"><span class="'+glyphs[t.mediaType]+'"></span>&nbsp;&nbsp;&nbsp;'+ utils.extractToHtml(t.label, props) +'</a>');
				li.data("mediaType", i);
				list.append(li);
			}
		}
		return list.children().length ? list : null;
	},
	
	showFullScreen: function(content, titleText, picSrc) {
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
			$(".gp-fullscreen").find("audio").each(function() {
				if (this.pause) {
					this.pause();
				}
			});
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
		var title = '<h1>'+titleText+'</h1>';
		div.append(title);
		if (picSrc) {
			var pic = $('<img class="gp-mediapic" src="'+picSrc+'" />');
			div.append(pic);			
		}
		div.append(content);
		div.append(btnClose);
		btnClose.css("z-index", 3000);
		$("body").append(div);
		setTimeout(function() {
			div.addClass("gp-fs-visible");			
		}, 50);
	},
	
	
	_makeMediaContent: function(mediaType, sources) {
		var content;
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

	_getFeatureData: function(featureId) {
		// featureId is optional
		var fData = this.options.modalContentOverrides[featureId] || {};
		return $.extend(true, {}, this.options.modalContent || {}, fData);
	},
	
	createPopup: function(props) {
		props = props || {};
		
		var self = this;
		
		var content = 
		'<ul class="nav nav-tabs">' +
			'<li class="active"><a href="#gp-intro" data-toggle="tab">'+this.lang.introHeader+'</a></li>'+
			'<li><a href="#gp-moreinfo" data-toggle="tab">'+this.lang.mediaHeader+'</a></li>'+
			'<li><a href="#gp-access" data-toggle="tab">'+this.lang.accessHeader+'</a></li>'+
		'</ul>'+
		'<div class="tab-content gp-popup">'+
		  '<div class="tab-pane active" id="gp-intro">'+
		  		// Add loading icon here
			'</div>'+
		  '<div class="tab-pane" id="gp-moreinfo"></div>'+
		  '<div class="tab-pane" id="gp-access"></div>'+
		'</div>';
		
//		content = utils.extractToHtml(content, props);
		content = $(content);
		
		// Fetch bigpopup config for this feature
		var data = this._getFeatureData(props[this.options.attrId]);
		
		// Fill media-tab content
		var list = this._makeMediaList(data.tabMedia, props);
		if (list) {
			content.find("#gp-moreinfo").append(list);
		}
		else {
			content.find('[href="#gp-moreinfo"], #gp-moreinfo').remove();
		}
		
		// Fill access-tag content
		var accessContent = this._makeAccessContent(props);
		if (accessContent) {
			content.find("#gp-access").append(accessContent);
		}
		else {
			content.find('[href="#gp-access"], #gp-access').remove();
		}
		
		
		var dialogTitle = utils.extractToHtml(data.dialogTitle || props[this.options.dialogTitle], props);
		var btnClose = '<button type="button" class="btn btn-default" data-dismiss="modal">'+this.lang.close+'</button>';

		this.dialog = utils.drawDialog(
				dialogTitle,
				content,
				btnClose
		);
		this.dialog.on("hidden.bs.modal", function() {
			$(this).empty().remove();
			self.dialog = null;
			delete self.dialog;
		});
		this.dialog.attr("id", "gp-popup");
		
		function onLiTap(e) {
			var index = $(this).data("mediaType");
			var t = data.tabMedia[index];
			var sources = utils.extractToHtml(t.sources, props);
			var content = self._makeMediaContent(t.mediaType, sources.split(","));
			var mediaPic;
			if (t.mediaType === "audio") {
				mediaPic = utils.extractToHtml(data.fullScreenIntroPic, props);
			}
			self.showFullScreen(content, $(this).text(), mediaPic);
			return false;
		};
		this.dialog.find("#gp-listmoreinfo").find(".list-group-item").on("tap click", onLiTap);
		$("body").append(this.dialog);
		this.dialog.modal();
		
		// Fill intro-tab content after modal dialog has already opened
		if (data.tabIntro) {
			var tabIntro = utils.extractToHtml(data.tabIntro, props);
			if (tabIntro.substring(0, 4).toUpperCase() === "HTTP") {
				// We are dealing with a URL
				this._getData(tabIntro, function() {
					$("#gp-intro").append(utils.extractToHtml($(this).html(), props));
					smap.cmd.loading(false);
				});
			}
			else {
				// We are dealing with HTML
				var $tabIntro = $("<div />").append(tabIntro);
				$tabIntro.find("img").each(function() {
					utils.addImageLoadIndicator( $(this), {
						height: "150px"
					});
				});
				$tabIntro.find("img").on("click tap", function() {
					var $fsContent = self._makeCarousel( [$(this).prop("src")] );
					self.showFullScreen($fsContent, dialogTitle);
				}).prop("title", this.lang.tipClickForFullScreen).tooltip();
				$("#gp-intro").append($tabIntro);
			}
		}
	},
	
	_getData: function(url, callback) {
		var div = $('<div />');
		
		smap.cmd.loading(true);
//		utils.extractToHtml(html, props)
		url = this.options.useProxy ? smap.config.ws.proxy + encodeURIComponent(url) : url;
		div.load(url, callback);
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
