L.Control.LayerSwitcher = L.Control.extend({
	options: {
		pxDesktop: 992,
		toggleSubLayersOnClick: false,
		unfoldOnClick: true,
		olFirst: false,
		unfoldAll: false,
		btnHide: true,
		zoomToExtent: false,
		showTooltip: false, // Can also be a number which is then ms of visibility
		hoverTooltip: true, // Show tooltip on hover
		showTooltipOnCollapse: false, // Show tooltip (once only) when the layerswitcher is collapsed
		catIconClass: "fa fa-chevron-right", //fa-chevron-circle-right
		contentAsIframe: true, // If false, html with popup-content is extracted from url and displayed directly in modal 
		getFitBoundsOptions: function() {
			// Adapts zoom to extent options (default function prevents the 
			// layer switcher from covering markers).
			var o = {
				paddingTopLeft: [0, 0]
			};
			if ( $(".lswitch-panel:visible").length) {
				// Adapt extent so markers don't appear under the layer switcher.
				o.paddingTopLeft[0] = 330;
			}
			return o;
		}

	},
	
	_lang: {
		"sv": {
			baselayers: "Bakgrundslager",
			overlays: "Kartskikt",
			close: "Stäng",
			hide: "Göm",
			btnHideTooltip: "Göm lagerväljaren",
			btnShowTooltip: "Visa lagerväljaren",
			layerSwitcher: "Lagerväljare",
			btnToggleTooltip: "Lagerväljare"
		},
		"en": {
			baselayers: "Baselayers",
			overlays: "Overlays",
			close: "Close",
			hide: "Hide",
			btnHideTooltip: "Hide layer switcher",
			btnShowTooltip: "Show layer switcher",
			layerSwitcher: "Layer switcher",
			btnToggleTooltip: "Layer switcher"
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
		console.log('layerswitcher');
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

		var self = this;
		this._moveWithCursor = function(e) {
			if ( !$("body").find(".lswitch-legend-big").length ) {
				$("body").append(self._hoverImg);
			}
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

		// var b = utils.getBrowser();
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
		if ( !utils.isTouchOnly() && !(b.ie && b.ieVersion <= 8)) {
			// Don't attempt to hide panel if touch device or old IE.
			// For touch devices, resize cannot be done. And "orientationchange" 
			// will take care of closing the switcher when that happens.
			this.hidePanel();
		}
		if ( $("#lswitch-btn:visible").length && this.options.showTooltipOnCollapse && !this._btnToggleTooltipShown) {
			this._showBtnTooltip(this.lang.btnToggleTooltip, this.options.optionShowTooltip);
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
		
		if (utils.isTouchOnly()) {
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
					self.onRowTap(row);
					// row.addClass("active");						
				}
				else if (e.type === "layerremove" && isActive === true) {
					self.onRowTap(row);
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
		
		var autoOpenSwitcher = function() {
			// smap.event.off("smap.core.pluginsadded", autoOpenSwitcher);
			if ( $(window).width() > self.options.pxDesktop ) {
				return false;
			}
			var p = smap.core.paramInst.getParams();
			if (p.LSW && parseInt(p.LSW) === 1) {
				// We need a timeout here – or the switcher will not open (_panelIsSliding == true).
				// The timeout needs to be as long as the transition time 
				// (closing the switcher). The reason is, when starting the map
				// on a small screen, the switcher is hiding, which takes 300 ms.
				setTimeout(function() {
					$("#lswitch-btn").trigger("mousedown");
				}, 310);
			}
		};
		smap.event.on("smap.core.pluginsadded", autoOpenSwitcher);
	},
	
	_addBtn: function() {
		var btn = $('<div id="lswitch-btn" class="lswitch-btn-outslided"><span class="fa fa-angle-right"></span></div>');
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
		if ( this.options.hoverTooltip && !utils.isTouchOnly() ) {
			btn.on("mouseenter", (function() {
				this._isHoveringToggleBtn = true;
				this._bindToggleBtnPopover(this.lang.btnToggleTooltip);
				$("#lswitch-btn").tooltip("show");

			}).bind(this));

			btn.on("mouseleave", (function() {
				$("#lswitch-btn").tooltip("hide");
				this._isHoveringToggleBtn = false;
			}).bind(this));
		}
		var self = this;
		var optionShowTooltip = this.options.showTooltip || false;
		var btnToggleTooltip = this.lang.btnToggleTooltip;
		setTimeout(function() {
			$("#lswitch-btn").removeClass("lswitch-btn-outslided");
			if (optionShowTooltip) {
				self._showBtnTooltip(btnToggleTooltip, optionShowTooltip);
			}
		}, 800);

	},

	/**
	 * Bind a popover for the toggle button. To be shown either
	 * automatically or on hover.
	 * 
	 * @return {[type]} [description]
	 */
	_bindToggleBtnPopover: function(text) {
		// $("#lswitch-btn").popover("destroy");
		if (!$("#lswitch-btn").data('bs.tooltip')) {
			$("#lswitch-btn").tooltip({
				title: text,
				trigger: "manual",
				placement: "right"
			});
		}
	},

	_showBtnTooltip: function(text, ms) {
		if ( !$("#lswitch-btn:visible").length ) {
			return;
		}
		this._btnToggleTooltipShown = true;
		var self = this;
		setTimeout(function() {
			if (!self._isHoveringToggleBtn) {
				self._bindToggleBtnPopover(text);
				$("#lswitch-btn").tooltip("show");
				setTimeout(function() {
					if (!self._isHoveringToggleBtn) {
						$("#lswitch-btn").tooltip("destroy");
					}
				}, typeof ms === "number" ? ms : 3000);
			}
		}, 1000);
	},
	
	_addPanel: function() {
		var self = this;

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
				'<div class="panel-heading"><span>'+this.lang.baselayers+'</span></div>'+
				'<div id="lswitch-blcont" class="list-group"></div>'+
			'</div>'+
			'<div class="panel panel-default lswitch-panel-ol">'+
				'<div class="panel-heading"><span>'+this.lang.overlays+'</span></div>'+
				'<div id="lswitch-olcont" class="list-group"></div>'+
			'</div>');
		this.$panel.append(this.$list);
		if (this.options.olFirst && this.options.olFirst === true) {
			this.$panel.prepend( this.$panel.find(".lswitch-panel-ol") );
		}
		if (this.options.btnHide) {
			var $btn = $('<button title="'+this.lang.btnHideTooltip+'" type="button" class="lswitch-btnhide btn btn-default"><i class="fa fa-chevron-down"></i></button>');   //'+this.lang.hide+'
			this.$panel.find(".panel-heading:first").append( $btn );

			function setTooltip($theBtn, text) {
				// $(".tooltip").tooltip("destroy");
				$theBtn.tooltip("destroy"); // Doesn't work for me! tag not removed from dom. TODO: Check if newer version of Bootstrap solves it.
				$(".tooltip").remove(); // Fix for previous row mal function.
				$theBtn.prop("title", text);
				$theBtn.tooltip({placement: "right", text: text, container: "#maindiv"});
			}
			setTooltip($btn, this.lang.btnHideTooltip);
			var oldText = $btn.parent().text();

			var working = false;
			$btn.on("tap click", function() {
				var $this = $(this);
				if (working) {
					return false;
				}
				var className = "rotate-90";
				var icon = $this.find("i");
				if (icon.hasClass(className)) {
					// Showing
					icon.removeClass(className);
					$(".lswitch-panel").removeClass("lswitch-displaynone");
					$this.prev().text(oldText);
					// $(".lswitch-panel .panel-heading span").removeClass("slipout-anim").addClass("slipout-anim");
					setTimeout(function() {
						$(".lswitch-panel").removeClass("lswitch-hidden");
					}, 1);
					setTooltip($this, self.lang.btnHideTooltip);
				}
				else {
					// Hiding
					working = true;
					icon.addClass(className);
					$(".lswitch-panel").addClass("lswitch-hidden");
					setTooltip($this, self.lang.btnShowTooltip);
					$this.prev().text(self.lang.layerSwitcher);
					setTimeout(function() {
						$(".lswitch-panel").addClass("lswitch-displaynone");
						working = false;
					}, 200);
				}
				return false;
			});
		}
		$("#maindiv").append( this.$panel );
	},
	
	showPanel: function() {
		var self = this;

		this.$panel.show();
		if (this._panelIsSliding) {
			return false;
		}
		this._panelIsSliding = true;
		$("#lswitch-btn span").addClass("lsw-angle-turned");

		setTimeout(function() {
			$(".lswitch-panel").addClass("panel-visible");
		}, 1);
		setTimeout(function() {
			self._panelIsSliding = false;
			// $("#mapdiv").addClass("mapdiv-lsw-visible"); // blur mapdiv
		}, 300);
		
		$("#mapdiv").addClass("mapdiv-slidetransition");
		$("#maindiv").addClass("lswitcher-slidetransition");
		var panelWidth = this.$panel.outerWidth();
		$("#mapdiv").css({
			"margin-left": panelWidth + "px",
			"width": $("#mapdiv").outerWidth() - panelWidth + "px"
		});
		// $("#lswitch-btn").hide();
	},
	
	hidePanel: function() {
		if (this._panelIsSliding) {
			return false;
		}
		this._panelIsSliding = true;
		$("#lswitch-btn span").removeClass("lsw-angle-turned");
		$("#mapdiv").css({
			"margin-left": "0",
			"width": "100%"
		});
		$(".lswitch-panel").removeClass("panel-visible");
		
		$("#maindiv").addClass("lswitch-overflow-hidden");
		$("#maindiv").removeClass("lswitcher-slidetransition");
		setTimeout($.proxy(function() {
			$("#mapdiv").removeClass("mapdiv-slidetransition");
			this._panelIsSliding = false;
			this.$panel.hide();
			$("#maindiv").removeClass("lswitch-overflow-hidden");
			// $("#mapdiv").removeClass("mapdiv-lsw-visible"); // remove blur mapdiv
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
		var $tag = $(e.target);
		if ($tag.hasClass("list-group-item")) {
			this.onRowTap($tag);
			return false;
		}
	},


	onRowTap: function($tag) {
		var theId = $tag.attr("id");
		var layerId = this._unMakeId(theId),
			isBaseLayer = $("#"+theId).parents("#lswitch-blcont").length > 0;
		
		if (isBaseLayer) {
			// $tag.siblings().removeClass("active");
			$("#lswitch-blcont").find("a.active").removeClass("active");
			$tag.addClass("active");
			this._setBaseLayer(layerId);
			return false;
		}
		$tag.toggleClass("active");
		
		// Toggle active class of all parent headers (just as an indication that the headers have active children)
		
		// if (this.options.toggleSubLayersOnClick) {
		var isActive = $tag.hasClass("active");
		var parentConts = $tag.parents(".lswitch-catcont");
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
		var isActive = $tag.hasClass("active");
		
		var layer;
		if ( isActive ) {
			// Show layer
			var t = $tag.data("t") || null; // Allow to store layer config in a custom way (not requiring to be present in config file)
			layer = this.showLayer(t || layerId);

			var fitBoundsOptions = this.options.getFitBoundsOptions ? this.options.getFitBoundsOptions() : null;
			// Adaptation for zooming to extent of layer
			if ( (this.options.zoomToExtent || (t && t.options && t.options.zoomToExtent)) && !this._sumBounds && layer.getBounds) {
				// This means, we are not in the process of summing up many layers' bounds
				// so we can safely zoom to bounds of this layer.
				if ($.isEmptyObject(layer._layers)) {
					layer.once("load", function(e) {
						e.layer._map.fitBounds(layer.getBounds(), fitBoundsOptions);
					});
				}
				else {
					this.map.fitBounds(layer.getBounds(), fitBoundsOptions);
				}
			}
		}
		else {
			// Hide layer
			this.map.closePopup();
			layer = this.hideLayer(layerId);
		}
		return layer;
		
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

		if (this.options.toggleSubLayersOnClick && tag.parents("#lswitch-blcont").length === 0) {
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


			// Adaptation for zooming to extent of all sub-layers
			var def, funcAddExtent;
			this._sumBounds = null;
			if (this.options.zoomToExtent && !headerIsActive && !this._sumBounds) {
				def = $.Deferred();
				def.done(function() {
					if (self._sumBounds.isValid()) {
						self.map.fitBounds(self._sumBounds, self.options.getFitBoundsOptions ? self.options.getFitBoundsOptions() : null);
					}
					self._rowCount = null;
					self._sumBounds = null;
				});
				this._rowCount = this._rowCount || cont.find("a.list-group-item").length;
				this._sumBounds = L.latLngBounds([]);
				funcAddExtent = function(layer, def) {
					this._rowCount -= 1;
					this._sumBounds.extend(layer.getBounds());
					if (this._rowCount === 0) {
						def.resolve();
					}
				};

			}
			cont.children(".list-group-item").each(function() {
				row = $(this);
				rowIsActive = row.hasClass("active");
				if (row[0].tagName === "A" && headerIsActive === rowIsActive) {
					var layer = self.onRowTap(row);
					if (self._sumBounds && layer.getBounds) {
						if ($.isEmptyObject(layer._layers) === true) {
							layer.once("load", function() {
								funcAddExtent.call(self, layer, def);
							});
						}
						else {
							funcAddExtent.call(self, layer, def);
						}
					}
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
		var footerContent = '<button type="button" class="btn btn-default" data-dismiss="modal">'+this.lang.close+'</button>';
		var body = '';
		var d = utils.drawDialog(o.displayName, body, footerContent, {});
		var dBody = d.find(".modal-body");
		d.addClass("lswitch-dialog");

		if (dialogContent.substring(0, 4) === "http" || dialogContent.substring(0, 2) === "//") {
			// We are dealing with a URL
			if (this.options.contentAsIframe) {
				dBody.append('<div class="modal-body-container"><iframe frameborder="0" scrolling="auto" src="'+dialogContent+'" width="100%" height="100%" style="position:absolute;left:0;top:0;margin:0;padding:0;" frameborder="0"></iframe></div>');
			}
			else {
				this._htmlToDialog(dialogContent, d);
			}
		}

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

	_htmlToDialog: function(path, target) {
		$.get(path, function(data) {
			// Replace all relative paths in src-attributes.
			var baseURL = path.match(/.*\//)[0]; //removes filename from end of URL
			data = data.split('\n').map(function(x) {
				var filePath = (x.match(/src="(?!http)(.*?)"/) != null) ? x.match(/src="(.*?)"/)[1]: '';
				//remove all scripts from page
				x = x.replace(/<script.*\/script>/, ''); 
				return x.replace(/src="(.*?)"/, 'src="' + baseURL + filePath + '"');
			}).join('\n');

			target.find(".modal-body").append(data)
		});
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
		delete this._hoverImg;
		var img = $('<img class="lswitch-legend-big" src="'+src+'" />');
		this._hoverImg = img;
		$(document).on("mousemove", this._moveWithCursor);
	},
	
	_addRow: function(t) {

		var catIconClass = this.options.catIconClass;

		var self = this;
		var o = t.options;
		var row = $('<a class="list-group-item">'+o.displayName+'</a>');
		row.attr("id", this._makeId(o.layerId));
		row.on("tap", this.__onRowTap);
		row.data("t", t); // Faster to fetch than fetching from config on click
		
		if (o.legend && !(utils.isTouchOnly() && $(window).width() < this.options.pxDesktop)) {
			this._addLegend(row, o.legend);
		}
		if (o.dialog) {
			this._addBtnDialog(row, t);
		}

		var parentTag;
		if (o.isBaseLayer) {
			parentTag = $("#lswitch-blcont");
			if (!parentTag.is(":visible")) {
				// If made invisible before, show it now.
				$(".lswitch-panel-bl").show();
			}
		}
		else {
			parentTag = $("#lswitch-olcont");
			if (!parentTag.is(":visible")) {
				// If made invisible before, show it now.
				$(".lswitch-panel-ol").show();
			}
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