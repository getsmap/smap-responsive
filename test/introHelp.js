
var testConfig = require("./resources/config.js").config;
var utils = require("./resources/utils.js").utils;
var runPreTests = require("./resources/preIntegration.js").runPreTests;


/**
 * Tests to run before starting device specific tests
 */


/**
 * Tests which are not device specific
 */
function runTests(test) {

	it('button element should exist and be visible', function(){
		expect('#smap-opacity-btn').to.be.inDOM;
		expect('#smap-opacity-btn').to.be.visible;
	});

	it('button element click should open the popover with exactly 1 slider', function() {
		casper.then(function() {
			this.mouse.click("#smap-opacity-btn");
		}).waitForSelector('.opacity-popover', function() {
			expect("document.querySelectorAll('.slider-handle.min-slider-handle').length").evaluate.to.equal(2);
			utils.capture("slider.png");
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
			utils.capture("hide_all.png");

			// -- This example shows how to use evaluate to run a custom query command ---
			// var style = this.evaluate(function() {
			// 	return document.querySelectorAll('.slider-handle.min-slider-handle')[0].style;
			// });
			// expect(style.left).to.equal("0%");
			
			// -- This example is a different approach for evaluating a custom query command ---
			// expect("document.querySelectorAll('.slider-handle.min-slider-handle')[1].style").evaluate.to.equal("left: 0%;");
		});
			
	});
}

function main() {
	var testUrl = "http://localhost/smap-responsive/dev.html?config=malmo_atlas.js&ol=lekplatser";

	// -- Desktop tests ----------------------------------
	describe("Opacity plugin: desktop", function(test) {
		before(function() {
			casper.options.viewportSize = testConfig.casperOptions.viewportSizeDesktop;
			casper.start(testUrl);
		});
		runPreTests(test);
		runTests(test);
	});

	// -- Mobile tests ----------------------------------
	describe("Opacity plugin: mobile", function(test) {
		before(function() {
			casper.options.viewportSize = testConfig.casperOptions.viewportSizeMobile;
			casper.start(testUrl);
		});
		runPreTests(test);
		it('collapse button click should reveal the opacity button', function() {
			casper.then(function() {
				this.mouse.click(".thbtn");
			}).waitForSelector('#smap-opacity-btn', function() {
				expect('#smap-opacity-btn').to.be.visible;
				utils.capture("toolhandler-toggled-open.png");
			});
		});
		runTests(test);
	});
}

main();

