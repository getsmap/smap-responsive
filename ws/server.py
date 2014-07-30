#!/usr/bin/python


import cherrypy

serverConfig = 'cherrypy.conf'


class CultMap(object):
	@cherrypy.expose
	def index(self):
		return "Hello World!"








cherrypy.config.update(serverConfig)

cherrypy.quickstart(CultMap(), '/cultmap', 'cultmap.conf')



myConfig = cherrypy.request.app.config
print myConfig['someparams']['somekey']

cherrypy.engine.start()
cherrypy.engine.block()