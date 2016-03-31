This folder contains external libraries which cannot be installed using bower or npm – or because they are modified or built in some way. The dependencies noted in bower.json or package.json should point to this folder so that the gulp build will work and it is also nice to have an overview over all dependencies in bower.json and package.json.

As far as possible, libraries should not be put here.


Notes:

jquery.mobile.custom - 
leaflet-polyline-distance
leaflet.draw-smap - (Used to be) A quite buggy plugin used by Editing.js and modified to work for our needs
Leaflet.print-smap - Used by the Print plugin
Leaflet.snap - Currently not used by any plugin but was once used by the MMP plugin for snapping markers to underlying data
openlayers-smap - Custom build for smap-responsive using smap.cfg
smap.leaflet.wfs-t - Used by the Editor plugin to save to WFS-T. Quite a buggy plugin which needed a lot of tweaking to work.

smap.cfg - used for creating a custom build of openlayers 2