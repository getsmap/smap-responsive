L.Control.Opacity = L.Control.extend({
    options: {
        position: 'bottomright',
        addToMenu: true
    },

    _lang: {
        "sv": {
            caption: "Opacitetsverktyg",
            close: "Stäng",
            collapsebtn: "visa/dölj lager"
        },
        "en": {
            caption: "Opacity tool",
            close: "Close",
            collapsebtn: "show/hide layers"
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
        self.allNamesInGui = [];

        map.on("layeradd layerremove", function(e) {
            
            if (!e.layer.options || !e.layer.options.layerId || e.layer.feature) {
                return;
            }
            
            var layerId = e.layer.options.layerId;
            if($.inArray(layerId,self.allNamesInGui) != -1){
                if (e.type === "layerremove") {
                    var delLayer = $.inArray(layerId,self.allNamesInGui);
                    self.allNamesInGui.splice(delLayer,1);
                    $("#op-rowsdiv").find("#"+layerId).remove();                     
                }
                return;
            }
            self.allNamesInGui.push(layerId);
        });

        self._container = L.DomUtil.create('div', 'leaflet-control-Opacity'); // second parameter is class name

        L.DomEvent.disableClickPropagation(self._container);

        self.$container = $(self._container);
        self._createBtn();

        return self._container;
    },

    _addLayers: function(layers) {
        var opDiv = $("<div class='op-opdiv'><button id='op-collapsebtn' type='button' class='btn' data-toggle='collapse' "+
            "data-target='#op-rowsdiv'>" + this.lang.collapsebtn + "</button><div id='op-rowsdiv' class='collapse in'></div></div>");
        
        var inputDiv = opDiv.children("#op-rowsdiv");
        var a = 0;
       
        $.each(layers,function(){
            var t = smap.core.layerInst._getLayer(this);
            if( t == null ){
                return;
            }

            var opRow = $("<div class='op-rows' id='" + t.options.layerId + "' ><span class='op-mapname'>" + t.options.displayName + "</span>" + 
                "<input class='op-sliderdiv' data-slider-id='slider" + a + "' type='text' data-slider-min='0'" +
                "data-slider-max='100' data-slider-value='100' data-slider-step='1'/>" );         


            opRow.children("input").slider().on('slide', function(ev){
                var lyrId = $(this).closest("div.op-rows").get(0).id;
                var theLyr = smap.core.layerInst._getLayer(lyrId);
                theLyr.setOpacity(ev.value/100);
            });
     
            a+=1;

            inputDiv.append(opRow);
            
        });
        
           return opDiv;
    },

    activate: function() {
        var self = this;
        var inputDiv = self._addLayers(self.allNamesInGui);
        
        if (!self._$dialog) {
            var footerContent = '<button type="button" class="btn btn-default" data-dismiss="modal">'+this.lang.close+'</button>';
            self._$dialog = utils.drawDialog(self.lang.caption, inputDiv, footerContent);
            self._$dialog.attr("id", "op-modal");
                      
            /*this._$dialog.on("hide.bs.modal", function() {
            	// Hide keyboard on touch devices
            	$(this).find('input[type=text]').blur();
            });*/

            self._$dialog.on("hidden.bs.modal", function() {
            	self._$dialog.empty().remove();
            	self._$dialog = null;
            });
        }
        
        self._$dialog.modal("show");

    },

    _createBtn: function() {
        var self = this;

        if(self.options.addToMenu) {
            smap.cmd.addToolButton( "", "fa fa-share-square-o", function () {
                self.activate();
                return false;
            },null);
        }

        else {
            var $btn = $('<button id="smap-info-btn" class="btn btn-default"><span class="fa fa-share-square-o"></span></button>');
            $btn.on("click", function () {
                self.activate();
                return false;
            });
            self.$container.append($btn);
        }

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