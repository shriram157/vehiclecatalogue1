sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"./model/errorHandling",
	"com/sap/build/toyota-canada/vehiclesGuideV3/model/models"
], function (UIComponent, Device, errorHandling, models) {
	"use strict";
	var navigationWithContext = {

	};
	return UIComponent.extend("com.sap.build.toyota-canada.vehiclesGuideV3.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */

		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			errorHandling.register(this);
			// enable routing
			this.getRouter().initialize();
			jQuery.sap.require("sap.ui.core.routing.Router");
			jQuery.sap.require("sap.ui.core.routing.History");
			jQuery.sap.require("sap.ui.core.routing.HashChanger");
			jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
			this.routeHandler = new sap.m.routing.RouteMatchedHandler(this.getRouter());
			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			var employeemodel = new sap.ui.model.json.JSONModel();
			employeemodel.loadData("model/DataDetail.json");
			sap.ui.getCore().setModel(employeemodel, "employee");

		},
		getNavigationPropertyForNavigationWithContext: function (sEntityNameSet, targetPageName) {
			var entityNavigations = navigationWithContext[sEntityNameSet];
			return entityNavigations == null ? null : entityNavigations[targetPageName];
		}
	});
});