sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function (ManagedObject, MessageBox, utilities, History) {
	var CreateVehicleGuideDialogController;
	return ManagedObject.extend("com.sap.build.toyota-canada.vehiclesGuideV3.controller.util.CreateVehicleGuideDialog", {
		constructor: function (oView) {
			CreateVehicleGuideDialogController = this;
			CreateVehicleGuideDialogController._oView = oView;
			CreateVehicleGuideDialogController._oControl = sap.ui.xmlfragment(oView.getId(),
				"com.sap.build.toyota-canada.vehiclesGuideV3.fragments.CreateVehicleGuideDialog",
				CreateVehicleGuideDialogController);
			CreateVehicleGuideDialogController._bInit = false;
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
							CreateVehicleGuideDialogController.getView().byId("idVeh_brandCB").setEnabled(false);
							CreateVehicleGuideDialogController.getView().byId("idVeh_brandCB").setSelectedKey("1");
						} else if (bpData[0].Division == "20") {
							CreateVehicleGuideDialogController.getView().byId("idVeh_brandCB").setEnabled(false);
							CreateVehicleGuideDialogController.getView().byId("idVeh_brandCB").setSelectedKey("2");
						}
					} else if (userData.loggedUserType[0] == "TCI_User" || userData.loggedUserType[0] == "TCI_User_Preliminary") {

						CreateVehicleGuideDialogController.getView().byId("idVeh_brandCB").setEnabled(true);
						CreateVehicleGuideDialogController.getView().byId("idVeh_brandCB").setValue(brandVal);

					} else {
						CreateVehicleGuideDialogController.getView().byId("idVeh_brandCB").setEnabled(true);
						CreateVehicleGuideDialogController.getView().byId("idVeh_brandCB").setValue(brandVal);
					}
				}
			}
		},

		onInit: function () {
			CreateVehicleGuideDialogController._oDialog = CreateVehicleGuideDialogController.getControl();
			CreateVehicleGuideDialogController.listOfBrand();
			CreateVehicleGuideDialogController.listOfModelYear();
			var brandCB = sap.ushell.components.brandCB;
			var moYearCB = sap.ushell.components.modelYearCB;
			var seriesCB = sap.ushell.components.seriesCB;
			//var userAttributesModel = sap.ui.getCore().getModel("userAttributesModel");
			//var langData;
			//	if (userAttributesModel) {
			/*langData = userAttributesModel.getData();
			Language = langData[0].Language[0];
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
			CreateVehicleGuideDialogController.getView().byId("idVehCreate_Lang").setState(LanguageState);
			if (brandCB != undefined && moYearCB != undefined && seriesCB != undefined) {
				var brandVal = brandCB.getValue();

				if (brandVal != " " && brandVal != "" && brandVal != null && brandVal != undefined) {
					CreateVehicleGuideDialogController._readUserBrand();
				} else {
					CreateVehicleGuideDialogController.getView().byId("idVeh_brandCB").setEnabled(true);
				}
				var moYearVal = moYearCB.getValue();
				if (moYearVal != " " && moYearVal != "" && moYearVal != null && moYearVal != undefined) {
					CreateVehicleGuideDialogController.getView().byId("idVeh_modelYearCB").setValue(moYearVal);
					//	CreateVehicleGuideDialogController.getView().byId("idVeh_modelYearCB").setEnabled(false);
				} else {
					CreateVehicleGuideDialogController.getView().byId("idVeh_modelYearCB").setEnabled(true);
				}
				var seriesVal = seriesCB.getValue();
				if (seriesVal != " " && seriesVal != "" && seriesVal != null && seriesVal != undefined) {
					CreateVehicleGuideDialogController.getView().byId("idVeh_seriesCB").setValue(seriesVal);
					//	CreateVehicleGuideDialogController.getView().byId("idVeh_seriesCB").setEnabled(false);
				} else {
					CreateVehicleGuideDialogController.getView().byId("idVeh_seriesCB").setEnabled(true);
					var sLocation = window.location.host;
					var sLocation_conf = sLocation.search("webide");
					if (sLocation_conf == 0) {
						CreateVehicleGuideDialogController.sPrefix = "/voasguide_node";
					} else {
						CreateVehicleGuideDialogController.sPrefix = "";
					}
					CreateVehicleGuideDialogController.nodeJsUrl = CreateVehicleGuideDialogController.sPrefix + "/node";
					var host = CreateVehicleGuideDialogController.nodeJsUrl;
					var url = host +
						"/Z_VEHICLE_CATALOGUE_SRV/ZC_BRAND_MODEL_DETAILSSet?$filter=(Brand eq '" + brandVal + "' and Modelyear eq '" + moYearVal +
						"')";
					$.ajax({
						url: url,
						method: 'GET',
						async: false,
						dataType: 'json',
						success: function (data, textStatus, jqXHR) {
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
							CreateVehicleGuideDialogController.getView().setModel(oModel, "seriesdropDownModelNew");
						},
						error: function (jqXHR, textStatus, errorThrown) {
							sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error",
								sap
								.m.MessageBox.Action.OK, null, null);
						}
					});
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
			CreateVehicleGuideDialogController.getView().setModel(modelBrandModel, "brandModelNew");
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
			CreateVehicleGuideDialogController.getView().setModel(modelYearModel, "yearModelNew");
		},
		onChange_ModelYear: function () {

			var brandCB = CreateVehicleGuideDialogController.getView().byId("idVeh_brandCB");
			var modelYearCB = CreateVehicleGuideDialogController.getView().byId("idVeh_modelYearCB");
			var seriesCB = CreateVehicleGuideDialogController.getView().byId("idVeh_seriesCB");

			var brandCBVal = brandCB.getValue();
			var modelYearCBVal = modelYearCB.getValue();
			if (seriesCB.getValue() !== "") {
				seriesCB.setValue("");
			}

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");
			if (sLocation_conf == 0) {
				CreateVehicleGuideDialogController.sPrefix = "/voasguide_node";
			} else {
				CreateVehicleGuideDialogController.sPrefix = "";
			}
			CreateVehicleGuideDialogController.nodeJsUrl = CreateVehicleGuideDialogController.sPrefix + "/node";
			var host = CreateVehicleGuideDialogController.nodeJsUrl;
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
					CreateVehicleGuideDialogController.getView().setModel(oModel, "seriesdropDownModelNew");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},
		exit: function () {
			delete CreateVehicleGuideDialogController._oView;
		},

		getView: function () {
			return CreateVehicleGuideDialogController._oView;
		},

		getControl: function () {
			return CreateVehicleGuideDialogController._oControl;
		},

		getOwnerComponent: function () {
			return CreateVehicleGuideDialogController._oView.getController().getOwnerComponent();
		},

		open: function () {
			var oView = CreateVehicleGuideDialogController._oView;
			var oControl = CreateVehicleGuideDialogController._oControl;

			if (!CreateVehicleGuideDialogController._bInit) {

				// Initialize our fragment
				CreateVehicleGuideDialogController.onInit();

				CreateVehicleGuideDialogController._bInit = true;

				// connect fragment to the root view of CreateVehicleGuideDialogController component (models, lifecycle)
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
			CreateVehicleGuideDialogController._oControl.close();
			CreateVehicleGuideDialogController._oDialog.destroy();
		},
		afterClose: function () { //added new kanika , check CreateVehicleGuideDialogController 
			CreateVehicleGuideDialogController._oDialog.destroy();
		},
		setRouter: function (oRouter) {
			CreateVehicleGuideDialogController.oRouter = oRouter;
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
					var brandCB = CreateVehicleGuideDialogController.getView().byId("idVeh_brandCB");
					var modelYearCB = CreateVehicleGuideDialogController.getView().byId("idVeh_modelYearCB");
					var seriesCB = CreateVehicleGuideDialogController.getView().byId("idVeh_seriesCB");
					var brandVal = brandCB.getValue();
					var moYear = modelYearCB.getValue();
					var serVal = seriesCB.getValue();
					var dealerSwitch = CreatePocketSumController.getView().byId("id_Veh_DealerSwitch").mProperties.state;
					var dealer = "";
					if (dealerSwitch == true) {
						dealer = "ON";
					} else {
						dealer = "OFF";
					}
					var langSwitchState = CreateVehicleGuideDialogController.getView().byId("idVehCreate_Lang").mProperties.state;
					var lang = "";
					if (langSwitchState == false) {
						lang = "FR";
					} else {
						lang = "EN";
					}
					var sLocation = window.location.host;
					var sLocation_conf = sLocation.search("webide");
					if (sLocation_conf == 0) {
						CreateVehicleGuideDialogController.sPrefix = "/voasguide_node";
					} else {
						CreateVehicleGuideDialogController.sPrefix = "";
					}
					CreateVehicleGuideDialogController.nodeJsUrl = CreateVehicleGuideDialogController.sPrefix + "/node";
					var host = CreateVehicleGuideDialogController.nodeJsUrl;
					var url = host +
						"/Z_VEHICLE_CATALOGUE_SRV/FileDownloadSet(Language='" + lang + "',Tab='WhatsNew',Model_year='" + moYear + "',Tciseries='" +
						serVal +
						"',Brand='" + brandVal + "',DealerNet='" + dealer + "')/$value";
					/*	$.ajax({
							url: url,
							method: 'GET',
							async: false,
							dataType: 'json',
							success: function (data, textStatus, jqXHR) {
								console.log(data);
							},
							error: function (jqXHR, textStatus, errorThrown) {
								sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error",
									sap
									.m.MessageBox.Action.OK, null, null);
							}
						});*/
					window.open(url, '_blank');
					//	alert("CreateVehicleGuideDialogController should Generate and display Active (Based on Today's Date) What's New Pdf in new window");

				}.bind(CreateVehicleGuideDialogController))
				.then(function (result) {
					if (result === false) {
						return false;
					} else {

						CreateVehicleGuideDialogController.close();

					}
				}.bind(CreateVehicleGuideDialogController)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
		},
		_onButtonPress1: function () {

			CreateVehicleGuideDialogController.close();

		},

		onExit: function () {
			CreateVehicleGuideDialogController._oDialog.destroy();

			// to destroy templates for bound aggregations when templateShareable is true on exit to prevent duplicateId issue
			var aControls = [{
				"controlId": "sap_m_Dialog_0-content-build_simple_form_Form-1539206849712-formContainers-build_simple_form_FormContainer-1-formElements-build_simple_form_FormElement-2-fields-sap_m_ComboBox-1",
				"groups": ["items"]
			}, {
				"controlId": "sap_m_Dialog_0-content-build_simple_form_Form-1539206849712-formContainers-build_simple_form_FormContainer-1-formElements-build_simple_form_FormElement-2-fields-sap_m_ComboBox-1539207024362",
				"groups": ["items"]
			}, {
				"controlId": "sap_m_Dialog_0-content-build_simple_form_Form-1539206849712-formContainers-build_simple_form_FormContainer-1-formElements-build_simple_form_FormElement-2-fields-sap_m_ComboBox-1539206947726",
				"groups": ["items"]
			}];
			for (var i = 0; i < aControls.length; i++) {
				var oControl = CreateVehicleGuideDialogController.getView().byId(aControls[i].controlId);
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