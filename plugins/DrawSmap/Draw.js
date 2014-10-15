/*

This plugin requires:
leaflet.draw.js, 
bootstrap-3/bootstrap.icon-large.css,
notify-custom/notify.js
leaflet.label.js

*/

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
            	iconClass: "drawBtns",
            	showArea: true
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
            },
            save: {
            	addToPopover: true,
            	iconCss: "fa icon-large icon-map-save",
            	displayName: "Save",
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
			
			self.bindLabelNotify(e);
			            
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
			console.log('STARTED!');
        });
        smap.map.on('draw:editstop', function (e) {
        	self.bindLabelNotify(this);
        });
        
        
        $.each(self.options.buttons,function(k,v){
            if (v.addToPopover === true){
                var tool = self._createToolBtn(k,v);
                popoverdiv.append(tool);
            }
        });

        return popoverdiv;
    },
    
    hideNotify: function(){
    	var nc = $('.notifyjs-container').is(":visible");
    	if(nc){
    		$('.notifyjs-container').parent().remove();
    	}
    },
    
    bindLabelNotify: function(e){
    	var self = this;
		if(e.layerType === "marker"){
			self.hideNotify();

			var result = e.layer._latlng;
			var sticklbl = e.layer.bindLabel(''+result+'',{ noHide: false });
			sticklbl.on('click',function(evt){
				self.hideNotify();
				self.showResults(result);
			});
			self.showHideLbl(sticklbl);			
			self.showResults(result);
			
		}
		if(e.layerType === "circle"){
			self.hideNotify();

		 	var result = e.layer._mRadius.toFixed(2);
		 	var sticklbl = e.layer.bindLabel(''+result+'',{ noHide: true });
		 	sticklbl.on('click',function(evt){
		 		self.hideNotify();
				self.showResults("Radius: "+result);
		 	});
			self.showHideLbl(sticklbl);
		 	self.showResults("Radius: "+result);
		 	
		}
		if(e.layerType === "rectangle"){
			self.hideNotify();
			var da = e.layer._latlngs[0];
			var db = e.layer._latlngs[1];
			var dab = da.distanceTo(db);
			var dc = e.layer._latlngs[2];
			var dd = e.layer._latlngs[3];
			var dcd = dc.distanceTo(dd);

			var area = (dab*dcd).toFixed(2);
			
			var sticklbl = e.layer.bindLabel(''+area+'',{ noHide: true });
			sticklbl.on('click',function(evt){
				self.hideNotify();
				self.showResults("Area: "+area);
			});
			self.showHideLbl(sticklbl);
			self.showResults("Area: "+area);
		}
		if(e.layerType === "polygon"){
			self.hideNotify();
			
		}
		
		if(e.layerType === "polyline" || e.handler === "edit"){
			self.hideNotify();
			var polyline = L.polyline(e.layer._latlngs);
            
            var result = utils.getLength(e.layer._latlngs);
			// var result = polyline.measuredDistance();
			self.showResults(result);
			var sticklbl = e.layer.bindLabel(''+result+'',{ noHide: true });
			sticklbl.on('click',function(evt){
				self.hideNotify();
				self.showResults(result);
			});

			self.showHideLbl(sticklbl);
		
		     //Returns the distance in imperial units
		     //var result_imp =  polyline.measuredDistance({
		     	//metric: false
		     //});
		 }
    },
    
    showHideLbl: function(sticklbl){
    	sticklbl.on('mouseover', function(){
    		var draw  = $('.leaflet-draw-tooltip').is(':visible');
    		if(draw){
    			$('.leaflet-draw-tooltip').hide();
    		}
    	}, this)
    	.on('mouseout', function() {
    		$('.leaflet-draw-tooltip').show();
    	},this);
    },
        
    showResults: function(results){
    	$.notify.addStyle('happywhite', {
    	  "html": '<div>'
    	  +'<span data-notify-text/>'
    	  +'<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'
    	  +'</div>',
    	  "classes": {
    	    "base": {
    	      "white-space": "nowrap",
    	      "background-color": "#fff",
    	      "padding": "15px",
    	      "width": "auto",
    	      "height": "auto",
    	      "font-size": "16px"
    	    },
    	    "superblue": {
    	      "color": "#000",
    	      "background-color": "#fff"
    	    }
    	  }
    	});
    	
    	$.notify(''+results+'', {
    		"position": "b c",
       		"style": 'happywhite',
       		"clickToHide": false,
       		"autoHide": false
    	});
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
            case "Save":
                
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
