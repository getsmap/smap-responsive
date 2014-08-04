L.Control.ToolHandler = L.Control.extend({
    options: {
        position: 'bottomright',
        showPopoverTitle: true
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

        this._makeToolHandler();
        smap.event.on("smap.core.pluginsadded", function() {
            $('.leaflet-control').children("button").each(function(){
               // $(this).addClass("th-btn");
               self._addButton( $(this) );
            });
        });

        // smap.event.on("smap.core.pluginsadded", $.proxy(, this));

        return self._container;
    },

    activate: function() {},

    _makeToolHandler: function() {
        var self = this;

        var $thCont = $(".leaflet-top.leaflet-right")  //$('<div class="thandler-container" class="thandler-div btn-group-lg"></div>');
        this.$thCont = $thCont;

        $thCont.addClass("thandler-container");

        // The button that toggles the tool container
        var $thBtn = $('<div class="thandler-btn popover-dismiss"><button type="button" class="btn btn-default thbtn"><span class="fa fa-th"></span></button></div>');

        $("#mapdiv").append($thBtn);
        
        function onFocusOut() {
            if (!self._popoverWorking) {
                self._popoverWorking = true;
                $thBtn.popover("hide");
            }
        }
        
        this._map.on("click dragstart", function() {
            $thBtn.popover("hide");
        });

        $(window).on("orientationchange", function() {
            $thBtn.popover("hide");
        });

        $thBtn.on("click", function() {
            if ( self._popoverWorking ) {
                return false;
            }
            self._popoverWorking = true;

            var $this = $(this);
            if ( $this.data('bs.popover') ) {
                var isVisible = $(".thandler-popover").length && parseInt($(".thandler-popover").css("opacity") || 0) > 0;
                if (isVisible) {
                    $this.popover("hide");
                    return;
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
                    $popCont.append( $(".thandler-container").children(":has('button')") );
                    
                    $this.on("focusout", onFocusOut);

                    setTimeout(function() {
                        self._popoverWorking = false;
                    }, 150);
                });
                $this.on("hidden.bs.popover", function() {
                    $this.off("focusout", onFocusOut);
                    var $popCont = $(".popover-content");

                    // It seems as though the hidden.bs.popover-event is triggered before animation 
                    // is completed - so we need to add a timeout, to avoid ugly animation.
                    setTimeout(function() {
                        $(".thandler-container").append( $popCont.children() );
                        self._popoverWorking = false;
                    }, 150);
                });
                // $(".thandler-container").toggleClass("thandler-visible");
            }
            $this.popover("show");
            return false;
        });

        // $(window).on("resize", function() {
        //     $(".thandler-btn").popover("hide");
        // });
        $thBtn.on("tap", function() {
            return false;
        });
        $thBtn.on("dblclick", function() {
            return false;
        });

        // self.$thCont.append($thBtn).append($thCont);
        // $("#mapdiv").append( self.$thCont);

        // TODO: Should be possible to solve purely with CSS
        // $(window).resize(function(){    
        //     if ( $(".thandler-btn").css("display") == "none"){
        //         $(".thandler-container").addClass("thandler-div btn-group-lg").removeClass("thandler-div-small btn-group-vertical");
        //     }
        // });
    },

    /**
     * Each time a button is added this function should be called
     * @param {[type]} btn [description]
     */
    _addButton: function($btn) {
        // this.$thCont.append( $btn.parent() );


        // $btn.children("button").click(function(){
        //     if ($(".thandler-container").hasClass("thandler-div-small") ){
        //         $(".thandler-container").removeClass("thandler-div-small btn-group-vertical").addClass("thandler-div btn-group-lg");
        //     }
        //     else {
        //         $(".thandler-container").removeClass("thandler-div btn-group-lg").addClass("thandler-div-small btn-group-vertical");
        //     }
        // });
    },

    /**
     * Each time a button is remove this function should be called
     * @param {[type]} btn [description]
     */
    _removeButton: function(btn) {},

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