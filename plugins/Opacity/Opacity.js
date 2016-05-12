L.Control.Opacity = L.Control.extend({
	options: {
		position: 'topright',
		showTitle: false
	},

	_lang: {
		"sv": {
			caption: "Ändra genomskinlighet på lager",
			close: "Stäng",
			btnTitle: "Justera genomskinlighet",
			popoverTitle: "Genomskinlighet",
			transparency: "Genomskinlighet",
			transparent: "Genomskinlig",
			opaque: "Synlig",
			visibility: "Synlighet",
			layerName: "Kartskikt"

		},
		"en": {
			caption: "Transparency tool",
			close: "Close",
			btnTitle: "Adjust transparency",
			popoverTitle: "Transparency",
			transparency: "Transparency",
			transparent: "Transparent",
			opaque: "Visible",
			visibility: "Opacity",
			layerName: "Layer"
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
		if (options._lang) {
			// Always allow setting lang through options
			$.extend(true, this._lang, options._lang);
		}
		this._setLang(options.langCode);
	},

	onAdd: function(map) {
		

		this._container = L.DomUtil.create('div', 'leaflet-control-opacity'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		this.$container = $(this._container);
		
		this._createBtn();
		this.$popContainer.append('<div class="smap-opacity-headerrow"><label>'+this.lang.layerName+'</label><label>'+this.lang.visibility+'</label></div>');
		this.$sliderRowContainer = $('<div class="smap-opacity-sliderrow-container" />');
		this.$popContainer.append( this.$sliderRowContainer );
		this._bindEvents();


		// this._addResetBtn(); // TODO
		// var $btnReset = $('<button class="btn btn-default">Reset</button>');
		// $btnReset.on("click touchstart", this.reset.bind(this) );
		// this.$popContainer.prepend($btnReset);
		
		return this._container;
	},

	hide: function() {
		this.$btn.popover("hide");
	},

	_bindEvents: function() {
		var onAddRemove = (function(e) {
			if (!e.layer.options || !e.layer.options.layerId || e.layer.feature) { 
				return;
			}
			var layer = e.layer;
			switch (e.type) {
				case "layeradd":
					// Add slider to GUI
					this._addRow(layer);
					break;
				case "layerremove":
					// Remove slider to GUI
					this._removeRow(layer);
					break;
			}
		}).bind(this);

		this._map.on("layeradd layerremove", onAddRemove);
		var hide = this.hide.bind(this);
		this._map.on("mousedown dragstart", hide);
		$(window).on("resize orientationchange", hide);
		// $("#mapdiv").on("touchstart", hide);
		smap.event.on("smap.toolhandler.hide", hide);

		smap.event.on("smap.core.aftercreateparams", this.onAfterCreateParams.bind(this));
		smap.event.on("smap.core.applyparams", this.onApplyParams.bind(this));
	},

	onAfterCreateParams: function(e, p) {
		// Find which layers have had their opacity modified
		var defaults = this._getDefaults(true);
		var unCreateId = this._unCreateId;
		var values = {};
		this.$sliderRowContainer.find("input").each(function(index) {
			var actualValue = Number( $(this).val() );
			var layerId = unCreateId( $(this).prop("id") );
			if (actualValue !== defaults[layerId] * 100) {
				values[layerId] = actualValue;
			}
		});
		if ( $.isEmptyObject(values) === false ) {
			var paramVals = [];

			p.ol.forEach(function(layerId) {
				// Follow the same order as OLs so that we can "re-use" the layerIds
				paramVals.push( values[layerId] !== undefined ? values[layerId] : "" ); // If no value exists, keep the order by pushing empty string
			});

			// Now, we should not forget our baselayer. See if it also needs to be added.
			var defaultsArr = this._getDefaults();
			var nbrOfSliders = this.$sliderRowContainer.find("input").length;
			if (p.ol.length < nbrOfSliders && values[p.bl] !== undefined && values[p.bl] !== defaults[p.bl] * 100) {
				paramVals.push( values[p.bl] );
			}
			p.opacity = paramVals.join(",").replace(/,+$/, ""); // Trim commas at the end of string
			console.log(p.opacity);
		}
	},

	onApplyParams: function(e, p) {
		if (p.OPACITY) {
			var opacityArr = p.OPACITY instanceof Array ? p.OPACITY : p.OPACITY.split(",");
			var ols = p.OL;
			var setLayerOpacity = this._setLayerOpacity;
			var self = this;
			opacityArr.forEach(function(displayOpacity, index) {
				if (displayOpacity.length === 0) return;
				displayOpacity = Number(displayOpacity);
				var layerId = ols.length > index ? ols[index] : layerId = p.BL;
				self._setSliderOpacity( self._createId(layerId), displayOpacity ); // this will also trigger opacity change in layer
			});
		}
	},

	_createId: function(layerId) {
		return "opacity-"+layerId;
	},
	_unCreateId: function(sliderId) {
		return sliderId.replace("opacity-", "");;
	},


	_setLabelValue: function($label, val) {
		$label.text(val + " %");
	},

	_setLayerOpacity: function(layer, val) {
		if (layer.setOpacity) {
			layer.setOpacity( val );
		}
		else {
			layer.eachLayer(function(marker) {
				marker.setOpacity( val );
			});
		}
	},

	_setSliderOpacity: function(sliderId, displayValue) {
		this.$sliderRowContainer.find("#"+sliderId)
				.val( displayValue )
				.trigger("change")
				.slider('setValue', displayValue);
	},

	reset: function() {
		var d = this._getDefaults();
		var self = this;
		this.$sliderRowContainer.find("input").each(function(index, val) {
			var displayValue = d[index] * 100;
			self._setSliderOpacity( $(this).prop("id"), displayValue );
			// .trigger("create"); //TODO How to redraw/update slider element
			// $(this).slider({value: d[index] * 100});
		});

	},

	/**
	 * Return original opacity values for the layers added to the opacity panel.
	 * @return {[type]} [description]
	 */
	_getDefaults: function(asObject) {
		asObject = asObject || false;
		var defaults = [];
		if (asObject) {
			defaults = {};
		}
		var unCreateId = this._unCreateId;
		this.$sliderRowContainer.find("input").each(function() {
			var layerId = unCreateId( $(this).prop("id") );
			var t = smap.cmd.getLayerConfig( layerId );
			var opacity = t.options.opacity || 1;
			if (asObject) {
				defaults[layerId] = opacity;
			}
			else {
				defaults.push(opacity);
			}
		});
		return defaults;
	},

	onSlide: function(e) {
		// console.log(e);
		var $target = $(e.target);
		var val = Number( $target.val() );
		var layerId = this._unCreateId( $target.prop("id") );
		var layer = smap.cmd.getLayer(layerId);
		
		this._setLayerOpacity(layer, val / 100);
		
		var $valueLabel = $target.parent().find(".smap-opacity-value");
		this._setLabelValue($valueLabel, val);

	},

	_adjustSize: function() {
		var $p = $(".opacity-popover");
		if (!$p.length) return;
		var $pc = $p.find(".smap-opacity-popcontainer");
		var availableHeight = $("#mapdiv").innerHeight();
		var estimatedHeightRemaining = availableHeight - $pc.offset().top - ($pc.outerHeight() + 100);
		if (estimatedHeightRemaining < 0) {
			// Set max height and make it scrollable
			$pc.addClass("smap-opacity-scrollable");
			$pc.css("max-height", (availableHeight - $p.offset().top - 70) + "px");
		}
		else {
			$pc.css("max-height", "none").removeClass("smap-opacity-scrollable");
		}

		if ( !this._popoverRepositioned && $(".thandler-popover:visible").length ) {
			// Force popover to reposition ( using popover("show") ) but avoid iternal recursion
			this._popoverRepositioned = true;
			this.$btn.popover("show");
			setTimeout( (function() {
				this._popoverRepositioned = false;
			}).bind(this), 0);
		}
	},

	_addRow: function(layer) {
		// var $c = this.$popContainer;
		var $c = this.$sliderRowContainer;
		var theId = this._createId(layer.options.layerId);
		if ( $c.find("#"+theId).length ) {
			return false;
		}
		if (!layer) {
			return;
		}
		var opacity;
		if (!layer.setOpacity && layer._layers) {
			// Check if the opacity can be changed for features in this layer. If not, return.
			var firstFeature;
			for (var key in layer._layers) {
				firstFeature = layer._layers[key];
				break;
			}
			if (firstFeature && firstFeature.setOpacity) {
				opacity = firstFeature.options.opacity;
			}
			else {
				return;
			}	
		}
		opacity = opacity || (typeof layer.options.opacity === "number" ? layer.options.opacity : 1);
		var displayValue = opacity * 100; //(1 - opacity )*100;
		var $row = $('<div class="smap-opacity-row">'+
					'<div class="smap-opacity-valuerow">'+
						'<span class="smap-opacity-label">'+(layer.options.displayName || layer.options.layerId || "no name")+'</span>'+
						'<span class="smap-opacity-value">'+displayValue+'</span>'+
					'</div>'+
					'<input type="text" id="'+theId+'" data-provide="slider" '+
					'data-slider-min="0" data-slider-max="100" data-slider-step="1" data-slider-value="'+displayValue+'" '+
					'data-slider-tooltip="hide">'+
				'</div>');
		$c.prepend($row);

		var $input = $row.find('#'+theId);
		var textTransparency = this.lang.transparency;
		$input.slider({
			tooltip_position: 'bottom'
			// ticks: [0, 100],
			// ticks_positions: [0, 100],
			// ticks_labels: [this.lang.opaque, this.lang.transparent],
			// formatter: function(value) {
			// 	return value+" %";
			// 	// return textTransparency+": "+ value+" %";
			// }
		});
		// $input.on("slide", this.onSlide.bind(this));
		$input.on("change", this.onSlide.bind(this));
		this._setLabelValue( $row.find(".smap-opacity-value"), displayValue );
		this._adjustSize();
	},

	_removeRow: function(layer) {
		var defaults = this._getDefaults(true);
		if (!defaults[layer.options.layerId]) return;
		this._setLayerOpacity(layer, defaults[layer.options.layerId]); // Reset opacity to original value
		var $c = this.$sliderRowContainer;
		var theId = this._createId(layer.options.layerId);
		$c.find("#"+theId).parent().remove();
		this._adjustSize();
	},

	_createBtn: function() {
		var self = this;
		var $btn = $('<button id="smap-opacity-btn" title="' + this.lang.btnTitle + '" class="btn btn-default"><span class="fa fa-adjust"></span></button>');
		this.$btn = $btn;
		$btn.on("click touchstart", function () {
			self.activate();
			return false;
		});
		this.$container.append($btn);

		this.$popContainer = $('<div class="smap-opacity-popcontainer" />');
		$btn.popover({
			// container: 'body',
			content: function() {
				// console.log($(this).data("bs.popover"));
				var $popoverContent = $(this).data("bs.popover").$tip.find(".popover-content");
				if ( $popoverContent.find(".smap-opacity-popcontainer").length === 0 ) {
					$popoverContent.append( self.$popContainer );
				}
			},
			placement: "bottom",
			// title: this.lang.popoverTitle, // set by the btn's title attribute
			trigger: "manual"
		});

		$btn.on("click touchstart", function() {
			$(this).popover("toggle");
		});

		function stopEvent(e) {
			e.stopPropagation();
		}
		function stopEvents($tag) {
			$tag
				.on("click", stopEvent)
				.on("dblclick", stopEvent)
				.on("mousewheel DOMMouseScroll MozMousePixelScroll", stopEvent) // prevent scroll
				.on("mousedown", stopEvent);
		}

		// Draw dropdown
		$btn.on("shown.bs.popover", function(e) {
			if (!self._popoverInititated) {
				var $popover = $(this).next();
				stopEvents($popover);
				$popover.addClass("opacity-popover");
				if (!self.options.showTitle) {
					$popover.find("h3").remove();
				}
				self._popoverInititated = true;
			}
			$(".smap-opacity-popcontainer").show();
			self._adjustSize();
			// $popCont = $(".smap-opacity-popover");
			// if (!self.options.showPopoverTitle) {
			// 	$popover.find("h3").remove();
			// }
		});

		$btn.on("hidden.bs.popover", (function(e) {
			// This code should execute after the hide animation 
			// is done – but it with the current version of Bootstrap it doesnt seem to happen
			$(".smap-opacity-popcontainer").hide();
		}).bind(this));
	},


	activate: function() {
		if (this._active) {
			return false;
		}
		this._active = true;
		var $btn = this.$btn;
		
		// this.$btn.popover("show");
		// var $popover = $btn.data("bs.tooltip").$element;
		// $popover.append(this.$popContainer);
		return true;
	},

	deactivate: function() {
		var $btn = this.$btn;
		this.$popContainer.detach();
		// $btn.popover("hide");
		$btn.popover("destroy");
	},


	onRemove: function(map) {
		this.$btn.remove();
		delete this.$btn;
		delete this.$popContainer;

	}
});

/*
 * This code lets us skip "new" before the
 * Class name when instantiating it.
 */
L.control.opacity = function (options) {
	return new L.Control.Opacity(options);
};