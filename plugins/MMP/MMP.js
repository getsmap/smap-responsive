
L.Control.MMP = L.Control.extend({
	options: {
		position: 'topright',
		forcedDomain: "malmo.se"
	},
	
	_lang: {
		"sv": {
			btnLabel: "Spara",
			dragMe: '<ol><li>Dra markören till platsen som ärendet avser</li>'+
				'<li>Zooma in så långt som möjligt</li>'+
				'<li>Tryck sen på <b><span class="fa fa-save" style="margin-right: 4px;"></span>Spara</b></li></ol>'
		},
		"en": {
			btnLabel: "Save",
			dragMe: 'Drag the marker and then press <b>"Save"</b>.'
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
		this._setLang(options.langCode);
	},

	onAdd: function(map) {
		if (document.domain === "kartor.malmo.se") {
			// Solve cross-domain issue between iframe and parent
			document.domain = this.options.forcedDomain;
		}
		this.map = map;
		this._container = L.DomUtil.create('div', 'leaflet-control-mmp');
		L.DomEvent.disableClickPropagation(this._container);
		this.$container = $(this._container);
		this._createBtn();

		var self = this;
		smap.event.on("smap.core.beforeapplyparams", function(e, p) {
			// Make the category layer visible so we can snap to it
			var ol = p.OL || "";
			ol = ol.split(",");
			ol.push(p.CATEGORY);
			ol.join(",");
			p.OL = ol;
		});
		smap.event.on("smap.core.applyparams", function(e, p) {
			self._snapLayer = smap.cmd.getLayer(p.CATEGORY);
			if (self._snapLayer) {
				self._addEditInterface();
			}
		});
		return this._container;
	},

	onRemove: function(map) {},

	save: function() {
		var self = this;
		var p = this.map.getCenter();
		smap.cmd.loading(true);

		// TODO: Ajax request and then return data to parent
		setTimeout(function() {
			var data = {easting: self._latLng.lng, northing: self._latLng.lat};
			parent.$("body").trigger("smap:updatedata", data);
			smap.cmd.loading(false);
		}, 1000);
	},

	_createBtn: function() {
		var self = this;

		this.$btn = $('<button id="smap-mmp-btn" disabled title="' + self.lang.btnLabel + '" class="btn btn-default"><span class="fa fa-save"></span><label>'+this.lang.btnLabel+'</label></button>');
		this.$btn.on("click", function () {
			self.save();
			return false;
		});
		this.$container.append(this.$btn);
	},

	_addSnapping: function(marker) {
		marker.snapediting = new L.Handler.MarkerSnap(this.map, marker);
        marker.snapediting.addGuideLayer(this._snapLayer);
        marker.snapediting.enable();
	},

	_addEditInterface: function() {

		var self = this;
		var c = this.map.getCenter();
		var marker = L.marker(c, {
				draggable: true
		});

		marker.bindPopup(this.lang.dragMe);
		marker.on("dragstart", function(e) {
			e.target.closePopup();
		});
		marker.on("dragend", function(e) {
			$("#smap-mmp-btn").prop("disabled", false);
			e.target.openPopup();
			self._latLng = e.target.getLatLng();
		});
		this.map.addLayer(marker);
		this._addSnapping(marker);
		marker.openPopup();
	}
});





















//L.control.template = function (options) {
//	return new L.Control.Template(options);
//};