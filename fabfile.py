from __future__ import with_statement
from fabric.api import *
from fabric.contrib.console import confirm

import sys, getopt

gitUsername = "johanlahti"
gitPassword = ""

env.hosts = ['johan@91.123.201.52']


def getParamVal(key, keyLong=None):
    # keyLong=["long_param_name="]
    o, a = getopt.getopt(sys.argv[1:], key+":", keyLong)
    opts = {}
    val = None
    for k,v in o:
        opts[k] = v
    if opts.has_key("-"+key) == True:
        val = opts["-"+key]
    return val

def test():
    with settings(warn_only=True):
        result = local('./manage.py test my_app', capture=True)
    if result.failed and not confirm("Tests failed. Continue anyway?"):
        abort("Aborting at user request.")

def commit(msg):
    msg = 'git add && git commit -m "%s"' %msg
    print msg
    local(msg)

def push():
    local("git push")

def prepare():
    #test()
    msg = ""
    if len(sys.argv) > 2:
        msg = sys.argv[2] #getParamVal("m")
    commit(msg)
    #push()

def deploy():
    #code_dir_client = '~/public_html/smap-mobile-svnfab'
    code_dir_ws = '/usr/lib/cgi-bin/trash_this_fabtest'
    #run("svn co https://%s:%s@github.com/getsmap/smap-mobile/trunk %s" % (gitUsername, gitPassword, code_dir_client) )
    
    #run("git clone https://%s:%s@github.com/getsmap/smap-mobile.git %s" % (gitUsername, gitPassword, code_dir_client) )
    #with cd(code_dir_client):
      #  run("git pull")
      #  run("touch app.wsgi")
    
    run("svn co https://%s:%s@github.com/getsmap/smap-mobile/trunk/ws %s" % (gitUsername, gitPassword, code_dir_ws) )
    #with cd(code_dir_ws):
    #    run("chmod 705 *")