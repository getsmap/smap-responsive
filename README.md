sMap-responsive
===========

###Examples
- [Malmö Stadsatlas (City Map of Malmö)](http://kartor.malmo.se/init/?appid=stadsatlas-v1)
- [Guided tour](http://kartor.malmo.se/init/?appid=tema_vh-v1) in Västra Hamnen, Malmö
- [Lunds Stadskarta (City Map of Lund)](http://www.lund.se/Tillbehor/Karta-over-Lund/)
- [Map with editable points, lines and polygons](http://kartor.malmo.se/init/?appid=edit_demo) (using WFS-T, requires password to save)

###Introduction

sMap-responsive is a software framework for web maps built with Leaflet and Bootstrap. The purpose of the framework is to facilitate creation of maps which supports a range of different browsers and devices (specified in the wiki).

###Credit
The framework is developed by [Johan Lahti](https://github.com/johanlahti) at [City of Malmö](http://www.malmo.se) together with a team of valuable [contributors](https://github.com/getsmap/smap-responsive/graphs/contributors). Credit should also go to the testers and all the users giving feedback. Many thanks also to those who have shared their map link above. If you also want to share you map, please contact the [the site admin](https://github.com/johanlahti).

###Technical overview
The framework can be extended with Leaflet controls. This modular approach is great, because you can easily pick other Leaflet tools from the [Leaflet plugin site](http://leafletjs.com/plugins.html) or vice versa – pick controls from here and use in your own Leaflet based framework.

A configuration file allows you to create a custom map, using your own layers and plugins. Which configuration to be used by the application is set by a web parameter ```config```. For instance ```config=my_config.js``` will load a unique map defined in the file ```my_config.js```. Thereby you can use one code base, but let it host an unlimited number of map applications.

###Getting started…

####Preconditions
First, make sure you have the following applications installed.
- node and npm: [https://nodejs.org/download/](https://nodejs.org/download/)
- bower: [http://bower.io/](http://bower.io/)
- A webserver like Apache, Nginx or IIS (either locally installed or on a server)

####Clone and install dependencies
If you are running on Mac or Linux, you may need to use ```sudo``` before some of the commands.
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
If the build went fine, point your browser to http://localhost/smap-responsive/dev.html – or wherever your clone is located. If you want to use a minified version of the map, just point your browser to http://localhost/smap-responsive/dist/index.html instead. The ```dist``` folder contains the whole application but with everything minified and compressed. While debugging, it is better to use dev.html.

Now you are finally ready to create some maps!

### Create a customized map
Copy and modify [this](https://github.com/getsmap/smap-responsive/blob/master/examples/configs/config.js) configuration file. Rename it to ```myconfig.js```. The configuration file informs the map of:
- Starting zoom and centering of the map
- Background layers to use (e.g. OpenStreetMap)
- Overlays to use
- Plugins to be included and their settings

Inside the example [configuration file](https://github.com/getsmap/smap-responsive/blob/master/examples/configs/config.js) is described how each and every parameter affects the map.

Next. When calling the map, we need to specify which configuration file to use. This is accomplished with the URL parameter ```config```:
```
// Using our newly created configuration file myconfig.js
http://localhost/smap-responsive/dev.html?config=examples/configs/myconfig.js
```
Other URL parameters can also be used to control the map. They are described below:

### URL parameters

TODO: working on this… going for lunch now

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
