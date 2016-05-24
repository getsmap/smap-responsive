
var utils = require("./utils.js").utils;

/**
 * Does some necessary button clicks before 
 * letting the module run its tests.
 * @return {undefined}
 */
exports.runPreTests = function() {

	
	
	it('tour shows', function() {
		casper.evaluate(function() {
			localStorage.removeItem["tour_end"];
			localStorage.clear();
		}, {});
		casper.waitForSelector('button[data-role="end"]', function() {
			this.echo("Yess");
		});
	});
	it('tour ends', function() {
		casper.thenClick('button[data-role=end]', function() {
			// this.echo( this.evaluate(function() {
			// 	return document.querySelectorAll('button[data-role=end]').length;
			// }) );
			// var btn = this.evaluate(function() {
			// 	return document.querySelectorAll('button[data-role=end]').length;
			// });
			// this.mouse.click('button[data-role=end]');
			// this.mouse.click('button[data-role=end]');
		});
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
		casper.then(function() {
			this.mouse.click(".smap-info-footer button");	
		}).waitWhileVisible('.modal', function() {
			expect('.smap-info-footer').not.to.be.visible;
			utils.capture("after_closing_introwin.png");
		});
	});
}