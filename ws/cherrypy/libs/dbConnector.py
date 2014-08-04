
import psycopg2

# Queue for connections
import Queue
dbq = Queue.Queue(10)

from cherrypy import log

counter = 0

def checkIfClose(conn):
	counter += 1
	yes = counter % 5 == 0
	if yes == True:
		counter = 0 # just because we don't want to big numbers
	return yes


def opendbconnection():
	host = "localhost"
	port = "5432"
	database = "kulturkartan"
	user = "johanlahti"
	password = ""

	try:
		conn = dbq.get_nowait()
	except Queue.Empty:
		try:
			conn = psycopg2.connect(host=host, port=port, database=database, user=user, password=password)
			log("creating new pg-connection")
		except:
			# failed to open a database connection
			raise
	return conn

def closedbconnection(conn):
	# if checkIfClose() == True:
	# 	q.task_done()
	# 	return
    try:
        dbq.put_nowait(conn)
        log(str(dbq.qsize())+" open postgis connections")
    except Queue.Full:
        conn.close()

