sMap-responsive
===========

[![Build Status](https://drone.io/github.com/getsmap/smap-responsive/status.png)](https://drone.io/github.com/getsmap/smap-responsive/latest)

<img src="img/demo/smap-responsive-demo.gif" width="600" />

###Examples
- [Malmö Stadsatlas (City Map of Malmö)](http://kartor.malmo.se/init/?appid=stadsatlas-v1&lang=en)
- [Kristianstadkartan (City Map of Kristianstad)](http://kartor.kristianstad.se/kristianstadskartan/)
- [Lunds Stadskarta (City Map of Lund)](http://www.lund.se/Tillbehor/Karta-over-Lund/)
- [Guided tour](http://kartor.malmo.se/init/?appid=tema_vh-v1&lang=en) for pedestrians in Western Harbour, Malmö (and [more tours](http://malmo.se/kartor/promenadstaden/))
- [Find your school](http://malmo.se/Forskola--utbildning/Grundskola/Grundskolor-och-forskoleklass/Att-valja-skola/Upptagningsomraden-och-hemskola.html) in Malmö (map integrated in a form)
- [Map with editable points, lines and polygons](http://kartor.malmo.se/init/?appid=edit_demo) (using WFS-T, requires password to save)
- [Kävlingeån map](http://kartor.lund.se/vspu/?zoom=14&center=13.1278,55.78562&ol=VE,Haro&bl=mapboxcolor&md=url%2C%7B:t:%22FeatureCollection%22%2C:fs:%5B%7B:t::F:%2C:p%7B%22id%22:42%2C:mt::%22H%C3%A4r%20ligger%20M%C3%A5s%C3%A4ngen%22%2C%22radius%22:134.4049356995406%2C%22popupIsOpen%22:true%7D%2C:g:%7B:t::P:%2C:c:%5B13.12283%2C55.79042%5D%7D%7D%5D%7D) [(project site)](http://www.kavlingean.se/)

###Introduction

sMap-responsive is a software framework for web maps built with Leaflet and Bootstrap. The purpose of the framework is to facilitate creation of maps which support a range of different browsers and devices (specified in the wiki).

> Quick install with [npm](https://nodejs.org/): `npm install --save smap-responsive`

###Who to blame?
The framework is developed by [Johan Lahti](https://github.com/johanlahti) at [City of Malmö](http://www.malmo.se) together with a team of valuable [contributors](https://github.com/getsmap/smap-responsive/graphs/contributors).

###Why another framework?
First of all. This framework is based around Leaflet controls (plugins). The controls are **reusable** in any other Leaflet-based framework. You can pick Leaflet controls from the [Leaflet plugin site](http://leafletjs.com/plugins.html) or vice versa – pick controls from here and use in your own Leaflet based framework (with few or no modifications needed).

Second. This framework is built to be **dynamic** and serve multiple objectives in various contexts. Smap-responsive is used in many different types of external applications as well as for stand-alone maps. Although every map is unique, most functionality can be re-used for every map.

Third. In order to minimise the need of programmers' hands-on – we put a lot of effort into making this framework as **easy to use** as possible for the administrator. New maps – from the most advanced to the simplest of simple – can be created by just copying and modifying one configuration file. This gives the administrator a lot of **power** and **flexibility** – without doing any programming.

<br />

---

<br />

###Tutorial

####0. Overview

**Basic chapters:**
- Getting started (1-2)
- Creating a map (3)
- URL parameters (4)

**Advanced chapters:**
- Include external plugins (5)
- Develop new plugins (6)
- Developer API (7)

<br />

####1. Preconditions
First, make sure you have the following applications installed.
- node and npm: [https://nodejs.org/download/](https://nodejs.org/download/)
- bower: [http://bower.io/](http://bower.io/)
- A webserver like Apache, Nginx, IIS, or whatever your prefer (either locally installed or on a server)

<br />

> The easy way: [Install npm](https://nodejs.org/) and execute this command:
`npm install --save smap-responsive`
inside a directory of your choice (locate the folder node_modules/smap-responsive)

####2. Clone and install dependencies
If you are using a Mac or Linux computer, you may need to use ```sudo``` before some of the commands.
Clone the project using Git or Subversion (you can also use a GUI version of the mentioned):
```
git clone https://github.com/getsmap/smap-responsive
```
or 
```
svn co https://github.com/getsmap/smap-responsive/trunk smap-responsive
```
Install dependencies
```
cd smap-responsive
npm install
bower install
```
Build the application. Run this from the root directory of your smap clone.
```
gulp full
```
If the build went fine, point your browser to [http://localhost/smap-responsive/dev.html](http://localhost/smap-responsive/dev.html) – or wherever your clone is located.
If you want to use a minimised version of the application, just point your browser to [http://localhost/smap-responsive/dist/index.html](http://localhost/smap-responsive/dist/index.html) instead.
The ```dist``` folder contains the whole application but everything is minimised and compressed. While debugging, it is better to use dev.html.

> The default language is Swedish (language code "sv"). If you want to change this to English, then edit the file ```core/js/mainConfig.js``` and change the variable to ```defaultLanguage: "en" ```.

Now you are finally ready to create some maps!

<br />

#### 3. Create a customised map
1. Copy and modify the example [configuration file](https://github.com/getsmap/smap-responsive/blob/master/examples/configs/config.js).
2. Rename it to ```myconfig.js```.

The configuration file informs the application of:
- Starting zoom and centering of the map
- Background layers to use (e.g. OpenStreetMap)
- Overlays to use
- Plugins to be included and their settings

Inside the example [configuration file](https://github.com/getsmap/smap-responsive/blob/master/examples/configs/config.js) (the one you just copied) is described how each and every parameter affects the application.

Next. We need to specify which configuration file to use. This is accomplished with the URL parameter ```config```:
```
// Using our newly created configuration file myconfig.js
http://localhost/smap-responsive/dev.html?config=examples/configs/myconfig.js

// Or, using compressed code:
http://localhost/smap-responsive/dist/index.html?config=../examples/configs/myconfig.js
```
> Note that the path to the config file is relative to the html file.

Next step is to change the application's behaviour using URL parameters.

<br />

#### 4. URL parameters (REST API)

The application can be called with various URL parameters. For instance, [http://localhost/smap?config=another_config.js&zoom=12](http://ralocalhost/smap?config=another_config.js&zoom=12) will load the config file ``` another_config.js ``` and set the zoom to 12 (higher means more zoomed in).

#####Core parameters:

| Parameter key |  Parameter value(s) | Decides | Example value |
| ------------- | ------------- | ------------- | ------------- |
| config        | {String}      | Config to use | my_config.js or somefolder/my_config.js or http://someserver.com/folder/my_config.js |
| zoom          | {Integer}   range: 0-18 | Starting zoom level | zoom=12 (higher=more zoomed in) |
| center        | {Integer},{Integer} | Starting center | 13.1,55.6 |
| bl            | {String}      | Starting baselayer | bl=citymap - the baselayer with given layerId will be active from start |
| ol            | {String}, …   | Starting overlay(s) | ol=some_points,some_data (layerId for two layers) |
| xy            | {Integer},{Integer},{Optional String},{Optional String} | Adds a marker | 13.1,55.6 or 13.1,55.6,Text%20in%20popup or xy=117541,6163401,Projected coords,EPSG:3008 |
| lang          | {String}      | Sets language | lang=en (for English) |

<br />
#####Plugin parameters (for the plugins hosted here):

| Parameter key |  Parameter value(s) | Decides | Example value | Plugin |
| ------------- | ------------- | ------------- | ------------- | ---------- |
| poi           | {String},{Optional Integer} | Triggers geolocate for given address | poi=Storgatan%201,1 (open popup) poi=Storgatan%201 (no popup) | L.Control.Search |
| lsw           | {Integer}     | Open switcher from start | lsw=1 opens switcher from start (only small screens) | L.Control.LayerSwitcher |
| md            | {String} | Features to draw | - (created internally) | L.Control.MeasureDraw |

<br />

#### 5. Include external plugins

As seen in the example [configuration file](https://github.com/getsmap/smap-responsive/blob/master/examples/configs/config.js) plugins, any Leaflet control can be included in the map simply by adding its constructor and its options to the plugins array. All options will be transferred to the plugin when it is instanstiated (the pre-assumption is that all controls follow the same syntax pattern, taking only one parameter which is ```options```).

However, first you need to incorporate the plugin into the code. Follow these steps:

1. Place the files, e.g. ```MyPlugin.js``` and ```MyPlugin.css``` inside a folder named ```MyPlugin```. This folder should be placed inside the plugins-folder of your smap clone.
2. Run gulp in order to build the code (from the root directory of your smap clone): ```gulp full```
3. Open dev.html or index.html and confirm that the plugin has been added into these html-files. Add the plugin to the configuration file in the same manner as in the example [configuration file](https://github.com/getsmap/smap-responsive/blob/master/examples/configs/config.js)

<br />

#### 6. Develop plugins

Developing a plugin for smap-responsive is no different than developing an ordinary Leaflet control, which you can learn better from other sources. However, smap-responsive has some special additions which can be useful when you want to interact with core funcionality. For instance:
- Responding to a selected feature event
- Creating or adding URL parameters
- Fetching an already added layer using its layerId
- Adding language support

Use the [plugin template](https://github.com/getsmap/smap-responsive/blob/master/plugins/PluginTemplate.js) when developing a new plugin. The only addition to an ordinary Leaflet plugin is the ```_lang``` object which allows you to adapt labels and stuff depending on language. If you don't need it, just ignore it.

> Note! While developing a plugin you can execute gulp without any parameter: ``` gulp ```. It will then automatically compile .styl and .sass files into CSS whenever you save something. Check the ```gulpfile.js``` and learn more about how to modify it for your needs.

<br />

#### 7. Developer API

This section describes:
- Core events
- Core methods (used for communicating with the core)
- Utility methods

##### Core events:
| Event name | Triggered… | Example | 
| ---------- | ----------- | ------- | 
| smap.core.createparams | …when URL params are created. Useful if your plugin needs to add something to the URL. | ```smap.event.on("smap.core.createparams", function(e, paramsObject) { paramsObject.new_param = 3; });``` |
| smap.core.aftercreateparams | …after createparams have been triggered. Useful e.g. if you have a param dependency for your own param(s). | ```smap.event.on("smap.core.createparams", function(e, paramsObject) { paramsObject.new_param = 3; });``` |
| smap.core.beforeapplyparams | …before URL params are applied in core | ```smap.event.on("smap.core.beforeapplyparams", function(e, paramsObj) { alert(paramsObj.MY_PARAM); });``` |
| smap.core.applyparams | …after URL params have been applied in core | – " " – |
| smap.core.pluginsadded | …when all plugins have been added. Useful if you need another plugin to be added before you do something. | ```smap.event.on("smap.core.pluginsadded", function() {}); ``` |
| selected   | …when a feature is selected (through getfeatureinfo or vector select) | ```smap.map.on("selected", function(e) { /* e.layer, e.feature, e.latLng, e.selectedFeatures */});``` |
| unselected   | …when a feature is unselected | ```smap.map.on("unselected", function(e) {});``` |

<br />

> Note! Check the file where the method exists for a more detailed description of the parameters below.

##### Core methods – in core/js/cmd.js:

| Method | Params | Description | Example | 
| ---------- | ----------- | ----------- | ------- |
| smap.cmd.createParams | addRoot {Boolean} | Create URL params that recreates the map | var s = smap.cmd.createParams(true); |
| smap.cmd.createParamsAsObject | - | Same as previous but params as object | var obj = smap.cmd.createParamsAsObject(); |
| smap.cmd.getControl | controlName {String} | Get control with given name OR full class name | var search = smap.cmd.getControl("Search"); |
| smap.cmd.getControls | controlName {String} | Same as above but to be used if there are many instances | var arr = smap.cmd.getControls("RedirectClick"); |
| smap.cmd.notify | text {String}, msgType {String}, options {Object} | Alert the user about something | smap.cmd.notify("An error", "error"); |
| smap.cmd.addLayerWithConfig | layerConfig {Object} | Same method used by core when adding layers from config file | – |
| smap.cmd.getLayer | layerId {String} | Fetch an already added layer | var layer = smap.cmd.getLayer("some_layer_id"); |
| smap.cmd.getLayerConfig | layerId {String} | Fetch configuration for a specific layer from config file | var t = smap.cmd.getLayerConfig("some_layer_id"); |
| smap.cmd.getLayerConfigBy | key {String}, val {String}, options {Object} | Same as previous, but based on different key and val | smap.cmd.getLayerConfigBy("options.displayName", "Districts of Malmö"); |
| smap.cmd.getLang | - | Get the currently set language | var lang = smap.cmd.getLang(); // e.g. "en" |
| smap.cmd.reloadCore | options {Object} | Reload the map without reloading the browser | smap.cmd.reloadCore({}); |
| smap.cmd.loading | show {Boolean}, options {Object} | Show/hide the loading indicator (set ```show``` to false to hide) | smap.cmd.loading(true, {text: "Fetching data"}); |

<br />

##### Utility methods – in core/js/utils.js:

| Method | Params | Description | Example | 
| ---------- | ----------- | ----------- | ------- |
| utils.rmPx | text {String} | Converts a CSS "size" given as text into an integer | utils.rmPx("10px") // -> 10 |
| utils.capitalize | theString {String} | Converts string into upper-case | utils.capitalize("Hey there") // -> "HEY THERE" |
| utils.getBrowser | - | Get current browser (so far only IE versions) | utils.getBrowser().ie8; // {Boolean} |
| utils.urlAppend | baseUrl {String}, params {String}, separator {String} | Merges a URL with params | utils.urlAppend("http://myurl/folder/, "param=1&hey=2, "?"); |
| utils.isInIframe | - | Check whether this app runs inside an iframe | utils.isInIframe() // {Boolean} |
| utils.makeUniqueArr | arr {String} | Removes all duplicates from array | utils.makeUniqueArr([1,1,2,2,2]); // -> [1,2] |
| utils.objectToUpperCase | o {Object} | Converts all keys in the object into upper-case | utils.objectToUpperCase({test: "hey"}); // -> {"TEST": "hey"} |
| utils.drawDialog | title {String}, bodyContent {String or jQuery Object}, footerContent{String or jQuery Object}, options {Object} | Returns a Bootstrap modal | utils.drawDialog("Title", "<p>Body</p>", '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>').modal("show"); |
| utils.getLayerFromFeature | feature {unknown}, layer {unknown} | Return the parent layer of a feature | utils.getLayerFromFeature(f, layer); |
| utils.round | val {Number}, nbrOfDecimals {Integer} | Rounds to number of decimals | utils.round(4.87123, 1); // -> 4.9 |
| utils.makeUnselectable | tag {jQuery tag} | Make HTML elements in (old) IE unselectable | utils.makeUnselectable($("body")); |
| utils.extractToHtml | html {String}, props {Object} | Replaces all ${key} with the corresponding value found in props | utils.extractToHtml("<p>${some_key}</p>", {"some_key": "Hey"}); // -> <p>Hey</p> |
| utils.createLabel | center {L.LatLng}, html {String}, className {String} | Returns a map label | utils.createLabel([13,55.6], "I am a label", "label-nbr-1"); |
| utils.getLength | arrLatLng {Array({L.LatLng},{…})} | Returns total true (curved) distance for the line | utils.getLength([L.latLng(13, 55), L.latLng(14, 67)]) |
| utils.paramsStringToObject | pString {String}, keysToUpperCase {Boolean} | Converts a parameter string into an object | utils.paramsStringToObject("a=2&b=3", true); // -> {"A":2, "B":3} |
| utils.projectPoint | east {Number}, north {Number}, srsSrc {String}, srsDest {String} | Convert coords from one projection to another | utils.projectPoint(13,56,"EPSG:4326","EPSG:3008"); // -> [118803, 6208675] |
| utils.projectLatLng | latLng, srsSrc, srsDest, reverseAxisSrc, reverseAxisDest | Similar as previous but for L.LatLng | utils.projectLatLng(L.latLng([13,56]), "EPSG:4326", "EPSG:3008", false, true); |
| utils.projectFeature | feature {GeoJSON Object}, inputCrs {String}, options {Object} | Convert entire GeoJSON object into another projection (used by WFS layer class) | See L.GeoJSON.WFS class for example usage |


<br />

---

<br />

###Scope

sMap as a product consists of source code developed by the contributors of this repository. This code is released under the [AGPL-v3 license](http://www.gnu.org/licenses/agpl-3.0.html).

The product uses a number of third-party libraries, such as Leaflet and Bootstrap etc. These are not included in the sMap product. The copyright of these libraries belongs to their respective authors and are protected by their own license.

The sMap package (i.e. the contents of this repository) consists of the sMap product on one hand, and the required third-party libraries on the other.

###Important information regarding data sources

Data sources – whether belonging to the contributors' organisation, or to anyone else – are not included, neither in the product, nor in the package. You need to seek permission from the publisher and/or from the copyright owner to use these data. This also applies if the data is linked from any other code.

###Support

If you are using sMap-responsive to make your own map, or if you change it, we would be grateful if you let us know and share your experiences and your code. Please contact [the site admin](https://github.com/johanlahti) if you want to publish it in the examples section above.

###Questions or suggestions?

We are happy for any type of constructive feed-back.

If you have questions regarding smap-reponsive, please contact [Johan Lahti](https://github.com/johanlahti) 
