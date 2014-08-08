import psycopg2



def getConnection(host="localhost", port="5432", database="kulturkartan", user="johanlahti", password=""):
	conn = psycopg2.connect(host=host, port=port, database=database, user=user, password=password)
	cur = conn.cursor(cursor_factory=cursor_factory)
	return cur

def closeConnection(cur):
	cur.close()
	cur.conn.close()
