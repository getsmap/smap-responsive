
import psycopg2

# Queue for connections
import Queue

from cherrypy import log

import os
import json

# Read config file for database connections
dbConnectSecretPath = "/Users/johanlahti/permanent_folder/pg_configs.json"
if os.path.exists(dbConnectSecretPath) == True:
	f = open(dbConnectSecretPath, "r")
	dbConfig = json.loads(f.read())
	f.close()







counter = 0
def checkIfClose(conn):
	counter += 1
	yes = counter % 5 == 0
	if yes == True:
		counter = 0 # just because we don't want to big numbers
	return yes


queues = {}
dbq = Queue.Queue(10)


def _makeKey(host, port, database, user):
	return "%s_%s_%s_%s" %(host, port, database, user)

def opendbconnection(confName=None, host="localhost", port="5432", database="kulturkartan", user="johanlahti", password=""):
	''' If using confName it will try to fetch the connection from the config file '''

	if confName != None:
		# Read all params from the config
		t = dbConfig[confName]
		host = t["host"]
		port = t["port"]
		database = t["database"]
		user = t["user"]
		password = t["password"]

	queueKey = _makeKey(host, port, database, user)
	if queues.has_key(queueKey) == False:
		# Create a new queue for this connection
		queues[queueKey] = Queue.Queue(10)
	
	dbq = queues[queueKey]
	try:
		conn = dbq.get_nowait()
	except Queue.Empty:
		try:
			conn = psycopg2.connect(host=host, port=port, database=database, user=user, password=password)
		except:
			# failed to open a database connection
			raise
	return conn

def closedbconnection(conn):
	
	# Recreate the queue key
	connString = conn.dsn
	connArr = connString.split(" ")
	d = {}
	for i in connArr:
		keyVal = i.split("=")
		d[keyVal[0].strip()] = keyVal[1].strip()
	queueKey = _makeKey(d["host"], d["port"], d["dbname"], d["user"])

	dbq = queues[queueKey]

	try:
		dbq.put_nowait(conn)
		log(str(dbq.qsize())+" open postgis connections")
	except Queue.Full:
		conn.close()

