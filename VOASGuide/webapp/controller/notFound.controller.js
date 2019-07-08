sap.ui.define([
	"com/sap/build/toyota-canada/vehiclesGuideV3/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.sap.build.toyota-canada.vehiclesGuideV3.controller.notFound", {
	
		onInit: function () {
			this.getView().setModel(this.getOwnerComponent().getModel("i18n"), "i18n");
		}
	});

});