sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function (BaseController, MessageBox, Utilities, History) {
	"use strict";

	return BaseController.extend("com.sap.build.toyota-canada.vehiclesGuideV3.controller.Page5", {
		handleRouteMatched: function (oEvent) {
			var sAppId = "App5bb531dd96990b5ac99be4fa";

			var oParams = {};

			if (oEvent.mParameters.data.context) {
				this.sContext = oEvent.mParameters.data.context;

			} else {
				if (this.getOwnerComponent().getComponentData()) {
					var patternConvert = function (oParam) {
						if (Object.keys(oParam).length !== 0) {
							for (var prop in oParam) {
								if (prop !== "sourcePrototype") {
									return prop + "(" + oParam[prop][0] + ")";
								}
							}
						}
					};

					this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);

				}
			}

			var oPath;

			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}

		},
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("Page5").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

		},
		onExit: function () {

			// to destroy templates for bound aggregations when templateShareable is true on exit to prevent duplicateId issue
			var aControls = [{
				"controlId": "sap_Responsive_Page_0-content-build_simple_form_Form-1539203861690-formContainers-build_simple_form_FormContainer-1-formElements-build_simple_form_FormElement-1-fields-sap_m_ComboBox-1539203905049",
				"groups": ["items"]
			}, {
				"controlId": "sap_Responsive_Page_0-content-build_simple_form_Form-1539203861690-formContainers-build_simple_form_FormContainer-1-formElements-build_simple_form_FormElement-1-fields-sap_m_ComboBox-1539204556934",
				"groups": ["items"]
			}, {
				"controlId": "sap_Responsive_Page_0-content-build_simple_form_Form-1539203861690-formContainers-build_simple_form_FormContainer-1-formElements-build_simple_form_FormElement-1-fields-sap_m_ComboBox-1539204622321",
				"groups": ["items"]
			}];
			for (var i = 0; i < aControls.length; i++) {
				var oControl = this.getView().byId(aControls[i].controlId);
				for (var j = 0; j < aControls[i].groups.length; j++) {
					var sAggregationName = aControls[i].groups[j];
					var oBindingInfo = oControl.getBindingInfo(sAggregationName);
					var oTemplate = oBindingInfo.template;
					oTemplate.destroy();
				}
			}

		}
	});
}, /* bExport= */ true);