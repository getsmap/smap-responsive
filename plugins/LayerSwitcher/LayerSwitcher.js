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
		this._addBtn();
		this._bindEvents();
		$("#mapdiv").addClass("lswitch-panelslide");
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
		for (var i=0,len=bls.length; i<len; i++) {
			t = bls[i];
			this._addRow({
				displayName: t.options.displayName,
				layerId: t.options.layerId,
				isBaseLayer: true
			});
		}
		for (var i=0,len=ols.length; i<len; i++) {
			t = ols[i];
			this._addRow({
				displayName: t.options.displayName,
				layerId: t.options.layerId,
				isBaseLayer: false
			});
		}
	},
	
	_onApplyParams: function(e) {
		var theId;
		if (e.BL) {
			theId = e.BL;			
		}
		else {
			theId = smap.config.bl[0].options.layerId;
		}
		theId = this._makeId(theId);
		$("#lswitch-blcont").find( "#"+theId ).addClass("active");
	},
	
	_bindEvents: function() {
		var self = this;
		
		
		
		
		
		$("#mapdiv").on("touchstart click", $.proxy(function() {
			if ( $(window).width() < this.options.pxDesktop) {
				this.hidePanel();
				return false;
			}
		}, this));
		
		smap.event.on("smap.core.applyparams", $.proxy(this._onApplyParams, this));
		
		var showPanel = $.proxy(this.showPanel, this),
			hidePanel = $.proxy(this.hidePanel, this);
		
//		var wasMobile = $("#lswitch-btn").is("visible")
//		$(window).on("resize", $.proxy(function() {
//			var isMobile = ( $(window).width() < this.options.pxDesktop );
//			var changed = wasMobile !== undefined && (wasMobile !== isMobile);
//			wasMobile = isMobile;
//			
//			if (changed) {
//				if (isMobile === false) {
//					showPanel();
//				}
//				else {
//					hidePanel();
//				}
//			}
//		}, this));
		
		$(window).on("orientationchange", function() {
			if (self.$panel.is(":visible")) {
				showPanel();
				window.scrollTo(0,0);
			}
		});
		
//		this.map.on("layeradd layerremove", function(e) {
//			var layerId = e.layer.options.layerId;
//			if (layerId) {
//				var theId = self._makeId(layerId);
//				$("#"+theId).toggleClass("active");
//			}
//		});
	},
	
	_addBtn: function() {
		var btn = $('<div id="lswitch-btn"><img class="glyphicon" src="img/glyphicons_113_justify_lsw.png"></img></div>');
		$("#mapdiv").prepend(btn);
		btn.on("touchstart mousedown", $.proxy(function() {
			this.showPanel();
			return false;
		}, this));
	},
	
	_addPanel: function() {
		this.$panel = $('<div class="lswitch-panel unselectable" />');
		this.$panel.swipeleft($.proxy(function() {  
			this.hidePanel();
		}, this));
		this.$list = $(
			'<div class="panel panel-default">'+
				'<div class="panel-heading">'+this.lang.baselayers+'</div>'+
				'<div id="lswitch-blcont" class="list-group"></div>'+
			'</div>'+
			'<div class="panel panel-default">'+
				'<div class="panel-heading">'+this.lang.overlays+'</div>'+
				'<div id="lswitch-olcont" class="list-group"></div>'+
			'</div>');
		this.$panel.append(this.$list);
		$("body").append( this.$panel );
	},
	
	showPanel: function() {
		$("body").css("overflow", "hidden"); // To avoid scroll bars
		this.$panel.show();
		$("#mapdiv").css({
			"margin-left": this.$panel.outerWidth() + "px"
		});
		$("#lswitch-btn").hide();
		console.log("show panel");
	},
	
	hidePanel: function() {
		$("body").css("overflow", "auto"); // restore overflow
		$("#mapdiv").css({
			"margin-left": "0px"
		});
		$("#lswitch-btn").show();
		setTimeout($.proxy(function() {
			this.$panel.hide();
		}, this), 300);
		console.log("hide panel");
	},
	
	_setBaseLayer: function(layerId) {
		var layers = this.map._layers,
			layer;
		
		// Hide all baselayers
		for (var key in layers) {
			layer = layers[key];
			if (layer.options.isBaseLayer) {
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
			isBaseLayer = $("#"+theId).parent().attr("id") === "lswitch-blcont";
		
		if (isBaseLayer) {
			tag.siblings().removeClass("active");
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
	
	_addRow: function(t) {
		var row = $('<a class="list-group-item">'+t.displayName+'</a>');
		row.attr("id", this._makeId(t.layerId));
		row.on("tap", $.proxy(this._onRowTap, this));
		
		var parentTag;
		if (t.isBaseLayer) {
			parentTag = $("#lswitch-blcont");
		}
		else {
			parentTag = $("#lswitch-olcont");
		}
		parentTag.append(row);
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