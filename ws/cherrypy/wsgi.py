

import cherrypy
import sys
sys.path.extend(["libs", "cultmap"])

import proxy
import getGeoData


class CultMap(object):
	''' This app is used by the Culture map application. '''
    
	@cherrypy.expose
	def index(self):
		return "Hello world!"

	@cherrypy.expose
	def sayhi(self, uname=""):
		return "Hello %s" %(uname)

	@cherrypy.expose
	def respond(self, p=""):
		return cherrypy.request.method

	@cherrypy.expose
	def proxy(self, url):
		# cherrypy.response.headers['Content-Type']= 'text/html'
		
		return proxy.request(url)

	@cherrypy.expose
	def getdata(self, q, bbox=None, **params):
		cherrypy.response.headers['Content-Type']= 'application/json'
		return getGeoData.getCultureFeatures(q, bbox.split(","))
		

	



# myConfig = cherrypy.request.app.config
# print myConfig['someparams']['somekey']


# def application(env, start_response):
#     start_response('200 OK', [('Content-Type', 'text/html')])
#     return ["Hello!"]