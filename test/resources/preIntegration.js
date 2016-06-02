
var utils = require("./utils.js").utils;

/**
 * Does some necessary button clicks before 
 * letting the module run its tests.
 * @return {undefined}
 */
exports.runPreTests = function() {

	
	
	it('tour shows', function() {
		casper.waitForSelector('button[data-role="end"]', function() {
			this.echo("Yess");
		});
	});
	it('tour ends', function() {
		casper.thenClick('button[data-role=end]');
		casper.waitWhileVisible('.tour-backdrop', function() {
			utils.capture("tour-backdrop-gone.png");
			expect('.tour-backdrop').not.to.be.visible;
		});
	});

	it('intro dialog shows up', function() {
		casper.waitForSelector('.smap-info-footer', function() {
			expect('.smap-info-footer').to.be.visible;
		});
	});
	it('hides intro dialog on close button click', function() {
		casper.thenClick(".smap-info-footer button");
		casper.waitWhileVisible('.modal', function() {
			expect('.smap-info-footer').not.to.be.visible;
			utils.capture("after_closing_introwin.png");
		});
	});
}