L.Control.Opacity = L.Control.extend({
	options: {
		position: 'topright',
		addToMenu: false
	},

	_lang: {
		"sv": {
			caption: "Ändra genomskinlighet på lager",
			close: "Stäng",
			collapsebtn: "visa/dölj lagerlista",
			btntitle: "Justera transparens",
			prefTxt: "Spara inställningar"
		},
		"en": {
			caption: "Transparency tool",
			close: "Close",
			collapsebtn: "show/hide layers",
			btntitle: "Adjust transparency",
			prefTxt: "Save settings"
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
		//Variable allNamesInGui keeps track of all the layers
		this.allNamesInGui = [];

		var self = this;
		map.on("layeradd layerremove", function(e) {
			if( !e.layer.options || !e.layer.options.layerId || e.layer.feature ){
				return;
			}
			
			var layerId = e.layer.options.layerId;
			if ($.inArray(layerId, self.allNamesInGui) != -1) {
				if (e.type === "layerremove") {
					var delLayer = $.inArray(layerId,self.allNamesInGui);
					self.allNamesInGui.splice(delLayer, 1);
					$("#op-rowsdiv").find("#"+layerId).remove();
				}
				return;
			}
			self.allNamesInGui.push(layerId);
		});

		this._container = L.DomUtil.create('div', 'leaflet-control-Opacity'); // second parameter is class name

		L.DomEvent.disableClickPropagation(this._container);

		this.$container = $(this._container);
		this._createBtn();

		return this._container;
	},

	_addLayers: function(layers) {
		var opDiv = $("<div class='op-opdiv'><button id='op-collapsebtn' type='button' class='btn' data-toggle='collapse' "+
			"data-target='#op-rowsdiv'>" + this.lang.collapsebtn + "</button><div id='op-rowsdiv' class='collapse in'></div></div>");
		
		var inputDiv = opDiv.children("#op-rowsdiv");
		a = 0;
	   
		$.each(layers,function(){
			var t = smap.core.layerInst._getLayer(this);
			if( t == null ){
				return;
			}			
			
			var decVal = t.options.opacity != null ? t.options.opacity : 1;
			var guiVal = Math.round(decVal * 100);

			var opRow = $("<div class='op-rows' id='" + t.options.layerId + "' ><span class='op-mapname'>" + t.options.displayName + "</span>" + 
				"<span class='op-values'>" + guiVal + "</span><input class='op-sliderdiv' data-slider-tooltip='hide'"+ 
				"data-slider-id='slider" + a + "' type='text' data-slider-min='0' data-slider-max='100' data-slider-value='" + guiVal + "' data-slider-step='1'/>" );		 

			opRow.children("input").slider().on('slide', function(ev){
				var theDiv = $(this).closest("div.op-rows");
				var lyrId = theDiv.get(0).id;
				var theLyr = smap.core.layerInst._getLayer(lyrId);
				
				if( theLyr.setOpacity ){
					theLyr.setOpacity(ev.value/100);
				}
				else if ( theLyr.options.style ){
					theLyr.setStyle({"opacity" : ev.value/100,"fillOpacity" : ev.value/100});
				}
				theDiv.children("span.op-values").text(ev.value);
			}).on('slideStart', function(ev){
				$('#op-modal').addClass('op-modal-slideeffect');			   
			}).on('slideStop', function(ev){
				$('#op-modal').removeClass('op-modal-slideeffect');
			});
	 
			a+=1;

			inputDiv.append(opRow);
			
		});
		
		   return opDiv;
	},

	_onClose: function(){
		if( this.options.savePrefBox && $("#op-prefs").is(":checked") == false){
			$.each($("div.op-rows"),function(){
				if( smap.core.layerInst._getLayer(this.id).setOpacity ){
					smap.core.layerInst._getLayer(this.id).setOpacity(1);
				}
				else if( theLyr.options.style ){
					theLyr.setStyle({"opacity" : 1,"fillOpacity" : 1});
				}
				$(this).children("span.op-values").text(100);  
			});
		}
	},

	activate: function() {
		var self = this;
		var inputDiv = self._addLayers(self.allNamesInGui);
		
		if (!self._$dialog) {
			if (self.options.savePrefBox && self.options.savePrefBox == true){
				var footerContent = "<div id='op-prefdiv'><label for='op-prefs'>" + self.lang.prefTxt + "</label><input id='op-prefs' type='checkbox' " + 
					" name='saveprefs' checked /></div><button type='button' class='btn btn-default' data-dismiss='modal'>"+this.lang.close+"</button>";
			}
			else{
				var footerContent = '<button type="button" class="btn btn-default" data-dismiss="modal">'+this.lang.close+'</button>';
			}
			self._$dialog = utils.drawDialog(self.lang.caption, inputDiv, footerContent);
			self._$dialog.attr("id", "op-modal");
					  
			self._$dialog.on("hidden.bs.modal", function() {
				self._onClose();
				self._$dialog.empty().remove();
				self._$dialog = null;
			});
		}
		
		self._$dialog.modal("show");

	},

	_createBtn: function() {
		var self = this;
		var $btn = $('<button id="smap-opacity-btn" title="' + this.lang.btntitle + '" class="btn btn-default"><span class="fa fa-adjust"></span></button>');
		$btn.on("click", function () {
			self.activate();
			return false;
		});
		this.$container.append($btn);
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
L.control.opacity = function (options) {
	return new L.Control.Opacity(options);
};