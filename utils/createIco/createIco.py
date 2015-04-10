# -*- coding: utf-8 -*-

# Author: Johan Lahti
# Date: 2015-03-05
# Usage:
# 		> python createIco.py pathInputImage pathOutputImage
# 	Note! Include the extension of both input and output image.
# 		E.g. If you want to create an ico-format image, use extension ".ico"
# License: MIT License

# Install (requires 1 external library, PIL):
# To install PIL use:
# 	> pip install Pillow
# 	Read this for more info: http://pillow.readthedocs.org/en/latest/installation.html

# --- Options -----------------
size = 32  # Size in pixels (width and height will be the same)
# -----------------------------


import sys, getopt
from PIL import Image

def getParams():

	if len(sys.argv) <= 1:
		return None, None, None
	
	inputSrc = sys.argv[1]
	outputSrc = sys.argv[2]

	# Get optional parameter output size
	# o, a = getopt.getopt(sys.argv[1:], "s:", ["size="])
	# opts = {}
	# for k,v in o:
	# 	opts[k] = v
	# if opts.has_key('-s') == True:
	# 	size = opts["-s"]
	
	# Format size
	size = int(size)
	size = tuple([size]*2) # [size] -> (size, size)
	return inputSrc, outputSrc, size

def convertImage(inputSrc, outputSrc, size):
	inp = Image.open(inputSrc)
	out = inp.resize(size)
	inp.close()
	out.save(outputSrc)
	out.close()


if __name__ == "__main__":
	inputSrc, outputSrc, size = getParams()
	if not None in [inputSrc, outputSrc, size]:
		print "Starting conversion…"
		convertImage(inputSrc, outputSrc, size)
		print "Done! New image here: %s" %(outputSrc)
	else:
		print "Usage >> python createIco.py inputImg.png outputImg.ico -s 32"
