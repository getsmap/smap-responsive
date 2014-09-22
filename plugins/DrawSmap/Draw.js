L.Control.DrawSmap = L.Control.extend({
    options: {
        buttons: {
            polyline: {
            	addToPopover: true,
            	iconCss: "fa icon-large icon-vector-path-line",
            	displayName: "Polyline",
            	iconClass: "drawBtns"
            },
            polygon: {
            	addToPopover: true,
            	iconCss: "fa icon-large icon-vector-path-polygon",
            	displayName: "Polygon",
            	iconClass: "drawBtns"
            },
            rectangle: {
            	addToPopover: true,
            	iconCss: "fa icon-large icon-vector-path-square",
            	displayName: "Rectangle",
            	iconClass: "drawBtns"
            },
            circle: {
            	addToPopover: true,
            	iconCss: "fa icon-large icon-vector-path-circle",
            	displayName: "Circle",
            	iconClass: "drawBtns"
            },
            marker: {
            	addToPopover: true,
            	iconCss: " fa icon-large icon-map-marker",
            	displayName: "Marker",
            	iconClass: "drawBtns"
            },
            edit: {
            	addToPopover: true,
            	iconCss: "fa fa-edit",
            	displayName: "Edit",
            	iconClass: ""
            },
            remove: {
            	addToPopover: true,
            	iconCss: "fa fa-times",
            	displayName: "Remove",
            	iconClass: ""
            }
        }
    },

    _lang: {
        "sv": {
            caption: "rita",
            close: "Stäng",
            btntitle: "rita",

            lineTitle: "Rita en linje.",
            lineStart: "Klicka i kartan för att börja rita en linje.",
            lineCont: "Rita linje",
            lineEnd: "Rita linje",

            polylineTooltip: "hej",
            polygonTitle: "Rita figur",
            rectangleTitle: "Rita linje",
            circleTitle: "Rita cirkel",
            markerTitle: "Markör",

            editTooltip: "Ändra genom att dra i brytpunkter, eller markör.",

            rmDisabledTitle: "Inget att radera.",
            rmEnabledTitle: "Radera figur(er).",
            rmTooltip: "Klicka på en figur för att ta bort den."
        },
        "en": {
            caption: "draw",
            close: "Close",
            btntitle: "Draw",
            lineTitle: "Draw a line.",
            polygonTitle: "Draw a polygon.",
            rectangleTitle: "Draw a rectangle.",

            //Circle
            circleTitle: "Draw a circle.",
            circleTooltip: "Click and drag to draw a circle.",

            //Marker.
            markerTitle: "Draw a marker.",
            markerTooltip: "Click map to place a marker.",

            //Edit
            editDisabledTitle: "Nothing to edit.",
            editEnabledTitle: "Edit object(s).",
            editTooltip: "Drag handles, or marker, to edit objects.",
            editTooltipSub: "Click cancel-button to undo changes.",
            editSaveTxt: "Save it!",
            editSaveTooltip: "Save ur changes",
            editCancelTxt: "Cancel",
            editCancelTooltip: "Cancel this!",


            //Remove
            rmDisabledTitle: "Nothing to delete.",
            rmEnabledTitle: "Delete object(s).",
            rmTooltip: "Click an object to delete it."
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

    setTexts: function(){
        var t = L.drawLocal;
        var s = this.lang;

        //Set text, polyline
        t.draw.toolbar.buttons.polyline = s.lineTitle;
        //t.draw.handlers.polyline.tooltip.start = s.lineStart;
        //t.draw.handlers.polyline.tooltip.cont = s.lineCont;
        //t.draw.handlers.polyline.tooltip.end = s.lineEnd;

        //Set text, polygon
        t.draw.toolbar.buttons.polygon = s.polygonTitle;

        //Set text, rectangle
        t.draw.toolbar.buttons.rectangle = s.rectangleTitle;

        //Set text, circle
        t.draw.toolbar.buttons.circle = s.circleTitle;
        t.draw.handlers.circle.tooltip.start = s.circleTooltip;

        //Set text, marker
        t.draw.toolbar.buttons.marker = s.markerTitle;
        t.draw.handlers.marker.tooltip.start = s.markerTooltip;


        //Set text, edit
        t.edit.toolbar.buttons.editDisabled = s.editDisabledTitle;
        t.edit.toolbar.buttons.edit = s.editEnabledTitle;
        t.edit.handlers.edit.tooltip.text = s.editTooltip;
        t.edit.handlers.edit.tooltip.subtext = s.editTooltipSub;
        t.edit.toolbar.actions.save.text = s.editSaveTxt;
        t.edit.toolbar.actions.save.title = s.editSaveTooltip;
        t.edit.toolbar.actions.cancel.text = s.editCancelTxt;
        t.edit.toolbar.actions.cancel.title = s.editCancelTooltip;

        //Set text, remove
        t.edit.toolbar.buttons.removeDisabled = s.rmDisabledTitle;
        t.edit.toolbar.buttons.remove = s.rmEnabledTitle;
        t.edit.handlers.remove.tooltip.text = s.rmTooltip;

    },

    onAdd: function(map) {
        var self = this;
        self._drawcontainer = L.DomUtil.create('div', 'leaflet-control-drawsmap'); // second parameter is class name
        L.DomEvent.disableClickPropagation(self._drawcontainer);

        self.$drawcontainer = $(self._drawcontainer);
        self.initDone = false;
        self.currentTool = {};
        //self._createDrawTool();
        self.initDraw(self.$drawcontainer);
        return self._drawcontainer;
    },

    activate: function() {},

    initDraw: function(popoverdiv){
        var self = this;
        self.featureGroup = L.featureGroup().addTo(smap.map);

        self.drawControl = new L.Control.Draw({
            position: "bottomright",
            draw: {
                marker: false,
                polyline: false,
                polygon: false,
                rectangle: false,
                circle: false
                
            },
            edit: {
                edit: false,
                remove: false,
                featureGroup: self.featureGroup,
                selectedPathoptions: {
                    maintainColor: true,
                    opacity: 0.3
                }
            }
        });

        self.setTexts();

        smap.map.on('draw:created', function (e) {
            var type = e.layerType,
            layer = e.layer;
            
            layer.on("click", function(e){
                if(self.delModeOn == true){
                    self.featureGroup.removeLayer(layer);
                    if(!self.featureGroup.getLayers().length){
                        $("#drawsmapremove").prop("disabled",true);
                        $("#drawsmapedit").prop("disabled",true);
                        self.currentTool.disable();
                        self.currentTool = {};
                        self.delModeOn = false;
                    }
                }
                return false;
            });
            self.featureGroup.addLayer(layer);
            
            $("#drawsmapremove").prop("disabled",false);
            $("#drawsmapedit").prop("disabled",false);
            self.currentTool = {};
        });

        smap.map.on('draw:edited', function (e) {
            //var layers = e.layers;
            //layers.eachLayer(function (layer) {});
        });
        

        //this.drawControl.addTo(smap.map);
       // var rt = this.drawControl.getContainer();
        //popoverdiv.append($(rt));
        
        $.each(self.options.buttons,function(k,v){
            if (v.addToPopover === true){
                var tool = self._createToolBtn(k,v);
                popoverdiv.append(tool);
            }
        });
        
        
//        $('.thandler-btn').on('click',function(e){
//        	alert("hil");
//        	
//        	if ( $(".thandler-popover").data('bs.popover') ) {
//	            if ($(".thandler-popover").is(":visible")) {
//	                            $(".drawsmap-popover").hide();
//					alert("POP");
//	            }
//	            else{
//	                $(".drawsmap-popover").show();
//	                alert("NO");
//	            }
//	        }
//        				
//        
//        });
        return popoverdiv;
    },

    _createToolBtn : function(tooltype,obj){
        var self = this;
        tooltype.toLowerCase();
        var $toolbtn = $('<button id="drawsmap'+tooltype+'" class="btn btn-default '+obj.iconClass+' " title="'+obj.displayName+'"><span></span></button>');
       
        tooltype = tooltype.charAt(0).toUpperCase() + tooltype.slice(1);
       
        switch(tooltype) {
            case "Polyline":
                var t = new L.Draw.Polyline(smap.map, self.drawControl.options.draw.polyline);
                break;
            case "Polygon":
                var t = new L.Draw.Polygon(smap.map, self.drawControl.options.polygon);
                break;
            case "Rectangle":
                var t = new L.Draw.Rectangle(smap.map, self.drawControl.options.rectangle);
                break;
            case "Circle":
                var t = new L.Draw.Circle(smap.map, self.drawControl.options.circle);
                break;
            case "Marker":
                var t = new L.Draw.Marker(smap.map, self.drawControl.options.marker);
                break;
            case "Edit":
                var t = new L.EditToolbar.Edit(smap.map, {
                    featureGroup: self.drawControl.options.edit.featureGroup,
                    selectedPathOptions: self.drawControl.options.edit.selectedPathOptions
                });
                    
                if(!self.featureGroup.getLayers().length){
                    $toolbtn.prop("disabled",true);
                }
                break;
            case "Remove":
                var t = new L.EditToolbar.Delete(smap.map, {
                    featureGroup: self.drawControl.options.edit.featureGroup
                });
                 if(!self.featureGroup.getLayers().length){
                    $toolbtn.prop("disabled",true);
                }
                break;
            default:
                return;
        }

        $toolbtn.on("click", function(e){
            if( t.enabled() == true ){
                t.disable();
                self.currentTool = {};
                self.delModeOn = false; 
            }
            else{
                self.currentTool.type == "remove" ? self.delModeOn = false : "";
                $.isEmptyObject(self.currentTool) == true ? self.currentTool = t : self.currentTool.disable();
                t.enable();
                t.type == "remove" ? self.delModeOn = true : "";
                self.currentTool = t;
            }
            
        });
        
//        if ( $(".thandler-popover").data('bs.popover') ) {
//            if ($(".thandler-popover").is(":visible")) {
//                            $(".drawsmap-popover").hide();
//				alert("hi");
//            }
//            else{
                //$(".drawsmap-popover").show();
//                alert("NO");
//            }
//        }
                
//        popover thandler-popover fade bottom in
        
//        height: 2.55em;
//        padding: 4px;
//        border-right-width: 1px;
//        margin-right: 5px;
        
        $toolbtn.find("span").addClass(obj.iconCss);
		return $toolbtn;
    },

    _createDrawTool: function() {
        var self = this;
        var $btn = $('<button id="smap-drawsmap-btn" title="' + self.lang.btntitle + '" class="btn btn-default"><span ></span><i class="fa fa-th"></i></button>');
        
        self.$drawcontainer.append($btn);

        $btn.on("click", function () {
            var $this = $(this);
        
            if ( $this.data('bs.popover') ) {
                if ($(".drawsmap-popover").is(":visible")) {
                    $(".drawsmap-popover").hide();
                }
                else{
                    $(".drawsmap-popover").show();
                }
            }
            else{
                $this.popover({
                    placement: "bottom",
                    container: "body",
                    title: self.lang.popoverTitle,
                    trigger: "manual" 
                });

                $this.on("shown.bs.popover", function() {

                    if(!self.initDone){
                        var $popover = $(".popover"),
                        $popCont = $(".popover-content");
                        $popover.addClass("drawsmap-popover");
                        $popCont.attr('id', 'drawsmap-popover');
                        self.initDraw($popCont);
                        self.initDone = true;

                    }
                });
                
                $this.on("hidden.bs.popover", function() { console.log("hidden"); });
                $this.popover("show");
            }
            return false;
         });
        
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
L.control.drawsmap = function (options) {
    return new L.Control.DrawSmap(options);
};