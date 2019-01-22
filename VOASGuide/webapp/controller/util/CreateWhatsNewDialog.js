sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function (ManagedObject, MessageBox, Utilities, History) {
var CreateWhatsNewDialogController;
	return ManagedObject.extend("com.sap.build.toyota-canada.vehiclesGuideV3.controller.util.CreateWhatsNewDialog", {
		constructor: function (oView) {
			CreateWhatsNewDialogController=this;
			CreateWhatsNewDialogController._oView = oView;
			CreateWhatsNewDialogController._oControl = sap.ui.xmlfragment(oView.getId(), "com.sap.build.toyota-canada.vehiclesGuideV3.fragments.CreateWhatsNewDialog",
				CreateWhatsNewDialogController);
			CreateWhatsNewDialogController._bInit = false;
			//	CreateWhatsNewDialogController.listOfBrand();
			//	CreateWhatsNewDialogController.listOfModelYear();
		},

		exit: function () {
			delete CreateWhatsNewDialogController._oView;
		},

		getView: function () {
			return CreateWhatsNewDialogController._oView;
		},

		getControl: function () {
			return CreateWhatsNewDialogController._oControl;
		},

		getOwnerComponent: function () {
			return CreateWhatsNewDialogController._oView.getController().getOwnerComponent();
		},

		open: function () {
			var oView = CreateWhatsNewDialogController._oView;
			var oControl = CreateWhatsNewDialogController._oControl;

			if (!CreateWhatsNewDialogController._bInit) {

				// Initialize our fragment
				CreateWhatsNewDialogController.onInit();

				CreateWhatsNewDialogController._bInit = true;

				// connect fragment to the root view of CreateWhatsNewDialogController component (models, lifecycle)
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
			CreateWhatsNewDialogController._oControl.close();
		},

		setRouter: function (oRouter) {
			CreateWhatsNewDialogController.oRouter = oRouter;

		},
		getBindingParameters: function () {
			return {};

		},

		listOfBrand: function () {
			var data = {
				"modelBrand": [{
					"key": "1",
					"text": "TOYOTA"
				}, {
					"key": "2",
					"text": "LEXUS"
				}]
			};
			var modelBrandModel = new sap.ui.model.json.JSONModel();
			modelBrandModel.setData(data);
			CreateWhatsNewDialogController.getView().setModel(modelBrandModel, "brandModelNew");
		},

		listOfModelYear: function () {
			var d = new Date();
			var currentModelYear = d.getFullYear();
			var oldYear = currentModelYear - 1;
			var nextModelYear = currentModelYear + 1;
			var nextModelYear2 = currentModelYear + 2;
			var nextModelYear3 = currentModelYear + 3;
			var data = {
				"modelYear": [{
					"key": "5",
					"text": oldYear
				}, {
					"key": "1",
					"text": currentModelYear
				}, {
					"key": "2",
					"text": nextModelYear
				}, {
					"key": "3",
					"text": nextModelYear2
				}, {
					"key": "4",
					"text": nextModelYear3
				}]
			};
			var modelYearModel = new sap.ui.model.json.JSONModel();
			modelYearModel.setData(data);
			CreateWhatsNewDialogController.getView().setModel(modelYearModel, "yearModelNew");
		},
		onChange_ModelYear: function () {

			var brandCB = CreateWhatsNewDialogController.getView().byId("idNew_brandCB");
			var modelYearCB = CreateWhatsNewDialogController.getView().byId("idNew_modelYearCB");
			var seriesCB = CreateWhatsNewDialogController.getView().byId("id_seriesCBNew");

			var brandCBVal = brandCB.getValue();
			var modelYearCBVal = modelYearCB.getValue();
			if (seriesCB.getValue() !== "") {
				seriesCB.setValue("");
			}
			
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");
			if (sLocation_conf == 0) {
				CreateWhatsNewDialogController.sPrefix = "/voasguide_node";
			} else {
				CreateWhatsNewDialogController.sPrefix = "";
			}
			CreateWhatsNewDialogController.nodeJsUrl = CreateWhatsNewDialogController.sPrefix + "/node";
			var host = CreateWhatsNewDialogController.nodeJsUrl;
			var url = host +
				"/Z_VEHICLE_CATALOGUE_SRV/ZC_BRAND_MODEL_DETAILSSet?$filter=(Brand eq '" + brandCBVal + "' and Modelyear eq '" + modelYearCBVal +
				"')";
			//	"/Z_VEHICLE_CATALOGUE_SRV/ZC_BRAND_MODEL_DETAILSSet?$filter= (Brand eq 'TOYOTA' and Modelyear eq '2018')";
			$.ajax({
				url: url,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					//	var oModel = new sap.ui.model.json.JSONModel(data.d.results);
					var oModel = new sap.ui.model.json.JSONModel();

					var arr = [];
					var j = 0;
					for (var c = 0; c < data.d.results.length; c++) {
						for (var i = 0; i < data.d.results.length; i++) {
							if ($.inArray(data.d.results[i]["TCISeries"], arr) < 0) {
								arr[j] = data.d.results[i]["TCISeries"];
								j++;

							}
						}
					}

					oModel.setData(arr);
					CreateWhatsNewDialogController.getView().setModel(oModel, "seriesdropDownModelNew");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},
		_onButtonPress: function (oEvent) {

			oEvent = jQuery.extend(true, {}, oEvent);
			return new Promise(function (fnResolve) {
					fnResolve(true);
				})
				.then(function (result) {
					alert("CreateWhatsNewDialogController should Generate and display Active (Based on Today's Date) What's New Pdf in new window");

				}.bind(CreateWhatsNewDialogController))
				.then(function (result) {
					if (result === false) {
						return false;
					} else {

						CreateWhatsNewDialogController.close();

					}
				}.bind(CreateWhatsNewDialogController)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
		},
		_onButtonPress1: function () {

			CreateWhatsNewDialogController.close();

		},
		onInit: function () {

			CreateWhatsNewDialogController._oDialog = CreateWhatsNewDialogController.getControl();
			CreateWhatsNewDialogController.listOfBrand();
			CreateWhatsNewDialogController.listOfModelYear();

		},
		onExit: function () {
			CreateWhatsNewDialogController._oDialog.destroy();

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
				var oControl = CreateWhatsNewDialogController.getView().byId(aControls[i].controlId);
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