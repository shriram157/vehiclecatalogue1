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
		_readUserBrand: function () {
			var brandCB = sap.ushell.components.brandCB;
			var brandVal = brandCB.getValue();
			var userModel = sap.ui.getCore().getModel("userModel");
			var bpDealerModel = sap.ui.getCore().getModel("BpDealerModel");
			var userData = [];
			var bpData = [];
			if (userModel) {
				if (bpDealerModel) {
					userData = userModel.getData();
					bpData = bpDealerModel.getData();
					if (userData.loggedUserType[0] == "Dealer_User" || userData.loggedUserType[0] == "Dealer_Admin") {
						if (bpData[0].Division == "10") {
							CreatePocketSumController.getView().byId("idPoc_brandCB").setEnabled(false);
							CreatePocketSumController.getView().byId("idPoc_brandCB").setSelectedKey("1");
						} else if (bpData[0].Division == "20") {
							CreatePocketSumController.getView().byId("idPoc_brandCB").setEnabled(false);
							CreatePocketSumController.getView().byId("idPoc_brandCB").setSelectedKey("2");
						}
					} else if (userData.loggedUserType[0] == "TCI_User" || userData.loggedUserType[0] == "TCI_User_Preliminary") {

						CreatePocketSumController.getView().byId("idPoc_brandCB").setEnabled(true);
						CreatePocketSumController.getView().byId("idPoc_brandCB").setValue(brandVal);

					} else {
						CreatePocketSumController.getView().byId("idPoc_brandCB").setEnabled(true);
						CreatePocketSumController.getView().byId("idPoc_brandCB").setValue(brandVal);
					}
				}
			}
		},
		onInit: function () {

			CreatePocketSumController._oDialog = CreatePocketSumController.getControl();
			CreatePocketSumController.listOfBrand();
			CreatePocketSumController.listOfModelYear();
			var brandCB = sap.ushell.components.brandCB;
			var moYearCB = sap.ushell.components.modelYearCB;
			//var userAttributesModel = sap.ui.getCore().getModel("userAttributesModel");
			//var langData;
			//	if (userAttributesModel) {
			/*langData = userAttributesModel.getData();
			Language = langData.Language[0];
			if (Language == "English") {
				LanguageState = true;
			} else {
				LanguageState = false;
			}*/
			var Language, LanguageState;
			var isLocaleSent = window.location.search.match(/language=([^&]*)/i);
			if (isLocaleSent) {
				Language = window.location.search.match(/language=([^&]*)/i)[1];
			} else {
				Language = "EN";
			}
			if (Language == "FR") {
				LanguageState = false;
			} else {
				LanguageState = true;
			}
			//	}
			CreatePocketSumController.getView().byId("id_poc_LangSwitch").setState(LanguageState);
			if (brandCB != undefined && moYearCB != undefined) {
				var brandVal = brandCB.getValue();
				var moYearVal = moYearCB.getValue();
				if (brandVal != " " && brandVal != "" && brandVal != null && brandVal != undefined) {
					CreatePocketSumController._readUserBrand();
				} else {
					CreatePocketSumController.getView().byId("idPoc_brandCB").setEnabled(true);
				}
				if (moYearVal != " " && moYearVal != "" && moYearVal != null && moYearVal != undefined) {
					CreatePocketSumController.getView().byId("idPoc_modelYearCB").setValue(moYearVal);
					//	CreatePocketSumController.getView().byId("idPoc_modelYearCB").setEnabled(false);
				} else {
					//	CreatePocketSumController.getView().byId("idPoc_modelYearCB").setEnabled(true);
				}
			}
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
			CreatePocketSumController._oDialog.destroy();
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
					var brandCB = CreatePocketSumController.getView().byId("idPoc_brandCB");
					var modelYearCB = CreatePocketSumController.getView().byId("idPoc_modelYearCB");
					var brandVal = brandCB.getValue();
					var moYear = modelYearCB.getValue();
					var dealerSwitch = CreatePocketSumController.getView().byId("id_poc_DealerSwitch").mProperties.state;
					var dealer = "";
					if (dealerSwitch == true) {
						dealer = "";
					} else {
						dealer = "X";
					}
					var langSwitchState = CreatePocketSumController.getView().byId("id_poc_LangSwitch").mProperties.state;
					var lang = "";
					if (langSwitchState == false) {
						lang = "FR";
					} else {
						lang = "EN";
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
						var userModel = sap.ui.getCore().getModel("userModel");
			var userData = userModel.getData();
			var usr = userData.loggedUserType[0];
					var url = host +
						"/Z_VEHICLE_CATALOGUE_SRV/FileDownload_summarySet(User='" + usr + "',Language='" + lang + "',Tab='X',Model_year='" + moYear + "',Brand='" +
						brandVal +
						"',Tciseries='" + dealer + "')/$value";
						var oBusyDialog = new sap.m.BusyDialog({
				showCancelButton: false
			});
			
			 oBusyDialog.open();
				// oBusyDialog.open();
						// $.ajax({
						// 	url: url,
						// 	method: 'GET',
						// 	async: true,
						// 	dataType: 'json',
						// 	success: function (data, textStatus, jqXHR) {
						// 		console.log(data);
						// 	},
						// 	error: function (jqXHR, textStatus, errorThrown) {
						// 		sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error",
						// 			sap
						// 			.m.MessageBox.Action.OK, null, null);
						// 	}
						// });
					window.open(url);
oBusyDialog.close();
					//	alert("CreatePocketSumController should Generate and display Active (Based on Today's Date) What's New Pdf in new window");

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