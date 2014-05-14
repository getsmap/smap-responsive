L.Control.ShareLink = L.Control.extend({
    options: {
        position: 'bottomright', // just an example
        addToMenu: true
    },

    _lang: {
        "sv": {
            caption: "Länk till kartan",
            close: "Stäng"
        },
        "en": {
            caption: "Link to the map",
            close: "Close"
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

        this._container = L.DomUtil.create('div', 'leaflet-control-ShareLink'); // second parameter is class name
        L.DomEvent.disableClickPropagation(this._container);

        this.$container = $(this._container);
        this._createBtn();

        return this._container;
    },

    activate: function() {
    	var self = this;
        var url = smap.cmd.createParams(true);
        var inputDiv = $('<div class="form-group"><input type="text" class="form-control" placeholder="'+this.lang.caption+'"></div>');
        var input = inputDiv.find("input");
        input.val(url);

        var select = function(tag) {
//        	tag.selectionStart = 0;
//        	tag.selectionEnd = 9999;
        	tag.setSelectionRange(0, 9999);
//        	$(tag).select();
        };
        
        if (!this._$dialog) {
            var footerContent = '<button type="button" class="btn btn-default" data-dismiss="modal">'+this.lang.close+'</button>';
            this._$dialog = utils.drawDialog(this.lang.caption, inputDiv, footerContent);
            this._$dialog.attr("id", "slink-modal");
            
            input.on("tap click", function() {
            	select(this);
            });
            this._$dialog.on("shown.bs.modal", function() {
        		select(input[0]);
        	});
            this._$dialog.on("hide.bs.modal", function() {
            	// Hide keyboard on touch devices
            	$(this).find('input[type=text]').blur();
            });
            this._$dialog.on("hidden.bs.modal", function() {
            	self._$dialog.empty().remove();
            	self._$dialog = null;
            });
            
        }
        this._$dialog.modal("show");

    },

    _createBtn: function() {


        var self = this;
        if(this.options.addToMenu) {
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
            this.$container.append($btn);
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
L.control.sharePos = function (options) {
    return new L.Control.SharePos(options);
};