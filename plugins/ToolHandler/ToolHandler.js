L.Control.ToolHandler = L.Control.extend({
	options: {
		position: 'bottomright',
		showPopoverTitle: false
	},

	_lang: {
		"sv": {
			popoverTitle: "Verktyg"
		},
		"en": {
			popoverTitle: "Tools"
		}
	},

	_setLang: function(langCode) {
		langCode = langCode || smap.config.langCode;
		if (this._lang) {
			this.lang = this._lang ? this._lang[langCode] : null;
		}
	},

	initialize: function(options) {
		L.setOptions(this, options);
		this._setLang(options.langCode);
	},

	onAdd: function(map) {
		var self = this;
		self._container = L.DomUtil.create('div', 'leaflet-control-toolhandler'); // second parameter is class name
		L.DomEvent.disableClickPropagation(self._container);

		self.$container = $(self._container);
		self.$container.css("display", "none");

		if (!utils.getBrowser().ie8) {
			this._makeToolHandler();
			smap.event.on("smap.core.pluginsadded", function() {
				$(".thandler-container .leaflet-control button").each(function() {
					$(this).tooltip({
						placement: "bottom",
						container: "#maindiv"
					});
				});
				// $('.leaflet-control').children("button").each(function(){
				// 	self._addButton( $(this) );
				// });
			});
		}
		return self._container;
	},

	activate: function() {},

	_makeToolHandler: function() {
		var self = this;

		var $thCont = $(".leaflet-top.leaflet-right");
		this.$thCont = $thCont;
		$thCont.addClass("thandler-container");

		// The button that toggles the tool container
		var $thBtn = $('<div class="thandler-btn popover-dismiss"><button type="button" class="btn btn-default thbtn"><span class="fa fa-th"></span></button></div>');

		$("#mapdiv").append($thBtn);
		
		function hidePopover(e) {
			var isVisible = $(".thandler-popover").length && parseInt($(".thandler-popover").css("opacity") || 0) > 0;
			var $popCont = $(".popover-content");
			if ( $thBtn.data('bs.popover') && isVisible && $popCont.children().length) {
				if (utils.getBrowser().ie9) {
					onPopoverHidden();
				}
				$thBtn.popover("hide");
			}
			smap.event.trigger("smap.toolhandler.hide", e);
		}

		function togglePopover() {
			var $btns = $(".thandler-container").children(":has('button')");
			if ($btns.length) {
				$thBtn.popover("show");
			}
		}

		function onFocusOut() {
			hidePopover();
		}
		
		this._map.on("click dragstart", hidePopover);
		$(window).on("orientationchange", hidePopover);
	
		var onPopoverHidden = function() {
			/*var drawBtns = $('.leaflet-control-drawsmap').children();
			if(drawBtns.length > 0){
				drawBtns.removeClass('drawBtnsTight');
			}*/
			$(window).off("resize", hidePopover);
			var $popCont = $(".popover-content");

			// It seems as though the hidden.bs.popover-event is triggered before animation 
			// is completed - so we need to add a timeout, to avoid ugly animation.
			setTimeout(function() {
				$popCont.children().each(function() {
					$(".thandler-container").prepend(this); // must prepend (instead of append) to preserve the order of buttons
				});
			}, 150);
		}

		$thBtn.on("click", function() {
			var $this = $(this);
			if ( $this.data('bs.popover') ) {
				var isVisible = $(".thandler-popover").length && parseInt($(".thandler-popover").css("opacity") || 0) > 0;
				if (isVisible) {
					if (utils.getBrowser().ie9) {
						onPopoverHidden();
					}
					$this.popover("hide");
					return false;
				}
			}
			else {
				$this.popover({
					// container: 'body',
					content: null,
					placement: "bottom"
					, title: self.lang.popoverTitle
					, trigger: "manual"
				});

				$this.on("shown.bs.popover", function() {
					var $popover = $(".popover"),
						$popCont = $(".popover-content");
					if (!self.options.showPopoverTitle) {
						$popover.find("h3").remove();
					}
					$popover.addClass("thandler-popover");

					// Move control divs into the popover - but only those which contains a button tag
					var btns = $(".thandler-container").children(".leaflet-control:has('button')").detach();
					$popCont.empty();
					btns.each(function() {
						$popCont.prepend(this); // must prepend (instead of append) to preserve the order of buttons
					});
					
					/*var drawBtns = $('.leaflet-control-drawsmap').children();
					if(drawBtns.length > 0){
						drawBtns.addClass('drawBtnsTight');
					}*/
										
					$(window).on("resize", hidePopover);
					
				});
				
				$this.on("hidden.bs.popover", onPopoverHidden);
				// $(".thandler-container").toggleClass("thandler-visible");
			}
			togglePopover();
			return false;
		});


		// $(window).on("resize", function() {
		//	 $(".thandler-btn").popover("hide");
		// });
		$thBtn.on("tap", function() {
			return false;
		});
		$thBtn.on("dblclick", function() {
			return false;
		});

    },

	onRemove: function(map) {
		// Do everything "opposite" of onAdd – e.g. unbind events and destroy things
		// map.off('layeradd', this._onLayerAdd).off('layerremove', this._onLayerRemove);
	}
});

/*
 * This code lets us skip "new" before the
 * Class name when instantiating it.
 */
L.control.toolhandler = function (options) {
	return new L.Control.ToolHandler(options);
};