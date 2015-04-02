sMap-responsive
===========

###Examples
- [Malmö Stadsatlas (City Map of Malmö)](http://kartor.malmo.se/init/?appid=stadsatlas-v1)
- [Guided tour](http://kartor.malmo.se/init/?appid=tema_vh-v1) in Västra Hamnen, Malmö
- [Lunds Stadskarta (City Map of Lund)](http://www.lund.se/Tillbehor/Karta-over-Lund/)
- [Map with editable points, lines and polygons](http://kartor.malmo.se/init/?appid=edit_demo) (using WFS-T, requires password to save)

###Introduction

sMap-responsive is a software framework for web maps built with Leaflet and Bootstrap. The purpose of the framework is to facilitate creation of maps which support a range of different browsers and devices (specified in the wiki).

###Credit
The framework is developed by [Johan Lahti](https://github.com/johanlahti) at [City of Malmö](http://www.malmo.se) together with a team of valuable [contributors](https://github.com/getsmap/smap-responsive/graphs/contributors). Credit should also go to the testers and users providing feedback – as well as those who have shared a link to their maps above. If you also want to share your map with us, please contact the [the site admin](https://github.com/johanlahti).

###Why another framework?
*First* of all. This framework is based around Leaflet controls. This means most of the code here is **reusable** in any other Leaflet-based framework. You can easily pick other Leaflet tools from the [Leaflet plugin site](http://leafletjs.com/plugins.html) or vice versa – pick controls from here and use in your own Leaflet based framework.

*Second*. This framework is built to serve a multiple of objectives. New maps – from the most advanced to the simplest of simple – can be created by just copying and modifying *one configuration file*. This gives the administrator a lot of **power** and **flexibility** – without doing any programming.

*Third*. In order to minimize the need of programmers' hands-on – we put a lot of effort into making this framework as **easy to use** as possible for the administrator. For instance, all options of a plugin can be changed from the configuration file. But if no options are provided, the plugin's defaults are used. As simple as needed, but yet no simpler.

###Getting started…
These steps describe:
- Installing (step 1-2)
- Creating a map (step 3)
- URL parameters (step 4)
- Include external plugins (step 5)
- Develop new plugins (step 6)
 
####1. Preconditions
First, make sure you have the following applications installed.
- node and npm: [https://nodejs.org/download/](https://nodejs.org/download/)
- bower: [http://bower.io/](http://bower.io/)
- A webserver like Apache, Nginx or IIS (either locally installed or on a server)

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
If you want to use a minimised version of the map, just point your browser to [http://localhost/smap-responsive/dist/index.html](http://localhost/smap-responsive/dist/index.html) instead.
The ```dist``` folder contains the whole application but everything is minimised and compressed. While debugging, it is better to use dev.html.

Now you are finally ready to create some maps!

#### 3. Create a customised map
1. Copy and modify the example [configuration file](https://github.com/getsmap/smap-responsive/blob/master/examples/configs/config.js).
2. Rename it to ```myconfig.js```.

The configuration file informs the map of:
- Starting zoom and centering of the map
- Background layers to use (e.g. OpenStreetMap)
- Overlays to use
- Plugins to be included and their settings

Inside the example [configuration file](https://github.com/getsmap/smap-responsive/blob/master/examples/configs/config.js) (the one you just copied) is described how each and every parameter affects the map.

Next. When calling the map, we need to specify which configuration file to use. This is accomplished with the URL parameter ```config```:
```
// Using our newly created configuration file myconfig.js
http://localhost/smap-responsive/dev.html?config=examples/configs/myconfig.js

// Or, using compressed code:
http://localhost/smap-responsive/dist/index.html?config=../examples/configs/myconfig.js
```
Note that the path to the config file is relative to the html file.

Next step is to learn how other URL parameters can be used to control the map.

#### 4. URL parameters

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



#####Plugin parameters (for the plugins hosted here):

| Parameter key |  Parameter value(s) | Decides | Example value | Plugin |
| ------------- | ------------- | ------------- | ------------- | ---------- |
| poi           | {String},{Optional Integer} | Triggers geolocate for given address | poi=Storgatan%201,1 (open popup) poi=Storgatan%201 (no popup) | L.Control.Search |
| lsw           | {Integer}     | Open switcher from start | lsw=1 opens switcher from start (only small screens) | L.Control.LayerSwitcher |
| md            | {String} | Features to draw | - (created internally) | L.Control.MeasureDraw |


#### 5. Include external plugins

As seen in the example [configuration file](https://github.com/getsmap/smap-responsive/blob/master/examples/configs/config.js) plugins, any Leaflet control can be included in the map, simply by adding its constructor and its options to the plugins array. All options will be transferred to the plugin when it is instanstiated (the pre-assumption is that all controls follow the same syntax pattern, taking only one parameter which is ```options```).

However, before the plugin is callable, you need follow these steps:
1. Place the files, e.g. ```MyPlugin.js``` and ```MyPlugin.css``` inside a folder named ```MyPlugin```. This folder should be placed inside the ```plugins```-folder of your smap clone.
2. Run gulp in order to build the code (from the root directory of your smap clone):
```
gulp full
```
3. Add the plugin to configuration file in the same manner as in the example [configuration file](https://github.com/getsmap/smap-responsive/blob/master/examples/configs/config.js)

#### 6. Develop plugins

Developing a plugin for smap-responsive is no different than developing an ordinary Leaflet control – which you can learn better from other sources. However, smap-responsive has some special additions which can be useful when you want to interact with core funcionality. For instance, responding to a selected feature event, creating or adding URL parameters, or fetching an already added layer using its layerId.

(This section will be improved with time.)

##### Events:
| Event name | Description | Example | 
| ---------- | ----------- | ------- | 
| smap.core.createparams | Triggered when URL params are created. Useful if your plugin needs to add something to the URL. | ```smap.event.on("smap.core.createparams", function(e, paramsObject) { paramsObject.new_param = 3; });``` |

##### Methods:
| Method name | Description | Example | 
| ---------- | ----------- | ------- |


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
