    L.Control.Print = L.Control.extend({
        options: {
            position: 'bottomright', // just an example
            addToMenu: false,
            printUrl: "printMock.py"
        },

        _lang: {
            "sv": {
                caption: "Skriv ut",
                close: "Stäng"
            },
            "en": {
                caption: "Print",
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

            this._container = L.DomUtil.create('div', 'leaflet-control-Print'); // second parameter is class name
            L.DomEvent.disableClickPropagation(this._container);

            this.$container = $(this._container);
            this._createBtn();

            return this._container;
        },

        activate: function() {

            var self = this;
            
            var params = smap.cmd.createParamsAsObject();
            
            $.post(this.options.printUrl, { params: params },
                function (data) {
                    
                    var win=window.open('about:blank');
                    with(win.document)
                        {
                            open();
                            write(data);
                            close();
                        }
                });

        },

        _createBtn: function() {


            var self = this;


            if(this.options.addToMenu) {
                smap.cmd.addToolButton( "", "fa fa-print", function () {
                    self.activate();
                    return false;
                },null);
            }

            else {
                var $btn = $('<button id="smap-print-btn" class="btn btn-default"><span class="fa fa-print"></span></button>');
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
     L.control.Print = function (options) {
        return new L.Control.Print(options);
    };