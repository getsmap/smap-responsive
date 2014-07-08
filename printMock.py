#!c:/Tools/Python27/python.exe
import os, cgi
print "Content-type: text/html"
print
print "<html><body>"
method = os.environ["REQUEST_METHOD"]

if method == "POST":
	print "<h2>printMock.py POST parameters</h2>"
	form = cgi.FieldStorage() 
	for a in form:
		print "<p>%s: %s</p>" % (a, form.getvalue(a))

else:
	print "No POST header detected."

print "</body></html>"
