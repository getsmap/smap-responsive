// var casper    = require("casper").create();

// var assert    = require("chai").assert;
// var expect    = require("chai").expect;
// var should    = require("chai").should();

// var testConfig = require("./test/testConfig.js").config;

function capture(fileName) {
	var screenshotsFolder = "test/screenshots/";
	casper.capture(screenshotsFolder + fileName);
}

describe("Opacity plugin desktop", function(test) {
	// this.timeout(300);
	before(function() {
		casper.options.viewportSize = {width: 1200, height: 600};
		casper.start('http://localhost/smap-responsive/dev.html?config=malmo_atlas.js&ol=lekplatser');
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
			capture("after_closing_introwin.png");
		});
	});

	it('button element should exists and be visible', function(){
		expect('#smap-opacity-btn').to.be.inDOM;
		expect('#smap-opacity-btn').to.be.visible;
	});

	it('button element click should open the popover with exactly 1 slider', function() {
		casper.then(function() {
			this.mouse.click("#smap-opacity-btn");
		}).waitForSelector('.opacity-popover', function() {
			expect("document.querySelectorAll('.slider-handle.min-slider-handle').length").evaluate.to.equal(2);
			capture("slider.png");
		});
	});

	it("button hideall should move slider to the left and set value to 0%", function(done) {
		casper.then(function() {
			this.mouse.click(".smap-opacity-btnhideall");
		}).then(function() {
			var styles = this.getElementsAttribute(".slider-handle.min-slider-handle", "style");
			styles.forEach(function(style) {
				expect(style).to.contain("0%");
			});
			capture("hide_all.png");

			// -- This example shows how to use evalute ---
			// var style = this.evaluate(function() {
			// 	return document.querySelectorAll('.slider-handle.min-slider-handle')[0].style;
			// });
			// expect(style.left).to.equal("0%");
		});
			
			// expect("document.querySelectorAll('.slider-handle.min-slider-handle')[1].style").evaluate.to.equal("left: 0%;");
			// setTimeout(function() {
			// 	done();
			// }, 250);
	});
});