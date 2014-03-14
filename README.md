smap-mobile
===========

###Introduction

sMap-mobile is a software framework for web maps built with Leaflet and Bootstrap. The purpose of the framework is to facilitate creation of maps which supports a range of different browsers and devices (specified in the wiki). The framework can be extended by Leaflet controls.

For more information about smap-mobile, contact Johan Lahti (see below).

###Scope

sMap as a product consists of source code developed in the sMap project. This code is released under the Apache Software License 2.0.

The product is using a number of the third-party libraries, such as Leaflet and Boostrap etc. These are not included in the sMap product and are given as they are. The copyright of these libraries belong to their authors and are protected by their own license.

The sMap package (i.e. the contents of this repository) consists of the sMap product on one hand, and the required third-party libraries on the other.

###Important information regarding data sources

Data sources – whether belonging to the sMap project or the participants of the sMap project, or anyone else – are not included, neither in the product, nor in the package. You need to seek permission to use these data – from the publisher and/or from the copyright owner. This also applies if the data is linked from any other code.

###Get started

To get started, follow these steps:

1. Clone or download the source code of this repository
2. Adapt the file configs/config.js so that it refers to already published data (e.g. WMS or WFS)
3. Upload the entire repository to a web server and point the browser to the index.html file
4. The map can be adapted by adding parameters to the URL, e.g. ?center=13,55.605&zoom=15&config=test.js

###Support

If you are using sMap mobile to make your own map, or if you change it, we would be grateful if you let us know and share your experiences and your code.

###Questions or suggestions?

We are happy for any type of feed-back.

If you have questions regarding smap-mobile, contact Johan Lahti (johan.lahti (at) malmo.se).

For more generic questions about the sMap project – contact our project administrators Ulf Minör (ulf.minor (at) malmo.se) or Karl-Magnus Jönsson (karl-magnus.jonsson (at) kristianstad.se).
