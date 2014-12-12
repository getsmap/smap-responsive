/*
*  Leaflet.wfst.js a WFS-T plugin for Leaflet.js
*  (c) 2013, Michael Moore
*
* Many thanks to georepublic.info for enough info to get up and running: http://blog.georepublic.info/2012/leaflet-example-with-wfs-t/
*/

L.WFST = L.GeoJSON.WFS.extend({

    // These functions overload the parent (GeoJSON) functions with some WFS-T
    // operations and then call the parent functions to do the Leaflet stuff

    initialize: function(geojson,options){
        // These come from OL demo: http://openlayers.org/dev/examples/wfs-protocol-transactions.js
        var initOptions = L.extend({
            showExisting: true,     // Show existing features in WFST layer on map?
            version: "1.1.0",         // WFS version 
            error: function(msg){}, // Function for handling initialization errors
            xsdNs: 'xsd'
            // geomField : <field_name> // The geometry field to use. Auto-detected if only one geom field 
            // url: <WFS service URL> 
            // featureNS: <Feature NameSpace>
            // featureType: <Feature Type>
            // uniqueKey: <The Primary Key field for using when doing deletes and updates>
            // xsdNs: Namespace used in XSD schemas, XSD returned by TinyOWS uses 'xs:' while GeoServer uses 'xsd:'
        },options);


        if(typeof initOptions.url == 'undefined'){ throw "ERROR: No WFST url declared"; }
        if(typeof initOptions.featureNS == 'undefined'){ throw "ERROR: featureNS not declared"; }
        if(typeof initOptions.featureType == 'undefined'){ throw "ERROR: featureType not declared"; }

        initOptions.typename = initOptions.featureNS + ':' + initOptions.featureType;

        initOptions.params = {
            typeName: initOptions.typename,
            srsName: initOptions.srs
        };

        // Call to parent initialize

        L.GeoJSON.WFS.prototype.initialize.call(this, geojson, initOptions);

        // Now probably an ajax call to get existing features
        // if(this.options.showExisting){
        //  this._loadExistingFeatures();
        // }
        // this._loadFeatureDescription();
    },
    // Additional functionality for these functions
    addLayer: function(layer, options) {
        // this.wfstAdd(layer,options);
        // Call to parent addLayer
        L.GeoJSON.WFS.prototype.addLayer.call(this,layer);
        this._loadFeatureDescription();

    },
    // removeLayer: function(layer,options) {
    //  // this.wfstRemove(layer,options);

    //  // Call to parent removeLayer
    //  L.GeoJSON.WFS.prototype.removeLayer.call(this,layer);
    // },


    // These functions are unique to WFST

    // WFST Public functions

    /* 
    Save changes to one or more layers which we may or may not already have
    layer : a single layer or array of layers. Possibly an empty array
    */
    wfstAdd: function(layers,options){
        options = options || {};
        layers = layers ? (L.Util.isArray(layers) ? layers : [layers]) : [];

        for (var i = 0, len = layers.length; i < len; i++) {
            this._wfstAdd(layers[i],options);
        }
    },
    wfstRemove: function(layers,options) {
        options = options || {};
        if(layers === null){
            this._wfstRemove(null,options);
        }

        layers = layers ? (L.Util.isArray(layers) ? layers : [layers]) : [];

        var defs = [];
        for (var i = 0, len = layers.length; i < len; i++) {
            defs.push( this._wfstRemove(layers[i],options) );
        }
        return $.when.apply($, defs);
    },

    wfstSave: function(layers,options){
        options = options || {};
        realsuccess = options.success;
        layers = layers ? (L.Util.isArray(layers) ? layers : [layers]) : [];

        var v;
        for (var i = 0, len = layers.length; i < len; i++) {
            if(typeof layers[i]._layers == 'object'){
                for(v in layers[i]._layers){   
                    this._wfstSave(layers[i]._layers[v],options);
                }
            }else{
                this._wfstSave(layers[i], options);
            }
        }
    },
    wfstTouch: function(layers,options){
        // Touch a file so it needs to be saved again
        layers = layers ? (L.Util.isArray(layers) ? layers : [layers]) : [];
        console.log("Save layers now!");

        for (var i = 0, len = layers.length; i < len; i++) {
            layers[i]._wfstSaved = false;
        }
    },
    wfstSaveDirty: function(options){
        for(var i in this._layers){
            if(typeof this._layers[i].feature._wfstSaved == 'undefined'){
                this._wfstAdd(this._layers[i],options);
            }else if(this._layers[i].feature._wfstSaved === false){
                this._wfstSave(this._layers[i],options);
            }
        }
    },


    // WFST Private functions

    // Interesting / real functions
    // Add a single layer with WFS-T
    _wfstAdd: function(layer, options){
        options = options || {};

        if(typeof layer.feature != 'undefined' && 
            typeof layer.feature._wfstSaved == 'boolean' && 
        layer.feature._wfstSaved){
            return true; // already saved
        }

        var realsuccess;
        if(typeof options.success == 'function'){
            realsuccess = options.success;
        }
        var self = this;
        options = L.extend(options,{
            success: function(res){
                var xml = this._wfstSuccess(res);
                self.fire("wfst:savesuccess");
                if(typeof realsuccess == 'function' && xml !== false){
                    layer.feature = layer.feature || {};
                    layer.feature._wfstSaved = true;

                    // Populate the IDs of the object we just inserted. 
                    // Since we do one insert at a time, it should always be object 0
                    var fid = this._getElementsByTagName(xml,'ogc:FeatureId')[0].getAttribute('fid');
                    layer.feature.id = fid;
                    layer.feature.properties[this.options.uniqueKey] = fid.replace(this.options.featureType + '.','');

                    realsuccess(res);
                }else if(typeof options.error == 'function'){
                    self.fire("wfst:saveerror");
                    options.error(res);
                }
            }
        });

        var xmlPre = this.options._xmlpre;
        if (this.options.geomType && this.options.geomType.toUpperCase() === "MULTIPOLYGON") {
            xmlPre = xmlPre.replace(/version="1.1.0"/, 'version="1.0.0"');
        }
        var xml = xmlPre;

        xml += "<wfs:Insert>";
        xml += "<" + this.options.typename + ">";
        xml += this._wfstSetValues(layer);
        xml += "</" + this.options.typename + ">";
        xml += "</wfs:Insert>";
        xml += "</wfs:Transaction>";

        return this._ajax( L.extend({type:'POST', data:xml},options));
    },

    // Remove a layers with WFS-T
    _wfstRemove: function(layer,options) {
        if(typeof this.options.uniqueKey == 'undefined' && typeof options.where == 'undefined'){
            console.log("I can't do deletes without a uniqueKey!");
            if(typeof options.error == 'function'){
                options.error();
            }
            return false;
        }

        var realsuccess;
        if(typeof options.success == 'function'){
            realsuccess = options.success;
        }
        var self = this;
        options = L.extend(options,{
            success: function(res){
                self.fire("wfst:savesuccess");
                if(typeof realsuccess == 'function' && this._wfstSuccess(res)){
                    if(layer !== null){
                        layer.feature = layer.feature || {};
                        layer.feature._wfstSaved = true;
                    }
                    realsuccess(res);
                }else if(typeof options.error == 'function'){
                    self.fire("wfst:saveerror");
                    options.error(res);
                }
            }
        });

        var where; 
        if(typeof options.where == 'undefined'){
            where = {};
            where[this.options.uniqueKey] = layer.feature.properties[this.options.uniqueKey];
        }else{
            where = options.where;
        }

        var xmlPre = this.options._xmlpre;
        // if (layer.options.geomType.toUpperCase() === "MULTIPOLYGON") {
        //     xmlPre = xmlPre.replace(/version="1.1.0"/, 'version="1.0.0"');
        // }
        var xml = xmlPre;
        xml += '<wfs:Delete typeName="'+this.options.typename+'">';
        xml += this._whereFilter(where);
        xml += "</wfs:Delete>";
        xml += "</wfs:Transaction>";

        return this._ajax( L.extend({type:'POST', data:xml},options));
    },


    //  Save changes to a single layer with WFS-T
    _wfstSave: function(layer,options){
        if(typeof this.options.uniqueKey == 'undefined'){
            console.log("I can't do saves without a uniqueKey!");
            if(typeof options.error == 'function'){
                options.error();
            }
            return false;
        }

        options = options || {};

        var realsuccess;
        if (typeof options.success == 'function'){
            realsuccess = options.success;
        }
        var self = this;
        options = L.extend(options, {
            success: function(res) {
                self.fire("wfst:savesuccess");
                if(typeof realsuccess == 'function' && this._wfstSuccess(res)){
                    layer.feature._wfstSaved = true;
                    realsuccess(res);
                }else if(typeof options.error == 'function'){
                    self.fire("wfst:saveerror");
                    options.error(res);
                }
            }
        });

        var where = {};
        where[this.options.uniqueKey] = layer.feature.properties[this.options.uniqueKey];

        var xmlPre = this.options._xmlpre;
        if (layer.options.geomType && layer.options.geomType && layer.options.geomType.toUpperCase() === "MULTIPOLYGON") {
            xmlPre = xmlPre.replace(/version="1.1.0"/, 'version="1.0.0"');
        }
        var xml = xmlPre;
        xml += '<wfs:Update typeName="'+this.options.typename+'">';
        xml += this._wfstUpdateValues(layer, options.newProps);
        xml += this._whereFilter(where);
        xml += "</wfs:Update>";
        xml += "</wfs:Transaction>";

        return this._ajax( L.extend({type:'POST', data:xml},options));
    },


    // Utility functions

    // Build the xml for setting/updating fields
    _wfstSetValues: function(layer){
        var xml = '';
        var field = this._wfstValueKeyPairs(layer);

        if(!field){
            return false;
        }
        for(var f in field){
            xml += "<" + this.options.featureNS + ":" + f +">";
            xml += field[f];
            xml += "</" + this.options.featureNS + ":" + f +">";
        }

        return xml;
    },
    _wfstUpdateValues: function(layer, newProps){
        newProps = newProps || {};

        var xml = '';
        var field = this._wfstValueKeyPairs(layer);

        if(!field){
            return false;
        }

        if (newProps) {
            $.extend(field, newProps);
        }

        for(var f in field){
            if(field[f] !== null && field[f] !== ''){
                xml += "<wfs:Property>";
                xml += "<wfs:Name>" + f + "</wfs:Name>";
                xml += "<wfs:Value>" + field[f] + "</wfs:Value>";
                xml += "</wfs:Property>";
            }
        }

        return xml;
    },
    _wfstValueKeyPairs: function(layer){
        var field = {};
        var elems = this._fieldsByAttribute();
        var geomFields = [];

        for(var p = 0;p < elems.length;p++){
            attr = elems[p].getAttribute('name');

            if( typeof layer.feature != 'undefined' && 
                typeof layer.feature.properties != 'undefined' && 
                typeof layer.feature.properties[attr] != 'undefined'
            ){
                // Null value present, but not allowed
                if(layer.feature.properties[attr] === null && !elems[p].getAttribute('nillable')){
                    console.log("Null value given for non nillable field: " + attr);
                    return false; // No value given for required field!
                }else if(layer.feature.properties[attr] !== null){
                    field[attr] = layer.feature.properties[attr]; 
                }else{
                    // Not sure what to do with null values yet. 
                    // At the very least Geoserver isn't liking null where a date should be.
                }
            }else if(
                elems[p].getAttribute('type') === 'gml:GeometryPropertyType' || 
                elems[p].getAttribute('type') === 'gml:PointPropertyType' || 
                elems[p].getAttribute('type') === 'gml:MultiPointPropertyType' ||
                elems[p].getAttribute('type') === 'gml:MultiSurfacePropertyType' || 
                elems[p].getAttribute('type') === 'gml:SurfacePropertyType'  ||
                // Johan was here
                elems[p].getAttribute('type') === 'gml:MultiLineStringPropertyType' ||
                elems[p].getAttribute('type') === 'gml:LineStringPropertyType' ||
                elems[p].getAttribute('type') === 'gml:MultiCurvePropertyType'
                
            ){
                geomFields.push(elems[p]);
            }else if(elems[p].getAttribute('nillable') == 'false'){
                if(elems[p].getAttribute('maxOccurs') != "1" && elems[p].getAttribute('minOccurs') != "1"){
                    console.log("No value given for required field " + attr);
                    return false; // No value given for required field!
                }
            }
        }

        // Only require a geometry field if it looks like we have geometry but we aren't trying to save it
        if(
            (geomFields.length || layer.hasOwnProperty('x') && layer.hasOwnProperty('y') && typeof layer.x != 'undefined' && typeof layer.y != 'undefined') ||
            (layer.hasOwnProperty('_latlng') && Object.keys(layer._latlng).length > 0)
        ){
            if(this.options.geomField || geomFields.length === 1){
                this.options.geomField = this.options.geomField || geomFields[0].getAttribute('name');
                field[this.options.geomField] = layer.toGML();
            }else{
                console.log("No geometry field!");
                return false;
            }
        }

        return field;
    },
    // Make WFS-T filters for deleting/updating specific items
    _whereFilter: function(where){
        var xml = '<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">';
        for(var propertyName in where){
            xml += '<ogc:PropertyIsEqualTo>';
            xml += '<ogc:PropertyName>' + propertyName + '</ogc:PropertyName>';
            xml += '<ogc:Literal>' + where[propertyName] + '</ogc:Literal>';
            xml += '</ogc:PropertyIsEqualTo>'; 
        }
        xml += '</ogc:Filter>';
        return xml;
    },



    /* Make an ajax request
    options: {
    url: url to fetch (required),
    method : GET, POST (optional, default is GET),
    success : function (optional), must accept a string if present
    error: function (optional), must accept a string if present
    }
    */
    _ajax: function(options){
        var self = this;
        var url = options.url || this.options.url;
        options.url = this.options.proxy ? this.options.proxy + encodeURIComponent(url) : url;
        options = L.extend({
            type: "GET",
            context: this,
            dataType: "text",
            success: function(r){console.log(r);},
            error: function(r){
                self.fire("wfst:ajaxerror");
                console.log(r);
            }
        }, options);

        // var xmlhttpreq = (window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP'));
        // xmlhttpreq.onreadystatechange=function() {
        //     if(xmlhttpreq.readyState==4){
        //         if(xmlhttpreq.status==200){
        //             options.success.call(options.context, xmlhttpreq.responseText);
        //         }else{
        //             options.failure.call(options.context, xmlhttpreq.responseText);
        //         }
        //     }
        // };
        options.contentType = "application/xml";
        return $.ajax(options);

        // JL: I'm using jquery instead of this
        // xmlhttpreq.open(options.type,options.url,true);
        // xmlhttpreq.send(options.data);

    },

    // _swapCoords: function(coords) {
    //  coords = [coords[1], coords[0]];
    //  return coords;
    // },

    /*
    Get all existing objects from the WFS service and draw them
    */
    // _loadExistingFeatures: function(){
    //  var geoJsonUrl = this.options.url + '?service=WFS&version=' + this.options.version + '&request=GetFeature&typeName=' + this.options.featureNS + ':' + this.options.featureType + '&outputFormat=application/json';
    //  this._ajax({
    //      url: geoJsonUrl,
    //      success: function(res) {
    //          res = JSON.parse(res);
    //          var features = res.features,
    //              reverseAxis = this.options.reverseAxis,
    //              i, f;
    //          for (i=0,len=features.length; i<len; i++) {
    //              f = features[i];
    //              if (reverseAxis && f.geometry && f.geometry.coordinates) {
    //                  // Swap coords
    //                  f.geometry.coordinates = swapCoords(f.geometry.coordinates);
    //              }
    //              f._wfstSaved = true;
    //          }
    //          this.addData(res.features);
    //      }
    //  });
    // },
    /*
    Get the feature description
    */
    _loadFeatureDescription: function(){
        var describeFeatureUrl = this.options.url + '?service=WFS&version=' + this.options.version + '&request=DescribeFeatureType&typename=' + this.options.featureNS + ':' + this.options.featureType;
        this._ajax({
            url: describeFeatureUrl,
            success: function(res){
                xml = this._wfstSuccess(res);
                if(xml !== false){
                    this.options.featureinfo = xml;
                    this._xmlPreamble();
                    this.ready = true;
                }else{
                    this.options.error("There was an exception fetching DescribeFeatueType");
                }
            }
        });
    },

    // Deal with XML -- should probably put this into gml and do reading and writing there
    _parseXml: function(rawxml){
        if (window.DOMParser)
        {
            parser=new DOMParser();
            xmlDoc=parser.parseFromString(rawxml,"text/xml");
        }
        else // Internet Explorer
        {
            xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async=false;
            xmlDoc.loadXML(rawxml);
        } 

        return xmlDoc;
    },
    _xmlPreamble: function(){
        // var objectName = this._getElementsByTagName(this.options.featureinfo,'xsd:complexType')[0].getAttribute('name');
        // this.featureNS = this._getElementsByTagName(this.options.featureinfo,'xsd:schema')[0].getAttribute('targetNamespace');

        var _xmlpre = '';
        _xmlpre = '';
        _xmlpre += '<wfs:Transaction service="WFS" version="' + this.options.version + '"'; 
        _xmlpre += ' xmlns:wfs="http://www.opengis.net/wfs"';
        _xmlpre += ' xmlns:gml="http://www.opengis.net/gml"';
        _xmlpre += ' xmlns:' + this.options.featureNS + '="' + this._getElementsByTagName(this.options.featureinfo, this.options.xsdNs + ':schema')[0].getAttribute('targetNamespace') + '"';
        _xmlpre += ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"';
        _xmlpre += ' xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/' + this.options.version + '/wfs.xsd';
        //_xmlpre += ' ' + this.options.url + '?service=WFS&version=' + this.options.version + '&request=DescribeFeatureType&typename=' + this.options.featureNS + ':' + this.options.featureType;
        _xmlpre += '">';

        this.options._xmlpre = _xmlpre;
    },

    // A compatibility layer because browsers argue about the right way to do getElementsByTagName when namespaces are involved
    _getElementsByTagName : function(xml,name){
        var tag = xml.getElementsByTagName(name);
        if(!tag || tag === null || tag.length === 0){
            tag = xml.getElementsByTagName(name.replace(/.*:/,''));
        }
        if(!tag || tag === null || tag.length === 0){
            tag = xml.getElementsByTagNameNS('', name.replace(/.*:/,''));
        }
        return tag;
    },

    _fieldsByAttribute: function(attribute,value,max){
        var seq = this._getElementsByTagName(this.options.featureinfo, this.options.xsdNs + ':sequence')[0];
        if(typeof seq == 'undefined'){
            return [];
        }
        var elems = this._getElementsByTagName(seq, this.options.xsdNs + ':element');
        var found = [];

        var foundVal;
        for(var e = 0;e < elems.length;e++){
            if(typeof attribute == 'undefined'){
                found.push(elems[e]);
            }else if(elems[e].getAttribute(attribute) == value){
                found.push(elems[e]);
                if(typeof max == 'number' && found.length == max){
                    return found;
                }
            }
        }

        return found;
    },

    // Because with WFS-T even success can be error
    _wfstSuccess: function(xml){
        if(typeof xml == 'string'){
            xml = this._parseXml(xml);
        }
        var exception = this._getElementsByTagName(xml,'ows:ExceptionReport');
        if(exception.length > 0){ 
            console.log(this._getElementsByTagName(xml,'ows:ExceptionText')[0].firstChild.nodeValue);
            return false;
        }
        return xml;
    }

    // Todo: create/handle onchange?

});

L.wfst = function(geojson,options){
    return new L.WFST(geojson,options);
};
