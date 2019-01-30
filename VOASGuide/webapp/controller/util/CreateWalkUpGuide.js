sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function (ManagedObject, MessageBox, utilities, History) {
	var CreateWalkUpDialogController;
	return ManagedObject.extend("com.sap.build.toyota-canada.vehiclesGuideV3.controller.util.CreateWalkUpGuide", {
		constructor: function (oView) {
			CreateWalkUpDialogController = this;
			CreateWalkUpDialogController._oView = oView;
			CreateWalkUpDialogController._oControl = sap.ui.xmlfragment(oView.getId(),
				"com.sap.build.toyota-canada.vehiclesGuideV3.fragments.CreateWalkUpGuide", CreateWalkUpDialogController);
			CreateWalkUpDialogController._bInit = false;
		},
		onInit: function () {

			CreateWalkUpDialogController._oDialog = CreateWalkUpDialogController.getControl();
			CreateWalkUpDialogController.listOfBrand();
			CreateWalkUpDialogController.listOfModelYear();
			var brandCB = sap.ushell.components.brandCB;
			var moYearCB = sap.ushell.components.modelYearCB;
			var seriesCB = sap.ushell.components.seriesCB;
				if (brandCB != undefined && moYearCB != undefined && seriesCB != undefined) {
			var brandVal = brandCB.getValue();

			if (brandVal != " " && brandVal != "" && brandVal != null && brandVal != undefined) {
				CreateWalkUpDialogController.getView().byId("idWalk_brandCB").setValue(brandVal);
				CreateWalkUpDialogController.getView().byId("idWalk_brandCB").setEnabled(false);
			} else {
				CreateWalkUpDialogController.getView().byId("idWalk_brandCB").setEnabled(true);
			}
			var moYearVal = moYearCB.getValue();
			if (moYearVal != " " && moYearVal != "" && moYearVal != null && moYearVal != undefined) {
				CreateWalkUpDialogController.getView().byId("idWalk_modelYearCB").setValue(moYearVal);
				CreateWalkUpDialogController.getView().byId("idWalk_modelYearCB").setEnabled(false);
			} else {
				CreateWalkUpDialogController.getView().byId("idWalk_modelYearCB").setEnabled(true);
			}
			var seriesVal = seriesCB.getValue();
			if (seriesVal != " " && seriesVal != "" && seriesVal != null && seriesVal != undefined) {
				CreateWalkUpDialogController.getView().byId("idWalk_seriesCB").setValue(seriesVal);
				CreateWalkUpDialogController.getView().byId("idWalk_seriesCB").setEnabled(false);
			} else {
				CreateWalkUpDialogController.getView().byId("idWalk_seriesCB").setEnabled(true);
				var sLocation = window.location.host;
				var sLocation_conf = sLocation.search("webide");
				if (sLocation_conf == 0) {
					CreateWalkUpDialogController.sPrefix = "/voasguide_node";
				} else {
					CreateWalkUpDialogController.sPrefix = "";
				}
				CreateWalkUpDialogController.nodeJsUrl = CreateWalkUpDialogController.sPrefix + "/node";
				var host = CreateWalkUpDialogController.nodeJsUrl;
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
						CreateWalkUpDialogController.getView().setModel(oModel, "seriesdropDownModelNew");
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
			CreateWalkUpDialogController.getView().setModel(modelBrandModel, "brandModelNew");
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
			CreateWalkUpDialogController.getView().setModel(modelYearModel, "yearModelNew");
		},
		onChange_ModelYear: function () {

			var brandCB = CreateWalkUpDialogController.getView().byId("idWalk_brandCB");
			var modelYearCB = CreateWalkUpDialogController.getView().byId("idWalk_modelYearCB");
			var seriesCB = CreateWalkUpDialogController.getView().byId("idWalk_seriesCB");

			var brandCBVal = brandCB.getValue();
			var modelYearCBVal = modelYearCB.getValue();
			if (seriesCB.getValue() !== "") {
				seriesCB.setValue("");
			}

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");
			if (sLocation_conf == 0) {
				CreateWalkUpDialogController.sPrefix = "/voasguide_node";
			} else {
				CreateWalkUpDialogController.sPrefix = "";
			}
			CreateWalkUpDialogController.nodeJsUrl = CreateWalkUpDialogController.sPrefix + "/node";
			var host = CreateWalkUpDialogController.nodeJsUrl;
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
					CreateWalkUpDialogController.getView().setModel(oModel, "seriesdropDownModelNew");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},
		exit: function () {
			delete CreateWalkUpDialogController._oView;
		},

		getView: function () {
			return CreateWalkUpDialogController._oView;
		},

		getControl: function () {
			return CreateWalkUpDialogController._oControl;
		},

		getOwnerComponent: function () {
			return CreateWalkUpDialogController._oView.getController().getOwnerComponent();
		},

		open: function () {
			var oView = CreateWalkUpDialogController._oView;
			var oControl = CreateWalkUpDialogController._oControl;
			if (!CreateWalkUpDialogController._bInit) {
				// Initialize our fragment
				CreateWalkUpDialogController.onInit();
				CreateWalkUpDialogController._bInit = true;
				// connect fragment to the root view of CreateWalkUpDialogController component (models, lifecycle)
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
			CreateWalkUpDialogController._oControl.close();
			CreateWalkUpDialogController._oDialog.destroy();
		},

		setRouter: function (oRouter) {
			CreateWalkUpDialogController.oRouter = oRouter;

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
					var brandCB = CreateWalkUpDialogController.getView().byId("idWalk_brandCB");
					var modelYearCB = CreateWalkUpDialogController.getView().byId("idWalk_modelYearCB");
					var seriesCB = CreateWalkUpDialogController.getView().byId("idWalk_seriesCB");
					var brandVal = brandCB.getValue();
					var moYear = modelYearCB.getValue();
					var serVal = seriesCB.getValue();
					var langSwitchState = CreateWalkUpDialogController.getView().byId("walkUpCreate_Lang").mProperties.state;
					var lang = "";
					if (langSwitchState == false) {
						lang = "FR";
					} else {
						lang = "EN";
					}
					var sLocation = window.location.host;
					var sLocation_conf = sLocation.search("webide");
					if (sLocation_conf == 0) {
						CreateWalkUpDialogController.sPrefix = "/voasguide_node";
					} else {
						CreateWalkUpDialogController.sPrefix = "";
					}
					CreateWalkUpDialogController.nodeJsUrl = CreateWalkUpDialogController.sPrefix + "/node";
					var host = CreateWalkUpDialogController.nodeJsUrl;
					var url = host +
						"/Z_VEHICLE_CATALOGUE_SRV/FileDownloadSet(Language='" + lang + "',Tab='WalkUp',Model_year='" + moYear + "',Tciseries='" + serVal +
						"',Brand='" + brandVal + "')/$value";
						$.ajax({
						url: url,
						method: 'GET',
						async: false,
						dataType: 'text',
						success: function (data, textStatus, jqXHR) {
							if (jqXHR.readyState === 4 && jqXHR.status === 200) {
								var string = JSON.stringify(data);
								var blob = new Blob([string], {
									type: "octet/stream"
								});
							/*var url2=window.URL.createObjectURL(blob, {
									type: "application/pdf"
								})*/
								//window.open(url2,'_blank');
							
								var link = document.createElement('a');
								link.href = window.URL.createObjectURL(blob);
								link.download = "Pdf-WalkUp" + new Date().getTime() + ".pdf";
								link.click();
							}
						},
						error: function (jqXHR, textStatus, errorThrown) {
						sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error",
								sap
								.m.MessageBox.Action.OK, null, null);
						}
					});
				//	window.open(url,'_blank');
					//	alert("CreateWalkUpDialogController should Generate and display Active (Based on Today's Date) What's New Pdf in new window");

				}.bind(CreateWalkUpDialogController))
				.then(function (result) {
					if (result === false) {
						return false;
					} else {

						CreateWalkUpDialogController.close();

					}
				}.bind(CreateWalkUpDialogController)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
		},
		_onButtonPress1: function () {

			CreateWalkUpDialogController.close();

		},

		onExit: function () {
			CreateWalkUpDialogController._oDialog.destroy();

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
				var oControl = CreateWalkUpDialogController.getView().byId(aControls[i].controlId);
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