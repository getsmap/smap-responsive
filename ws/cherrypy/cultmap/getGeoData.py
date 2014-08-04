#!/usr/bin/python

import sys, os, json, psycopg2, psycopg2.extras
import cherrypy

from dbConnector import opendbconnection, closedbconnection


# Tell CherryPy to call "connect" for each thread, when it starts up 
# cherrypy.engine.subscribe('start_thread', connect)

class GeoDataFetcher(object):
	"""docstring for GeoDataFetcher"""
	def __init__(self):
		super(GeoDataFetcher, self).__init__()



	def _getCursor(self, cursor_factory=psycopg2.extras.DictCursor):
		conn = opendbconnection()
		#cur = cherrypy.thread_data.conn.cursor(cursor_factory=cursor_factory)
		cur = conn.cursor(cursor_factory=cursor_factory)
		return cur

	# def _dbconnect(self, host="localhost", database="kulturkartan", user="johanlahti", password=""):
	# 	conn = psycopg2.connect(host=host, database=database, user=user, password=password)
	# 	cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
	# 	return cur

	def getData(self, tableName, q, bbox=None):
		geomColName = "the_geom"

		#p = cherrypy.request.app.config['postgresql']
		cur = self._getCursor()
	

		whereString = ""
		vals = []
		for k in q.keys():
			whereString += "%s ILIKE %s AND " %(k, "%s")
			val = q[k]
			vals.append(val)
		whereString = whereString[:-5]


		# bbox
		if bbox != None:
			# w,s,e,n
			whereString += " AND %s.%s && ST_MakeEnvelope(%s, %s, %s, %s, 4326)" %(tableName, geomColName, "%s", "%s", "%s", "%s")
			vals.extend(bbox)

		sql = """
		select *, ST_AsGeoJSON(%s) as the_geom
		from cultplaces
		where %s;
		""" %(geomColName, whereString)

		out = {
			"type": "FeatureCollection",
			"features": []
		}
		cur.execute(sql, vals)

		features = []
		for r in cur:
			geom = r["the_geom"]
			props = r.copy()
			del props["the_geom"]
			features.append({
				"type": "Feature",
				"id": "%s.%s" %(tableName, props["id"]),
				"geometry": json.loads(geom),
				"properties": props
			})

		out["features"] = features

		# Close
		closedbconnection(cur.connection)
		# cur.connection.close()
		# cur.close()
		return out



# def getParamsAsObject():
# 	params = cgi.FieldStorage()
# 	out = {}
# 	for i in params.keys():
# 		out[i] = params[i].value
# 	return out

def getCultureFeatures(q, bbox=None):
	''' Function for fetching objects from the Kulturkarta database '''
	
	# print "Content-Type: application/json\n\n"  #text/html\n\n

	# p = getParamsAsObject()
	g = GeoDataFetcher()
	
	q = {
		"txt_cat": "%%;%s;%%" %(q)
	}
	geodata = g.getData("cultplaces", q, bbox)

	return json.dumps(geodata)


# if __name__ == "__main__":
# 	getCultureFeatures()

