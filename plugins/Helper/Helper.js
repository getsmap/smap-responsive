
L.Control.Helper = L.Control.extend({
	options: {
		autoActivate: false,
		position: 'topright',
		steps: [
			{
				title: "Welcome to Malmö Stadsatlas!",
				description:
					'<p>Would you like to take a little tour?</p>'+
					'<div class="smap-helper-button-group smap-helper-tour-or-not" style="text-align: left; font-size:1.5em;">'+
						'<div class="smap-helper-button"><i class="fa fa-close"></i><span> No</span></div>'+
						'<div class="smap-helper-button" style="margin-left: 10px;"><span>Yes </span><i class="fa fa-check"></i></div>'+
					'</div>',
				noNav: true,
				func: function() {
					var $btnGroup = this._$stepContainer.find(".smap-helper-tour-or-not");
					// this._$stepContainer.append($btnGroup);
					var $btnOff = $btnGroup.find(".smap-helper-button:eq(0)"),
						$btnOn = $btnGroup.find(".smap-helper-button:eq(1)");
					var self = this;
					$btnOff.on("click", function() {
						self.deactivate();
						return false;
					});
					$btnOn.on("click", function() {
						self.goToNextStep();
						return false;
					});
					$btnGroup.addClass("smap-helper-fadein");
				}
			},
			{
				title: "Toggle button",
				description: "To hide the switcher you can press this button.",
				breakPoint: 991,
				bbox: {
					selector: ".lswitch-btnhide",
					mobileSelector: false
				},
				css: {
					side: "right"
				}
			},
			{
				title: "Layer switcher",
				description: "The layer switcher is not visible from start on mobile devices. Try making the window smaller and notice that the switcher hides. You can then "+
						"show it by clicking the expand button in the lower left section of the map.",
				breakPoint: 991,
				bbox: {
					selector: ".lswitch-panel .panel",
					mobileSelector: "#lswitch-btn"
				},
				css: {
					side: "right",
					mobileSide: "bottom"
				},
				func: function() {
					
				}
			},
			{
				title: "Search functionality",
				description: "The search functionality is vast. You can search for Malmö addresses or a place like Turning Torso, or Zlatans home.",
				bbox: {
					selector: "#smap-search-div"
				},
				css: {
					side: "bottom"
					// ,
					// standard: {
					// 	"max-width": "19em"
					// }
				}
			},
			{
				title: "Tools",
				description: "These are the basic tools for map navigation",
				bbox: {
					selector: ".leaflet-bottom.leaflet-right"
				},
				css: {
					side: "top"
				}
			},
			{
				title: "Masthead",
				description: "Left",
				bbox: {
					selector: "#malmo-masthead"
				},
				css: {
					side: "bottom"
				}
			},
			{
				title: "Search again",
				description: "The search functionality is vast. You can search for Malmö addresses or a place like Turning Torso, or Zlatans home.",
				bbox: {
					selector: "#smap-search-div"
				},
				css: {
					side: "bottom"
				}
			},
			{
				title: "That's it",
				description: '<p>If you have questions, please contact stadsatlas@malmo.se</p><div id="smap-helper-done" class="smap-helper-button" style="font-size:1.5em;"><span>Done </span><i class="fa fa-check"></i></div>', 
				noNav: true,
				func: function() {
					var self = this;
					$("#smap-helper-done").on("click", function() {
						self.deactivate();
						return false;
					});
				}
			}
		]
	},
	
	_lang: {
		"sv": {
			btnLabel: "Hjälp"
		},
		"en": {
			btnLabel: "Help"
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
		this.map = map;
		this._container = L.DomUtil.create('div', 'leaflet-control-helper'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		this.$container = $(this._container);
		this._createBtn();

		var self = this;
		this._refresh = function() {
			setTimeout(function() {
				self.refresh();	
			}, 500);
		};

		return this._container;
	},

	onRemove: function(map) {},

	_createBtn: function() {
		var self = this;

		this.$btn = $('<button id="smap-helper-btn" title="' + self.lang.btnLabel + '" class="btn btn-default"><span class="fa fa-question"></span></button>');
		this.$btn.on("touchend click", function () {
			self.activate();
			return false;
		});
		this.$container.append(this.$btn);
	},

	activate: function() {
		if (this._active && this._active === true) {
			// Toggle activity
			return this.deactivate();
		}
		this._active = true;

		this._nbr = 0;
		this._prevNbr = 0;

		this._drawBasic();
		this._bindEvents();
		this.goToStep(1);
		$(this._bgCanvas).addClass("smap-helper-fadein");
		$(window).on("resize", this._refresh);
	},

	deactivate: function() {
		if (this._active === false) {
			return false;
		}
		this._active = false;

		var self = this;

		this._$btnClose.remove();
		this._$btnClose = null;

		this._$clickTip.popover("destroy");
		this._$clickTip.empty().remove();
		this._$clickTip = null;

		// this._helperPopoverShownOnce = false;

		self._$stepContainer.empty().remove();
		self._$stepContainer = null;
		// self._$navContainer.empty().remove();
		// self._$navContainer = null;
		$(this._bgCanvas).removeClass("smap-helper-fadein");
		setTimeout(function() {
			$(self._bgCanvas).remove();
			self._bgCanvas = null;
		}, 300);

		$(window).off("resize", this._refresh);
		this._unbindEvents();
	},

	_unbindEvents: function() {
		$("body").off("keydown", this.onKeyDown);
	},

	_bindEvents: function() {
		// -- For dev only --
		// $(this._bgCanvas).on("touchend click", $.proxy(function() {
		// 	this.goToNextStep();
		// 	return false;
		// }, this));

		var self = this;

		// Define click for nav buttons
		this._$clickTip.find(".smap-helper-button").on("tap click", function() {
			var index = $(this).index();
			switch (index) {
				case 0:
					self.goToPrevStep();
					break;
				case 1:
					self.goToNextStep();
					break;
			}
			return false;
		});

		this.onKeyDown = function(e) {
			switch (e.which) {
			case 27:
				// Escape
				self.deactivate();
				break;
			case 37:
				// Left
				self.goToPrevStep();
				break;
			case 38:
				// Up
				self.goToPrevStep();
				break;
			case 39:
				// Right
				self.goToNextStep();
				break;
			case 40:
				// Down
				self.goToNextStep();
				break;
			}
			return false;
		}

		$("body").on("keydown", this.onKeyDown);

	},

	_drawBasic: function() {
		if (this._$stepContainer) return false;
		
		var self = this;

		this._$btnClose = $('<div class="smap-helper-btnclose"><i class="fa fa-close"></i></div>');
		$("#maindiv").append(this._$btnClose);
		this._$btnClose.on("tap click", function() {
			self.deactivate();
			return false;
		});

		// Draw container
		this._$stepContainer = $('<div class="smap-helper-stepcont"><div class="smap-helper-steptitle"><span>The title</span></div><div class="smap-helper-stepdescription">The description</div></div>');

		// Draw navbar
		// this._$navContainer = $('<div />');
		// this._$navContainer.append($btnPrev).append($btnNext);

		// Draw "click-tip-for-next-slide"
		this._$clickTip = $('<div class="smap-helper-button-group smap-helper-clicktip"><div class="smap-helper-button smap-helper-button-icon-effect"><i class="fa fa-chevron-left"></i><span> Back</span></div><div class="smap-helper-button smap-helper-button-icon-effect"><span>Next </span><i class="fa fa-chevron-right"></i></div></div>');
		// <i class="fa fa-arrow-right"></i>
		
		// this._$stepContainer.append(this._$clickTip);
		$("#mapdiv").append(this._$clickTip);

		// Draw canvas
		var canvas = '<canvas class="smap-helper-bgcanvas" />';
		
		// Append
		$("#mapdiv").append(this._$stepContainer); //.append(this._$navContainer);
		$("body").append(canvas);
		this._bgCanvas = $(".smap-helper-bgcanvas")[0];

		// Fill navbar with buttons
		// var steps = this.options.steps,
		// 	t, $step;
		// for (var i=0,len=steps.length; i<len; i++) {
		// 	// t = steps[i];
		// 	$step = '<span class="badge">'+(i+1)+'</span>';
		// 	this._$navContainer.append( $step );
		// }
	},

	_drawCanvasHole: function(bbox) {

		var c = this._bgCanvas;
		var ctx = c.getContext("2d");
		ctx.clearRect (0, 0, c.width, c.height);

		var winWidth = $(window).width(),
			winHeight = $(window).height();
		if (bbox) {
			var box = [];
			if (bbox instanceof Array) {
				box = bbox;
			}
			else if (bbox.selector) {
				var padding = 15;
				var selector = bbox.selector;
				var $el = $(selector);
				var pos = $el.offset();
				var marginLeft = 0, //utils.rmPx( $el.css("margin-left") ),
					marginTop = 0, //utils.rmPx( $el.css("margin-top") ),
					marginRight = 0, //utils.rmPx( $el.css("margin-right") ),
					marginBottom = 0; //utils.rmPx( $el.css("margin-bottom") );
				box.push(pos.left + marginLeft - padding - marginRight);
				box.push(pos.top + marginTop - padding  - marginBottom);
				box.push( pos.left + $el.width() + marginLeft + padding - marginRight);
				box.push( pos.top + $el.height() + marginTop + padding - marginRight);
			}

			var left = box[0],
				top = box[1],
				right = box[2],
				bottom = box[3];
		}
		
		c.width = winWidth;
		c.height = winHeight;

		// ctx.fillRect(0,0,winWidth,winHeight);

		ctx.moveTo(0, 0);
		ctx.lineTo(winWidth, 0);
		ctx.lineTo(winWidth, winHeight);
		ctx.lineTo(0, winHeight);
		ctx.lineTo(0, 0);
		ctx.closePath();

		if (bbox) {
			ctx.moveTo(left, top);
			ctx.lineTo(left, bottom);
			ctx.lineTo(right, bottom);
			ctx.lineTo(right, top);
			ctx.lineTo(left, top);
			ctx.closePath();
		}

		ctx.fillStyle = "rgba(0,0,0,0.5)";
		ctx.shadowColor = 'rgba(0,0,0,1)';
		ctx.shadowBlur = 20;
		
		ctx.fill();
		
	},

	refresh: function() {
		this.goToStep(this._nbr);
	},

	goToStep: function(nbr) {
		var self = this;

		if (nbr <= 0) {
			return false;
		}
		this._prevNbr = this._nbr;
		this._nbr = nbr;

		// this._$clickTip.hide();
		this._$clickTip.removeClass("smap-helper-fadein");

		if (nbr > this.options.steps.length) {
			// Done!
			// return this.goToStep(1);
			return this.deactivate();
		}

		var t = this.options.steps[nbr-1];
		var $t = this._$stepContainer.find(".smap-helper-steptitle");
		var $d = this._$stepContainer.find(".smap-helper-stepdescription");

		$t.find("span").empty().html(t.title);
		$d.empty().html(t.description);

		var selector;
		if (t.bbox && t.bbox.selector) {
			selector = t.bbox.selector;
			if ( t.breakPoint && $(window).width() <= t.breakPoint ) {
				selector = t.bbox.mobileSelector;
			}
			if (selector === false) {
				if (this._prevNbr < this._nbr) {
					return this.goToNextStep();
				}
				else {
					return this.goToPrevStep();
				}
			}
			this._$stepContainer.css( t.css.standard ? t.css.standard : t.css );
			// this._$stepContainer.css("max-width", ($(window).width() - 20) + "px");
			if (t.css.side) {
				$(document).ready(function() {
					var side = t.css.side,
						mySide, atSide;
					if ( t.bbox.breakPoint && t.css.mobileSide && $(window).width() <= t.bbox.breakPoint ) {
						side = t.css.mobileSide;
					}
					if (side === "top") {
						mySide = "bottom";
						atSide = side+"-20px";
					}
					else if (side === "bottom") {
						mySide = "top";
						atSide = side+"+20px";
					}
					else if (side === "left") {
						mySide = "right";
						atSide = side+"-20px";
					}
					else if (side === "right") {
						mySide = "left";
						atSide = side+"+20px";
					}
					$(".smap-helper-stepcont").position({
						my: mySide,
						at: atSide,
						of: selector,
						collision: "fit flip"
						// ,
						// using: function(pos) {
							
						// },
					});
				});
			}
		}
		else {
			$(".smap-helper-stepcont").position({
				my: "center",
				at: "center",
				of: "#mapdiv",
				collision: "fit flip"
			});
		}
		if (t.css && t.css.standard) {
			this._$stepContainer.css(t.css.standard);
		}

		// Draw canvas
		this._drawCanvasHole({
			selector: selector
		});
		// $(this._bgCanvas).addClass("smap-helper-darken");
		// var self = this;
		// setTimeout(function() {
		// 	$(self._bgCanvas).removeClass("smap-helper-darken");
		// }, 300);

		if (this._showHelperTimeout) {
			clearTimeout(this._showHelperTimeout);
		}

		if (!t.noNav) {
			$(".smap-helper-clicktip").popover("destroy");
			this._$clickTip.show();
			if (this._nbr >= this.options.steps.length) {
				this._$clickTip.find(".smap-helper-button:eq(1)").hide();
			}
			else {
				this._$clickTip.find(".smap-helper-button").show();
			}
			this._showHelperTimeout = setTimeout(function() {
				self._$clickTip.addClass("smap-helper-fadein");
				if (!utils.isTouchOnly() && !self._helperPopoverShownOnce) {
					self._helperPopoverShownOnce = true;
					$(".smap-helper-clicktip").popover({
						// title: "Tip!",
						content: 'Tip! Use your keyboards\' arrow keys to navigate through the help section <i class="fa fa-caret-square-o-left"><i class="fa fa-caret-square-o-up"></i><i class="fa fa-caret-square-o-right"><i class="fa fa-caret-square-o-down"></i>',
						html: true,
						placement: "top",
						trigger: "manual",
						container: ".maindiv"
					}).popover("show");
					$(".smap-helper-clicktip").data("bs.popover").$tip.addClass("smap-helper-popover");
				}
			}, 950);
		}
		if (t.func) {
			t.func.call(this);
		}

		
	},

	goToPrevStep: function() {
		this.goToStep(this._nbr - 1);
	},

	goToNextStep: function() {
		this.goToStep(this._nbr + 1);
	}


});

//L.control.helper = function (options) {
//	return new L.Control.Helper(options);
//};