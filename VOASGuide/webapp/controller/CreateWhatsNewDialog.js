sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function (ManagedObject, MessageBox, Utilities, History) {

	return ManagedObject.extend("com.sap.build.toyota-canada.vehiclesGuideV3.controller.CreateWhatsNewDialog", {
		constructor: function (oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "com.sap.build.toyota-canada.vehiclesGuideV3.view.CreateWhatsNewDialog", this);
			this._bInit = false;
		},

		exit: function () {
			delete this._oView;
		},

		getView: function () {
			return this._oView;
		},

		getControl: function () {
			return this._oControl;
		},

		getOwnerComponent: function () {
			return this._oView.getController().getOwnerComponent();
		},

		open: function () {
			var oView = this._oView;
			var oControl = this._oControl;

			if (!this._bInit) {

				// Initialize our fragment
				this.onInit();

				this._bInit = true;

				// connect fragment to the root view of this component (models, lifecycle)
				oView.addDependent(oControl);
			}

			var args = Array.prototype.slice.call(arguments);
			if (oControl.open) {
				oControl.open.apply(oControl, args);
			} else if (oControl.openBy) {
				oControl.openBy.apply(oControl, args);
			}
		},

		close: function () {
			this._oControl.close();
		},

		setRouter: function (oRouter) {
			this.oRouter = oRouter;

		},
		getBindingParameters: function () {
			return {};

		},
		_onButtonPress: function (oEvent) {

			oEvent = jQuery.extend(true, {}, oEvent);
			return new Promise(function (fnResolve) {
					fnResolve(true);
				})
				.then(function (result) {
					alert("This should Generate and display Active (Based on Today's Date) What's New Pdf in new window");

				}.bind(this))
				.then(function (result) {
					if (result === false) {
						return false;
					} else {

						this.close();

					}
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
		},
		_onButtonPress1: function () {

			this.close();

		},
		onInit: function () {

			this._oDialog = this.getControl();

		},
		onExit: function () {
			this._oDialog.destroy();

			// to destroy templates for bound aggregations when templateShareable is true on exit to prevent duplicateId issue
			var aControls = [{
				"controlId": "sap_m_Dialog_5-content-build_simple_form_Form-1539640431280-formContainers-build_simple_form_FormContainer-1-formElements-build_simple_form_FormElement-2-fields-sap_m_ComboBox-1",
				"groups": ["items"]
			}, {
				"controlId": "sap_m_Dialog_5-content-build_simple_form_Form-1539640431280-formContainers-build_simple_form_FormContainer-1-formElements-build_simple_form_FormElement-2-fields-sap_m_ComboBox-2",
				"groups": ["items"]
			}, {
				"controlId": "sap_m_Dialog_5-content-build_simple_form_Form-1539640431280-formContainers-build_simple_form_FormContainer-1-formElements-build_simple_form_FormElement-2-fields-sap_m_ComboBox-3",
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