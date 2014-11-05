sMap-responsive
===========

###Introduction

sMap-responsive is a software framework for web maps built with Leaflet and Bootstrap. The purpose of the framework is to facilitate creation of maps which supports a range of different browsers and devices (specified in the wiki).

The framework can be extended with Leaflet controls. Leaflet controls are great, because you can easily pick the goodies from here and use in any other Leaflet-based framework.

###Scope

sMap as a product consists of source code developed by the contributors of this repository. This code is released under the Apache Software License 2.0.

The product uses a number of third-party libraries, such as Leaflet and Bootstrap etc. These are not included in the sMap product. The copyright of these libraries belongs to their respective authors and are protected by their own license.

The sMap package (i.e. the contents of this repository) consists of the sMap product on one hand, and the required third-party libraries on the other.

###Important information regarding data sources

Data sources – whether belonging to the contributors' organisation, or to anyone else – are not included, neither in the product, nor in the package. You need to seek permission from the publisher and/or from the copyright owner to use these data. This also applies if the data is linked from any other code.

###Getting started…

There are two ways to get ready, depending on if your goal is to:
- a) **Develop** the source code
- b) **Deploy** the application only (only adapting the configuration file)

###a) Get started developing the source code

1. Clone or download the source code of this repository (using e.g. Git or SVN)
2. Adapt the file dist/configs/config.js (or any other config-file you want to use) so that it refers to already published data (e.g. WMS or WFS)
3. Install dependencies using: ```npm install``` and ```bower install```
4. Point the browser to dev.html and point out the config-file by adding the parameter e.g. like this: ?config=dist/configs/config.js

###b) Get started deploying the code

1. Clone or download the source code of this repository (note that Git doesn't allow downloading a subfolder)
```svn checkout https://github.com/getsmap/smap-responsive/trunk/dist myDeployedMap```
2. Adapt the file configs/config.js (or any other config-file you want to use) so that it refers to already published data (e.g. WMS or WFS)
3. Point the browser to index.html and set the config parameter to a desired config-file, like this: ?config=config.js or ?config=config.js  or if you want to use a config file from a different server: ?config=http://someserver.with.smapconfigfiles/configs/mySmapConfig.js


###Support

If you are using sMap-responsive to make your own map, or if you change it, we would be grateful if you let us know and share your experiences and your code.

###Questions or suggestions?

We are happy for any type of feed-back.

If you have technical questions regarding smap-reponsive, please contact Johan Lahti (System Architect) (johan.lahti (at) malmo.se).

For more generic questions about projects using smap-responsive – contact Ulf Minör (ulf.minor (at) malmo.se).
