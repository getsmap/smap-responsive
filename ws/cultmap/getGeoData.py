#!/usr/bin/python

import sys, os, json, cgi, cgitb, psycopg2, psycopg2.extras
cgitb.enable()

class GeoDataFetcher(object):
	"""docstring for GeoDataFetcher"""
	def __init__(self):
		super(GeoDataFetcher, self).__init__()

	def _dbconnect(self, host="localhost", database="kulturkartan", user="johanlahti", password=""):
		conn = psycopg2.connect(host=host, database=database, user=user, password=password)
		cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
		return cur

	def getData(self, tableName, q, bbox=None):
		geomColName = "the_geom"

		cur = self._dbconnect()
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
			whereString += " AND %s.%s && ST_MakeEnvelope(%s, %s, %s, %s, 4326);" %(tableName, geomColName, "%s", "%s", "%s", "%s")
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
		cur.connection.close()
		cur.close()
		return out



def getParamsAsObject():
	params = cgi.FieldStorage()
	out = {}
	for i in params.keys():
		out[i] = params[i].value
	return out

def getCultureFeatures():
	''' Function for fetching objects from the Kulturkarta database '''
	
	print "Content-Type: application/json\n\n"  #text/html\n\n

	p = getParamsAsObject()
	g = GeoDataFetcher()
	val = p["q"] if p.has_key("q") == True else None
	bbox = p["bbox"].split(",") if p.has_key("bbox") == True else None
	q = {
		"txt_cat": "%%;%s;%%" %(val)
	}
	geodata = g.getData("cultplaces", q, bbox)
	print json.dumps(geodata)


if __name__ == "__main__":
	getCultureFeatures()

