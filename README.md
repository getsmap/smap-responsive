sMap-responsive
===========

###Examples
- [Malmö Stadsatlas (City Map of Malmö)](http://kartor.malmo.se/init/?appid=stadsatlas-v1)
- [Guided tour](http://kartor.malmo.se/init/?appid=tema_vh-v1) in Västra Hamnen, Malmö
- [Lunds Stadskarta (City Map of Lund)](http://www.lund.se/Tillbehor/Karta-over-Lund/)

###Introduction

sMap-responsive is a software framework for web maps built with Leaflet and Bootstrap. The purpose of the framework is to facilitate creation of maps which supports a range of different browsers and devices (specified in the wiki).

###Credit
The framework is developed by [Johan Lahti](https://github.com/johanlahti) at [City of Malmö](http://www.malmo.se) together with a team of valuable [contributors](https://github.com/getsmap/smap-responsive/graphs/contributors). Credit should also go to the testers and those giving feedback regarding design and usage. The examples above should also credit the data managers of respective [organisation](https://github.com/getsmap/smap-responsive/wiki/Projektgrupp).

###Technical overview
The framework can be extended with Leaflet controls. This modular approach is great, because you can easily pick other Leaflet tools from the [Leaflet plugin site](http://leafletjs.com/plugins.html) or vice versa – pick controls from here and use in your own Leaflet based framework.

A configuration file lets the manager of the map create a unique map, with its own layers and plugins etc. Which configuration file to going to be used is determined by the web parameter ```config```. For instance ```config=my_config.js``` will load a unique map defined in the file ```my_config.js```.

###Scope

sMap as a product consists of source code developed by the contributors of this repository. This code is released under the [AGPL-v3 license](http://www.gnu.org/licenses/agpl-3.0.html).

The product uses a number of third-party libraries, such as Leaflet and Bootstrap etc. These are not included in the sMap product. The copyright of these libraries belongs to their respective authors and are protected by their own license.

The sMap package (i.e. the contents of this repository) consists of the sMap product on one hand, and the required third-party libraries on the other.

###Important information regarding data sources

Data sources – whether belonging to the contributors' organisation, or to anyone else – are not included, neither in the product, nor in the package. You need to seek permission from the publisher and/or from the copyright owner to use these data. This also applies if the data is linked from any other code.

###Getting started…

There are two ways to get started depending on if your goal is to:
- a) **Develop** the source code
- b) **Deploy** the application only (easiest)

###a) Getting started developing the source code

1. Clone or download the source code of this repository (using e.g. Git or SVN)
2. Adapt the file dist/configs/config.js (or any other config-file you want to use) so that it refers to already published data (e.g. WMS or WFS)
3. Install dependencies using: ```npm install``` and ```bower install```
4. Point the browser to dev.html and point out the config-file by adding the parameter e.g. like this: ?config=config.js [*]

[*] If the config-file is located in another directory, or server, can use a relative or absolute path e.g. ```config=../config.js``` or ```config=http://my-config-server/config.js```

###b) Getting started deploying the code

1. Clone or download the source code of this repository (note that Git doesn't allow downloading a subfolder)
```svn checkout https://github.com/getsmap/smap-responsive/trunk/dist myDeployedMap```
2. Adapt the file configs/config.js (or any other config-file you want to use) so that it refers to already published data (e.g. WMS or WFS)
3. Point the browser to index.html and set the config parameter to a desired config-file, like this: ?config=config.js [*]

[*] If the config-file is located in another directory, or server, can use a relative or absolute path e.g. ```config=../config.js``` or ```config=http://my-config-server/config.js```

###Support

If you are using sMap-responsive to make your own map, or if you change it, we would be grateful if you let us know and share your experiences and your code.

###Questions or suggestions?

We are happy for any type of constructive feed-back.

If you have questions regarding smap-reponsive, please contact Johan Lahti (johanlahti (at) gmail.se).
