'use strict';

var es = require('event-stream');
var cssValidator = require('css-validator');
var gutil = require('gulp-util');

var errorText = gutil.colors.red.bold('CSS Error:');
var warningText = gutil.colors.yellow.bold('CSS Warning:');
var validatorError = gutil.colors.red.bold('Error:');

var handleBrowserHacks = function (file) {
  file = file
    .replace(/(\*(?!\s|\W).*?;(?!\s*\*\/))/gm, '/* $1 */')
    .replace(/-webkit-min-device-pixel-ratio/g, 'max-device-width')
    .replace(/x:default/g, 'x:-moz-any-link')
    .replace(/::selection/g, '::-moz-selection')
    .replace(/\\\d+;/g, ';')
    .replace(/(zoom\s*:\s*.+?(?:;|$))/gm, '/* $1 */')
    .replace(/(text-rendering\s*:\s*.+?(?:;|$))/gm, '/* $1 */');
  return file;
};


module.exports = function (options) {
  var opts = options || {};

  return es.map(function (file, callback) {

    var sanitizedFile = opts.allowHacks ? handleBrowserHacks(file.contents.toString()) : file.contents.toString();

    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      return callback(new PluginError('gulp-css-validation', 'Streaming not supported'));
    }

    cssValidator(sanitizedFile, function (err, data) {
      if (err) {
        gutil.log(validatorError, err.code)
        return callback(err);
      }

      if (opts.logWarnings) {
        data.warnings.forEach(function (v) {
          var location = 'Line ' + v.line + ':';
          gutil.log(warningText, file.relative, v.errortype, location, v.message.replace(/\n|\s+/g, ' ').trim());
        });
      }

      if (!data.validity) {
        var verr = new gutil.PluginError('gulp-css-validation', 'CSS File not valid', {showStack: true});

        data.errors.forEach(function (v) {
          var location = 'Line ' + v.line + ':';
          gutil.log(errorText, file.relative, location, v.message.replace(/\n|\s+/g, ' ').trim());
        });

        return callback(verr);
      }

      callback(null, file);
    });
  });
};
