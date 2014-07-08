[![Build Status](https://drone.io/github.com/sergeyt/jQuery-xml2json/status.png)](https://drone.io/github.com/sergeyt/jQuery-xml2json/latest)
[![Dependency Status](https://david-dm.org/sergeyt/jQuery-xml2json.svg)](https://david-dm.org/sergeyt/jQuery-xml2json)
[![devDependency Status](https://david-dm.org/sergeyt/jQuery-xml2json/dev-status.svg)](https://david-dm.org/sergeyt/jQuery-xml2json#info=devDependencies)

#jQuery xml2json 

[![NPM](https://nodei.co/npm/jquery-xml2json.png?downloads=true&stars=true)](https://nodei.co/npm/jquery-xml2json/)

A simple jQuery plugin that converts XML data, typically from $.ajax requests, to a valid JSON object.

Here's a simple usage example:

    $.ajax({
        url: 'data/test.xml',
        dataType: 'xml',
        success: function(response) {
            json = $.xml2json(response);
        }
    });
