sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/resource/ResourceModel",
	"sap/base/i18n/ResourceBundle",
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"./model/errorHandling",
	"com/sap/build/toyota-canada/vehiclesGuideV3/model/models",
	"sap/ui/model/odata/v2/ODataModel"
], function (JSONModel, ResourceModel, ResourceBundle, Dialog, Text, UIComponent, Device, errorHandling, models, ODataModel) {
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
			var employeemodel = new JSONModel();
		/*	employeemodel.loadData("model/DataDetail.json");
			sap.ui.getCore().setModel(employeemodel, "employee");

		*/

			// Initialize language and i18n models
			var i18nModel = this.getModel("i18n");
			var language = jQuery.sap.getUriParameters().get("Language");
			if (language) {
				language = language.toLowerCase();
			}
			// language must be uppercase for OData calls
			var languageModel = new JSONModel({
				language: (language ? language : "en").toUpperCase()
			});
			this.setModel(languageModel, "language");
			if (language === "en" || language === "fr") {
				i18nModel = new ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: language
				});
				this.setModel(i18nModel, "i18n");
			}
			var bundle = i18nModel.getResourceBundle();

			// Attach XHR event handler to detect 401 error responses for handling as timeout
			var sessionExpDialog = new Dialog({
				title: bundle.getText('SESSION_EXP_TITLE'),
				type: 'Message',
				state: 'Warning',
				content: new Text({
					text: bundle.getText('SESSION_EXP_TEXT')
				})
			});
			var origOpen = XMLHttpRequest.prototype.open;
			XMLHttpRequest.prototype.open = function () {
				this.addEventListener('load', function (event) {
					// TODO Compare host name in URLs to ensure only app resources are checked
					if (event.target.status === 401) {
						if (!sessionExpDialog.isOpen()) {
							sessionExpDialog.open();
						}
					}
				});
				origOpen.apply(this, arguments);
			};

		},
		getNavigationPropertyForNavigationWithContext: function (sEntityNameSet, targetPageName) {
			var entityNavigations = navigationWithContext[sEntityNameSet];
			return entityNavigations == null ? null : entityNavigations[targetPageName];
		}
	});
});