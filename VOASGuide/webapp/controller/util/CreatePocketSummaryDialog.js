sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function (ManagedObject, MessageBox, utilities, History) {
	var CreatePocketSumController;
	return ManagedObject.extend("com.sap.build.toyota-canada.vehiclesGuideV3.controller.util.CreatePocketSummaryDialog", {
		constructor: function (oView) {
			CreatePocketSumController = this;
			CreatePocketSumController._oView = oView;
			CreatePocketSumController._oControl = sap.ui.xmlfragment(oView.getId(),
				"com.sap.build.toyota-canada.vehiclesGuideV3.fragments.CreatePocketSummaryDialog",
				CreatePocketSumController);
			CreatePocketSumController._bInit = false;
		},
		onInit: function () {

			CreatePocketSumController._oDialog = CreatePocketSumController.getControl();
			CreatePocketSumController.listOfBrand();
			CreatePocketSumController.listOfModelYear();

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
			CreatePocketSumController.getView().setModel(modelBrandModel, "brandModelNew");
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
			CreatePocketSumController.getView().setModel(modelYearModel, "yearModelNew");
		},
		/*onChange_ModelYear: function () {

			var brandCB = CreatePocketSumController.getView().byId("idNew_brandCB");
			var modelYearCB = CreatePocketSumController.getView().byId("idNew_modelYearCB");
			var seriesCB = CreatePocketSumController.getView().byId("id_seriesCBNew");

			var brandCBVal = brandCB.getValue();
			var modelYearCBVal = modelYearCB.getValue();
			if (seriesCB.getValue() !== "") {
				seriesCB.setValue("");
			}

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");
			if (sLocation_conf == 0) {
				CreatePocketSumController.sPrefix = "/voasguide_node";
			} else {
				CreatePocketSumController.sPrefix = "";
			}
			CreatePocketSumController.nodeJsUrl = CreatePocketSumController.sPrefix + "/node";
			var host = CreatePocketSumController.nodeJsUrl;
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
					CreatePocketSumController.getView().setModel(oModel, "seriesdropDownModelNew");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},*/
		exit: function () {
			delete CreatePocketSumController._oView;
		},

		getView: function () {
			return CreatePocketSumController._oView;
		},

		getControl: function () {
			return CreatePocketSumController._oControl;
		},

		getOwnerComponent: function () {
			return CreatePocketSumController._oView.getController().getOwnerComponent();
		},

		open: function () {
			var oView = CreatePocketSumController._oView;
			var oControl = CreatePocketSumController._oControl;

			if (!CreatePocketSumController._bInit) {

				// Initialize our fragment
				CreatePocketSumController.onInit();

				CreatePocketSumController._bInit = true;

				// connect fragment to the root view of CreatePocketSumController component (models, lifecycle)
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
			CreatePocketSumController._oControl.close();
		},

		setRouter: function (oRouter) {
			CreatePocketSumController.oRouter = oRouter;

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
					alert("CreatePocketSumController should Generate and display Pocket Summary Pdf in new window");

				}.bind(CreatePocketSumController))
				.then(function (result) {
					if (result === false) {
						return false;
					} else {

						CreatePocketSumController.close();

					}
				}.bind(CreatePocketSumController)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
		},
		_onButtonPress1: function () {

			CreatePocketSumController.close();

		},

		onExit: function () {
			CreatePocketSumController._oDialog.destroy();

			// to destroy templates for bound aggregations when templateShareable is true on exit to prevent duplicateId issue
			var aControls = [{
				"controlId": "sap_m_Dialog_4-content-build_simple_form_Form-1539614756800-formContainers-build_simple_form_FormContainer-1-formElements-build_simple_form_FormElement-2-fields-sap_m_ComboBox-1",
				"groups": ["items"]
			}, {
				"controlId": "sap_m_Dialog_4-content-build_simple_form_Form-1539614756800-formContainers-build_simple_form_FormContainer-1-formElements-build_simple_form_FormElement-2-fields-sap_m_ComboBox-2",
				"groups": ["items"]
			}];
			for (var i = 0; i < aControls.length; i++) {
				var oControl = CreatePocketSumController.getView().byId(aControls[i].controlId);
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