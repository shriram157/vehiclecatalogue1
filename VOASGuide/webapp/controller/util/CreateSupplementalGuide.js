sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function (ManagedObject, MessageBox, utilities, History) {
	var CreateSuppGuideController;
	return ManagedObject.extend("com.sap.build.toyota-canada.vehiclesGuideV3.controller.util.CreateSupplementalGuide", {
		constructor: function (oView) {
			CreateSuppGuideController = this;
			CreateSuppGuideController._oView = oView;
			CreateSuppGuideController._oControl = sap.ui.xmlfragment(oView.getId(),
				"com.sap.build.toyota-canada.vehiclesGuideV3.fragments.CreateSupplementalGuide", CreateSuppGuideController);
			CreateSuppGuideController._bInit = false;
		},
		onInit: function () {

			CreateSuppGuideController._oDialog = CreateSuppGuideController.getControl();
			CreateSuppGuideController.listOfBrand();
			CreateSuppGuideController.listOfModelYear();
			var brandCB = sap.ushell.components.brandCB;
			var moYearCB = sap.ushell.components.modelYearCB;
			var seriesCB = sap.ushell.components.seriesCB;
			if (brandCB != undefined && moYearCB != undefined && seriesCB != undefined) {
				var brandVal = brandCB.getValue();

				if (brandVal != " " && brandVal != "" && brandVal != null && brandVal != undefined) {
					CreateSuppGuideController.getView().byId("idSupp_brandCB").setValue(brandVal);
					CreateSuppGuideController.getView().byId("idSupp_brandCB").setEnabled(false);
				} else {
					CreateSuppGuideController.getView().byId("idSupp_brandCB").setEnabled(true);
				}
				var moYearVal = moYearCB.getValue();
				if (moYearVal != " " && moYearVal != "" && moYearVal != null && moYearVal != undefined) {
					CreateSuppGuideController.getView().byId("idSupp_modelYearCB").setValue(moYearVal);
					CreateSuppGuideController.getView().byId("idSupp_modelYearCB").setEnabled(false);
				} else {
					CreateSuppGuideController.getView().byId("idSupp_modelYearCB").setEnabled(true);
				}
				var seriesVal = seriesCB.getValue();
				if (seriesVal != " " && seriesVal != "" && seriesVal != null && seriesVal != undefined) {
					CreateSuppGuideController.getView().byId("idSupp_seriesCB").setValue(seriesVal);
					CreateSuppGuideController.getView().byId("idSupp_seriesCB").setEnabled(false);
				} else {
					CreateSuppGuideController.getView().byId("idSupp_seriesCB").setEnabled(true);
					var sLocation = window.location.host;
					var sLocation_conf = sLocation.search("webide");
					if (sLocation_conf == 0) {
						CreateSuppGuideController.sPrefix = "/voasguide_node";
					} else {
						CreateSuppGuideController.sPrefix = "";
					}
					CreateSuppGuideController.nodeJsUrl = CreateSuppGuideController.sPrefix + "/node";
					var host = CreateSuppGuideController.nodeJsUrl;
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
							CreateSuppGuideController.getView().setModel(oModel, "seriesdropDownModelNew");
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
			CreateSuppGuideController.getView().setModel(modelBrandModel, "brandModelNew");
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
			CreateSuppGuideController.getView().setModel(modelYearModel, "yearModelNew");
		},
		onChange_ModelYear: function () {

			var brandCB = CreateSuppGuideController.getView().byId("idSupp_brandCB");
			var modelYearCB = CreateSuppGuideController.getView().byId("idSupp_modelYearCB");
			var seriesCB = CreateSuppGuideController.getView().byId("idSupp_seriesCB");

			var brandCBVal = brandCB.getValue();
			var modelYearCBVal = modelYearCB.getValue();
			if (seriesCB.getValue() !== "") {
				seriesCB.setValue("");
			}

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");
			if (sLocation_conf == 0) {
				CreateSuppGuideController.sPrefix = "/voasguide_node";
			} else {
				CreateSuppGuideController.sPrefix = "";
			}
			CreateSuppGuideController.nodeJsUrl = CreateSuppGuideController.sPrefix + "/node";
			var host = CreateSuppGuideController.nodeJsUrl;
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
					CreateSuppGuideController.getView().setModel(oModel, "seriesdropDownModelNew");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},
		exit: function () {
			delete CreateSuppGuideController._oView;
		},

		getView: function () {
			return CreateSuppGuideController._oView;
		},

		getControl: function () {
			return CreateSuppGuideController._oControl;
		},

		getOwnerComponent: function () {
			return CreateSuppGuideController._oView.getController().getOwnerComponent();
		},

		open: function () {
			var oView = CreateSuppGuideController._oView;
			var oControl = CreateSuppGuideController._oControl;

			if (!CreateSuppGuideController._bInit) {

				// Initialize our fragment
				CreateSuppGuideController.onInit();

				CreateSuppGuideController._bInit = true;

				// connect fragment to the root view of CreateSuppGuideController component (models, lifecycle)
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
			CreateSuppGuideController._oControl.close();
			CreateSuppGuideController._oDialog.destroy();
		},

		setRouter: function (oRouter) {
			CreateSuppGuideController.oRouter = oRouter;

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
					var brandCB = CreateSuppGuideController.getView().byId("idSupp_brandCB");
					var modelYearCB = CreateSuppGuideController.getView().byId("idSupp_modelYearCB");
					var seriesCB = CreateSuppGuideController.getView().byId("idSupp_seriesCB");
					var brandVal = brandCB.getValue();
					var moYear = modelYearCB.getValue();
					var serVal = seriesCB.getValue();
					var langSwitchState = CreateSuppGuideController.getView().byId("idCreateSupp_LangSwitch").mProperties.state;
					var lang = "";
					if (langSwitchState == false) {
						lang = "FR";
					} else {
						lang = "EN";
					}
					var sLocation = window.location.host;
					var sLocation_conf = sLocation.search("webide");
					if (sLocation_conf == 0) {
						CreateSuppGuideController.sPrefix = "/voasguide_node";
					} else {
						CreateSuppGuideController.sPrefix = "";
					}
					CreateSuppGuideController.nodeJsUrl = CreateSuppGuideController.sPrefix + "/node";
					var host = CreateSuppGuideController.nodeJsUrl;
					var url = host +
						"/Z_VEHICLE_CATALOGUE_SRV/FileDownloadSet(Language='" + lang + "',Tab='suppliment',Model_year='" + moYear + "',Tciseries='" +
						serVal +
						"',Brand='" + brandVal + "')/$value";
					$.ajax({
						url: url,
						method: 'GET',
						async: false,
						dataType: 'text',
						success: function (data, textStatus, jqXHR) {
							//console.log(data);
							console.log(jqXHR);
							if (jqXHR.readyState === 4 && jqXHR.status === 200) {
								//	var blob = new Blob([jqXHR.responseText]);
								var json = JSON.stringify(data);
								var blob = new Blob([json], {
									type: "octet/stream"
								});
							var url2=window.URL.createObjectURL(blob, {
									type: "application/pdf"
								})
								console.log(blob);
								console.log(url2)
							//	var str=url2.splice(0,5);
							//	console.log(str);
								window.open(url2,'_blank');
							//	var decode = atob(jqXHR.responseText);
							//	console.log(decode);
								/*var blob = jqXHR.response;
								ajax.onload = function (e) {
									download(e.target.response, "fileName", '_blank');
								};*/
								/*var link = document.createElement('a');
								link.href = window.URL.createObjectURL(blob);
								link.download = "PdfName-" + new Date().getTime() + ".pdf";
								link.click();*/
							}
						},
						error: function (jqXHR, textStatus, errorThrown) {
							console.log(jqXHR);
							console.log(textStatus);
							console.log(errorThrown);

							sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error",
								sap
								.m.MessageBox.Action.OK, null, null);
						}
					});
				//	window.open(url, '_blank');
					//	alert("CreateSuppGuideController should Generate and display Active (Based on Today's Date) What's New Pdf in new window");

				}.bind(CreateSuppGuideController))
				.then(function (result) {
					if (result === false) {
						return false;
					} else {

						CreateSuppGuideController.close();

					}
				}.bind(CreateSuppGuideController)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
		},
		_onButtonPress1: function () {

			CreateSuppGuideController.close();

		},

		onExit: function () {
			CreateSuppGuideController._oDialog.destroy();

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
				var oControl = CreateSuppGuideController.getView().byId(aControls[i].controlId);
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