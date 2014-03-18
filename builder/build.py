#!/usr/bin/env python
# -*- coding: utf-8 -*-

#######################################################################################
# Author: Johan Lahti
# Company/Organisation: Malmö municipality, Sweden.
# Date: 2011-11-22
# Version: 1.0
# License: MIT License
# About: A script for merging many JS- and CSS-files and then compressing
#   them with yuicompressor. The script requires two JSON-files for configuration:
#   - pathEnv: Tells the path to the code and where output files should be saved.
#   - pathSources: Tells which files (.js and .css) to include in the build as well as
#       other options for the build (like traversing dirs).
#   Check the readme-document for more information.
#######################################################################################

import subprocess
import os
import json
import sys
import getopt

pathEnv = "config_env.json" # path to the required configuration file
pathSources = "config_sources.json" # path to the config of sources

def checkConfigEnv(configEnv):
    paths = [configEnv["outPathJS"], configEnv["outPathCSS"], configEnv["tempPathJS"], configEnv["tempPathCSS"]]
    for p in paths:
        # Check if the outfiles' folder exist (if not, the output file cannot be saved).
        isDir = os.path.isdir(os.path.dirname(p))
        if isDir == False:
            print "Error. This path in configEnv is not valid: %s \nContaining folder does not exist." %(p)
            return False
    print "\n-- Paths in config are valid --"
    return True

def main():
    print "Reading config files:\nEnvironment: %s\nSources: %s" %(pathEnv, pathSources)    

    # Read the <environment> config file
    fEnv = open(pathEnv, "r")
    dec = json.JSONDecoder()
    configEnv = dec.decode( fEnv.read() )
    fEnv.close()
    
    # Read the <sources> config file
    fSources = open(pathSources, "r")
    dec = json.JSONDecoder()
    configSources = dec.decode( fSources.read() )
    fSources.close()
    
    ok = checkConfigEnv(configEnv)
    if ok == False:
        return
    
    if configSources.has_key("traverseDirs") == True:
        # Override js and css properties in the config file
        # by traversing all folders in the traverseDirs, looking
        # for files with extension ".js" or ".css".
        traverseDirs = configSources["traverseDirs"]
        avoidNames = configSources["avoidNames"] if configSources.has_key("avoidNames") == True else []
        for ext in ["js", "css"]:
            configSources[ext] = []
            for dir in traverseDirs:
                paths = traverseDir(configEnv["basePath"]+dir, ext, avoidNames)
                configSources[ext].extend(paths)
    
    if configSources.has_key("firstNames") == True:
        firstNames = configSources["firstNames"]
        # Make the names in list firstNames come first in the array (applies only to js-files).
        newArr = []
        oldArr = configSources["js"][:]   # Clone
        
        # Cut all occurrences of name in the oldArr into the newArr.
        for name in firstNames:
            for path in oldArr:
                if name in path:
                    # Cut it
                    newArr.append(path)
        
        # Finally prepend the newArr to the oldArr
        newArr.extend(oldArr)
    
    if customBuild is not None:
        # Allow JS and CSS overrides depending on user or application
        
        customBuildCss = customBuild + "Css"
        customBuildJs = customBuild + "Js"
        
        if configSources.has_key(customBuildCss) == True:
            # Extend with overrides
            arr = configSources[customBuildCss]
            configSources["css"].extend(arr)
              
        if configSources.has_key(customBuildJs) == True:
            # Extend with overrides
            arr = configSources[customBuildJs]
            configSources["js"].extend(arr)
    
    
    # Iterate through all JS- and CSS-files and merge then into two files.
    for i in ["js", "css"]:
        arr = configSources[i]
        
        # Remove all duplicates
        outlist = []
        for element in arr:
            if element not in outlist:
                outlist.append(element)
                configSources[i] = outlist
        
        tempPath = configEnv["tempPath"+i.upper()] # Get path for temp file (JS or CSS) 
        mergeFiles(configEnv["basePath"], configSources[i], tempPath ) # Merge the files
        
        # After merging is complete - compress the file.
        cmd = "java -jar %s %s -o %s --charset utf-8" \
              % ( configEnv["yuiPath"],
                  tempPath,
                  configEnv["outPath"+i.upper() ] )
        p = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        result = p.stdout.readlines()
        if p.wait() == 0:
            # OK
            print "-- Done with %s! --" % (i)
        elif p.wait() > 0:
            # Error
            print "Error: %s" %(result)
    print ("\nIt was a success! Your files can be found at:\n\nTempJS:\t%s\nTempCSS:\t%s\n" + \
            "\nCompressed JS:\t%s\nCompressed CSS:\t%s") \
            %(configEnv["tempPathJS"], configEnv["tempPathCSS"], configEnv["outPathJS"], configEnv["outPathCSS"])
    
def mergeFiles(basePath, arr, tempPath):
    
    addBasePath = True
    
    outFile = open(tempPath, "w")
    outFile.close()
    outFile = open(tempPath, "a")
    
    print "\n\n"
    for path in arr:
        if addBasePath == True:
            path = basePath + path
        if os.path.isfile( path ) == True:
            f = open(path, "r")
            print "Reading path: %s" %(path)
            data = f.read()
            outFile.write( data )
            f.close()
        else:
            print "Kunde inte hitta filen: %s" %(path)
    
    outFile.close()
    


def traverseDir(dir, ext, avoidNames=[]):
    paths = []
    for top, dirs, files in os.walk(dir):
        for name in files:
            avoid = False
            
            for a in avoidNames:
                if a.upper() in name.upper():
                    avoid = True
                    print "Avoiding file %s" %(name)
                    
            if avoid == False and name.split(".")[-1] == ext: 
                path = os.path.join(top, name)
                paths.append(path)
    
    return paths



if __name__=="__main__":
    print "Content-Type: text/plain\n\n"
    customBuild = None
    
    if len(sys.argv) > 1:
        configEnv = sys.argv[1]
    if len(sys.argv) > 2:
        configSources = sys.argv[2]
    if len(sys.argv) > 1:
        o, a = getopt.getopt(sys.argv[1:], "c:", ["custom="])
        opts = {}
        for k,v in o:
            opts[k] = v
        if opts.has_key('-c') == True:
            customBuild = opts["-c"]
    main()
