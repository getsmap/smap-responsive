/*
 * Extends L.Polyline to retrieve measured distance.
 *
 * https://github.com/danimt/Leaflet.PolylineMeasuredDistance
 */

L.Polyline.prototype.measuredDistance = function (options) {
  // Default options
  this.defaults = {
    metric: true
  };
  // Extend options
  this.options = L.extend(this.defaults, options);

  var distance = 0,  coords = null, coordsArray = this._latlngs;

  for (i = 0; i < coordsArray.length - 1; i++) {
    coords = coordsArray[i];
    distance += coords.distanceTo(coordsArray[i + 1]);
  }

  // Return formatted distance
  return L.PolylineUtil.readableDistance(distance, this.options.metric);
};

L.PolylineUtil = {
  readableDistance: function (distance, isMetric) {
    var distanceStr;

    if (isMetric) {
      // show metres when distance is < 1km, then show km
      if (distance > 1000) {
        distanceStr = (distance  / 1000).toFixed(2) + ' km';
      } else {
        distanceStr = Math.ceil(distance) + ' m';
      }
    } else {
      distance *= 1.09361;

      if (distance > 1760) {
        distanceStr = (distance / 1760).toFixed(2) + ' miles';
      } else {
        distanceStr = Math.ceil(distance) + ' yd';
      }
    }

    return distanceStr;
  }
};
