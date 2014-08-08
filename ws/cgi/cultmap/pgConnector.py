#!/usr/bin/python

import psycopg2, psycopg2.extras



def getConnection(host="localhost", port="5432", database="kulturkartan", user="johanlahti", password=""):
	conn = psycopg2.connect(host=host, port=port, database=database, user=user, password=password)
	cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
	return cur

def closeConnection(cur):
	cur.close()
	cur.connection.close()
