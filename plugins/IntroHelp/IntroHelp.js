
L.Control.IntroHelp = L.Control.extend({
	options: {
		position: 'topright',
		autoActivate: true,			// {Boolean} Begin automatically from start

		steps: [

			{
				element: ".leaflet-control-RedirectClick",
				title: "Snedbild",
				content: 'Click here and then in the map to see a "Snedbild" as we call it in Swedish'
			},
			{
				element: ".leaflet-control-ShareLink",
				title: "Share link",
				content: 'Click here to share the current map as a link, preserving zoom, center point etc.'
			},
			{
				element: "#smap-search-div",
				title: "Search",
				content: 'You can search for anything… limited to addresses.'
			}
		]


	},
	
	_lang: {
		"sv": {
			btnLabel: "Ett exempel"
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
		if (options._lang) {
			// Always allow setting lang through options
			$.extend(true, this._lang, options._lang);
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
		this.start(steps || this.options.steps, force);
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
			this.activate(this.options.steps, true);
			return false;
		}).bind(this));
		this.$container.append(this.$btn);
	},

	/**
	 * Run the help with the given steps.
	 * @param  {Array( {Object} )}	steps
	 * @return {null}
	 */
	start: function(steps, force) {
		force = force || false;
		this._tour = new Tour({
			steps: steps,
			backdrop: true,
			backdropContainer: "#mapdiv",
			storage: window.localStorage,
			onEnd: this.deactivate.bind(this)

		});
		
		// Initialize the tour
		var wasInitiated = this._tour.init()._inited || force;
		if (!wasInitiated) {
			return this.deactivate();
		}
		this._tour.restart();
		this._tour.start(steps, force);
	},

	stop: function() {
		if (this._tour._inited) {
			this._tour.end();
		}
	}
});

//L.control.IntroHelp = function (options) {
//	return new L.Control.introHelp(options);
//};