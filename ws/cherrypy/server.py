# Import your application as:
# from wsgi import application
# Example:

from wsgi import application
from wsgi import CultMap
from wsgi import Search
from cherrypy.process import plugins
from cherrypy import tools

# Import CherryPy
import cherrypy

if __name__ == '__main__':

    # Read the config file for SERVER
    cherrypy.config.update('server.conf')

    cherrypy.tree.mount(application, "/")

    # Mount the application
    cherrypy.tree.mount(CultMap(), "/cultmap", "cultmap/app_cultmap.conf") # 'app_cultmap.conf') # What's the difference between graft and mount?
    cherrypy.tree.mount(Search(), "/search", "search/app_search.conf")
    #cherrypy.tree.graft(CultMap(), "/cultmap")

    #cherrypy.tree.graft(cultMap, '/cultmap', 'cultmap.conf')

    # Unsubscribe the default server
    cherrypy.server.unsubscribe()

    plugins.PIDFile(cherrypy.engine, 'myserver.pid').subscribe()

    # Instantiate a new server object
    server = cherrypy._cpserver.Server()

    # Configure the server object (issue: some of this cannot be read from the config file)
    server.socket_host = "0.0.0.0"
    server.socket_port = 9090
    server.thread_pool = 30
    # cherrypy.engine.autoreload.on = False

    # Subscribe this server
    server.subscribe()

    # Example for a 2nd server (same steps as above):
    # Remember to use a different port

    # server2             = cherrypy._cpserver.Server()

    # server2.socket_host = "0.0.0.0"
    # server2.socket_port = 8081
    # server2.thread_pool = 30
    # server2.subscribe()

    # Start the server engine (Option 1 *and* 2)

    #cherrypy.engine.exit()
    cherrypy.engine.start()
    cherrypy.engine.block()