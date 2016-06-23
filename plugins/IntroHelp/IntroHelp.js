
// import { introGuide } from "intro-guide-js"

L.Control.IntroHelp = L.Control.extend({
	options: {
		position: 'topright',
		autoActivate: true,			// {Boolean} Begin automatically from start

		_lang: {
			sv: {
				steps: [
					{
						selector: ".leaflet-control-RedirectClick button",
						title: "Starta turen",
						description: 'Click here and then in the map to see a "Snedbild"'
					},
					{
						selector: ".leaflet-top.leaflet-right .leaflet-control-RedirectClick",
						title: "Snedbild",
						description: 'Click here and then in the map to see a "Snedbild" as we call it in Swedish'
					},
					{ 
						selector: ".leaflet-control-ShareLink",
						title: "Share link",
						description: 'Click here to share the current map as a link, preserving zoom, center point etc.'
					},
					{
						selector: "#smap-search-div",
						title: "Search",
						description: 'You can search for anything… limited to addresses.'
					},
					{
						selector: ".lswitch-btnhide",
						title: "Minimera lagermenyn",
						description: "Klicka här för att minimera/expandera lagermenyn"
					}
				]
			},
			en: {
				steps: [
					{
						selector: ".leaflet-control-RedirectClick",
						title: "Start tour",
						description: 'Click here and then in the map to see a "Snedbild" as we call it in Swedish'
					},
					{
						selector: ".leaflet-control-RedirectClick",
						title: "Snedbild",
						description: 'Click here and then in the map to see a "Snedbild" as we call it in Swedish'
					},
					{
						selector: ".leaflet-control-ShareLink",
						title: "Share link",
						description: 'Click here to share the current map as a link, preserving zoom, center point etc.'
					},
					{
						selector: "#smap-search-div",
						title: "Search",
						description: 'You can search for anything… limited to addresses.'
					},
					{
						selector: ".lswitch-btnhide",
						title: "Minimera lagermenyn",
						description: "Klicka här för att minimera/expandera lagermenyn"
					}
				]
			}

		}


	},
	
	_lang: {
		"sv": {
			btnLabel: "Ett exempels"
		},
		"en": {
			btnLabel: "An example"
		}
	},
	
	_setLang: function(langCode) {
		langCode = langCode || smap.config.langCode;
		if (this._lang) {
			this.lang = this._lang ? this._lang[langCode] : null;			
		}
	},

	initialize: function(options) {
		L.setOptions(this, options);
		if (this.options._lang) {
			// Always allow setting lang through options
			$.extend(true, this._lang, this.options._lang);
		}
		this._setLang(options.langCode);
	},

	onAdd: function(map) {
		// this._map // map can be accessed using *this* from all functions
		this._container = L.DomUtil.create('div', 'leaflet-control-introhelp'); // second parameter is class name
		L.DomEvent.disableClickPropagation(this._container);
		this.$container = $(this._container);
		this._createBtn();

		return this._container;
	},

	onRemove: function(map) {},

	/**
	 * This makes it possible to run different help courses without
	 * creating a new instance of this class.
	 * @param  {Array( {Object} )}	steps
	 * @return {[type]} [description]
	 */
	activate: function(steps, force) {
		force = force || false;
		if (this.active) {
			return false;
		}
		this.active = true;

		var $container = $('<div class="smap-introhelp-container" />').appendTo($("#maindiv"));
		var container = $container[0]
		// var container = document.querySelector("#intro"); // This is where the intro-guide will reside
		this._myIntroGuide = initIntroGuide.introGuide(container, {
			steps: this.lang.steps,
			stepIndex: 0
		});
		this._myIntroGuide.start();
		return true;
	},

	deactivate: function() {
		if (!this.active) {
			return false;
		}
		this.stop();
		this.active = false;
		return true;
	},


	_createBtn: function() {
		var self = this;

		this.$btn = $('<button id="smap-introhelp-btn" title="' + self.lang.btnLabel + '" class="btn btn-default"><span class="fa fa-question-circle-o"></span></button>');
		var self = this;
		this.$btn.on("click", (function () {
			this.activate(this.lang.steps, true);
			return false;
		}).bind(this));
		this.$container.append(this.$btn);
	}

});

//L.control.IntroHelp = function (options) {
//	return new L.Control.introHelp(options);
//};