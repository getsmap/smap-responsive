// var casper    = require("casper").create();

// var assert    = require("chai").assert;
// var expect    = require("chai").expect;
// var should    = require("chai").should();

// var testConfig = require("./test/testConfig.js").config;


describe("Opacity plugin", function(test) {
	before(function() {
		casper.options.viewportSize = {width: 1200, height: 600};
		casper.start('http://localhost/smap-responsive/dev.html?config=malmo_atlas.js');
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
			this.capture('./test/after_closing_introwin.png');
		});
	});

	it('button element should exists and be visible', function(){
		expect('#smap-opacity-btn').to.be.inDOM;
		expect('#smap-opacity-btn').to.be.visible;
	});

	it('button element click should open a popover with exactly 1 slider', function() {
		casper.then(function() {
			this.mouse.click("#smap-opacity-btn");
		})
		casper.waitForSelector('.opacity-popover', function() {
			expect("document.querySelectorAll('.slider-handle.min-slider-handle').length").evaluate.to.equal(1);
		});
		casper.capture("test/slider.png");
	});
});