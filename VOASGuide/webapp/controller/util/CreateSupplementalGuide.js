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
		_readUserBrand: function () {
			var brandCB = sap.ushell.components.brandCB;
			var brandVal = brandCB.getValue();
			var userModel = sap.ui.getCore().getModel("userModel");
			var bpDealerModel = sap.ui.getCore().getModel("BpDealerModel");
			var userData = [];
			var bpData = [];
			if (userModel) {
				userData = userModel.getData();
				if (bpDealerModel) {

					bpData = bpDealerModel.getData();
					if (userData.loggedUserType[0] == "Dealer_User" || userData.loggedUserType[0] == "Dealer_Admin") {
						if (bpData[0].Division == "10") {
							CreateSuppGuideController.getView().byId("idSupp_brandCB").setEnabled(false);
							CreateSuppGuideController.getView().byId("idSupp_brandCB").setSelectedKey("1");
						} else if (bpData[0].Division == "20") {
							CreateSuppGuideController.getView().byId("idSupp_brandCB").setEnabled(false);
							CreateSuppGuideController.getView().byId("idSupp_brandCB").setSelectedKey("2");
						}
					} else if (userData.loggedUserType[0] == "TCI_User" || userData.loggedUserType[0] == "TCI_User_Preliminary") {

						CreateSuppGuideController.getView().byId("idSupp_brandCB").setEnabled(true);
						CreateSuppGuideController.getView().byId("idSupp_brandCB").setValue(brandVal);

					} else {
						CreateSuppGuideController.getView().byId("idSupp_brandCB").setEnabled(true);
						CreateSuppGuideController.getView().byId("idSupp_brandCB").setValue(brandVal);
					}
				} else {
					if (userData.loggedUserType[0] == "TCI_User" || userData.loggedUserType[0] == "TCI_User_Preliminary") {

						CreateSuppGuideController.getView().byId("idSupp_brandCB").setEnabled(true);
						CreateSuppGuideController.getView().byId("idSupp_brandCB").setValue(brandVal);

					} else {
						CreateSuppGuideController.getView().byId("idSupp_brandCB").setEnabled(true);
						CreateSuppGuideController.getView().byId("idSupp_brandCB").setValue(brandVal);
					}
				}
			}
		},
		onInit: function () {

			CreateSuppGuideController._oDialog = CreateSuppGuideController.getControl();
			CreateSuppGuideController.listOfBrand();
			
			var brandCB = sap.ushell.components.brandCB;
			var moYearCB = sap.ushell.components.modelYearCB;
			var seriesCB = sap.ushell.components.seriesCB;
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
			if (Language == "FR" || Language === "fr") {
				LanguageState = false;
				Language = "FR";

			} else {
				LanguageState = true;
				Language = "EN";
			}
			//	}
			CreateSuppGuideController.getView().byId("idCreateSupp_LangSwitch").setState(LanguageState);
			if (brandCB != undefined && moYearCB != undefined && seriesCB != undefined) {
				var brandVal = brandCB.getValue();

				if (brandVal != " " && brandVal != "" && brandVal != null && brandVal != undefined) {
					CreateSuppGuideController._readUserBrand();
					CreateSuppGuideController.listOfModelYear();
				} else {
					CreateSuppGuideController.getView().byId("idSupp_brandCB").setEnabled(true);
				}
				var moYearVal = moYearCB.getValue();
				if (moYearVal != " " && moYearVal != "" && moYearVal != null && moYearVal != undefined) {
					CreateSuppGuideController.getView().byId("idSupp_modelYearCB").setValue(moYearVal);
					//	CreateSuppGuideController.getView().byId("idSupp_modelYearCB").setEnabled(false);
				} else {
					CreateSuppGuideController.getView().byId("idSupp_modelYearCB").setEnabled(true);
				}
				var seriesVal = seriesCB.getValue();
				var seriesKey = seriesCB.getSelectedKey();
				// if (seriesVal != " " && seriesVal != "" && seriesVal != null && seriesVal != undefined) {
				if (seriesKey != " " && seriesKey != "" && seriesKey != null && seriesKey != undefined) {
					// 	CreateSuppGuideController.getView().byId("idSupp_seriesCB").setValue(seriesVal);
					// 	//	CreateSuppGuideController.getView().byId("idSupp_seriesCB").setEnabled(false);
					CreateSuppGuideController.getView().byId("idSupp_seriesCB").setSelectedKey(seriesKey);
				} else {
					CreateSuppGuideController.getView().byId("idSupp_seriesCB").setEnabled(true);
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
				var userModel = sap.ui.getCore().getModel("userModel");
				var userData = userModel.getData();
				var usr = userData.loggedUserType[0];
				var url = host +
					"/Z_VEHICLE_CATALOGUE_SRV/ZC_BRAND_MODEL_DETAILSSet?$filter=(User eq  '" + usr + "' and Language eq '" + Language +
					"' and Brand eq '" + brandVal + "' and Modelyear eq '" + moYearVal +
					"')";
				$.ajax({
					url: url,
					method: 'GET',
					async: false,
					dataType: 'json',
					success: function (data, textStatus, jqXHR) {
						var oModel = new sap.ui.model.json.JSONModel();
						var arr = [];
						var arrVal = [];
						/*var j = 0;
						for (var c = 0; c < data.d.results.length; c++) {
							for (var i = 0; i < data.d.results.length; i++) {
								if ($.inArray(data.d.results[i]["TCISeries"], arr) < 0) {
									arr[j] = data.d.results[i]["TCISeries"];
									j++;
								}
							}
						}*/
						if (Language === "FR") {
							//for (var c = 0; c < data.d.results.length; c++) {
							for (var i = 0; i < data.d.results.length; i++) {
								if ($.inArray(data.d.results[i]["TCISeries_fr"], arrVal) < 0) {
									arrVal.push(data.d.results[i]["TCISeries_fr"]);
									arr.push({
										"key": data.d.results[i]["Zseries"] + "_" + data.d.results[i]["Suffix"],
										"value": data.d.results[i]["TCISeries_fr"]
									});
									//var key = {"key" : data.d.results[i]["Zseries"]};
									//var value = {"value" : data.d.results[i]["TCISeries_fr"]};
									//arr.push({key , value});
									//arr[j] = data.d.results[i]["TCISeries_fr"];
									//j++;

								}
								//}
							}
						} else { //if (language == "EN") {
							//for (var c = 0; c < data.d.results.length; c++) {
							for (var i = 0; i < data.d.results.length; i++) {
								if ($.inArray(data.d.results[i]["TCISeries"], arrVal) < 0) {
									//arr[j] = data.d.results[i]["TCISeries"];
									arrVal.push(data.d.results[i].TCISeries);
									arr.push({
										"key": data.d.results[i]["Zseries"] + "_" + data.d.results[i]["Suffix"],
										"value": data.d.results[i].TCISeries
									});
									//j++;

								}
							}
							//}

						}
						oModel.setData(arr);
						CreateSuppGuideController.getView().setModel(oModel, "seriesdropDownModelNew");
						CreateSuppGuideController.getView().byId("idSupp_seriesCB").setSelectedKey(seriesKey);
					},
					error: function (jqXHR, textStatus, errorThrown) {
						sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error",
							sap
							.m.MessageBox.Action.OK, null, null);
					}
				});
				// }
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
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");
			if (sLocation_conf == 0) {
				CreateSuppGuideController.sPrefix = "/voasguide_node";
			} else {
				CreateSuppGuideController.sPrefix = "";
			}
			CreateSuppGuideController.nodeJsUrl = CreateSuppGuideController.sPrefix + "/node";
			var host = CreateSuppGuideController.nodeJsUrl;
		
			var brandCB = CreateSuppGuideController.getView().byId("idSupp_brandCB");
			var url2 = "";
			var language = CreateSuppGuideController.language; // searchController.returnBrowserLanguage(); //"EN";

			var url2 = host + "/Z_VEHICLE_CATALOGUE_SRV/ZC_BRAND_MODEL_DETAILSSet?$filter=(Brand eq '" + brandCB.getValue() +
				"' and Language eq '" + language + "')";
			var arr = [];
			$.ajax({
				url: url2,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					//var j = 0; //TCISeries_fr

					//for (var c = 0; c < data.d.results.length; c++) {
					for (var i = 0; i < data.d.results.length; i++) {

						arr.push({
							"key": data.d.results[i]["Modelyear"],
							"text": data.d.results[i]["Modelyear"]
						});
						//var key = {"key" : data.d.results[i]["Zseries"]};
						//var value = {"value" : data.d.results[i]["TCISeries_fr"]};
						//arr.push({key , value});
						//arr[j] = data.d.results[i]["TCISeries_fr"];
						//j++;

					}

					//}

				},
				error: function (jqXHR, textStatus, errorThrown) {
					var errMsg = CreateSuppGuideController.getView().getModel("i18n").getResourceBundle().getText("Error1");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			});

			var modelYearModel = new sap.ui.model.json.JSONModel();
			modelYearModel.setData({
				"modelYear": arr
			});

			CreateSuppGuideController.getView().setModel(modelYearModel, "yearModelNew");
		},

		onChange_ModelBrand: function () {
			// CreateVehicleGuideDialogController.getView().byId("filterBar").setShowGoOnFB(false);
			// var brandCB = CreateVehicleGuideDialogController.getView().byId("id_brandCB");
			var modelYearCB = CreateSuppGuideController.getView().byId("idSupp_modelYearCB");
			var seriesCB = CreateSuppGuideController.getView().byId("idSupp_seriesCB");
			// var modelCB = CreateVehicleGuideDialogController.getView().byId("id_modelCB");
			// var suffixCB = CreateVehicleGuideDialogController.getView().byId("id_suffixCB");
			// searchController.refreshTableData();
			modelYearCB.setSelectedKey(null);
			CreateSuppGuideController.listOfModelYear();
			if (seriesCB.getValue() !== "") {
				seriesCB.setValue("");
				seriesCB.destroyItems();
			} // modelCB.setSelectedItems("");
			// suffixCB.setSelectedItems("");
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
			var langSwitchState = CreateSuppGuideController.getView().byId("idCreateSupp_LangSwitch").mProperties.state;
			var lang = "";
			if (langSwitchState == false) {
				lang = "FR";
			} else {
				lang = "EN";
			}
			var userModel = sap.ui.getCore().getModel("userModel");
			var userData = userModel.getData();
			var usr = userData.loggedUserType[0];
			var url = host +
				"/Z_VEHICLE_CATALOGUE_SRV/ZC_BRAND_MODEL_DETAILSSet?$filter=(User eq  '" + usr + "' and Language eq '" + lang +
				"'and Brand eq '" +
				brandCBVal + "' and Modelyear eq '" + modelYearCBVal +
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
					var arrVal = [];
					//var j = 0;
					/* TODO: for (var c = 0; c < data.d.results.length; c++) {
						for (var i = 0; i < data.d.results.length; i++) {
							if ($.inArray(data.d.results[i]["TCISeries"], arr) < 0) {
								arr[j] = data.d.results[i]["TCISeries"];
								j++;

							}
						}
					}*/
					if (lang === "FR") {
						//for (var c = 0; c < data.d.results.length; c++) {
						for (var i = 0; i < data.d.results.length; i++) {
							if ($.inArray(data.d.results[i]["TCISeries_fr"], arrVal) < 0) {
								arrVal.push(data.d.results[i]["TCISeries_fr"]);
								arr.push({
									"key": data.d.results[i]["Zseries"] + "_" + data.d.results[i]["Suffix"],
									"value": data.d.results[i]["TCISeries_fr"]
								});
								//var key = {"key" : data.d.results[i]["Zseries"]};
								//var value = {"value" : data.d.results[i]["TCISeries_fr"]};
								//arr.push({key , value});
								//arr[j] = data.d.results[i]["TCISeries_fr"];
								//j++;

							}
							//}
						}
					} else { //if (language == "EN") {
						//for (var c = 0; c < data.d.results.length; c++) {
						for (var i = 0; i < data.d.results.length; i++) {
							if ($.inArray(data.d.results[i]["TCISeries"], arrVal) < 0) {
								arrVal.push(data.d.results[i].TCISeries);
								//arr[j] = data.d.results[i]["TCISeries"];
								arr.push({
									"key": data.d.results[i]["Zseries"] + "_" + data.d.results[i]["Suffix"],
									"value": data.d.results[i].TCISeries
								});
								//j++;

							}
						}
						//}

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
			var oBusyDialog = new sap.m.BusyDialog({
				showCancelButton: false
			});
			//oBusyDialog.open();
			oBusyDialog.open();
			$.ajax({
				url: url,
				type: 'GET',
				async: true,
				dataType: 'text',
				success: function (data, textStatus, jqXHR) {
					console.log("GET success: ");
					// console.log(data.d.results);
					if (data !== "") {
						/*	var pdfAsDataUri = "data:application/pdf;base64," + data;
						 var byteCharacters = atob(data);
        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        var blob = new Blob([byteArray], {
            type: 'application/pdf'
        });*/

						//var blobAnchor = $("#blob");
						//var dataURIAnchor = $("#pdfAsDataUri");
						//blobAnchor.download = dataURIAnchor.download = "abc.pdf";
						//blobAnchor.href = url1;
						//dataURIAnchor.href = pdfAsDataUri;
						//blobAnchor.click();
						//var fileName = "SG_" + serVal + "_" + moYear + "_" + lang + ".pdf";
						//stat_.textContent = '';
						/*if (window.navigator.msSaveBlob) {
							
							window.navigator.msSaveOrOpenBlob(blob, fileName);
						  }
						  else
						  {
						  	 var link = document.createElement("a");
						var url1 = URL.createObjectURL(blob);        
						link.href = url1;
						          
						           link.download = fileName;
						           
						           link.click();
						  	
						  	// window.open(url1);
						  	URL.revokeObjectURL(url1);
						  	
						  }*/
						// var link1 = document.createElement('a');
						window.open(url, '_blank');
						oBusyDialog.close();
						// link1.download = "SG_"+serVal+"_"+ moYear +"_"+ lang +".pdf";
						// link1.href = pdfAsDataUri;
						// link1.click();
					} else {
						oBusyDialog.close();
						sap.m.MessageBox.show("No File exists for curent selection.", sap.m.MessageBox.Icon.ERROR, "Error", sap.m.MessageBox.Action
							.OK,
							null, null);

					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					oBusyDialog.close();
					sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error",
						sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
			CreateSuppGuideController.close();

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

		},

		handleLanguageChange: function (oEvent) {
			var oSource = oEvent.getSource();
			var bState = oSource.getState();
			var sLang = "EN";
			if (!bState) {
				sLang = "FR";
			}
			//var oSeriesVal =	CreateWhatsNewDialogController.getView().byId("id_seriesCBNew").getValue();
			var oSeriesKey = CreateSuppGuideController.getView().byId("idSupp_seriesCB").getSelectedKey();
			if (oSeriesKey) {
				this.onChange_ModelYear();
				CreateSuppGuideController.getView().byId("idSupp_seriesCB").setSelectedKey(oSeriesKey);
			}

		}

	});
}, /* bExport= */ true);