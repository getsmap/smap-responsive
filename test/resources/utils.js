


exports.utils = {
	
	capture: function(fileName) {
		var screenshotsFolder = "test/screenshots/";
		casper.capture(screenshotsFolder + fileName);
	}
}