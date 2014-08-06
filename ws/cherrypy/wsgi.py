#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import cherrypy
import sys
sys.path.extend(["libs", "cultmap", "search"])

import proxy
import getGeoData
import sok

from cherrypy import log



class Search(object):
	
	@cherrypy.expose
	def index(self):
		return "Welcome to the Map REST API of Malmö Stad"

	@cherrypy.expose
	# @cherrypy.tools.json_out()
	def match(self, q):
		return sok.match(q)
	
	@cherrypy.expose
	@cherrypy.tools.json_out()
	def locate(self, address):
		return sok.locate(address)




class CultMap(object):
	''' This app is used by the Culture map application. '''
    
	@cherrypy.expose
	def index(self):
		return "Welcome to Cult map's REST API"

	@cherrypy.expose
	def proxy(self, url, **params):
		out, mimetype = proxy.request(url)
		log( '\n\n-------- %s\n\n' %mimetype )
		cherrypy.response.headers['Content-Type'] = mimetype
		return out

	@cherrypy.expose
	def getdata(self, q, bbox=None, **params):
		cherrypy.response.headers['Content-Type']= 'application/json'
		return getGeoData.getCultureFeatures(q, bbox.split(",") if bbox is not None else None)
		

	



# myConfig = cherrypy.request.app.config
# print myConfig['someparams']['somekey']


# def application(env, start_response):
#     start_response('200 OK', [('Content-Type', 'text/html')])
#     return ["Hello!"]