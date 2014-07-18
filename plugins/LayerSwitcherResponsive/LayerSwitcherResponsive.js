L.Control.LayerSwitcherResponsive = L.Control.extend({
	options: {
        addToMenu: false,
		autoActivate: false,
		position: 'bottomleft',
		_lang: {
			"sv": {
				titleInfo: "<h4>Stadsatlas lager</h4>"
			},
			"en": {
				titleInfo: "<h4>Stadsatlas Layers</h4>"
			}
		}
	},
	
	_lang: {
		"sv": {
			close: "Stäng"
		},
		"en": {
			close: "Close"
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
		if (this.options._lang) {
			$.extend(true, this._lang, this.options._lang);
		}
		this._setLang(options.langCode);
	},

	onAdd: function(map) {
		this.map = map;
		this._container = L.DomUtil.create('div', 'leaflet-control-lyrswitcherresponsive'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		this.$container = $(this._container);
		this._drawBtn();
		this.activate();
		return this._container;
	},

	onRemove: function(map) {
		// Do everything "opposite" of onAdd – e.g. unbind events and destroy things
		// map.off('layeradd', this._onLayerAdd).off('layerremove', this._onLayerRemove);
	},
	
	_addCategory: function(){
		var cat = smap.config.categories.headers;
		
		var arrCategories = [];
		$.each(cat, function(header,value){
			var olyr = smap.config.ol;
			var countBadge = 0;
			for(var i=0,leni=olyr.length; i<leni; i++){
				if(olyr[i].parentTag === value.parentTag){
					countBadge += 1;
				}
			}		
			var categories = $('<div class="panel panel-default">'
					+'<div class="panel-heading">'
					+'<h4 class="panel-title">'
					+'<a data-toggle="collapse" data-parent="#accordion" href="#'+value.href+'">'+header+'<span id="badge-active" class="badge pull-right">'+countBadge+'</span><span style="padding:"></span><span id="badge-count" class="badge pull-right">0</span></a>'
					+'</h4>'
					+'</div>'
					+'<div id="'+value.href+'" class="panel-collapse collapse">'
					+'<div class="panel-body '+value.parentTag+'"></div>'
					+'</div>'
					+'</div>');

			if(value.startVisible){
				arrCategories.push(categories);
			}
		});

		this.$panel_default = arrCategories;
		this.$contentDialog.append(this.$panel_default);
		this._addLayers(smap.config.bl, smap.config.ol);
		//this._updateBadge(arrCategories);
	},

	activate: function() {
		var options = {
			dialogId: "lswitchresponsive-menu"
			
		};

		if (!this._$dialog) {
			var footerContent = $('<button type="button" id="modal-close-btn" class="btn btn-default" data-dismiss="modal">'+this.lang.close+'</button>');
			var contentDialog = $('<div class="panel-group" id="accordion">');
			this.$contentDialog = contentDialog;
			this._$dialog = utils.drawDialog(this.lang.titleInfo, this.$contentDialog, footerContent, options);
		}

		if(!this.$panel_default){
			this._addCategory();
		}
		
		if(window.innerWidth > 991){
			$(this._$dialog.modal("show")).css({"top":"45px"});
			this._menuHideControl();
			
			var backdrop = $("body").find("div.modal-backdrop");
			backdrop.removeClass("modal-backdrop");
		}
		else{
			//$(this._$dialog.modal("show")).css({"top":"0px"});
			this._menuHideControl();
		}
	},
	
	_menuHideControl: function(){
		$(this._$dialog).on('shown.bs.modal', function (e) {
			$("#lswitchresponsive-btn").hide();

		});
		$(this._$dialog).on('hidden.bs.modal', function (e) {
			$("#lswitchresponsive-btn").show();

		});
	},

	_drawBtn: function() {
		var self = this;

        if(this.options.addToMenu) {
            smap.cmd.addToolButton( "", "fa fa-bars fa-2x", function () {
                return false;
            },null);
        }

        else {
	           var $btn = $('<button id="lswitchresponsive-btn" class="btn btn-default"><span class="fa fa-bars fa-2x"></span></button>');
    	       $btn.on("click", function (evt) {
                 self._$dialog.modal("show");
                 var backdrop = $("body").find("div.modal-backdrop");
                 backdrop.removeClass("modal-backdrop");
                 $btn.hide();
   	             return false;
               });
               this.$container.append($btn);
        }
	},

	_addLayers: function(bls, ols) {
		bls = bls || [];
		ols = ols || [];
		
		var t;
		if (bls.length > 1) {
			for (var i=0,len=bls.length; i<len; i++) {
				t = bls[i];
				this._addRow({
					displayName: t.options.displayName,
					layerId: t.options.layerId,
					isBaseLayer: true
				});
			}
		}
		else {
			$(".lswitch-panel-bl").hide();
		}
		if (ols.length > 0) {
			for (var i=0,len=ols.length; i<len; i++) {
				t = ols[i];
				this._addRow({
					displayName: t.options.displayName,
					layerId: t.options.layerId,
					isBaseLayer: false,
					parentTag: t.parentTag,
					category: t.category
				});
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
	
	_updateBadge: function(){
		for(var i=0,leni=this.$panel_default.length; i<leni; i++){
			var children =  $(this.$panel_default[i]).children();
			var count = $(children[1]).find(".active").length;
			if(count > 0){
				$(children[0]).find("#badge-count").text(""+count+"").css({"background-color": "green"});
			}
			else {
				$(children[0]).find("#badge-count").text(""+count+"").css({"background-color": "#999"});
			}
		}
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
			this.map.closePopup();
			this.hideLayer(layerId);
		}
		this._updateBadge();
		return false;
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
	
	_addRow: function(t) {
		var row = $('<a class="list-group-item">'+t.displayName+'</a>');
		row.attr("id", this._makeId(t.layerId));
		row.on("tap", $.proxy(this._onRowTap, this));
		
		var parentTag, categoryTag;
		if (t.isBaseLayer) {
			parentTag = $("#lswitch-blcont");
		}
		else {
				parentTag = t.parentTag;
		}

		this._$dialog.find("div#"+parentTag+"").append(row);
	},
	
	_makeId: function(layerId) {
		return "lswitchrow-" + encodeURIComponent(layerId).replace(/%/g, "--pr--");
	},
	_unMakeId: function(theId) {
		return decodeURIComponent( theId.replace("lswitchrow-", "").replace(/--pr--/g, "%") );
	},

});


/*
 * This code just makes removes the need for
 * using "new" when instantiating the class. It
 * is a Leaflet convention and should be there.
 */
L.control.layerswitcherresponsive = function (options) {
	return new L.Control.LayerSwitcherResponsive(options);
};