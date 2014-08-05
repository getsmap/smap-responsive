#!/usr/bin/env python 
# -*- coding: UTF-8 -*-

# enable debugging. ONLY for use in testenvironment.
# import cgitb
# cgitb.enable()

# import libraries
import cgi
from os import environ
import dbConnector as db



def match(q):
	q = unicode(q.decode("utf8")) 
	q = q.upper()

	conn = db.opendbconnection("search")
	cur = conn.cursor()

	sql = "SELECT objektnamn FROM poi_skane_adressregister_apl WHERE objektnamn LIKE (%s);"
	safeParam = (q+"%", )
	cur.execute(sql, safeParam)
	#cur.execute("SELECT objektnamn FROM poi_hbg_sok WHERE objektnamn like '" + q + "%';")

	out = ""
	for record in cur:
		out += record[0]
	#print conn.encoding

	cur.close()
	db.closedbconnection(conn)
	return out


def locate(q):
	q = unicode(q.decode("utf8")) 
	q = q.upper()

	conn = db.opendbconnection()
	cur = conn.cursor()

	sql = "SELECT easting, northing, objektnamn, objekttyp FROM poi_skane_adressregister_apl WHERE objektnamn = (%s);"
	safeParam = (q, )
	cur.execute(sql, safeParam)
	#cur.execute("SELECT objektnamn FROM poi_hbg_sok WHERE objektnamn like '" + q + "%';")

	features = []

	for record in cur:
		coordinates=[record[0],record[1]]
		geometry={}
		geometry['type'] = 'Point'
		geometry['coordinates'] = coordinates
		properties={}
		properties['name']=record[2]
		properties['category']=record[3]
		feature={}
		feature['type']='Feature'
		feature['geometry']=geometry
		feature['properties']=properties
		features=[feature]
			
	out = {}
	out['type'] = 'FeatureCollection'
	out['features'] = features

	cur.close()
	db.closedbconnection(conn)

	return out














