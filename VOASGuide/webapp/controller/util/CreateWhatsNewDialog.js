sap.ui.define(["com/sap/build/toyota-canada/vehiclesGuideV3/controller/BaseController",
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History", "com/sap/build/toyota-canada/vehiclesGuideV3/libs/jQuery.base64",
	"com/sap/build/toyota-canada/vehiclesGuideV3/libs/jspdf.min"
], function (BaseController, ManagedObject, MessageBox, utilities, History, base64, jspdfmin) {
	var CreateWhatsNewDialogController;
	return ManagedObject.extend("com.sap.build.toyota-canada.vehiclesGuideV3.controller.util.CreateWhatsNewDialog", {

		constructor: function (oView) {
			CreateWhatsNewDialogController = this;
			CreateWhatsNewDialogController._oView = oView;
			CreateWhatsNewDialogController._oControl = sap.ui.xmlfragment(oView.getId(),
				"com.sap.build.toyota-canada.vehiclesGuideV3.fragments.CreateWhatsNewDialog",
				CreateWhatsNewDialogController);
			CreateWhatsNewDialogController._bInit = false;
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
							CreateWhatsNewDialogController.getView().byId("idNew_brandCB").setEnabled(false);
							CreateWhatsNewDialogController.getView().byId("idNew_brandCB").setSelectedKey("1");
						} else if (bpData[0].Division == "20") {
							CreateWhatsNewDialogController.getView().byId("idNew_brandCB").setEnabled(false);
							CreateWhatsNewDialogController.getView().byId("idNew_brandCB").setSelectedKey("2");
						}
					} else if (userData.loggedUserType[0] == "TCI_User" || userData.loggedUserType[0] == "TCI_User_Preliminary") {

						CreateWhatsNewDialogController.getView().byId("idNew_brandCB").setEnabled(true);
						CreateWhatsNewDialogController.getView().byId("idNew_brandCB").setValue(brandVal);

					} else {
						CreateWhatsNewDialogController.getView().byId("idNew_brandCB").setEnabled(true);
					}
				}
			}
		},
		onInit: function () {

			CreateWhatsNewDialogController._oDialog = CreateWhatsNewDialogController.getControl();
			CreateWhatsNewDialogController.listOfBrand();
			CreateWhatsNewDialogController.listOfModelYear();
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
			
			CreateWhatsNewDialogController.getView().byId("idNew_lanSwitch").setState(LanguageState);
			if (brandCB != undefined && moYearCB != undefined && seriesCB != undefined) {
				var brandVal = brandCB.getValue();
				if (brandVal != " " && brandVal != "" && brandVal != null && brandVal != undefined) {
					CreateWhatsNewDialogController._readUserBrand();
				} else {
					CreateWhatsNewDialogController.getView().byId("idNew_brandCB").setEnabled(true);
				}
				var moYearVal = moYearCB.getValue();
				if (moYearVal != " " && moYearVal != "" && moYearVal != null && moYearVal != undefined) {
					CreateWhatsNewDialogController.getView().byId("idNew_modelYearCB").setValue(moYearVal);
					//	CreateWhatsNewDialogController.getView().byId("idNew_modelYearCB").setEnabled(false);
				} else {
					CreateWhatsNewDialogController.getView().byId("idNew_modelYearCB").setEnabled(true);
				}
				var seriesVal = seriesCB.getValue();
				if (seriesVal != " " && seriesVal != "" && seriesVal != null && seriesVal != undefined) {
					CreateWhatsNewDialogController.getView().byId("id_seriesCBNew").setValue(seriesVal);
					//	CreateWhatsNewDialogController.getView().byId("id_seriesCBNew").setEnabled(false);
				} else {
					CreateWhatsNewDialogController.getView().byId("id_seriesCBNew").setEnabled(true);
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
						"/Z_VEHICLE_CATALOGUE_SRV/ZC_BRAND_MODEL_DETAILSSet?$filter=(Brand eq '" + brandVal + "' and Modelyear eq '" + moYearVal +
						"')";
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
							sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error",
								sap
								.m.MessageBox.Action.OK, null, null);
						}
					});
				}
			}
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
			CreateWhatsNewDialogController._oDialog.destroy();
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
					var brandCB = CreateWhatsNewDialogController.getView().byId("idNew_brandCB");
					var modelYearCB = CreateWhatsNewDialogController.getView().byId("idNew_modelYearCB");
					var seriesCB = CreateWhatsNewDialogController.getView().byId("id_seriesCBNew");
					var brandVal = brandCB.getValue();
					var moYear = modelYearCB.getValue();
					var serVal = seriesCB.getValue();
					var langSwitchState = CreateWhatsNewDialogController.getView().byId("idNew_lanSwitch").mProperties.state;
					var lang = "";
					if (langSwitchState == false) {
						lang = "FR";
					} else {
						lang = "EN";
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
						"/Z_VEHICLE_CATALOGUE_SRV/FileDownloadSet(Language='" + lang + "',Tab='suppliment',Model_year='" + moYear + "',Tciseries='" +
						serVal +
						"',Brand='" + brandVal + "')/$value";
					$.ajax({
						url: url,
						method: 'GET',
						async: false,
						dataType: 'text',
						success: function (data, textStatus, jqXHR) {
							//	console.log(data);
							var Base64 = {
								_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
								encode: function (e) {
									var t = "";
									var n, r, i, s, o, u, a;
									var f = 0;
									e = Base64._utf8_encode(e);
									while (f < e.length) {
										n = e.charCodeAt(f++);
										r = e.charCodeAt(f++);
										i = e.charCodeAt(f++);
										s = n >> 2;
										o = (n & 3) << 4 | r >> 4;
										u = (r & 15) << 2 | i >> 6;
										a = i & 63;
										if (isNaN(r)) {
											u = a = 64
										} else if (isNaN(i)) {
											a = 64
										}
										t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
									}
									return t
								},
								decode: function (e) {
									var t = "";
									var n, r, i;
									var s, o, u, a;
									var f = 0;
									//e = e.replace(/++[++^A-Za-z0-9+/=]/g, "");
									e = e.replace(/\\+\\+[++^A-Za-z0-9+/=]/g, "");
									while (f < e.length) {
										s = this._keyStr.indexOf(e.charAt(f++));
										o = this._keyStr.indexOf(e.charAt(f++));
										u = this._keyStr.indexOf(e.charAt(f++));
										a = this._keyStr.indexOf(e.charAt(f++));
										n = s << 2 | o >> 4;
										r = (o & 15) << 4 | u >> 2;
										i = (u & 3) << 6 | a;
										t = t + String.fromCharCode(n);
										if (u != 64) {
											t = t + String.fromCharCode(r)
										}
										if (a != 64) {
											t = t + String.fromCharCode(i)
										}
									}
									t = Base64._utf8_decode(t);
									return t
								},
								_utf8_encode: function (e) {
									e = e.replace(/\r\n/g, "n");
									var t = "";
									for (var n = 0; n < e.length; n++) {
										var r = e.charCodeAt(n);
										if (r < 128) {
											t += String.fromCharCode(r)
										} else if (r > 127 && r < 2048) {
											t += String.fromCharCode(r >> 6 | 192);
											t += String.fromCharCode(r & 63 | 128)
										} else {
											t += String.fromCharCode(r >> 12 | 224);
											t += String.fromCharCode(r >> 6 & 63 | 128);
											t += String.fromCharCode(r & 63 | 128)
										}
									}
									return t
								},
								_utf8_decode: function (e) {
									var t = "";
									var n = 0;
									var r = 0;
									var c1 = 0;
									var c2 = 0;
									//var c3=0;
									while (n < e.length) {
										r = e.charCodeAt(n);
										if (r < 128) {
											t += String.fromCharCode(r);
											n++;
										} else if (r > 191 && r < 224) {
											c2 = e.charCodeAt(n + 1);
											t += String.fromCharCode((r & 31) << 6 | c2 & 63);
											n += 2
										} else {
											c2 = e.charCodeAt(n + 1);
											c3 = e.charCodeAt(n + 2);
											t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
											n += 3;
										}
									}
									return t;
								}
							};
							var decodedString = Base64.decode(data);

							if (jqXHR.readyState === 4 && jqXHR.status === 200) {
								var string = JSON.stringify(data);
								/*var blob = new Blob([string], {
									type: "text/plain"
								});*/
								var blob = new Blob([string], {
									type: "application/pdf"
								});
								var url2 = window.URL.createObjectURL(blob, {
									type: "application/pdf"
								});
								window.open(url2, '_blank');
								/*var link = document.createElement('a');
								link.href = window.URL.createObjectURL(blob, {
									type: "application/pdf"
								});
								link.download = "PdfName-WhatsNew" + new Date().getTime() + ".pdf";
								link.click();*/

							}
						},
						error: function (jqXHR, textStatus, errorThrown) {
							sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error",
								sap
								.m.MessageBox.Action.OK, null, null);
						}
					});
					//window.open(url,'_blank');
					//	alert("CreateWhatsNewDialogController should Generate and display Active (Based on Today's Date) What's New Pdf in new window");

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