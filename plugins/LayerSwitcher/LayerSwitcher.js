L.Control.LayerSwitcher = L.Control.extend({
	options: {
		pxDesktop: 992
	},
	
	_lang: {
		"sv": {
			baselayers: "Bakgrundslager",
			overlays: "Kartskikt"
		},
		"en": {
			baselayers: "Baselayers",
			overlays: "Overlays"
		}
	},
	
	showLayer: function(layerId) {
		smap.core.layerInst.showLayer(layerId);
	},
	
	hideLayer: function(layerId) {
		smap.core.layerInst.hideLayer(layerId);
	},
	
	_setLang: function(langCode) {
		langCode = langCode || smap.config.langCode || navigator.language.split("-")[0] || "en";
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
				this._addRow(t);
			}
		}
		else {
			$(".lswitch-panel-ol").hide();
		}
		
		if (bls.length <= 1 && ols.length === 0) {
			// Hide all 
			$(".lswitch-panel").remove();
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
		
		if ( L.Browser.ielt9 ) {
			var self = this;
			this.map.on("click dragstart", function() {
				self.hidePanel();
			});
		}
		
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
			if (!e.layer.options || !e.layer.options.layerId || e.layer.feature) {
				return;
			}
			var layerId = e.layer.options.layerId;
			var rowId = self._makeId(layerId);
			var row = $("#"+rowId);
			var isActive = row.hasClass("active");
			if (row.length) {
				if (e.type === "layeradd" && isActive === false) {
					row.addClass("active");						
				}
				else if (e.type === "layerremove" && isActive === true) {
					row.removeClass("active");
				}
			}
		});
	},
	
	_addBtn: function() {
		var btn = $('<div id="lswitch-btn"><span class="fa fa-bars fa-2x"></span></div>');
		$("#mapdiv").prepend(btn);
		btn.on("click mousedown "+L.DomEvent._touchstart, $.proxy(function() {
			this.showPanel();
			return false;
		}, this));
		btn.on("dblclick", function() {
			return false;
		});
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
		
		
		this.$panel.swipeleft($.proxy(function() {
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
		setTimeout(function() {
			$(".lswitch-panel").addClass("panel-visible");
		}, 1);
		setTimeout(function() {
			self._panelIsSliding = false;
		}, 300);
		
		$("#mapdiv").css({
			"margin-left": this.$panel.outerWidth() + "px"
		});
		// $("#lswitch-btn").hide();
	},
	
	hidePanel: function() {
		if (this._panelIsSliding) {
			utils.log("no slide");
			return false;
		}
		$("#mapdiv").css({
			"margin-left": "0px"
		});
		// $("#lswitch-btn").show();
		$(".lswitch-panel").removeClass("panel-visible");
		
		$("#maindiv").addClass("lswitch-overflow-hidden");
		setTimeout($.proxy(function() {
			this._panelIsSliding = false;
			this.$panel.hide();
			$("#maindiv").removeClass("lswitch-overflow-hidden");
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
		var isActive = tag.hasClass("active");
		
		if ( isActive ) {
			// Show layer
			this.showLayer(layerId);
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

	_onHeaderClick: function(e) {
		var tag = $(this);
		tag.next().toggleClass('lswitch-catcont-visible');
		tag.toggleClass('open')
		// setTimeout(function() {
		// }, 1);
		return false;
	},
	
	_addRow: function(t) {
		var self = this;
		var o = t.options;
		var row = $('<a class="list-group-item">'+o.displayName+'</a>');
		row.attr("id", this._makeId(o.layerId));
		row.on("tap", $.proxy(this._onRowTap, this));
		
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
					catHeader = $('<div class="list-group-item lswitch-cat"><i class="fa fa-caret-right"></i><span>'+catName+'</span></div>')
						.appendTo(_parentTag);
					catContainer = $('<div class="lswitch-catcont"></div>');
					catHeader.after(catContainer);
					catHeader.on("click", self._onHeaderClick);
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