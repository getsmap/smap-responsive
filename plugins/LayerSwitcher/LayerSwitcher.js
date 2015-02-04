L.Control.LayerSwitcher = L.Control.extend({
	options: {
		pxDesktop: 992,
		toggleSubLayersOnClick: true,
		unfoldOnClick: true,
		olFirst: false,
		unfoldAll: false,
		catIconClass: "fa fa-chevron-right" //fa-chevron-circle-right

	},
	
	_lang: {
		"sv": {
			baselayers: "Bakgrundslager",
			overlays: "Kartskikt",
			close: "Stäng"
		},
		"en": {
			baselayers: "Baselayers",
			overlays: "Overlays",
			close: "Close"
		}
	},
	
	showLayer: function(layerId) {
		return smap.core.layerInst.showLayer(layerId);
	},
	
	hideLayer: function(layerId) {
		smap.core.layerInst.hideLayer(layerId);
	},
	
	_setLang: function(langCode) {
		langCode = langCode || smap.config.langCode || navigator.language.split("-")[0] || "sv";
		if (this._lang) {
			this.lang = this._lang ? this._lang[langCode] : null;
		}
	},

	initialize: function(options) {
		L.setOptions(this, options);
		this._setLang(options.lang);
	},

	onAdd: function(map) {
		this.map = map;
		
		this._container = L.DomUtil.create('div', 'leaflet-control-LayerSwitcher'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		
		this.$container = $(this._container);
		
		// Define functions for row and header tap/click
		this.__onRowTap = this.__onRowTap || $.proxy(this._onRowTap, this);
		this.__onHeaderClick = this.__onHeaderClick || $.proxy(this._onHeaderClick, this);
		this.__onHeaderIconClick = this.__onHeaderIconClick || $.proxy(this._onHeaderIconClick, this);
		this.__onBtnDialogClick = this.__onBtnDialogClick || $.proxy(this._onBtnDialogClick, this);

		this.__onLegendEnter = this.__onLegendEnter || $.proxy(this._onLegendEnter, this);
		this.__onLegendLeave = this.__onLegendLeave || $.proxy(this._onLegendLeave, this);
		this._moveWithCursor = function(e) {
			$(".lswitch-legend-big").css({
				left:  e.pageX+10+"px",
				top:   e.pageY-30+"px"
			});
		};

		this._addPanel();
		this._addLayers(smap.config.bl, smap.config.ol);

		this.options.startOpened = false;
		if (this.options.startOpened) {
			var baseParents = $("#lswitch-olcont, #lswitch-blcont");
			if (this.options.startOpened === 1) {
				baseParents.children(".lswitch-cat").click();
			}
			else if (this.options.startOpened === 2) {
				baseParents.children(".lswitch-cat").next().find(".lswitch-cat").click();
			}
			else if (this.options.startOpened === true) {
				// Open all levels and sublevels
				baseParents.find(".lswitch-cat").click();
			}
		}

		this._addBtn();
		this._bindEvents();
		$("#mapdiv").addClass("lswitch-panelslide");
		
		// Fix for Android 3 and lower (make div scrollable)
		if (L.Browser.android) {  // L.Browser.android23 is better?
			function touchScroll(selector){
			      var scrollStartPos = 0;
			      $(selector).on('touchstart', function(event) {
			        scrollStartPos = this.scrollTop + event.originalEvent.touches[0].pageY;
			      });
			      $(selector).on('touchmove', function(event) {
			        this.scrollTop = scrollStartPos - event.originalEvent.touches[0].pageY;
			      });
			}
			touchScroll($('.lswitch-panel'));
		}
		return this._container;
	},

	onRemove: function(map) {
		// Do everything "opposite" of onAdd – e.g. unbind events and destroy things
		// map.off('layeradd', this._onLayerAdd).off('layerremove', this._onLayerRemove);
	},
	
	_addLayers: function(bls, ols) {
		bls = bls || [];
		ols = ols || [];
		
		var t;
		if (bls.length > 1) {
			for (var i=0,len=bls.length; i<len; i++) {
				t = bls[i];
				t.options.isBaseLayer = true;
				this._addRow(t);
			}
		}
		else {
			$(".lswitch-panel-bl").hide();
		}
		if (ols.length > 0) {
			for (var i=0,len=ols.length; i<len; i++) {
				t = ols[i];
				t.options.isBaseLayer = false;
				if (t.options.showInLayerSwitcher !== false) {
					this._addRow(t);
				}
			}
		}
		else {
			$(".lswitch-panel-ol").hide();
		}

		var b = utils.getBrowser();
		if ( !(b.ie && !b.ieVersion <= 8) ) {

		}
		
		if (bls.length <= 1 && ols.length === 0) {
			// Hide all 
			$(".lswitch-panel span").css("color", "#fff");
		}

		this._setSwitcherPosition();
		this.__setSwitcherPosition = this.__setSwitcherPosition || $.proxy(this._setSwitcherPosition, this);
		$(window).on("resize", this.__setSwitcherPosition);
	},

	_setSwitcherPosition: function() {
		var panelsHeight = 0;
		var lp = $(".lswitch-panel");
		lp.children().each(function() {
			panelsHeight += $(this).outerHeight();
		});

		if (panelsHeight > ( $("#mapdiv").innerHeight() - utils.rmPx( lp.css("padding-top")+20 )) ) {
			// Allow scroll (panel is going outside map)
			lp.css("position", "absolute");
		}
		else {
			// Allow interacting with map "behind" layer switcher (panel is within map and no scroll needed)
			lp.css("position", "relative");
			/*if (b.ie9 || b.ie10 || b.ie11) {
				lp.css({
					"padding-top": "0",
					"margin-top": "0"
				});
			}*/
		}
		var b = utils.getBrowser();
		if (b.ie) {
			lp.css("position", "absolute");
		}
		if ( !(b.ie && !b.ieVersion <= 8) ) {
			this.hidePanel();
		}
	},
	
	_bindEvents: function() {
		var self = this;
		
		$("#mapdiv").on("touchstart click", $.proxy(function() {
			if ( $(window).width() < this.options.pxDesktop) {
				this.hidePanel();
				return false;
			}
		}, this));
		
		// if ( L.Browser.ielt9 ) {
		// 	var self = this;
		// 	this.map.on("click dragstart", function() {
		// 		alert("click/dragstart");
		// 		self.hidePanel();
		// 	});
		// }
		
		var showPanel = $.proxy(this.showPanel, this),
			hidePanel = $.proxy(this.hidePanel, this);
		
		if (L.Browser.touch) {
			$(window).on("orientationchange", function() {
				if (self.$panel.is(":visible")) {
					hidePanel();
				}
			});			
		}
		
		this.map.on("layeradd layerremove", function(e) {
			var layer = e.layer || {};
			if (!layer.options || layer.options._silent || !layer.options.layerId || layer.feature) {
				return;
			}
			var layerId = layer.options.layerId;
			var rowId = self._makeId(layerId);
			var row = $("#"+rowId);
			var isActive = row.hasClass("active");
			if (row.length) {
				if (e.type === "layeradd" && isActive === false) {
					self._onRowTap({target: row});
					// row.addClass("active");						
				}
				else if (e.type === "layerremove" && isActive === true) {
					self._onRowTap({target: row});
					// row.removeClass("active");
				}
			}
		});

		smap.event.on("smap.core.createparams", function(e, p) {
			// Keep this param when creating new params
			var oldP = smap.core.paramInst.getParams();
			if (oldP.LSW) {
				p.lsw = oldP.LSW;
			}
		});
	},
	
	_addBtn: function() {
		var btn = $('<div id="lswitch-btn"><span class="fa fa-bars fa-2x"></span></div>');
		$("#mapdiv").prepend(btn);
		btn.on("mousedown "+L.DomEvent._touchstart, $.proxy(function() {
			if (!this._panelIsSliding) {
				var isVisible = $(".lswitch-panel").hasClass("panel-visible");
				if (isVisible) {
					this.hidePanel();
				}
				else {
					this.showPanel();
				}
			}
			return false;
		}, this));
		btn.on("dblclick", function() {
			return false;
		});

		if (btn.is(":visible")) {
			var p = smap.core.paramInst.getParams();
			if (p.LSW && p.LSW === "1") {
				btn.trigger("mousedown");
			}
		}
	},
	
	_addPanel: function() {
		this.$panel = $('<div class="lswitch-panel unselectable" />');
		// smap.event.on("smap.core.pluginsadded", function() {
		// 	if ( $("body > header.navbar").length ) {
		// 		// If body has an immediate child that is a <header>-tag, with class "navbar",
		// 		// then we assume we need to move the panel content down a little bit.
		// 		$(".lswitch-panel").addClass("panel-with-toolbar");
		// 	}
		// });
		
		this.$panel.on("swipeleft", $.proxy(function() {
			this.hidePanel();
		}, this));
		
		// Allow immeditate scrolling on touch devices by enabling scrolling right after touchstart
		this.$panel.on("touchstart", function() {
			$(this).css("overflow-y", "auto");
		});
		
		this.$list = $(
			'<div class="panel panel-default lswitch-panel-bl">'+
				'<div class="panel-heading">'+this.lang.baselayers+'</div>'+
				'<div id="lswitch-blcont" class="list-group"></div>'+
			'</div>'+
			'<div class="panel panel-default lswitch-panel-ol">'+
				'<div class="panel-heading">'+this.lang.overlays+'</div>'+
				'<div id="lswitch-olcont" class="list-group"></div>'+
			'</div>');
		this.$panel.append(this.$list);
		if (this.options.olFirst && this.options.olFirst === true) {
			this.$panel.prepend( this.$panel.find(".lswitch-panel-ol") );
		}
		$("#maindiv").append( this.$panel );
	},
	
	showPanel: function() {
		var self = this;

		this.$panel.show();
		if (this._panelIsSliding) {
			utils.log("no slide");
			return false;
		}
		this._panelIsSliding = true;
		$("#lswitch-btn span").removeClass("fa-bars").addClass("fa-chevron-left");

		setTimeout(function() {
			$(".lswitch-panel").addClass("panel-visible");
		}, 1);
		setTimeout(function() {
			self._panelIsSliding = false;
		}, 300);
		
		$("#mapdiv").addClass("mapdiv-slidetransition");
		var panelWidth = this.$panel.outerWidth();
		$("#mapdiv").css({
			"margin-left": panelWidth + "px",
			"width": $("#mapdiv").outerWidth() - panelWidth + "px"
		});
		// $("#lswitch-btn").hide();
	},
	
	hidePanel: function() {
		if (this._panelIsSliding) {
			utils.log("no slide");
			return false;
		}
		$("#lswitch-btn span").removeClass("fa-chevron-left").addClass("fa-bars");
		$("#mapdiv").css({
			"margin-left": "0",
			"width": "100%"
		});
		$(".lswitch-panel").removeClass("panel-visible");
		
		$("#maindiv").addClass("lswitch-overflow-hidden");
		setTimeout($.proxy(function() {
			$("#mapdiv").removeClass("mapdiv-slidetransition");
			this._panelIsSliding = false;
			this.$panel.hide();
			$("#maindiv").removeClass("lswitch-overflow-hidden");
			// $("#lswitch-btn").show();
		}, this), 300);
	},
	
	_setBaseLayer: function(layerId) {
		var layers = this.map._layers,
			layer;
		
		// Hide all baselayers
		for (var key in layers) {
			layer = layers[key];
			if (layer && layer.options && layer.options.isBaseLayer) {
				if (layer.options.layerId !== layerId) {
					this.hideLayer(layer.options.layerId);					
				}
			}
		}
		this.showLayer(layerId);
	},

	_onLegendClick: function(e) {
		$(this).parent().trigger("tap");
		return false;
	},
	
	_onRowTap: function(e) {
		
		var tag = $(e.target);
		
		var theId = tag.attr("id");
		var layerId = this._unMakeId(theId),
			isBaseLayer = $("#"+theId).parents("#lswitch-blcont").length > 0;
		
		if (isBaseLayer) {
			// tag.siblings().removeClass("active");
			$("#lswitch-blcont").find("a.active").removeClass("active");
			tag.addClass("active");
			this._setBaseLayer(layerId);
			return false;
		}
		tag.toggleClass("active");
		
		// Toggle active class of all parent headers (just as an indication that the headers have active children)
		
		// if (this.options.toggleSubLayersOnClick) {
		var isActive = tag.hasClass("active");
		var parentConts = tag.parents(".lswitch-catcont");
		parentConts.each(function() {
			if (isActive) {
				$(this).prev().addClass("active");
			}
			else {
				if ( $(this).find("a.list-group-item.active").length > 0 ) {
					// Don't deactivate if there are other active layers
					return false;
				}
				$(this).prev().removeClass("active");
			}
		});
		// }
		var isActive = tag.hasClass("active");
		
		if ( isActive ) {
			// Show layer
			var t = tag.data("t") || null; // Allow to store layer config in a custom way (not requiring to be present in config file)
			var layer = this.showLayer(t || layerId);
			// if (t.options.zoomToExtent) {
			// 	layer.on("load", function() {
			// 		this._map.fitBounds(this.getBounds());
			// 	});
			// }

		}
		else {
			// Hide layer
			this.map.closePopup();
			this.hideLayer(layerId);
		}
		return false;
	},
	
	_makeId: function(layerId) {
		return "lswitchrow-" + encodeURIComponent(layerId).replace(/%/g, "--pr--");
	},
	_unMakeId: function(theId) {
		return decodeURIComponent( theId.replace("lswitchrow-", "").replace(/--pr--/g, "%") );
	},

	_toggleHeader: function(header) {
		header.next().toggleClass('lswitch-catcont-visible');
		header.toggleClass('open');
	},

	_onHeaderClick: function(e, options) {
		options = options || {};

		var self = this;
		var tag = e.target;
		if (tag.tagName === "A" || tag.tagName === "SPAN") {
			tag = $(tag).parent();
		}
		else {
			tag = $(tag);
		}
		var cont = tag.next();
		if (this.options.unfoldOnClick && (this.options.unfoldAll || !options.isSubHeader)) {
			this._toggleHeader(tag);
		}

		if (!this.options.toggleSubLayersOnClick && this.options.unfoldOnClick && this.options.unfoldAll) {
			cont.find("div.list-group-item").each(function() {
				h = $(this);
				var thisIsOpen = tag.hasClass("open"),
					thatIsOpen = h.hasClass("open");
				if (thisIsOpen !== thatIsOpen) {
					self._toggleHeader(h);
				}
			});
		}

		if (this.options.toggleSubLayersOnClick) {
			// Render cat header as active or inactive (toggle)

			var headerIsActive = tag.hasClass("active"),
				headerIsOpen = tag.hasClass("open"),
				rowIsActive,
				row;

			if (this.options.unfoldOnClick && headerIsOpen === headerIsActive && !options.isSubHeader) {
				headerIsActive = !headerIsActive;
			}
			else {
				tag.toggleClass("active");
			}

			cont.children(".list-group-item").each(function() {
				row = $(this);
				rowIsActive = row.hasClass("active");
				if (row[0].tagName === "A" && headerIsActive === rowIsActive) {
					self._onRowTap({target: row});
				}
				else if (row[0].tagName === "DIV" && headerIsActive === rowIsActive) {
					self._onHeaderClick({target: row}, {isSubHeader: true});
				}
			});
		}
		if ( $(window).width() > this.options.pxDesktop) {
			this._setSwitcherPosition(); // Check whether position relative or absolute (affects scroll)
		}
		else {
			// We are in a mobile environment … always allow scroll (no map to interact with behind the switcher)
			$(".lswitch-panel").css("position", "absolute");
		}
		return false;
	},

	_onHeaderIconClick: function(e) {
		var icon = $(e.target);
		this._toggleHeader(icon.parent());
		return false;
	},

	_onBtnDialogClick: function(e) {
		var o = $(e.target).parents(".list-group-item:first").data("t").options,
			body = "";
		var dialogContent = o.dialog;
		if (dialogContent.substring(0, 4) === "http" || dialogContent.substring(0, 2) === "//") {
			// We are dealing with a URL
			body = '<div class="modal-body-container"><iframe frameborder="0" scrolling="auto" src="'+dialogContent+'" width="100%" height="100%" style="position:absolute;left:0;top:0;margin:0;padding:0;" frameborder="0"></iframe></div>';
		}
		var footerContent = '<button type="button" class="btn btn-default" data-dismiss="modal">'+this.lang.close+'</button>';
		var d = utils.drawDialog(o.displayName, body, footerContent, {});
		d.addClass("lswitch-dialog");
		d.modal("show");

		var h = $("#mapdiv").height();
		h = h > 500 ? 500 : h; // set max height
		d.find(".modal-body").css({
			"min-height": h+"px"
		});
		d.on("hidden.bs.modal", function() {
			$(this).empty().remove();
		});
		return false;
	},

	_addBtnDialog: function(row, t) {
		var self = this;
		var btn = $('<span class="fa fa-info-circle lswitch-btndialog" aria-hidden="true"></span>');
		btn.on("click touchstart", this.__onBtnDialogClick);
		row.prepend(btn);
	},

	_addLegend: function(row, src) {
		var img = $('<img class="lswitch-legend" src="'+src+'" />');
		img
			.on("tap", this._onLegendClick)
			.on("mouseenter", this.__onLegendEnter)
			.on("mouseleave", this.__onLegendLeave);
		row.prepend(img);
	},

	_onLegendLeave: function() {
		$(".lswitch-legend-big").remove();
		$(document).off("mousemove", this._moveWithCursor);
	},

	_onLegendEnter: function(e) {
		var $this = $(e.target);
		var t = $this.parent().data("t");
		var src = t.options.legendBig || t.options.legend;
		$(".lswitch-legend-big").remove();
		var img = $('<img class="lswitch-legend-big" src="'+src+'" />');
		$(document).on("mousemove", this._moveWithCursor);
		$("body").append(img);
	},
	
	_addRow: function(t) {

		var catIconClass = this.options.catIconClass;

		var self = this;
		var o = t.options;
		var row = $('<a class="list-group-item">'+o.displayName+'</a>');
		row.attr("id", this._makeId(o.layerId));
		row.on("tap", this.__onRowTap);
		row.data("t", t); // Faster to fetch than fetching from config on click
		
		if (o.legend && !L.Browser.touch) {
			this._addLegend(row, o.legend);
		}
		if (o.dialog) {
			this._addBtnDialog(row, t);
		}

		var parentTag;
		if (o.isBaseLayer) {
			parentTag = $("#lswitch-blcont");
		}
		else {
			parentTag = $("#lswitch-olcont");
		}
		if (o.category) {
			var cats = o.category,
				catHeader, catContainer, catName;

			// Recursively add a category container inside another category container
			// and at the end - add the row to the category container.
			function addToCat(_cats, index, _parentTag) {
				catName = _cats[index];
				catHeader = _parentTag.find('.lswitch-cat:has(span:contains("'+catName+'"))');
				if (!catHeader.length) {
					catHeader = $('<div class="list-group-item lswitch-cat"><i class="'+catIconClass+'"></i><span>'+catName+'</span></div>')
						.appendTo(_parentTag);
					catContainer = $('<div class="lswitch-catcont"></div>');
					catHeader.after(catContainer);
					catHeader.on("tap", self.__onHeaderClick);
					catHeader.find("i").on("tap", self.__onHeaderIconClick);
				}
				else {
					catContainer = catHeader.next();
				}
				if (_cats.length > index + 1) {
					// Add another sub-catheader
					return addToCat(_cats, index+1, catContainer);
				}
				else {
					// We're done – finally add the row to the container
					catContainer.append(row);
					return true;
				}

			}
			addToCat(cats, 0, parentTag); // Start digging down the hierarchies

		}
		else {
			parentTag.append(row);
		}
		return row;

	}
});


// Do something when the map initializes (example taken from Leaflet attribution control)

//L.Map.addInitHook(function () {
//	if (this.options.attributionControl) {
//		this.attributionControl = (new L.Control.LayerSwitcher()).addTo(this);
//	}
//});


/*
 * This code just makes removes the need for
 * using "new" when instantiating the class. It
 * is a Leaflet convention and should be there.
 */
L.control.layerSwitcher = function (options) {
	return new L.Control.LayerSwitcher(options);
};