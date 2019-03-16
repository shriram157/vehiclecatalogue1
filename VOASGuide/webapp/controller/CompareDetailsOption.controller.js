sap.ui.define([
	"com/sap/build/toyota-canada/vehiclesGuideV3/controller/BaseController",
	"./util/CreatePocketSummaryDialog", "./util/CreateWhatsNewDialog", "./util/CreateWalkUpGuide",
	"./util/CreateSupplementalGuide", "./util/CreateVehicleGuideDialog",
	"sap/m/MessageBox", "./util/utilities",
	"sap/ui/core/routing/History", "com/sap/build/toyota-canada/vehiclesGuideV3/Formatter/formatter"
], function (BaseController, CreatePocketSummaryDialog, CreateWhatsNewDialog, CreateWalkUpGuide, CreateSupplementalGuide,
	CreateVehicleGuideDialog, MessageBox, utilities, History, formatter) {
	"use strict";
	var CDO_controller;
	return BaseController.extend("com.sap.build.toyota-canada.vehiclesGuideV3.controller.CompareDetailsOption", {
		formatter: formatter,
		onInit: function () {
			CDO_controller = this;
			this.getUserLanguage();
			this.getBrowserLanguage();
			CDO_controller.oRouter = sap.ui.core.UIComponent.getRouterFor(CDO_controller);
			CDO_controller.oRouter.getTarget("CompareDetailsOption").attachDisplay(jQuery.proxy(CDO_controller.handleRouteMatched,
				CDO_controller));
			CDO_controller.oBusyDialog = new sap.m.BusyDialog({
				showCancelButton: false
			});
			CDO_controller.language = CDO_controller.returnBrowserLanguage();
		},
		onSwitchstateChange: function (evt_Switch) {
			var state = evt_Switch.getSource().mProperties.state;
			if (state == true) {
				//include com fea off
				CDO_controller.handleRouteMatchedStdFeatureOff();
			} else {
				CDO_controller.handleRouteMatchedStdFeatureOn();
			}
		},
		handleRouteMatchedStdFeatureOff: function () {
			//CDO_controller.user = CDO_controller.getLoggedUser();
			var fixedData = {
				Vehicle: " "
			};

			var aColumnData = [];
			aColumnData.push(fixedData);
			aColumnData.push(fixedData);
			var aColumnDataCol = [];
			aColumnDataCol.push(fixedData);
			aColumnDataCol.push(fixedData);

			var arg2 = CDO_controller.arg2; // oEvent.getParameters().data.num2;

			var parseArg = JSON.parse(arg2);
			var modelArg = new sap.ui.model.json.JSONModel(parseArg[0]);
			CDO_controller.getView().setModel(modelArg, "modelArg");
			var dataModelArg = CDO_controller.getView().getModel('modelArg').getData();
			CDO_controller.user = dataModelArg.user;
			var brandCBVal = dataModelArg.brand;
			var modelYearCBVal = dataModelArg.moYear;
			var seriesCBVal = dataModelArg.series;

			var empData;
			var arrNewData = [];

			var modelArr = [];
			var newModelStr = "";
			var modelText = [];
			var modelDescString = "";

			var suffixArr = [];
			var newSuffixStr = "";
			var suffixText = [];
			var suffixDescString;

			var vehArr = [];
			var vehText = [];
			var vehDescString = "";
			var newVehStr = "";
			//var stateSwitch;
			var stateSwitch;
			var parsePathArg = JSON.parse(parseArg[0].pathVeh);
			var len = parsePathArg.length;
			if (len == 2) {
				this.getView().byId("idTbl_compare2vehicles").setVisible(true);
				this.getView().byId("idTbl_compare3vehicles").setVisible(false);
				this.getView().byId("idTbl_compare4vehicles").setVisible(false);
				this.getView().byId("idTbl_compare5vehicles").setVisible(false);
				stateSwitch = this.getView().byId("stdFeatSwitchId2");
				//	this.getView().byId("hboxCompare").addStyleClass("paddingleft1");
			} else if (len == 3) {
				this.getView().byId("idTbl_compare3vehicles").setVisible(true);
				this.getView().byId("idTbl_compare2vehicles").setVisible(false);
				this.getView().byId("idTbl_compare4vehicles").setVisible(false);
				this.getView().byId("idTbl_compare5vehicles").setVisible(false);
				stateSwitch = this.getView().byId("stdFeatSwitchId3");
				//	this.getView().byId("hboxCompare").addStyleClass("paddingleft2");
			} else if (len == 4) {
				this.getView().byId("idTbl_compare4vehicles").setVisible(true);
				this.getView().byId("idTbl_compare3vehicles").setVisible(false);
				this.getView().byId("idTbl_compare2vehicles").setVisible(false);
				this.getView().byId("idTbl_compare5vehicles").setVisible(false);
				stateSwitch = this.getView().byId("stdFeatSwitchId4");
				//	this.getView().byId("hboxCompare").addStyleClass("paddingleft3");
			} else if (len == 5) {
				this.getView().byId("idTbl_compare5vehicles").setVisible(true);
				this.getView().byId("idTbl_compare3vehicles").setVisible(false);
				this.getView().byId("idTbl_compare4vehicles").setVisible(false);
				this.getView().byId("idTbl_compare2vehicles").setVisible(false);
				stateSwitch = this.getView().byId("stdFeatSwitchId5");
				//	this.getView().byId("hboxCompare").addStyleClass("paddingleft4");
			}
			console.log("len: " + len);
			if (parseArg[0].model !== "") {
				/*	if (parseArg[0].model !== "[]") {
						newModelStr = "Model eq '" +parseArg[0].model;
					} else {*/
				var parseModelPathArg = JSON.parse(parseArg[0].model);
				var lenModel = parseModelPathArg.length;
				console.log("lenModel: " + lenModel);
				var jsonModel = JSON.parse(parseArg[0].model);
				for (var i = 0; i < lenModel; i++) {
					modelText[i] = jsonModel[i];
					var modelText2 = "Model eq '" + modelText[i] + "'";
					modelArr.push(modelText2);
				}
				modelDescString = modelArr.toString();
				newModelStr = modelDescString.replace(/,/g, ' or ');
				/*	}*/
			} else {
				modelDescString = "";
				newModelStr = "";
			}

			if (parseArg[0].suffixDD !== "") {
				/*console.log(parseArg[0].suffix);
				if (parseArg[0].suffix !== "[]") {
					newSuffixStr = "Suffix eq '" +parseArg[0].suffix;
				} else {*/
				var parseSuffixPathArg = JSON.parse(parseArg[0].suffixDD);
				var lenSuffix = parseSuffixPathArg.length;
				var jsonSuffixDD = JSON.parse(parseArg[0].suffixDD);
				for (var j = 0; j < lenSuffix; j++) {
					suffixText[j] = jsonSuffixDD[j];
					var suffixText2 = "Suffix eq '" + suffixText[j] + "'";
					suffixArr.push(suffixText2);
				}
				suffixDescString = suffixArr.toString();
				newSuffixStr = suffixDescString.replace(/,/g, ' or ');
				/*	}*/
			} else {
				suffixDescString = "";
				newSuffixStr = "";
			}
			/*	if (parseArg[0].veh !== "") {
					var parseVehPathArg = JSON.parse(parseArg[0].veh);
					var lenVeh = parseVehPathArg.length;
					var jsonVeh = JSON.parse(parseArg[0].veh);
					for (var i = 0; i < lenVeh; i++) {
						vehText[i] = jsonVeh[i];
						var vehNum = i + 1;
						var vehText2 = "IN_Vehicle" + vehNum + " eq '" + vehText[i] + "'";
						vehArr.push(vehText2);
					}
					vehDescString = vehArr.toString();
					newVehStr = vehDescString.replace(/,/g, ' and ');

				} else {
					vehDescString = "";
					newVehStr = "";
				}*/
			if (parseArg[0].suffix !== "" && parseArg[0].veh !== "") {
				var parseVehPathArg = JSON.parse(parseArg[0].veh);
				var lenVeh = parseVehPathArg.length;
				var jsonVeh = JSON.parse(parseArg[0].veh);
				var jsonSuffix = JSON.parse(parseArg[0].suffix);
				//var jsonSuffixVeh = JSON.parse(parseArg[0].suffix);
				for (var i = 0; i < lenVeh; i++) {
					suffixText[i] = jsonSuffix[i];
					//	suffixTextVeh[i] = jsonSuffixVeh[i];
					vehText[i] = jsonVeh[i];
					var vehNum = i + 1;
					var vehText2 = "IN_Vehicle" + vehNum + " eq '" + vehText[i] + suffixText[i] + "'";
					vehArr.push(vehText2);
				}
				vehDescString = vehArr.toString();
				newVehStr = vehDescString.replace(/,/g, ' and ');
			} else {
				vehDescString = "";
				newVehStr = "";
			}
			var host = CDO_controller.host();
			var url2 = "";
			if (modelDescString == "" && suffixDescString !== "") {
				console.log("1");
				url2 = host +
					"/Z_VEHICLE_CATALOGUE_SRV/ZC_TABLE_DATA_LOADSet?$filter=(User eq  '" + CDO_controller.user + "' and Brand eq  '" + brandCBVal +
					" ' and TCISeries eq  '" + seriesCBVal +
					"' and (" + newSuffixStr + ") and Modelyear eq  '" + modelYearCBVal + " ')";
			} else if (suffixDescString == "" && modelDescString !== "") {
				console.log("2");
				url2 = host +
					"/Z_VEHICLE_CATALOGUE_SRV/ZC_TABLE_DATA_LOADSet?$filter=(User eq  '" + CDO_controller.user + "' and Brand eq  '" + brandCBVal +
					" ' and TCISeries eq  '" + seriesCBVal +
					" ' and Modelyear eq  '" + modelYearCBVal + " 'and (" + newModelStr + ") )";
			} else if (suffixDescString == "" && modelDescString == "") {
				console.log("3");
				url2 = host +
					"/Z_VEHICLE_CATALOGUE_SRV/ZC_TABLE_DATA_LOADSet?$filter=(User eq  '" + CDO_controller.user + "' and Brand eq  '" + brandCBVal +
					" ' and TCISeries eq  '" + seriesCBVal +
					" ' and Modelyear eq  '" + modelYearCBVal + " ')";
			} else {
				console.log("4");
				url2 = host +
					"/Z_VEHICLE_CATALOGUE_SRV/ZC_TABLE_DATA_LOADSet?$filter=(User eq  '" + CDO_controller.user + "' and Brand eq  '" + brandCBVal +
					" ' and TCISeries eq  '" + seriesCBVal +
					" ' and Modelyear eq  '" + modelYearCBVal + " ' and (" + newModelStr + ") and (" + newSuffixStr + ") )";
			}
			$.ajax({
				url: url2,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					var tblModel = new sap.ui.model.json.JSONModel(data.d.results);
					CDO_controller.getView().setModel(tblModel, "searchTblModel");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					var errMsg = CDO_controller.getView().getModel("i18n").getResourceBundle().getText("Error1");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error",
						sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
			if (newVehStr !== "") {
				var urlTable = host +
					"/Z_VEHICLE_CATALOGUE_SRV/ZC_VOAS_COMP_HEADERSet?$filter= (User eq  '" + CDO_controller.user + "' and " + newVehStr +
					" and Language eq '" + CDO_controller.language +
					"') &$expand=ZCVOASDEEP";
				//IN_Vehicle1 eq '2019Camry SEAM' and IN_Vehicle2 eq '2019Camry LEAM' )&$expand=ZCVOASDEEP";
				$.ajax({
					url: urlTable,
					method: 'GET',
					async: false,
					dataType: 'json',
					success: function (data, textStatus, jqXHR) {

						var tblModel = new sap.ui.model.json.JSONModel(data.d.results);
						CDO_controller.getView().setModel(tblModel, "TblModel");
					},
					error: function (jqXHR, textStatus, errorThrown) {
						var errMsg = CDO_controller.getView().getModel("i18n").getResourceBundle().getText("Error1");
						sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error",
							sap.m.MessageBox.Action.OK, null, null);
					}
				});

			}

			if (CDO_controller.getView().getModel("searchTblModel")) {
				empData = CDO_controller.getView().getModel("searchTblModel").getData();
				var modLen = empData.length;
				for (var i = 0; i < len; i++) {
					for (var k = 0; k < modLen; k++) {
						if (parsePathArg[i] == k) {
							var colname = empData[k].ENModelDesc + "  - SFX " + empData[k].Suffix;
							var colname2 = empData[k].ENModelDesc;
							//	aColumnData.push(empData[k]);
							aColumnData.push({
								Vehicle: colname
							});
							aColumnDataCol.push({
								Vehicle: colname2
							});
							arrNewData.push(empData[k]);
							break;
						}
					}
				}
				//		console.log(aColumnData);
				var nModel = new sap.ui.model.json.JSONModel();
				nModel.setData(arrNewData);
				//		console.log(arrNewData);
				CDO_controller.getView().setModel(nModel, "compareModel");
				//	var stateSwitch = this.getView().byId("stdFeatSwitchId");
				//		console.log(stateSwitch);
				if (CDO_controller.getView().getModel("TblModel")) {
					var dat = CDO_controller.getView().getModel("TblModel").getData();
					var dtExt = "",
						dtInt = "",
						dtPwr = "",
						dtSaf = "",
						dtInfo = "",
						dtCol = "",
						dtDim = "",
						dtOpt = "",
						dtApx = "";

					for (var j = 0; j < dat.length; j++) {
						if (dat[j].Super_catgy == "EXTERIOR") {
							dtExt = dat[j].ZCVOASDEEP.results;
						}
						if (dat[j].Super_catgy == "INTERIOR") {
							dtInt = dat[j].ZCVOASDEEP.results;
						}
						if (dat[j].Super_catgy == "POWERTRAIN/MECHANICAL") {
							dtPwr = dat[j].ZCVOASDEEP.results;
						}
						if (dat[j].Super_catgy == "SAFETY/CONVENIENCE") {
							dtSaf = dat[j].ZCVOASDEEP.results;
						}
						if (dat[j].Super_catgy == "INFOTAINMENT") {
							dtInfo = dat[j].ZCVOASDEEP.results;
						}
						if (dat[j].Super_catgy == "COLOR OPTIONS") {
							dtCol = dat[j].ZCVOASDEEP.results;
						}
						if (dat[j].Super_catgy == "DIMENSIONS & SPECS") {
							dtDim = dat[j].ZCVOASDEEP.results;
						}
						if (dat[j].Super_catgy == "APX") {
							dtApx = dat[j].ZCVOASDEEP.results;
						}
						if (dat[j].Super_catgy == "OPTION PACKAGES") {
							dtOpt = dat[j].ZCVOASDEEP.results;
						}

					}

					var dataExterior = [];
					for (var i = 0; i < dtExt.length; i++) {

						switch (len) {
						case 2:
							if (dtExt[i].Vehicle1 == dtExt[i].Vehicle2) {

							} else {
								dataExterior.push({
									"Category_en": dtExt[i].Cust_fac_desc_en, //dtExt[i].Category_en,
									"Cust_fac_desc_en": "", //dtExt[i].Cust_fac_desc_en,
									"Vehicle1": dtExt[i].Vehicle1,
									"Vehicle2": dtExt[i].Vehicle2,
									"Vehicle3": dtExt[i].Vehicle3,
									"Vehicle4": dtExt[i].Vehicle4,
									"Vehicle5": dtExt[i].Vehicle5
								});
							}
							break;
						case 3:
							//	console.log(dtExt[i].Vehicle1+" :"+dtExt[i].Vehicle2+" :"+dtExt[i].Vehicle3);
							if (dtExt[i].Vehicle1 == dtExt[i].Vehicle2 && dtExt[i].Vehicle2 == dtExt[i].Vehicle3) {
								//console.log("For"+i+" YES present in all")
							} else {
								dataExterior.push({
									"Category_en": dtExt[i].Cust_fac_desc_en, //dtExt[i].Category_en,
									"Cust_fac_desc_en": "",
									"Vehicle1": dtExt[i].Vehicle1,
									"Vehicle2": dtExt[i].Vehicle2,
									"Vehicle3": dtExt[i].Vehicle3,
									"Vehicle4": dtExt[i].Vehicle4,
									"Vehicle5": dtExt[i].Vehicle5
								});
							}
							break;
						case 4:
							if (dtExt[i].Vehicle1 == dtExt[i].Vehicle2 && dtExt[i].Vehicle2 == dtExt[i].Vehicle3 && dtExt[i].Vehicle3 == dtExt[i].Vehicle4) {
								//	console.log("For"+i+" YES present in all")
							} else {
								//	console.log(" For"+i+"YES is not present in all")
								dataExterior.push({
									"Category_en": dtExt[i].Cust_fac_desc_en, //dtExt[i].Category_en,
									"Cust_fac_desc_en": "",
									"Vehicle1": dtExt[i].Vehicle1,
									"Vehicle2": dtExt[i].Vehicle2,
									"Vehicle3": dtExt[i].Vehicle3,
									"Vehicle4": dtExt[i].Vehicle4,
									"Vehicle5": dtExt[i].Vehicle5
								});
							}
							break;
						case 5:
							if (dtExt[i].Vehicle1 == dtExt[i].Vehicle2 && dtExt[i].Vehicle2 == dtExt[i].Vehicle3 && dtExt[i].Vehicle3 == dtExt[i].Vehicle4 &&
								dtExt[i].Vehicle4 == dtExt[i].Vehicle5) {
								//	console.log("For"+i+" YES present in all")
							} else {
								dataExterior.push({
									"Category_en": dtExt[i].Cust_fac_desc_en, //dtExt[i].Category_en,
									"Cust_fac_desc_en": "",
									"Vehicle1": dtExt[i].Vehicle1,
									"Vehicle2": dtExt[i].Vehicle2,
									"Vehicle3": dtExt[i].Vehicle3,
									"Vehicle4": dtExt[i].Vehicle4,
									"Vehicle5": dtExt[i].Vehicle5
								});
							}
							break;
						default: // code to be executed if n doesn't match any cases
						}
					}
					var dataInterior = [];
					for (var i = 0; i < dtInt.length; i++) {
						switch (len) {
						case 2:
							if (dtInt[i].Vehicle1 == dtInt[i].Vehicle2) {

							} else {
								dataInterior.push({
									"Category_en": dtInt[i].Cust_fac_desc_en, // dtInt[i].Category_en,
									"Cust_fac_desc_en": "", //dtInt[i].Cust_fac_desc_en,
									"Vehicle1": dtInt[i].Vehicle1,
									"Vehicle2": dtInt[i].Vehicle2,
									"Vehicle3": dtInt[i].Vehicle3,
									"Vehicle4": dtInt[i].Vehicle4,
									"Vehicle5": dtInt[i].Vehicle5
								});
							}
							break;
						case 3:
							//	console.log(dtInt[i].Vehicle1+" :"+dtInt[i].Vehicle2+" :"+dtInt[i].Vehicle3);
							if (dtInt[i].Vehicle1 == dtInt[i].Vehicle2 && dtInt[i].Vehicle2 == dtInt[i].Vehicle3) {
								//console.log("For"+i+" YES present in all")
							} else {
								dataInterior.push({
									"Category_en": dtInt[i].Cust_fac_desc_en, // dtInt[i].Category_en,
									"Cust_fac_desc_en": "", //dtInt[i].Cust_fac_desc_en,
									"Vehicle1": dtInt[i].Vehicle1,
									"Vehicle2": dtInt[i].Vehicle2,
									"Vehicle3": dtInt[i].Vehicle3,
									"Vehicle4": dtInt[i].Vehicle4,
									"Vehicle5": dtInt[i].Vehicle5

								});
							}
							break;
						case 4:
							if (dtInt[i].Vehicle1 == dtInt[i].Vehicle2 && dtInt[i].Vehicle2 == dtInt[i].Vehicle3 && dtInt[i].Vehicle3 == dtInt[i].Vehicle4) {
								//	console.log("For"+i+" YES present in all")
							} else {
								//	console.log(" For"+i+"YES is not present in all")
								dataInterior.push({
									"Category_en": dtInt[i].Cust_fac_desc_en, // dtInt[i].Category_en,
									"Cust_fac_desc_en": "", //dtInt[i].Cust_fac_desc_en,
									"Vehicle1": dtInt[i].Vehicle1,
									"Vehicle2": dtInt[i].Vehicle2,
									"Vehicle3": dtInt[i].Vehicle3,
									"Vehicle4": dtInt[i].Vehicle4,
									"Vehicle5": dtInt[i].Vehicle5
								});
							}
							break;
						case 5:
							if (dtInt[i].Vehicle1 == dtInt[i].Vehicle2 && dtInt[i].Vehicle2 == dtInt[i].Vehicle3 && dtInt[i].Vehicle3 == dtInt[i].Vehicle4 &&
								dtInt[i].Vehicle4 == dtInt[i].Vehicle5) {
								//	console.log("For"+i+" YES present in all")
							} else {
								dataInterior.push({
									"Category_en": dtInt[i].Cust_fac_desc_en, // dtInt[i].Category_en,
									"Cust_fac_desc_en": "", //dtInt[i].Cust_fac_desc_en,
									"Vehicle1": dtInt[i].Vehicle1,
									"Vehicle2": dtInt[i].Vehicle2,
									"Vehicle3": dtInt[i].Vehicle3,
									"Vehicle4": dtInt[i].Vehicle4,
									"Vehicle5": dtInt[i].Vehicle5
								});
							}
							break;
						default: // code to be executed if n doesn't match any cases
						}
					}
					var dataInfo = [];
					for (var i = 0; i < dtInfo.length; i++) {

						switch (len) {
						case 2:
							if (dtInfo[i].Vehicle1 == dtInfo[i].Vehicle2) {

							} else {
								dataInfo.push({
									"Category_en": dtInfo[i].Cust_fac_desc_en, //dtInfo[i].Category_en,
									"Cust_fac_desc_en": "", //dtInfo[i].Cust_fac_desc_en,
									"Vehicle1": dtInfo[i].Vehicle1,
									"Vehicle2": dtInfo[i].Vehicle2,
									"Vehicle3": dtInfo[i].Vehicle3,
									"Vehicle4": dtInfo[i].Vehicle4,
									"Vehicle5": dtInfo[i].Vehicle5
								});
							}
							break;
						case 3:
							//	console.log(dtInfo[i].Vehicle1+" :"+dtInfo[i].Vehicle2+" :"+dtInfo[i].Vehicle3);
							if (dtInfo[i].Vehicle1 == dtInfo[i].Vehicle2 && dtInfo[i].Vehicle2 == dtInfo[i].Vehicle3) {
								//console.log("For"+i+" YES present in all")
							} else {
								//console.log(" For"+i+"YES is not present in all")
								dataInfo.push({
									"Category_en": dtInfo[i].Cust_fac_desc_en, //dtInfo[i].Category_en,
									"Cust_fac_desc_en": "", //dtInfo[i].Cust_fac_desc_en,
									"Vehicle1": dtInfo[i].Vehicle1,
									"Vehicle2": dtInfo[i].Vehicle2,
									"Vehicle3": dtInfo[i].Vehicle3,
									"Vehicle4": dtInfo[i].Vehicle4,
									"Vehicle5": dtInfo[i].Vehicle5
								});
							}
							break;
						case 4:
							if (dtInfo[i].Vehicle1 == dtInfo[i].Vehicle2 && dtInfo[i].Vehicle2 == dtInfo[i].Vehicle3 && dtInfo[i].Vehicle3 == dtInfo[i].Vehicle4) {
								//	console.log("For"+i+" YES present in all")
							} else {
								//	console.log(" For"+i+"YES is not present in all")
								dataInfo.push({
									"Category_en": dtInfo[i].Cust_fac_desc_en, //dtInfo[i].Category_en,
									"Cust_fac_desc_en": "", //dtInfo[i].Cust_fac_desc_en,
									"Vehicle1": dtInfo[i].Vehicle1,
									"Vehicle2": dtInfo[i].Vehicle2,
									"Vehicle3": dtInfo[i].Vehicle3,
									"Vehicle4": dtInfo[i].Vehicle4,
									"Vehicle5": dtInfo[i].Vehicle5
								});
							}
							break;
						case 5:
							if (dtInfo[i].Vehicle1 == dtInfo[i].Vehicle2 && dtInfo[i].Vehicle2 == dtInfo[i].Vehicle3 && dtInfo[i].Vehicle3 == dtInfo[i].Vehicle4 &&
								dtInfo[i].Vehicle4 == dtInfo[i].Vehicle5) {
								//	console.log("For"+i+" YES present in all")
							} else {
								//	console.log(" For"+i+"YES is not present in all")
								dataInfo.push({
									"Category_en": dtInfo[i].Cust_fac_desc_en, //dtInfo[i].Category_en,
									"Cust_fac_desc_en": "", //dtInfo[i].Cust_fac_desc_en,
									"Vehicle1": dtInfo[i].Vehicle1,
									"Vehicle2": dtInfo[i].Vehicle2,
									"Vehicle3": dtInfo[i].Vehicle3,
									"Vehicle4": dtInfo[i].Vehicle4,
									"Vehicle5": dtInfo[i].Vehicle5
								});
							}
							break;
						default: // code to be executed if n doesn't match any cases
						}
					}
					var dataPwr = [];
					for (var i = 0; i < dtPwr.length; i++) {

						switch (len) {
						case 2:
							if (dtPwr[i].Vehicle1 == dtPwr[i].Vehicle2) {

							} else {
								dataPwr.push({
									"Category_en": dtPwr[i].Cust_fac_desc_en, // dtPwr[i].Category_en,
									"Cust_fac_desc_en": "", //dtPwr[i].Cust_fac_desc_en,
									"Vehicle1": dtPwr[i].Vehicle1,
									"Vehicle2": dtPwr[i].Vehicle2,
									"Vehicle3": dtPwr[i].Vehicle3,
									"Vehicle4": dtPwr[i].Vehicle4,
									"Vehicle5": dtPwr[i].Vehicle5
								});
							}
							break;
						case 3:
							//	console.log(dtPwr[i].Vehicle1+" :"+dtPwr[i].Vehicle2+" :"+dtPwr[i].Vehicle3);
							if (dtPwr[i].Vehicle1 == dtPwr[i].Vehicle2 && dtPwr[i].Vehicle2 == dtPwr[i].Vehicle3) {
								//console.log("For"+i+" YES present in all")
							} else {
								dataPwr.push({
									"Category_en": dtPwr[i].Cust_fac_desc_en, // dtPwr[i].Category_en,
									"Cust_fac_desc_en": "", //dtPwr[i].Cust_fac_desc_en,
									"Vehicle1": dtPwr[i].Vehicle1,
									"Vehicle2": dtPwr[i].Vehicle2,
									"Vehicle3": dtPwr[i].Vehicle3,
									"Vehicle4": dtPwr[i].Vehicle4,
									"Vehicle5": dtPwr[i].Vehicle5
								});
							}
							break;
						case 4:
							if (dtPwr[i].Vehicle1 == dtPwr[i].Vehicle2 && dtPwr[i].Vehicle2 == dtPwr[i].Vehicle3 && dtPwr[i].Vehicle3 == dtPwr[i].Vehicle4) {
								//	console.log("For"+i+" YES present in all")
							} else {
								dataPwr.push({
									"Category_en": dtPwr[i].Cust_fac_desc_en, // dtPwr[i].Category_en,
									"Cust_fac_desc_en": "", //dtPwr[i].Cust_fac_desc_en,
									"Vehicle1": dtPwr[i].Vehicle1,
									"Vehicle2": dtPwr[i].Vehicle2,
									"Vehicle3": dtPwr[i].Vehicle3,
									"Vehicle4": dtPwr[i].Vehicle4,
									"Vehicle5": dtPwr[i].Vehicle5
								});
							}
							break;
						case 5:
							if (dtPwr[i].Vehicle1 == dtPwr[i].Vehicle2 && dtPwr[i].Vehicle2 == dtPwr[i].Vehicle3 && dtPwr[i].Vehicle3 == dtPwr[i].Vehicle4 &&
								dtPwr[i].Vehicle4 == dtPwr[i].Vehicle5) {
								//	console.log("For"+i+" YES present in all")
							} else {
								dataPwr.push({
									"Category_en": dtPwr[i].Cust_fac_desc_en, // dtPwr[i].Category_en,
									"Cust_fac_desc_en": "", //dtPwr[i].Cust_fac_desc_en,
									"Vehicle1": dtPwr[i].Vehicle1,
									"Vehicle2": dtPwr[i].Vehicle2,
									"Vehicle3": dtPwr[i].Vehicle3,
									"Vehicle4": dtPwr[i].Vehicle4,
									"Vehicle5": dtPwr[i].Vehicle5
								});
							}
							break;
						default: // code to be executed if n doesn't match any cases
						}
					}
					var dataSafety = [];
					for (var i = 0; i < dtSaf.length; i++) {

						switch (len) {
						case 2:
							if (dtSaf[i].Vehicle1 == dtSaf[i].Vehicle2) {

							} else {
								dataSafety.push({
									"Category_en": dtSaf[i].Cust_fac_desc_en, // dtSaf[i].Category_en,
									"Cust_fac_desc_en": "", // dtSaf[i].Cust_fac_desc_en,
									"Vehicle1": dtSaf[i].Vehicle1,
									"Vehicle2": dtSaf[i].Vehicle2,
									"Vehicle3": dtSaf[i].Vehicle3,
									"Vehicle4": dtSaf[i].Vehicle4,
									"Vehicle5": dtSaf[i].Vehicle5
								});
							}
							break;
						case 3:
							//	console.log(dtSaf[i].Vehicle1+" :"+dtSaf[i].Vehicle2+" :"+dtSaf[i].Vehicle3);
							if (dtSaf[i].Vehicle1 == dtSaf[i].Vehicle2 && dtSaf[i].Vehicle2 == dtSaf[i].Vehicle3) {
								//console.log("For"+i+" YES present in all")
							} else {
								dataSafety.push({
									"Category_en": dtSaf[i].Cust_fac_desc_en, // dtSaf[i].Category_en,
									"Cust_fac_desc_en": "", //dtSaf[i].Cust_fac_desc_en,
									"Vehicle1": dtSaf[i].Vehicle1,
									"Vehicle2": dtSaf[i].Vehicle2,
									"Vehicle3": dtSaf[i].Vehicle3,
									"Vehicle4": dtSaf[i].Vehicle4,
									"Vehicle5": dtSaf[i].Vehicle5
								});
							}
							break;
						case 4:
							if (dtSaf[i].Vehicle1 == dtSaf[i].Vehicle2 && dtSaf[i].Vehicle2 == dtSaf[i].Vehicle3 && dtSaf[i].Vehicle3 == dtSaf[i].Vehicle4) {
								//	console.log("For"+i+" YES present in all")
							} else {
								dataSafety.push({
									"Category_en": dtSaf[i].Cust_fac_desc_en, // dtSaf[i].Category_en,
									"Cust_fac_desc_en": "", //dtSaf[i].Cust_fac_desc_en,
									"Vehicle1": dtSaf[i].Vehicle1,
									"Vehicle2": dtSaf[i].Vehicle2,
									"Vehicle3": dtSaf[i].Vehicle3,
									"Vehicle4": dtSaf[i].Vehicle4,
									"Vehicle5": dtSaf[i].Vehicle5
								});
							}
							break;
						case 5:
							if (dtSaf[i].Vehicle1 == dtSaf[i].Vehicle2 && dtSaf[i].Vehicle2 == dtSaf[i].Vehicle3 && dtSaf[i].Vehicle3 == dtSaf[i].Vehicle4 &&
								dtSaf[i].Vehicle4 == dtSaf[i].Vehicle5) {
								//	console.log("For"+i+" YES present in all")
							} else {
								dataSafety.push({
									"Category_en": dtSaf[i].Cust_fac_desc_en, // dtSaf[i].Category_en,
									"Cust_fac_desc_en": "", //dtSaf[i].Cust_fac_desc_en,
									"Vehicle1": dtSaf[i].Vehicle1,
									"Vehicle2": dtSaf[i].Vehicle2,
									"Vehicle3": dtSaf[i].Vehicle3,
									"Vehicle4": dtSaf[i].Vehicle4,
									"Vehicle5": dtSaf[i].Vehicle5
								});
							}
							break;
						default: // code to be executed if n doesn't match any cases
						}
					}

					var dataColour = [];

					for (var i = 0; i < dtCol.length; i++) {
						var msrp = [],
							net = [];
						if (dtCol[i].MSRP != undefined && dtCol[i].MSRP != null && !isNaN(dtCol[i].MSRP) && dtCol[i].MSRP != "") {
							msrp[i] = " $" + parseInt(dtCol[i].MSRP);
						} else {
							msrp[i] = "NA";
						}
						if (dtCol[i].NETPRICE != undefined && dtCol[i].NETPRICE != null && !isNaN(dtCol[i].NETPRICE) && dtCol[i].NETPRICE != "") {
							net[i] = " $" + parseInt(dtCol[i].NETPRICE);
						} else {
							net[i] = "";
						}
						var msrpF = CDO_controller.getView().getModel("i18n").getResourceBundle().getText("MSRPWithoutDoll");
						var netPriceF = CDO_controller.getView().getModel("i18n").getResourceBundle().getText("DealerNetWithoutDoll");

						switch (len) {
						case 2:
							if (dtCol[i].Vehicle1 == dtCol[i].Vehicle2) {

							} else {
								dataColour.push({
									"Category_en": dtCol[i].EXT + "-" + dtCol[i].EXT_DESC + "\n" + dtCol[i].INT_DESC,
									//"Cust_fac_desc_en": "MSRP: $ " + msrp[i] + "\nDealer Net: $" + net[i],
									"Cust_fac_desc_en": msrpF + msrp[i] + "\n" + netPriceF + net[i],
									"Vehicle1": dtCol[i].Vehicle1,
									"Vehicle2": dtCol[i].Vehicle2,
									"Vehicle3": dtCol[i].Vehicle3,
									"Vehicle4": dtCol[i].Vehicle4,
									"Vehicle5": dtCol[i].Vehicle5
								});
							}
							break;
						case 3:
							//	console.log(dtCol[i].Vehicle1+" :"+dtCol[i].Vehicle2+" :"+dtCol[i].Vehicle3);
							if (dtCol[i].Vehicle1 == dtCol[i].Vehicle2 && dtCol[i].Vehicle2 == dtCol[i].Vehicle3) {
								//console.log("For"+i+" YES present in all")
							} else {
								dataColour.push({
									"Category_en": dtCol[i].EXT + "-" + dtCol[i].EXT_DESC + "\n" + dtCol[i].INT_DESC,
									//"Cust_fac_desc_en": "MSRP: $ " + msrp[i] + "\nDealer Net: $" + net[i],
									"Cust_fac_desc_en": msrpF + msrp[i] + "\n" + netPriceF + net[i],
									"Vehicle1": dtCol[i].Vehicle1,
									"Vehicle2": dtCol[i].Vehicle2,
									"Vehicle3": dtCol[i].Vehicle3,
									"Vehicle4": dtCol[i].Vehicle4,
									"Vehicle5": dtCol[i].Vehicle5
								});
							}
							break;
						case 4:
							if (dtCol[i].Vehicle1 == dtCol[i].Vehicle2 && dtCol[i].Vehicle2 == dtCol[i].Vehicle3 && dtCol[i].Vehicle3 == dtCol[i].Vehicle4) {
								//	console.log("For"+i+" YES present in all")
							} else {
								dataColour.push({
									"Category_en": dtCol[i].EXT + "-" + dtCol[i].EXT_DESC + "\n" + dtCol[i].INT_DESC,
									//"Cust_fac_desc_en": "MSRP: $ " + msrp[i] + "\nDealer Net: $" + net[i],
									"Cust_fac_desc_en": msrpF + msrp[i] + "\n" + netPriceF + net[i],
									"Vehicle1": dtCol[i].Vehicle1,
									"Vehicle2": dtCol[i].Vehicle2,
									"Vehicle3": dtCol[i].Vehicle3,
									"Vehicle4": dtCol[i].Vehicle4,
									"Vehicle5": dtCol[i].Vehicle5
								});
							}
							break;
						case 5:
							if (dtCol[i].Vehicle1 == dtCol[i].Vehicle2 && dtCol[i].Vehicle2 == dtCol[i].Vehicle3 && dtCol[i].Vehicle3 == dtCol[i].Vehicle4 &&
								dtCol[i].Vehicle4 == dtCol[i].Vehicle5) {
								//	console.log("For"+i+" YES present in all")
							} else {
								dataColour.push({
									"Category_en": dtCol[i].EXT + "-" + dtCol[i].EXT_DESC + "\n" + dtCol[i].INT_DESC,
									//"Cust_fac_desc_en": "MSRP: $ " + msrp[i] + "\nDealer Net: $" + net[i],
									"Cust_fac_desc_en": msrpF + msrp[i] + "\n" + netPriceF + net[i],
									"Vehicle1": dtCol[i].Vehicle1,
									"Vehicle2": dtCol[i].Vehicle2,
									"Vehicle3": dtCol[i].Vehicle3,
									"Vehicle4": dtCol[i].Vehicle4,
									"Vehicle5": dtCol[i].Vehicle5
								});
							}
							break;
						default: // code to be executed if n doesn't match any cases
						}
					}
					var dataDim = [];
					for (var i = 0; i < dtDim.length; i++) {

						switch (len) {
						case 2:
							if (dtDim[i].Vehicle1 == dtDim[i].Vehicle2) {

							} else {
								dataDim.push({
									"Category_en": dtDim[i].Dimensions,
									"Cust_fac_desc_en": " ",
									"Vehicle1": dtDim[i].Vehicle1,
									"Vehicle2": dtDim[i].Vehicle2,
									"Vehicle3": dtDim[i].Vehicle3,
									"Vehicle4": dtDim[i].Vehicle4,
									"Vehicle5": dtDim[i].Vehicle5
								});
							}
							break;
						case 3:
							//	console.log(dtDim[i].Vehicle1+" :"+dtDim[i].Vehicle2+" :"+dtDim[i].Vehicle3);
							if (dtDim[i].Vehicle1 == dtDim[i].Vehicle2 && dtDim[i].Vehicle2 == dtDim[i].Vehicle3) {
								//console.log("For"+i+" YES present in all")
							} else {
								dataDim.push({
									"Category_en": dtDim[i].Dimensions,
									"Cust_fac_desc_en": " ",
									"Vehicle1": dtDim[i].Vehicle1,
									"Vehicle2": dtDim[i].Vehicle2,
									"Vehicle3": dtDim[i].Vehicle3,
									"Vehicle4": dtDim[i].Vehicle4,
									"Vehicle5": dtDim[i].Vehicle5
								});
							}
							break;
						case 4:
							if (dtDim[i].Vehicle1 == dtDim[i].Vehicle2 && dtDim[i].Vehicle2 == dtDim[i].Vehicle3 && dtDim[i].Vehicle3 == dtDim[i].Vehicle4) {
								//	console.log("For"+i+" YES present in all")
							} else {
								dataDim.push({
									"Category_en": dtDim[i].Dimensions,
									"Cust_fac_desc_en": " ",
									"Vehicle1": dtDim[i].Vehicle1,
									"Vehicle2": dtDim[i].Vehicle2,
									"Vehicle3": dtDim[i].Vehicle3,
									"Vehicle4": dtDim[i].Vehicle4,
									"Vehicle5": dtDim[i].Vehicle5
								});
							}
							break;
						case 5:
							if (dtDim[i].Vehicle1 == dtDim[i].Vehicle2 && dtDim[i].Vehicle2 == dtDim[i].Vehicle3 && dtDim[i].Vehicle3 == dtDim[i].Vehicle4 &&
								dtDim[i].Vehicle4 == dtDim[i].Vehicle5) {
								//	console.log("For"+i+" YES present in all")
							} else {
								dataDim.push({
									"Category_en": dtDim[i].Dimensions,
									"Cust_fac_desc_en": " ",
									"Vehicle1": dtDim[i].Vehicle1,
									"Vehicle2": dtDim[i].Vehicle2,
									"Vehicle3": dtDim[i].Vehicle3,
									"Vehicle4": dtDim[i].Vehicle4,
									"Vehicle5": dtDim[i].Vehicle5
								});
							}
							break;
						default: // code to be executed if n doesn't match any cases
						}
					}

					var dataApx = [];
					var text = [];
					for (var i = 0; i < dtApx.length; i++) {

						switch (len) {
						case 2:
							if (dtApx[i].Vehicle1 == dtApx[i].Vehicle2) {

							} else {
								dataApx.push({
									"Category_en": dtApx[i].APX,
									"Cust_fac_desc_en": "",//dtApx[i].INT_DESC,
									"Vehicle1": dtApx[i].Vehicle1,
									"Vehicle2": dtApx[i].Vehicle2,
									"Vehicle3": dtApx[i].Vehicle3,
									"Vehicle4": dtApx[i].Vehicle4,
									"Vehicle5": dtApx[i].Vehicle5
								});
							}
							break;
						case 3:

							if (dtApx[i].Vehicle1 == dtApx[i].Vehicle2 && dtApx[i].Vehicle2 == dtApx[i].Vehicle3) {
								//console.log("For"+i+" YES present in all")
							} else {
								dataApx.push({
									"Category_en": dtApx[i].APX,
									"Cust_fac_desc_en": "",//dtApx[i].INT_DESC,
									"Vehicle1": dtApx[i].Vehicle1,
									"Vehicle2": dtApx[i].Vehicle2,
									"Vehicle3": dtApx[i].Vehicle3,
									"Vehicle4": dtApx[i].Vehicle4,
									"Vehicle5": dtApx[i].Vehicle5
								});
							}
							break;
						case 4:
							if (dtApx[i].Vehicle1 == dtApx[i].Vehicle2 && dtApx[i].Vehicle2 == dtApx[i].Vehicle3 && dtApx[i].Vehicle3 == dtApx[i].Vehicle4) {
								//	console.log("For"+i+" YES present in all")
							} else {
								dataApx.push({
									"Category_en": dtApx[i].APX,
									"Cust_fac_desc_en": "",//dtApx[i].INT_DESC,
									"Vehicle1": dtApx[i].Vehicle1,
									"Vehicle2": dtApx[i].Vehicle2,
									"Vehicle3": dtApx[i].Vehicle3,
									"Vehicle4": dtApx[i].Vehicle4,
									"Vehicle5": dtApx[i].Vehicle5
								});
							}
							break;
						case 5:
							if (dtApx[i].Vehicle1 == dtApx[i].Vehicle2 && dtApx[i].Vehicle2 == dtApx[i].Vehicle3 && dtApx[i].Vehicle3 == dtApx[i].Vehicle4 &&
								dtApx[i].Vehicle4 == dtApx[i].Vehicle5) {
								//	console.log("For"+i+" YES present in all")
							} else {
								dataApx.push({
									"Category_en": dtApx[i].APX,
									"Cust_fac_desc_en": "",//dtApx[i].INT_DESC,
									"Vehicle1": dtApx[i].Vehicle1,
									"Vehicle2": dtApx[i].Vehicle2,
									"Vehicle3": dtApx[i].Vehicle3,
									"Vehicle4": dtApx[i].Vehicle4,
									"Vehicle5": dtApx[i].Vehicle5
								});
							}
							break;
						default: // code to be executed if n doesn't match any cases
						}
					}

					var tblModelExt = new sap.ui.model.json.JSONModel();
					tblModelExt.setData({
						columns: aColumnData,
						rows: dataExterior
					});
					var tblModelInt = new sap.ui.model.json.JSONModel();
					tblModelInt.setData({
						columns: aColumnData,
						rows: dataInterior
					});
					var tblModelPwr = new sap.ui.model.json.JSONModel();
					tblModelPwr.setData({
						columns: aColumnData,
						rows: dataPwr
					});
					var tblModelInfo = new sap.ui.model.json.JSONModel();
					tblModelInfo.setData({
						columns: aColumnData,
						rows: dataInfo
					});
					var tblModelSaf = new sap.ui.model.json.JSONModel();
					tblModelSaf.setData({
						columns: aColumnData,
						rows: dataSafety
					});

					var tblModelCol = new sap.ui.model.json.JSONModel();
					tblModelCol.setData({
						columns: aColumnData,
						rows: dataColour
					});
					var tblModelOpt = new sap.ui.model.json.JSONModel(dtOpt);
					CDO_controller.getView().setModel(tblModelOpt, "tblModelOpt");
					/*	tblModelOpt.setData({
							columns: aColumnDataOpt,
							rows: dataOpt
						});*/
					var tblModelDim = new sap.ui.model.json.JSONModel();
					tblModelDim.setData({
						columns: aColumnData,
						rows: dataDim
					});
					var tblModelApx = new sap.ui.model.json.JSONModel();
					tblModelApx.setData({
						columns: aColumnData,
						rows: dataApx
					});

					var tblExterior = CDO_controller.getView().byId("tblExterior");
					tblExterior.setModel(tblModelExt);
					tblExterior.bindAggregation(
						"columns", "/columns",
						function (index, context) {
							return new sap.m.Column({
								header: new sap.m.Label({
									text: context.getObject().Vehicle
								}),
							});
						});
					tblExterior.bindItems("/rows", function (index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem();
						for (var k in obj) {
							if (obj[k] == "Y") {
								row.addCell(
									new sap.m.HBox({
										items: [new sap.m.Text({
											text: " ",
										}).addStyleClass("padding"), new sap.ui.core.Icon({
											src: "sap-icon://accept",
											color: "black"
										})]
									})
								);
							} else {
								row.addCell(
									new sap.m.Text({
										text: obj[k]
									})
								);
							}
						}
						return row;
					});

					var tblInterior = CDO_controller.getView().byId("tblInterior");
					tblInterior.setModel(tblModelInt);
					tblInterior.bindAggregation(
						"columns", "/columns",
						function (index, context) {
							return new sap.m.Column({
								header: new sap.m.Label({
									text: context.getObject().Vehicle
								}),
							});
						});
					tblInterior.bindItems("/rows", function (index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem();
						for (var k in obj) {
							if (obj[k] == "Y") {
								row.addCell(
									new sap.m.HBox({
										items: [new sap.m.Text({
											text: " ",
										}).addStyleClass("padding"), new sap.ui.core.Icon({
											src: "sap-icon://accept",
											color: "black"
										})]
									})
								);
							} else {
								row.addCell(
									new sap.m.Text({
										text: obj[k]
									})
								);
							}
						}
						return row;
					});

					var tblPowertrain = CDO_controller.getView().byId("pwrTrn");
					tblPowertrain.setModel(tblModelPwr);
					tblPowertrain.bindAggregation(
						"columns", "/columns",
						function (index, context) {

							return new sap.m.Column({
								header: new sap.m.Label({
									text: context.getObject().Vehicle
								}),
							});
						});
					tblPowertrain.bindItems("/rows", function (index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem();
						for (var k in obj) {
							if (obj[k] == "Y") {
								row.addCell(
									new sap.m.HBox({
										items: [new sap.m.Text({
											text: " ",
										}).addStyleClass("padding"), new sap.ui.core.Icon({
											src: "sap-icon://accept",
											color: "black"
										})]
									})
								);
							} else {
								row.addCell(
									new sap.m.Text({
										text: obj[k]
									})
								);
							}
						}
						return row;
					});
					var tblSafety = CDO_controller.getView().byId("tblSafety");
					tblSafety.setModel(tblModelSaf);
					tblSafety.bindAggregation(
						"columns", "/columns",
						function (index, context) {
							return new sap.m.Column({
								header: new sap.m.Label({
									text: context.getObject().Vehicle
								}),
							});
						});
					tblSafety.bindItems("/rows", function (index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem();
						for (var k in obj) {
							if (obj[k] == "Y") {
								row.addCell(
									new sap.m.HBox({
										items: [new sap.m.Text({
											text: " ",
										}).addStyleClass("padding"), new sap.ui.core.Icon({
											src: "sap-icon://accept",
											color: "black"
										})]
									})
								);
							} else {
								row.addCell(
									new sap.m.Text({
										text: obj[k]
									})
								);
							}
						}
						return row;
					});
					var tblInfotainment = CDO_controller.getView().byId("tblInfotainment");
					tblInfotainment.setModel(tblModelInfo);
					tblInfotainment
						.bindAggregation("columns", "/columns", function (index, context) {
							return new sap.m.Column({
								header: new sap.m.Label({
									text: context.getObject().Vehicle
								}),
							});
						});
					tblInfotainment.bindItems("/rows", function (index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem();
						for (var k in obj) {
							if (obj[k] == "Y") {
								row.addCell(
									new sap.m.HBox({
										items: [new sap.m.Text({
											text: " ",
										}).addStyleClass("padding"), new sap.ui.core.Icon({
											src: "sap-icon://accept",
											color: "black"
										})]
									})
								);
							} else {
								row.addCell(
									new sap.m.Text({
										text: obj[k]
									})
								);
							}
						}
						return row;
					});
					var tblColorOptions = CDO_controller.getView().byId("tblColorOptions");
					tblColorOptions.setModel(tblModelCol);
					tblColorOptions
						.bindAggregation("columns", "/columns", function (index, context) {
							return new sap.m.Column({
								header: new sap.m.Label({
									text: context.getObject().Vehicle
								}),
							});
						});
					tblColorOptions.bindItems("/rows", function (index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem();
						for (var k in obj) {
							if (obj[k] == "Y") {
								row.addCell(
									new sap.m.HBox({
										items: [new sap.m.Text({
											text: " ",
										}).addStyleClass("padding"), new sap.ui.core.Icon({
											src: "sap-icon://accept",
											color: "black"
										})]
									})
								);
							} else {
								row.addCell(
									new sap.m.Text({
										text: obj[k]
									})
								);
							}
						}
						return row;
					});
					var tblDimensions = CDO_controller.getView().byId("tblDimensions");
					tblDimensions.setModel(tblModelDim);
					tblDimensions.bindAggregation(
						"columns", "/columns",
						function (index, context) {
							return new sap.m.Column({
								header: new sap.m.Label({
									text: context.getObject().Vehicle
								}),
							});
						});
					tblDimensions.bindItems("/rows", function (index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem();
						for (var k in obj) {
							if (obj[k] == "Y") {
								row.addCell(
									new sap.m.HBox({
										items: [new sap.m.Text({
											text: " ",
										}).addStyleClass("padding"), new sap.ui.core.Icon({
											src: "sap-icon://accept",
											color: "black"
										})]
									})
								);
							} else {
								row.addCell(
									new sap.m.Text({
										text: obj[k]
									})
								);
							}
						}
						return row;
					});
					var tblOptionPack = CDO_controller.getView().byId("tblOptionPackStat");
					tblOptionPack.setModel("tblModelOpt");

					/*	tblOptionPack.setModel(tblModelOpt);
					tblOptionPack.bindAggregation("columns", "/columns", function (index, context) {
						return new sap.m.Column({
							header: new sap.m.Label({
								text: context.getObject().Vehicle
							}),
						});
					});
					tblOptionPack.bindItems("/rows", function (index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem();
						for (var k in obj) {
							row.addCell(new sap.m.Text({
								text: obj[k]
							}));
						}
						return row;
					});*/
					var tblAPX = CDO_controller.getView().byId("tblAPX");
					tblAPX.setModel(tblModelApx);
					tblAPX.bindAggregation("columns",
						"/columns",
						function (index, context) {
							return new sap.m.Column({
								header: new sap.m.Label({
									text: context.getObject().Vehicle
								}),
							});
						});
					tblAPX.bindItems("/rows", function (index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem();
						for (var k in obj) {
							if (obj[k] == "Y") {
								row.addCell(
									new sap.m.HBox({
										items: [new sap.m.Text({
											text: " ",
										}).addStyleClass("padding"), new sap.ui.core.Icon({
											src: "sap-icon://accept",
											color: "black"
										})]
									})
								);
							} else {
								row.addCell(
									new sap.m.Text({
										text: obj[k]
									})
								);
							}
						}
						return row;
					});
				}
			}

		},
		handleRouteMatchedStdFeatureOn: function () {
			//	CDO_controller.user = CDO_controller.getLoggedUser();
			var fixedData = {
				Vehicle: " "
			};

			var aColumnData = [];
			aColumnData.push(fixedData);
			aColumnData.push(fixedData);

			var aColumnDataCol = [];
			aColumnDataCol.push(fixedData);
			aColumnDataCol.push(fixedData);

			var arg2 = CDO_controller.arg2; // oEvent.getParameters().data.num2;//	var arg2 = oEvent.getParameters().data.num2;
			var parseArg = JSON.parse(arg2);
			var modelArg = new sap.ui.model.json.JSONModel(parseArg[0]);
			CDO_controller.getView().setModel(modelArg, "modelArg");
			var dataModelArg = CDO_controller.getView().getModel('modelArg').getData();
			var brandCBVal = dataModelArg.brand;
			var modelYearCBVal = dataModelArg.moYear;
			var seriesCBVal = dataModelArg.series;
			CDO_controller.user = dataModelArg.user;

			var empData;
			var arrNewData = [];

			var modelArr = [];
			var newModelStr = "";
			var modelText = [];
			var modelDescString = "";

			var suffixArr = [];
			var newSuffixStr = "";
			var suffixText = [];
			var suffixDescString;

			var vehArr = [];
			var vehText = [];
			var vehDescString = "";
			var newVehStr = "";
			var suffixTextVeh = [];
			var stateSwitch;
			var parsePathArg = JSON.parse(parseArg[0].pathVeh);
			var len = parsePathArg.length;
			if (len == 2) {
				this.getView().byId("idTbl_compare2vehicles").setVisible(true);
				this.getView().byId("idTbl_compare3vehicles").setVisible(false);
				this.getView().byId("idTbl_compare4vehicles").setVisible(false);
				this.getView().byId("idTbl_compare5vehicles").setVisible(false);
				stateSwitch = this.getView().byId("stdFeatSwitchId2");
				//	this.getView().byId("hboxCompare").addStyleClass("paddingleft1");
			} else if (len == 3) {
				this.getView().byId("idTbl_compare3vehicles").setVisible(true);
				this.getView().byId("idTbl_compare2vehicles").setVisible(false);
				this.getView().byId("idTbl_compare4vehicles").setVisible(false);
				this.getView().byId("idTbl_compare5vehicles").setVisible(false);
				stateSwitch = this.getView().byId("stdFeatSwitchId3");
				//	this.getView().byId("hboxCompare").addStyleClass("paddingleft2");
			} else if (len == 4) {
				this.getView().byId("idTbl_compare4vehicles").setVisible(true);
				this.getView().byId("idTbl_compare3vehicles").setVisible(false);
				this.getView().byId("idTbl_compare2vehicles").setVisible(false);
				this.getView().byId("idTbl_compare5vehicles").setVisible(false);
				stateSwitch = this.getView().byId("stdFeatSwitchId4");
				//	this.getView().byId("hboxCompare").addStyleClass("paddingleft3");
			} else if (len == 5) {
				this.getView().byId("idTbl_compare5vehicles").setVisible(true);
				this.getView().byId("idTbl_compare3vehicles").setVisible(false);
				this.getView().byId("idTbl_compare4vehicles").setVisible(false);
				this.getView().byId("idTbl_compare2vehicles").setVisible(false);
				stateSwitch = this.getView().byId("stdFeatSwitchId5");
				//	this.getView().byId("hboxCompare").addStyleClass("paddingleft4");
			}
			if (parseArg[0].model !== "") {
				/*	if (parseArg[0].model !== "[]") {
						newModelStr = "Model eq '" +parseArg[0].model;
					} else {*/
				var parseModelPathArg = JSON.parse(parseArg[0].model);
				var lenModel = parseModelPathArg.length;
				var jsonModel = JSON.parse(parseArg[0].model);
				for (var i = 0; i < lenModel; i++) {
					modelText[i] = jsonModel[i];
					var modelText2 = "Model eq '" + modelText[i] + "'";
					modelArr.push(modelText2);
				}
				modelDescString = modelArr.toString();
				newModelStr = modelDescString.replace(/,/g, ' or ');
				/*	}*/
			} else {
				modelDescString = "";
				newModelStr = "";
			}

			if (parseArg[0].suffixDD !== "") {
				/*console.log(parseArg[0].suffix);
				if (parseArg[0].suffix !== "[]") {
					newSuffixStr = "Suffix eq '" +parseArg[0].suffix;
				} else {*/
				var parseSuffixPathArg = JSON.parse(parseArg[0].suffixDD);
				var lenSuffix = parseSuffixPathArg.length;
				var jsonSuffixDD = JSON.parse(parseArg[0].suffixDD);
				for (var j = 0; j < lenSuffix; j++) {
					suffixText[j] = jsonSuffixDD[j];
					var suffixText2 = "Suffix eq '" + suffixText[j] + "'";
					suffixArr.push(suffixText2);
				}
				suffixDescString = suffixArr.toString();
				newSuffixStr = suffixDescString.replace(/,/g, ' or ');
				/*	}*/
			} else {
				suffixDescString = "";
				newSuffixStr = "";
			}
			/*	if (parseArg[0].veh !== "") {
					var parseVehPathArg = JSON.parse(parseArg[0].veh);
					var lenVeh = parseVehPathArg.length;
					var jsonVeh = JSON.parse(parseArg[0].veh);
					for (var i = 0; i < lenVeh; i++) {
						vehText[i] = jsonVeh[i];
						var vehNum = i + 1;
						var vehText2 = "IN_Vehicle" + vehNum + " eq '" + vehText[i] + "'";
						vehArr.push(vehText2);
					}
					vehDescString = vehArr.toString();
					newVehStr = vehDescString.replace(/,/g, ' and ');

				} else {
					vehDescString = "";
					newVehStr = "";
				}*/
			if (parseArg[0].suffix !== "" && parseArg[0].veh !== "") {
				var parseVehPathArg = JSON.parse(parseArg[0].veh);
				var lenVeh = parseVehPathArg.length;
				var jsonVeh = JSON.parse(parseArg[0].veh);
				var jsonSuffix = JSON.parse(parseArg[0].suffix);
				//var jsonSuffixVeh = JSON.parse(parseArg[0].suffix);
				for (var i = 0; i < lenVeh; i++) {
					suffixText[i] = jsonSuffix[i];
					//	suffixTextVeh[i] = jsonSuffixVeh[i];
					vehText[i] = jsonVeh[i];
					var vehNum = i + 1;
					var vehText2 = "IN_Vehicle" + vehNum + " eq '" + vehText[i] + suffixText[i] + "'";
					vehArr.push(vehText2);
				}
				vehDescString = vehArr.toString();
				newVehStr = vehDescString.replace(/,/g, ' and ');
			} else {
				vehDescString = "";
				newVehStr = "";
			}
			var host = CDO_controller.host();
			var url2 = "";
			if (modelDescString == "" && suffixDescString !== "") {
				console.log("1");
				url2 = host +
					"/Z_VEHICLE_CATALOGUE_SRV/ZC_TABLE_DATA_LOADSet?$filter=(User eq  '" + CDO_controller.user + "' and Brand eq  '" + brandCBVal +
					" ' and TCISeries eq  '" + seriesCBVal +
					"' and (" + newSuffixStr + ") and Modelyear eq  '" + modelYearCBVal + " ')";
			} else if (suffixDescString == "" && modelDescString !== "") {
				console.log("2");
				url2 = host +
					"/Z_VEHICLE_CATALOGUE_SRV/ZC_TABLE_DATA_LOADSet?$filter=(User eq  '" + CDO_controller.user + "' and Brand eq  '" + brandCBVal +
					" ' and TCISeries eq  '" + seriesCBVal +
					" ' and Modelyear eq  '" + modelYearCBVal + " 'and (" + newModelStr + ") )";
			} else if (suffixDescString == "" && modelDescString == "") {
				console.log("3");
				url2 = host +
					"/Z_VEHICLE_CATALOGUE_SRV/ZC_TABLE_DATA_LOADSet?$filter=(User eq  '" + CDO_controller.user + "' and Brand eq  '" + brandCBVal +
					" ' and TCISeries eq  '" + seriesCBVal +
					" ' and Modelyear eq  '" + modelYearCBVal + " ')";
			} else {
				console.log("4");
				url2 = host +
					"/Z_VEHICLE_CATALOGUE_SRV/ZC_TABLE_DATA_LOADSet?$filter=(User eq  '" + CDO_controller.user + "' and Brand eq  '" + brandCBVal +
					" ' and TCISeries eq  '" + seriesCBVal +
					" ' and Modelyear eq  '" + modelYearCBVal + " ' and (" + newModelStr + ") and (" + newSuffixStr + ") )";
			}
			$.ajax({
				url: url2,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					var tblModel = new sap.ui.model.json.JSONModel(data.d.results);
					CDO_controller.getView().setModel(tblModel, "searchTblModel");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					var errMsg = CDO_controller.getView().getModel("i18n").getResourceBundle().getText("Error1");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error",
						sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
			if (newVehStr !== "") {
				var urlTable = host +
					"/Z_VEHICLE_CATALOGUE_SRV/ZC_VOAS_COMP_HEADERSet?$filter= (User eq  '" + CDO_controller.user + "' and " + newVehStr +
					" and Language eq '" + CDO_controller.language +
					"') &$expand=ZCVOASDEEP";
				//IN_Vehicle1 eq '2019Camry SEAM' and IN_Vehicle2 eq '2019Camry LEAM' )&$expand=ZCVOASDEEP";
				//	"/Z_VEHICLE_CATALOGUE_SRV/ZC_VOAS_COMP_HEADERSet?$filter=(IN_Vehicle1 eq '2018Camry SEA' and IN_Vehicle2 eq '2018Camry LEA' )&$expand=ZCVOASDEEP";

				$.ajax({
					url: urlTable,
					method: 'GET',
					async: false,
					dataType: 'json',
					success: function (data, textStatus, jqXHR) {
						var tblModel = new sap.ui.model.json.JSONModel(data.d.results);
						CDO_controller.getView().setModel(tblModel, "TblModel");
					},
					error: function (jqXHR, textStatus, errorThrown) {
						var errMsg = CDO_controller.getView().getModel("i18n").getResourceBundle().getText("Error1");
						sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error",
							sap.m.MessageBox.Action.OK, null, null);
					}
				});
			}

			if (CDO_controller.getView().getModel("searchTblModel")) {
				empData = CDO_controller.getView().getModel("searchTblModel").getData();
				var modLen = empData.length;
				for (var i = 0; i < len; i++) {
					for (var k = 0; k < modLen; k++) {
						if (parsePathArg[i] == k) {
							var colname = empData[k].ENModelDesc + "  - SFX " + empData[k].Suffix;
							var colname2 = empData[k].ENModelDesc;
							//	aColumnData.push(empData[k]);
							aColumnData.push({
								Vehicle: colname
							});
							aColumnDataCol.push({
								Vehicle: colname2
							});
							arrNewData.push(empData[k]);
							break;
						}
					}
				}
				console.log(aColumnData);
				var nModel = new sap.ui.model.json.JSONModel();
				nModel.setData(arrNewData);
				console.log(arrNewData);
				CDO_controller.getView().setModel(nModel, "compareModel");
				//	var stateSwitch = this.getView().byId("stdFeatSwitchId");

				if (CDO_controller.getView().getModel("TblModel")) {
					var dat = CDO_controller.getView().getModel("TblModel").getData();
					var dtExt = "",
						dtInt = "",
						dtPwr = "",
						dtSaf = "",
						dtInfo = "",
						dtCol = "",
						dtDim = "",
						dtOpt = "",
						dtApx = "";

					for (var j = 0; j < dat.length; j++) {
						if (dat[j].Super_catgy == "EXTERIOR") {
							dtExt = dat[j].ZCVOASDEEP.results;
						}
						if (dat[j].Super_catgy == "INTERIOR") {
							dtInt = dat[j].ZCVOASDEEP.results;
						}
						if (dat[j].Super_catgy == "POWERTRAIN/MECHANICAL") {
							dtPwr = dat[j].ZCVOASDEEP.results;
						}
						if (dat[j].Super_catgy == "SAFETY/CONVENIENCE") {
							dtSaf = dat[j].ZCVOASDEEP.results;
						}
						if (dat[j].Super_catgy == "INFOTAINMENT") {
							dtInfo = dat[j].ZCVOASDEEP.results;
						}
						if (dat[j].Super_catgy == "COLOR OPTIONS") {
							dtCol = dat[j].ZCVOASDEEP.results;
						}
						if (dat[j].Super_catgy == "DIMENSIONS & SPECS") {
							dtDim = dat[j].ZCVOASDEEP.results;
						}
						if (dat[j].Super_catgy == "APX") {
							dtApx = dat[j].ZCVOASDEEP.results;
						}
						if (dat[j].Super_catgy == "OPTION PACKAGES") {
							dtOpt = dat[j].ZCVOASDEEP.results;
						}

					}

					var dataExterior = [];
					for (var i = 0; i < dtExt.length; i++) {
						dataExterior.push({
							"Category_en": dtExt[i].Cust_fac_desc_en, //dtExt[i].Category_en,
							"Cust_fac_desc_en": "",
							"Vehicle1": dtExt[i].Vehicle1,
							"Vehicle2": dtExt[i].Vehicle2,
							"Vehicle3": dtExt[i].Vehicle3,
							"Vehicle4": dtExt[i].Vehicle4,
							"Vehicle5": dtExt[i].Vehicle5
						});
					}
					var dataInterior = [];
					for (var i = 0; i < dtInt.length; i++) {
						dataInterior.push({
							"Category_en": dtInt[i].Cust_fac_desc_en, // dtInt[i].Category_en,
							"Cust_fac_desc_en": "", //dtInt[i].Cust_fac_desc_en,
							"Vehicle1": dtInt[i].Vehicle1,
							"Vehicle2": dtInt[i].Vehicle2,
							"Vehicle3": dtInt[i].Vehicle3,
							"Vehicle4": dtInt[i].Vehicle4,
							"Vehicle5": dtInt[i].Vehicle5
						});
					}
					var dataInfo = [];
					for (var i = 0; i < dtInfo.length; i++) {
						dataInfo.push({
							"Category_en": dtInfo[i].Cust_fac_desc_en, //dtInfo[i].Category_en,
							"Cust_fac_desc_en": "", //dtInfo[i].Cust_fac_desc_en,
							"Vehicle1": dtInfo[i].Vehicle1,
							"Vehicle2": dtInfo[i].Vehicle2,
							"Vehicle3": dtInfo[i].Vehicle3,
							"Vehicle4": dtInfo[i].Vehicle4,
							"Vehicle5": dtInfo[i].Vehicle5
						});
					}
					var dataPwr = [];
					for (var i = 0; i < dtPwr.length; i++) {
						dataPwr.push({
							"Category_en": dtPwr[i].Cust_fac_desc_en, // dtPwr[i].Category_en,
							"Cust_fac_desc_en": "", //dtPwr[i].Cust_fac_desc_en,
							"Vehicle1": dtPwr[i].Vehicle1,
							"Vehicle2": dtPwr[i].Vehicle2,
							"Vehicle3": dtPwr[i].Vehicle3,
							"Vehicle4": dtPwr[i].Vehicle4,
							"Vehicle5": dtPwr[i].Vehicle5
						});
					}
					var dataSafety = [];
					for (var i = 0; i < dtSaf.length; i++) {
						dataSafety.push({
							"Category_en": dtSaf[i].Cust_fac_desc_en, // dtSaf[i].Category_en,
							"Cust_fac_desc_en": "", //dtSaf[i].Cust_fac_desc_en,
							"Vehicle1": dtSaf[i].Vehicle1,
							"Vehicle2": dtSaf[i].Vehicle2,
							"Vehicle3": dtSaf[i].Vehicle3,
							"Vehicle4": dtSaf[i].Vehicle4,
							"Vehicle5": dtSaf[i].Vehicle5
						});
					}

					var dataColour = [];

					for (var i = 0; i < dtCol.length; i++) {
						var msrp = [],
							net = [];
						if (dtCol[i].MSRP != undefined && dtCol[i].MSRP != null && !isNaN(dtCol[i].MSRP) && dtCol[i].MSRP != "") {
							msrp[i] = " $" + parseInt(dtCol[i].MSRP);
						} else {
							msrp[i] = "";
						}
						if (dtCol[i].NETPRICE != undefined && dtCol[i].NETPRICE != null && !isNaN(dtCol[i].NETPRICE) && dtCol[i].NETPRICE != "") {
							net[i] = " $" + parseInt(dtCol[i].NETPRICE);
						} else {
							net[i] = "";
						}
						var msrpF = CDO_controller.getView().getModel("i18n").getResourceBundle().getText("MSRPWithoutDoll");
						var netPriceF = CDO_controller.getView().getModel("i18n").getResourceBundle().getText("DealerNetWithoutDoll");

						dataColour.push({
							"Category_en": dtCol[i].EXT + "-" + dtCol[i].EXT_DESC + "\n" + dtCol[i].INT_DESC,
							//"Cust_fac_desc_en": "MSRP: $ " + msrp[i] + "\nDealer Net: $" + net[i],
							"Cust_fac_desc_en": msrpF + msrp[i] + "\n" + netPriceF + net[i],
							"Vehicle1": dtCol[i].Vehicle1,
							"Vehicle2": dtCol[i].Vehicle2,
							"Vehicle3": dtCol[i].Vehicle3,
							"Vehicle4": dtCol[i].Vehicle4,
							"Vehicle5": dtCol[i].Vehicle5
						});
					}
					var dataDim = [];
					for (var i = 0; i < dtDim.length; i++) {
						dataDim.push({
							"Category_en": dtDim[i].Dimensions,
							"Cust_fac_desc_en": " ",
							"Vehicle1": dtDim[i].Vehicle1,
							"Vehicle2": dtDim[i].Vehicle2,
							"Vehicle3": dtDim[i].Vehicle3,
							"Vehicle4": dtDim[i].Vehicle4,
							"Vehicle5": dtDim[i].Vehicle5
						});
					}
					/*	var dataOpt = [];
						for (var i = 0; i < dtOpt.length; i++) {
							dataOpt.push({
								"Vehicle1": dtOpt[i].Vehicle1,
								"optPack": dtOpt[i].OptionPackages
							});
						}*/
					var dataApx = [];
					for (var i = 0; i < dtApx.length; i++) {
						dataApx.push({
							"Category_en": dtApx[i].APX,
							"Cust_fac_desc_en": "",//dtApx[i].INT_DESC,
							"Vehicle1": dtApx[i].Vehicle1,
							"Vehicle2": dtApx[i].Vehicle2,
							"Vehicle3": dtApx[i].Vehicle3,
							"Vehicle4": dtApx[i].Vehicle4,
							"Vehicle5": dtApx[i].Vehicle5
						});
					}

					var tblModelExt = new sap.ui.model.json.JSONModel();
					tblModelExt.setData({
						columns: aColumnData,
						rows: dataExterior
					});
					var tblModelInt = new sap.ui.model.json.JSONModel();
					tblModelInt.setData({
						columns: aColumnData,
						rows: dataInterior
					});
					var tblModelPwr = new sap.ui.model.json.JSONModel();
					tblModelPwr.setData({
						columns: aColumnData,
						rows: dataPwr
					});
					var tblModelInfo = new sap.ui.model.json.JSONModel();
					tblModelInfo.setData({
						columns: aColumnData,
						rows: dataInfo
					});
					var tblModelSaf = new sap.ui.model.json.JSONModel();
					tblModelSaf.setData({
						columns: aColumnData,
						rows: dataSafety
					});

					var tblModelCol = new sap.ui.model.json.JSONModel();
					tblModelCol.setData({
						columns: aColumnData,
						rows: dataColour
					});
					var tblModelOpt = new sap.ui.model.json.JSONModel(dtOpt);
					CDO_controller.getView().setModel(tblModelOpt, "tblModelOpt");
					/*	tblModelOpt.setData({
							columns: aColumnDataOpt,
							rows: dataOpt
						});*/
					var tblModelDim = new sap.ui.model.json.JSONModel();
					tblModelDim.setData({
						columns: aColumnData,
						rows: dataDim
					});
					var tblModelApx = new sap.ui.model.json.JSONModel();
					tblModelApx.setData({
						columns: aColumnData,
						rows: dataApx
					});

					var tblExterior = CDO_controller.getView().byId("tblExterior");
					tblExterior.setModel(tblModelExt);
					tblExterior.bindAggregation("columns", "/columns", function (index, context) {
						return new sap.m.Column({
							header: new sap.m.Label({
								text: context.getObject().Vehicle
							}),
						});
					});
					tblExterior.bindItems("/rows", function (index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem();
						for (var k in obj) {
							if (obj[k] == "Y") {
								row.addCell(
									new sap.m.HBox({
										items: [new sap.m.Text({
											text: " ",
										}).addStyleClass("padding"), new sap.ui.core.Icon({
											src: "sap-icon://accept",
											color: "black"
										})]
									})
								);
							} else {
								row.addCell(
									new sap.m.Text({
										text: obj[k]
									})
								);
							}
						}
						return row;
					});

					var tblInterior = CDO_controller.getView().byId("tblInterior");
					tblInterior.setModel(tblModelInt);
					tblInterior.bindAggregation("columns", "/columns", function (index, context) {
						return new sap.m.Column({
							header: new sap.m.Label({
								text: context.getObject().Vehicle
							}),
						});
					});
					tblInterior.bindItems("/rows", function (index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem();
						for (var k in obj) {
							if (obj[k] == "Y") {
								row.addCell(
									new sap.m.HBox({
										items: [new sap.m.Text({
											text: " ",
										}).addStyleClass("padding"), new sap.ui.core.Icon({
											src: "sap-icon://accept",
											color: "black"
										})]
									})
								);
							} else {
								row.addCell(
									new sap.m.Text({
										text: obj[k]
									})
								);
							}
						}
						return row;
					});

					var tblPowertrain = CDO_controller.getView().byId("pwrTrn");
					tblPowertrain.setModel(tblModelPwr);
					tblPowertrain.bindAggregation("columns", "/columns", function (index, context) {

						return new sap.m.Column({
							header: new sap.m.Label({
								text: context.getObject().Vehicle
							}),
						});
					});
					tblPowertrain.bindItems("/rows", function (index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem();
						for (var k in obj) {
							if (obj[k] == "Y") {
								row.addCell(
									new sap.m.HBox({
										items: [new sap.m.Text({
											text: " ",
										}).addStyleClass("padding"), new sap.ui.core.Icon({
											src: "sap-icon://accept",
											color: "black"
										})]
									})
								);
							} else {
								row.addCell(
									new sap.m.Text({
										text: obj[k]
									})
								);
							}
						}
						return row;
					});
					var tblSafety = CDO_controller.getView().byId("tblSafety");
					tblSafety.setModel(tblModelSaf);
					tblSafety.bindAggregation("columns", "/columns", function (index, context) {
						return new sap.m.Column({
							header: new sap.m.Label({
								text: context.getObject().Vehicle
							}),
						});
					});
					tblSafety.bindItems("/rows", function (index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem();
						for (var k in obj) {
							if (obj[k] == "Y") {
								row.addCell(
									new sap.m.HBox({
										items: [new sap.m.Text({
											text: " ",
										}).addStyleClass("padding"), new sap.ui.core.Icon({
											src: "sap-icon://accept",
											color: "black"
										})]
									})
								);
							} else {
								row.addCell(
									new sap.m.Text({
										text: obj[k]
									})
								);
							}
						}
						return row;
					});
					var tblInfotainment = CDO_controller.getView().byId("tblInfotainment");
					tblInfotainment.setModel(tblModelInfo);
					tblInfotainment.bindAggregation("columns", "/columns", function (index, context) {
						return new sap.m.Column({
							header: new sap.m.Label({
								text: context.getObject().Vehicle
							}),
						});
					});
					tblInfotainment.bindItems("/rows", function (index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem();
						for (var k in obj) {
							if (obj[k] == "Y") {
								row.addCell(
									new sap.m.HBox({
										items: [new sap.m.Text({
											text: " ",
										}).addStyleClass("padding"), new sap.ui.core.Icon({
											src: "sap-icon://accept",
											color: "black"
										})]
									})
								);
							} else {
								row.addCell(
									new sap.m.Text({
										text: obj[k]
									})
								);
							}
						}
						return row;
					});
					var tblColorOptions = CDO_controller.getView().byId("tblColorOptions");
					tblColorOptions.setModel(tblModelCol);
					tblColorOptions.bindAggregation("columns", "/columns", function (index, context) {
						return new sap.m.Column({
							header: new sap.m.Label({
								text: context.getObject().Vehicle
							}),
						});
					});
					tblColorOptions.bindItems("/rows", function (index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem();
						for (var k in obj) {
							if (obj[k] == "Y") {
								row.addCell(
									new sap.m.HBox({
										items: [new sap.m.Text({
											text: " ",
										}).addStyleClass("padding"), new sap.ui.core.Icon({
											src: "sap-icon://accept",
											color: "black"
										})]
									})
								);
							} else {
								row.addCell(
									new sap.m.Text({
										text: obj[k]
									})
								);
							}
						}
						return row;
					});
					var tblDimensions = CDO_controller.getView().byId("tblDimensions");
					tblDimensions.setModel(tblModelDim);
					tblDimensions.bindAggregation("columns", "/columns", function (index, context) {
						return new sap.m.Column({
							header: new sap.m.Label({
								text: context.getObject().Vehicle
							}),
						});
					});
					tblDimensions.bindItems("/rows", function (index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem();
						for (var k in obj) {
							if (obj[k] == "Y") {
								row.addCell(
									new sap.m.HBox({
										items: [new sap.m.Text({
											text: " ",
										}).addStyleClass("padding"), new sap.ui.core.Icon({
											src: "sap-icon://accept",
											color: "black"
										})]
									})
								);
							} else {
								row.addCell(
									new sap.m.Text({
										text: obj[k]
									})
								);
							}
						}
						return row;
					});
					var tblOptionPack = CDO_controller.getView().byId("tblOptionPackStat");
					tblOptionPack.setModel("tblModelOpt");

					/*	tblOptionPack.setModel(tblModelOpt);
					tblOptionPack.bindAggregation("columns", "/columns", function (index, context) {
						return new sap.m.Column({
							header: new sap.m.Label({
								text: context.getObject().Vehicle
							}),
						});
					});
					tblOptionPack.bindItems("/rows", function (index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem();
						for (var k in obj) {
							row.addCell(new sap.m.Text({
								text: obj[k]
							}));
						}
						return row;
					});*/
					var tblAPX = CDO_controller.getView().byId("tblAPX");
					tblAPX.setModel(tblModelApx);
					tblAPX.bindAggregation("columns", "/columns", function (index, context) {
						return new sap.m.Column({
							header: new sap.m.Label({
								text: context.getObject().Vehicle
							}),
						});
					});
					tblAPX.bindItems("/rows", function (index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem();
						for (var k in obj) {
							if (obj[k] == "Y") {
								row.addCell(
									new sap.m.HBox({
										items: [new sap.m.Text({
											text: " ",
										}).addStyleClass("padding"), new sap.ui.core.Icon({
											src: "sap-icon://accept",
											color: "black"
										})]
									})
								);
							} else {
								row.addCell(
									new sap.m.Text({
										text: obj[k]
									})
								);
							}
						}
						return row;
					});
				}
			}
		},
		formatFeatures: function (str) {
			var feat = "";
			var feature = "";
			if (str) {
				var slicestr = str.slice(1);
				console.log(slicestr);
				var res5 = slicestr.replace(/;/g, "#! ");
				var extra = res5.split('#');
				console.log(extra);
				var len = extra.length;
				//	console.log(len);
				var lendiv = Math.floor(len / 2);
				var arr = [];
				for (var i = 0; i < lendiv; i++) {
					arr.push(extra[i]);
				}
				console.log(arr);
				var string = arr.toString();
				console.log(string);
				var res9 = string.replace(/!/g, "#- ");
				console.log(res9);
				var rturnRes1 = res9.split('#').join('\n');
				console.log(rturnRes1);

				/*var arr2 = [];
				for (var q = lendiv; q < len; q++) {
					arr2.push(extra[q]);
				}
				var string2 = arr2.toString();
				
				var res2 = string2.replace(/!/g, "#- ");
				var rturnRes = res2.split('#').join('\n');
				*/
			}
			return "- " + rturnRes1;
		},
		formatFeatures1: function (str) {
			var feat = "";
			var feature = "";
			if (str) {
				/*	var res = str.replace(/;/g, "#- ");
					feat = res.split('#').join('\n');
					feature = feat;*/
				////
				var slicestring = str.slice(1);
				var res5 = slicestring.replace(/;/g, "#! ");
				var extra = res5.split('#');
				//	console.log(extra);
				var len = extra.length;
				console.log(len);
				var lendiv = Math.floor(len / 2);
				/*var arr = [];
				for (var i = 0; i < lendiv; i++) {
					arr.push(extra[i]);
				}
				var string = arr.toString();
				
				var res9 = string.replace(/!/g, "#- ");
				var rturnRes1 = res9.split('#').join('\n');
				*/

				var arr2 = [];
				for (var q = lendiv; q < len; q++) {
					arr2.push(extra[q]);
				}
				console.log(arr2);
				var string2 = arr2.toString();
					console.log(string2);
					var slicedStr2=string2.slice(2);
					console.log(slicedStr2);
				var res2 = slicedStr2.replace(/!/g, "#- ");
				console.log(res2);
				var rturnRes = res2.split('#').join('\n');
						console.log(rturnRes);
			}
			return "- "+rturnRes;
		},
		handleRouteMatched: function (oEvent) {
			//	CDO_controller.user = CDO_controller.getLoggedUser();
			var fixedData = {
				Vehicle: " "
			};
			var emptydata = [];
			emptydata.push(fixedData);
			emptydata.push(fixedData);
			emptydata.push(fixedData);
			var aColumnData = [];
			aColumnData.push(fixedData);
			aColumnData.push(fixedData);

			var aColumnDataCol = [];
			aColumnDataCol.push(fixedData);
			aColumnDataCol.push(fixedData);
			/*	var fixedDataOptPackage = {
				'optPack': ''
			};
			var fixedDataOptPackage2 = {
				'optPack': "Option Packages",
			};
			var aColumnDataOpt = [];
			aColumnDataOpt.push(fixedDataOptPackage2);
			aColumnDataOpt.push(fixedDataOptPackage);
*/
			var arg2 = oEvent.getParameters().data.num2;
			CDO_controller.arg2 = arg2;
			var parseArg = JSON.parse(arg2);
			var modelArg = new sap.ui.model.json.JSONModel(parseArg[0]);
			CDO_controller.getView().setModel(modelArg, "modelArg");
			var dataModelArg = CDO_controller.getView().getModel('modelArg').getData();
			var brandCBVal = dataModelArg.brand;
			var modelYearCBVal = dataModelArg.moYear;
			var seriesCBVal = dataModelArg.series;
			CDO_controller.user = dataModelArg.user;
			var empData;
			var arrNewData = [];

			var modelArr = [];
			var newModelStr = "";
			var modelText = [];
			var modelDescString = "";

			var suffixArr = [];
			var newSuffixStr = "";
			var suffixText = [];
			var suffixDescString;

			var vehArr = [];
			var vehText = [];
			var vehDescString = "";
			var newVehStr = "";
			var suffixTextVeh = [];
			var stateSwitch; // = this.getView().byId("stdFeatSwitchId");

			var parsePathArg = JSON.parse(parseArg[0].pathVeh);
			var len = parsePathArg.length;
				if (brandCBVal == "TOYOTA") {
				
				var disclaimerT= CDO_controller.getView().getModel("i18n").getResourceBundle().getText("Toyota_Disclaimer");
			CDO_controller.getView().byId("tACompareDisclaimer").setText(disclaimerT);
				
				
				

			} else {
				
			var disclaimerL= CDO_controller.getView().getModel("i18n").getResourceBundle().getText("Lexus_Disclaimer");
			CDO_controller.getView().byId("tACompareDisclaimer").setText(disclaimerL);
			}
			if (len == 2) {
				this.getView().byId("idTbl_compare2vehicles").setVisible(true);
				this.getView().byId("idTbl_compare3vehicles").setVisible(false);
				this.getView().byId("idTbl_compare4vehicles").setVisible(false);
				this.getView().byId("idTbl_compare5vehicles").setVisible(false);
				stateSwitch = this.getView().byId("stdFeatSwitchId2");
				//	this.getView().byId("hboxCompare").addStyleClass("paddingleft1");
			} else if (len == 3) {
				this.getView().byId("idTbl_compare3vehicles").setVisible(true);
				this.getView().byId("idTbl_compare2vehicles").setVisible(false);
				this.getView().byId("idTbl_compare4vehicles").setVisible(false);
				this.getView().byId("idTbl_compare5vehicles").setVisible(false);
				stateSwitch = this.getView().byId("stdFeatSwitchId3");
				//	this.getView().byId("hboxCompare").addStyleClass("paddingleft2");
			} else if (len == 4) {
				this.getView().byId("idTbl_compare4vehicles").setVisible(true);
				this.getView().byId("idTbl_compare3vehicles").setVisible(false);
				this.getView().byId("idTbl_compare2vehicles").setVisible(false);
				this.getView().byId("idTbl_compare5vehicles").setVisible(false);
				stateSwitch = this.getView().byId("stdFeatSwitchId4");
				//	this.getView().byId("hboxCompare").addStyleClass("paddingleft3");
			} else if (len == 5) {
				this.getView().byId("idTbl_compare5vehicles").setVisible(true);
				this.getView().byId("idTbl_compare3vehicles").setVisible(false);
				this.getView().byId("idTbl_compare4vehicles").setVisible(false);
				this.getView().byId("idTbl_compare2vehicles").setVisible(false);
				stateSwitch = this.getView().byId("stdFeatSwitchId5");
				//	this.getView().byId("hboxCompare").addStyleClass("paddingleft4");
			}
			if (parseArg[0].model !== "") {
				/*	if (parseArg[0].model !== "[]") {
						newModelStr = "Model eq '" +parseArg[0].model;
					} else {*/
				var parseModelPathArg = JSON.parse(parseArg[0].model);
				var lenModel = parseModelPathArg.length;
				var jsonModel = JSON.parse(parseArg[0].model);
				for (var i = 0; i < lenModel; i++) {
					modelText[i] = jsonModel[i];
					var modelText2 = "Model eq '" + modelText[i] + "'";
					modelArr.push(modelText2);
				}
				modelDescString = modelArr.toString();
				newModelStr = modelDescString.replace(/,/g, ' or ');
				/*	}*/
			} else {
				modelDescString = "";
				newModelStr = "";
			}

			if (parseArg[0].suffixDD !== "") {
				/*console.log(parseArg[0].suffix);
				if (parseArg[0].suffix !== "[]") {
					newSuffixStr = "Suffix eq '" +parseArg[0].suffix;
				} else {*/
				var parseSuffixPathArg = JSON.parse(parseArg[0].suffixDD);
				var lenSuffix = parseSuffixPathArg.length;
				var jsonSuffixDD = JSON.parse(parseArg[0].suffixDD);
				for (var j = 0; j < lenSuffix; j++) {
					suffixText[j] = jsonSuffixDD[j];
					var suffixText2 = "Suffix eq '" + suffixText[j] + "'";
					suffixArr.push(suffixText2);
				}
				suffixDescString = suffixArr.toString();
				newSuffixStr = suffixDescString.replace(/,/g, ' or ');
				/*	}*/
			} else {
				suffixDescString = "";
				newSuffixStr = "";
			}
			/*	if (parseArg[0].veh !== "") {
					var parseVehPathArg = JSON.parse(parseArg[0].veh);
					var lenVeh = parseVehPathArg.length;
					var jsonVeh = JSON.parse(parseArg[0].veh);
					for (var i = 0; i < lenVeh; i++) {
						vehText[i] = jsonVeh[i];
						var vehNum = i + 1;
						var vehText2 = "IN_Vehicle" + vehNum + " eq '" + vehText[i] + "'";
						vehArr.push(vehText2);
					}
					vehDescString = vehArr.toString();
					newVehStr = vehDescString.replace(/,/g, ' and ');

				} else {
					vehDescString = "";
					newVehStr = "";
				}*/
			if (parseArg[0].suffix !== "" && parseArg[0].veh !== "") {
				var parseVehPathArg = JSON.parse(parseArg[0].veh);
				var lenVeh = parseVehPathArg.length;
				var jsonVeh = JSON.parse(parseArg[0].veh);
				var jsonSuffix = JSON.parse(parseArg[0].suffix);
				//var jsonSuffixVeh = JSON.parse(parseArg[0].suffix);
				for (var i = 0; i < lenVeh; i++) {
					suffixText[i] = jsonSuffix[i];
					//	suffixTextVeh[i] = jsonSuffixVeh[i];
					vehText[i] = jsonVeh[i];
					var vehNum = i + 1;
					var vehText2 = "IN_Vehicle" + vehNum + " eq '" + vehText[i] + suffixText[i] + "'";
					vehArr.push(vehText2);
				}
				vehDescString = vehArr.toString();
				newVehStr = vehDescString.replace(/,/g, ' and ');
			} else {
				vehDescString = "";
				newVehStr = "";
			}
			var host = CDO_controller.host();
			var url2 = "";
			if (modelDescString == "" && suffixDescString !== "") {
				console.log("1");
				url2 = host +
					"/Z_VEHICLE_CATALOGUE_SRV/ZC_TABLE_DATA_LOADSet?$filter=(User eq  '" + CDO_controller.user + "' and Brand eq  '" + brandCBVal +
					" ' and TCISeries eq  '" + seriesCBVal +
					"' and (" + newSuffixStr + ") and Modelyear eq  '" + modelYearCBVal + " 'and Language eq '" + CDO_controller.language + "')";
			} else if (suffixDescString == "" && modelDescString !== "") {
				console.log("2");
				url2 = host +
					"/Z_VEHICLE_CATALOGUE_SRV/ZC_TABLE_DATA_LOADSet?$filter=(User eq  '" + CDO_controller.user + "' and Brand eq  '" + brandCBVal +
					" ' and TCISeries eq  '" + seriesCBVal +
					" ' and Modelyear eq  '" + modelYearCBVal + " 'and (" + newModelStr + ") and Language eq '" + CDO_controller.language + "')";
			} else if (suffixDescString == "" && modelDescString == "") {
				console.log("3");
				url2 = host +
					"/Z_VEHICLE_CATALOGUE_SRV/ZC_TABLE_DATA_LOADSet?$filter=(User eq  '" + CDO_controller.user + "' and Brand eq  '" + brandCBVal +
					" ' and TCISeries eq  '" + seriesCBVal +
					" ' and Modelyear eq  '" + modelYearCBVal + " 'and Language eq '" + CDO_controller.language + "')";
			} else {
				console.log("4");
				url2 = host +
					"/Z_VEHICLE_CATALOGUE_SRV/ZC_TABLE_DATA_LOADSet?$filter=(User eq  '" + CDO_controller.user + "' and Brand eq  '" + brandCBVal +
					" ' and TCISeries eq  '" + seriesCBVal +
					" ' and Modelyear eq  '" + modelYearCBVal + " ' and (" + newModelStr + ") and (" + newSuffixStr + ") and Language eq '" +
					CDO_controller.language + "')";
			}
			$.ajax({
				url: url2,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					var tblModel = new sap.ui.model.json.JSONModel(data.d.results);
					CDO_controller.getView().setModel(tblModel, "searchTblModel");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					var errMsg = CDO_controller.getView().getModel("i18n").getResourceBundle().getText("Error1");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error",
						sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
			if (newVehStr !== "") {
				var urlTable = host +
					"/Z_VEHICLE_CATALOGUE_SRV/ZC_VOAS_COMP_HEADERSet?$filter= (User eq  '" + CDO_controller.user + "' and " + newVehStr +
					" and Language eq '" + CDO_controller.language +
					"') &$expand=ZCVOASDEEP";
				//IN_Vehicle1 eq '2019Camry SEAM' and IN_Vehicle2 eq '2019Camry LEAM' )&$expand=ZCVOASDEEP";
				//	"/Z_VEHICLE_CATALOGUE_SRV/ZC_VOAS_COMP_HEADERSet?$filter=(IN_Vehicle1 eq '2018Camry SEA' and IN_Vehicle2 eq '2018Camry LEA' )&$expand=ZCVOASDEEP";

				$.ajax({
					url: urlTable,
					method: 'GET',
					async: false,
					dataType: 'json',
					success: function (data, textStatus, jqXHR) {
						var tblModel = new sap.ui.model.json.JSONModel(data.d.results);
						CDO_controller.getView().setModel(tblModel, "TblModel");
					},
					error: function (jqXHR, textStatus, errorThrown) {
						var errMsg = CDO_controller.getView().getModel("i18n").getResourceBundle().getText("Error1");
						sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error",
							sap.m.MessageBox.Action.OK, null, null);
					}
				});
			}

			if (CDO_controller.getView().getModel("searchTblModel")) {
				empData = CDO_controller.getView().getModel("searchTblModel").getData();
				var modLen = empData.length;
				for (var i = 0; i < len; i++) {
					for (var k = 0; k < modLen; k++) {
						if (parsePathArg[i] == k) {
							var colname = empData[k].ENModelDesc + "  - SFX " + empData[k].Suffix;
							var colname2 = empData[k].ENModelDesc;
							//	aColumnData.push(empData[k]);
							aColumnData.push({
								Vehicle: colname
							});
							aColumnDataCol.push({
								Vehicle: colname2
							});
							arrNewData.push(empData[k]);
							break;
						}
					}
				}
				console.log(aColumnData);
				var nModel = new sap.ui.model.json.JSONModel();
				nModel.setData(arrNewData);
				console.log(arrNewData);
				CDO_controller.getView().setModel(nModel, "compareModel");
				sap.ui.getCore().setModel(nModel, "compareModel");
				console.log(CDO_controller.getView().getModel("compareModel"));
				console.log(sap.ui.getCore().getModel("compareModel").getData())
					//var compData=CDO_controller.getView().getModel("compareModel").getData();
					//sap.ui.getCore().getModel().setProperty("/compareModelData",compData)

				if (CDO_controller.getView().getModel("TblModel")) {
					var dat = CDO_controller.getView().getModel("TblModel").getData();
					var dtExt = "",
						dtInt = "",
						dtPwr = "",
						dtSaf = "",
						dtInfo = "",
						dtCol = "",
						dtDim = "",
						dtOpt = "",
						dtApx = "";

					for (var j = 0; j < dat.length; j++) {
						if (dat[j].Super_catgy == "EXTERIOR") {
							dtExt = dat[j].ZCVOASDEEP.results;
						}
						if (dat[j].Super_catgy == "INTERIOR") {
							dtInt = dat[j].ZCVOASDEEP.results;
						}
						if (dat[j].Super_catgy == "POWERTRAIN/MECHANICAL") {
							dtPwr = dat[j].ZCVOASDEEP.results;
						}
						if (dat[j].Super_catgy == "SAFETY/CONVENIENCE") {
							dtSaf = dat[j].ZCVOASDEEP.results;
						}
						if (dat[j].Super_catgy == "INFOTAINMENT") {
							dtInfo = dat[j].ZCVOASDEEP.results;
						}
						if (dat[j].Super_catgy == "COLOR OPTIONS") {
							dtCol = dat[j].ZCVOASDEEP.results;
						}
						if (dat[j].Super_catgy == "DIMENSIONS & SPECS") {
							dtDim = dat[j].ZCVOASDEEP.results;
						}
						if (dat[j].Super_catgy == "APX") {
							dtApx = dat[j].ZCVOASDEEP.results;
						}
						if (dat[j].Super_catgy == "OPTION PACKAGES") {
							dtOpt = dat[j].ZCVOASDEEP.results;
						}

					}

					var dataExterior = [];
					for (var i = 0; i < dtExt.length; i++) {

						dataExterior.push({
							"Category_en": dtExt[i].Cust_fac_desc_en, //dtExt[i].Category_en,
							"Cust_fac_desc_en": "", //dtExt[i].Cust_fac_desc_en,
							"Vehicle1": dtExt[i].Vehicle1,
							"Vehicle2": dtExt[i].Vehicle2,
							"Vehicle3": dtExt[i].Vehicle3,
							"Vehicle4": dtExt[i].Vehicle4,
							"Vehicle5": dtExt[i].Vehicle5
						});
					}
					var dataInterior = [];
					for (var i = 0; i < dtInt.length; i++) {
						dataInterior.push({
							"Category_en": dtInt[i].Cust_fac_desc_en, //dtInt[i].Category_en,
							"Cust_fac_desc_en": "", //dtInt[i].Cust_fac_desc_en,
							"Vehicle1": dtInt[i].Vehicle1,
							"Vehicle2": dtInt[i].Vehicle2,
							"Vehicle3": dtInt[i].Vehicle3,
							"Vehicle4": dtInt[i].Vehicle4,
							"Vehicle5": dtInt[i].Vehicle5
						});
					}
					var dataInfo = [];
					for (var i = 0; i < dtInfo.length; i++) {
						dataInfo.push({
							"Category_en": dtInfo[i].Cust_fac_desc_en, //dtInfo[i].Category_en,
							"Cust_fac_desc_en": "", //dtInfo[i].Cust_fac_desc_en,
							"Vehicle1": dtInfo[i].Vehicle1,
							"Vehicle2": dtInfo[i].Vehicle2,
							"Vehicle3": dtInfo[i].Vehicle3,
							"Vehicle4": dtInfo[i].Vehicle4,
							"Vehicle5": dtInfo[i].Vehicle5
						});
					}
					var dataPwr = [];
					for (var i = 0; i < dtPwr.length; i++) {
						dataPwr.push({
							"Category_en": dtPwr[i].Cust_fac_desc_en, //dtPwr[i].Category_en, 
							"Cust_fac_desc_en": "", //dtPwr[i].Cust_fac_desc_en,
							"Vehicle1": dtPwr[i].Vehicle1,
							"Vehicle2": dtPwr[i].Vehicle2,
							"Vehicle3": dtPwr[i].Vehicle3,
							"Vehicle4": dtPwr[i].Vehicle4,
							"Vehicle5": dtPwr[i].Vehicle5
						});
					}
					var dataSafety = [];
					for (var i = 0; i < dtSaf.length; i++) {
						dataSafety.push({
							"Category_en": dtSaf[i].Cust_fac_desc_en, //dtSaf[i].Category_en,
							"Cust_fac_desc_en": "", //dtSaf[i].Cust_fac_desc_en,
							"Vehicle1": dtSaf[i].Vehicle1,
							"Vehicle2": dtSaf[i].Vehicle2,
							"Vehicle3": dtSaf[i].Vehicle3,
							"Vehicle4": dtSaf[i].Vehicle4,
							"Vehicle5": dtSaf[i].Vehicle5
						});
					}

					var dataColour = [];

					for (var i = 0; i < dtCol.length; i++) {
						var msrp = [],
							net = [];
						if (dtCol[i].MSRP != undefined && dtCol[i].MSRP != null && !isNaN(dtCol[i].MSRP) && dtCol[i].MSRP != "") {
							msrp[i] = "$" + parseInt(dtCol[i].MSRP);
						} else {
							msrp[i] = "";
						}
						if (dtCol[i].NETPRICE != undefined && dtCol[i].NETPRICE != null && !isNaN(dtCol[i].NETPRICE) && dtCol[i].NETPRICE != "") {
							net[i] = "$" + parseInt(dtCol[i].NETPRICE);
						} else {
							net[i] = "";
						}
						var msrpF = CDO_controller.getView().getModel("i18n").getResourceBundle().getText("MSRPWithoutDoll");
						var netPriceF = CDO_controller.getView().getModel("i18n").getResourceBundle().getText("DealerNetWithoutDoll");
						dataColour.push({
							"Category_en": dtCol[i].EXT + "-" + dtCol[i].EXT_DESC + "\n" + dtCol[i].INT_DESC,
							"Cust_fac_desc_en": msrpF + msrp[i] + "\n" + netPriceF + net[i],
							"Vehicle1": dtCol[i].Vehicle1,
							"Vehicle2": dtCol[i].Vehicle2,
							"Vehicle3": dtCol[i].Vehicle3,
							"Vehicle4": dtCol[i].Vehicle4,
							"Vehicle5": dtCol[i].Vehicle5
						});
					}
					var dataDim = [];
					for (var i = 0; i < dtDim.length; i++) {
						dataDim.push({
							"Category_en": dtDim[i].Dimensions,
							"Cust_fac_desc_en": " ",
							"Vehicle1": dtDim[i].Vehicle1,
							"Vehicle2": dtDim[i].Vehicle2,
							"Vehicle3": dtDim[i].Vehicle3,
							"Vehicle4": dtDim[i].Vehicle4,
							"Vehicle5": dtDim[i].Vehicle5
						});
					}
					/*	var dataOpt = [];
						for (var i = 0; i < dtOpt.length; i++) {
							dataOpt.push({
								"Vehicle1": dtOpt[i].Vehicle1,
								"optPack": dtOpt[i].OptionPackages
							});
						}*/
					var dataApx = [];
					for (var i = 0; i < dtApx.length; i++) {
						var msrp = [],
							net = [];
						if (dtApx[i].MSRP != undefined && dtApx[i].MSRP != null && !isNaN(dtApx[i].MSRP) && dtApx[i].MSRP != "") {
							msrp[i] = "$" + parseInt(dtApx[i].MSRP);
						} else {
							msrp[i] = "";
						}
						if (dtApx[i].NETPRICE != undefined && dtApx[i].NETPRICE != null && !isNaN(dtApx[i].NETPRICE) && dtApx[i].NETPRICE != "") {
							net[i] = "$" + parseInt(dtApx[i].NETPRICE);
						} else {
							net[i] = "";
						}
						var msrpF = CDO_controller.getView().getModel("i18n").getResourceBundle().getText("MSRPWithoutDoll");
						var netPriceF = CDO_controller.getView().getModel("i18n").getResourceBundle().getText("DealerNetWithoutDoll");
						var dtApxDesc = [];
						dtApxDesc[i] = CDO_controller.formatFeatures(dtApx[i].INT_DESC);
						dataApx.push({
							"Category_en": dtApx[i].APX, //+ "\n" + dtApxDesc[i], //+ "\n"+msrpF + msrp[i] + "\n"+ netPriceF+ net[i],
							"Cust_fac_desc_en": "", //dtApx[i].INT_DESC,
							"Vehicle1": dtApx[i].Vehicle1,
							"Vehicle2": dtApx[i].Vehicle2,
							"Vehicle3": dtApx[i].Vehicle3,
							"Vehicle4": dtApx[i].Vehicle4,
							"Vehicle5": dtApx[i].Vehicle5
						});
					}

					var dataApx1 = [];
					for (var i = 0; i < dtApx.length; i++) {
						var msrp = [],
							net = [];
						if (dtApx[i].MSRP != undefined && dtApx[i].MSRP != null && !isNaN(dtApx[i].MSRP) && dtApx[i].MSRP != "") {
							msrp[i] = "$" + parseInt(dtApx[i].MSRP);
						} else {
							msrp[i] = "";
						}
						if (dtApx[i].NETPRICE != undefined && dtApx[i].NETPRICE != null && !isNaN(dtApx[i].NETPRICE) && dtApx[i].NETPRICE != "") {
							net[i] = "$" + parseInt(dtApx[i].NETPRICE);
						} else {
							net[i] = "";
						}
						var msrpF = CDO_controller.getView().getModel("i18n").getResourceBundle().getText("MSRPWithoutDoll");
						var netPriceF = CDO_controller.getView().getModel("i18n").getResourceBundle().getText("DealerNetWithoutDoll");
						var dtApxDesc = [];
						var dtApxDesc2 = [];
						dtApxDesc[i] = CDO_controller.formatFeatures(dtApx[i].INT_DESC);
						dtApxDesc2[i] = CDO_controller.formatFeatures1(dtApx[i].INT_DESC);
						dataApx1.push({
							"Category_en": dtApx[i].APX + "\n" + msrpF + msrp[i] + "\n" + netPriceF + net[i],
							//dtApx[i].APX + "\n" + dtApxDesc + "\n" + msrpF + msrp[i] + "\n" + netPriceF + net[i],
							"Cust_fac_desc_en": dtApxDesc[i],//"", //dtApx[i].INT_DESC,
							"Vehicle1": dtApxDesc2[i], //dtApx[i].INT_DESC, //dtApx[i].Vehicle1,
							"Vehicle2": "",//dtApxDesc2[i], //dtApx[i].INT_DESC,//dtApx[i].Vehicle2
							"Vehicle3": dtApx[i].Vehicle3,
							"Vehicle4": dtApx[i].Vehicle4,
							"Vehicle5": dtApx[i].Vehicle5
						});
					}

					var tblModelExt = new sap.ui.model.json.JSONModel();
					tblModelExt.setData({
						columns: aColumnData,
						rows: dataExterior
					});
					var tblModelInt = new sap.ui.model.json.JSONModel();
					tblModelInt.setData({
						columns: aColumnData,
						rows: dataInterior
					});
					var tblModelPwr = new sap.ui.model.json.JSONModel();
					tblModelPwr.setData({
						columns: aColumnData,
						rows: dataPwr
					});
					var tblModelInfo = new sap.ui.model.json.JSONModel();
					tblModelInfo.setData({
						columns: aColumnData,
						rows: dataInfo
					});
					var tblModelSaf = new sap.ui.model.json.JSONModel();
					tblModelSaf.setData({
						columns: aColumnData,
						rows: dataSafety
					});

					var tblModelCol = new sap.ui.model.json.JSONModel();
					tblModelCol.setData({
						columns: aColumnData,
						rows: dataColour
					});
					var tblModelOpt = new sap.ui.model.json.JSONModel(dtOpt);
					CDO_controller.getView().setModel(tblModelOpt, "tblModelOpt");
					/*	tblModelOpt.setData({
							columns: aColumnDataOpt,
							rows: dataOpt
						});*/
					var tblModelDim = new sap.ui.model.json.JSONModel();
					tblModelDim.setData({
						columns: aColumnData,
						rows: dataDim
					});
					var tblModelApx = new sap.ui.model.json.JSONModel();
					tblModelApx.setData({
						columns: aColumnData,
						rows: dataApx
					});
					var tblModelApx1 = new sap.ui.model.json.JSONModel();
					tblModelApx1.setData({
						columns: emptydata,
						rows: dataApx1
					});

					var tblExterior = CDO_controller.getView().byId("tblExterior");
					tblExterior.setModel(tblModelExt);
					tblExterior.bindAggregation("columns", "/columns", function (index, context) {
						return new sap.m.Column({
							header: new sap.m.Label({
								text: context.getObject().Vehicle
							}),
						});
					});

					tblExterior.bindItems("/rows", function (index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem();

						for (var k in obj) {
							if (obj[k] == "Y") {
								row.addCell(
									new sap.m.HBox({
										items: [new sap.m.Text({
											text: " ",
										}).addStyleClass("padding"), new sap.ui.core.Icon({
											src: "sap-icon://accept",
											color: "black"
										})]
									})
								);
							} else {
								row.addCell(
									new sap.m.Text({
										text: obj[k]
									})
								);
							}
						}
						return row;
					});

					var tblInterior = CDO_controller.getView().byId("tblInterior");
					tblInterior.setModel(tblModelInt);
					tblInterior.bindAggregation("columns", "/columns", function (index, context) {
						return new sap.m.Column({
							header: new sap.m.Label({
								text: context.getObject().Vehicle
							}),
						});
					});
					tblInterior.bindItems("/rows", function (index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem(); //obj[k]
						for (var k in obj) {
							if (obj[k] == "Y") {
								row.addCell(
									new sap.m.HBox({
										items: [new sap.m.Text({
											text: " ",
										}).addStyleClass("padding"), new sap.ui.core.Icon({
											src: "sap-icon://accept",
											color: "black"
										})]
									})
								);
							} else {
								row.addCell(
									new sap.m.Text({
										text: obj[k]
									})
								);
							}
						}
						return row;
					});

					var tblPowertrain = CDO_controller.getView().byId("pwrTrn");
					tblPowertrain.setModel(tblModelPwr);
					tblPowertrain.bindAggregation("columns", "/columns", function (index, context) {

						return new sap.m.Column({
							header: new sap.m.Label({
								text: context.getObject().Vehicle
							}),
						});
					});
					tblPowertrain.bindItems("/rows", function (index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem();
						for (var k in obj) {
							if (obj[k] == "Y") {
								row.addCell(
									new sap.m.HBox({
										items: [new sap.m.Text({
											text: " ",
										}).addStyleClass("padding"), new sap.ui.core.Icon({
											src: "sap-icon://accept",
											color: "black"
										})]
									})
								);
							} else {
								row.addCell(
									new sap.m.Text({
										text: obj[k]
									})
								);
							}
						}
						return row;
					});
					var tblSafety = CDO_controller.getView().byId("tblSafety");
					tblSafety.setModel(tblModelSaf);
					tblSafety.bindAggregation("columns", "/columns", function (index, context) {
						return new sap.m.Column({
							header: new sap.m.Label({
								text: context.getObject().Vehicle
							}),
						});
					});
					tblSafety.bindItems("/rows", function (index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem();
						for (var k in obj) {
							if (obj[k] == "Y") {
								row.addCell(
									new sap.m.HBox({
										items: [new sap.m.Text({
											text: " ",
										}).addStyleClass("padding"), new sap.ui.core.Icon({
											src: "sap-icon://accept",
											color: "black"
										})]
									})
								);
							} else {
								row.addCell(
									new sap.m.Text({
										text: obj[k]
									})
								);
							}
						}
						return row;
					});
					var tblInfotainment = CDO_controller.getView().byId("tblInfotainment");
					tblInfotainment.setModel(tblModelInfo);
					tblInfotainment.bindAggregation("columns", "/columns", function (index, context) {
						return new sap.m.Column({
							header: new sap.m.Label({
								text: context.getObject().Vehicle
							}),
						});
					});
					tblInfotainment.bindItems("/rows", function (index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem();
						for (var k in obj) {
							if (obj[k] == "Y") {
								row.addCell(
									new sap.m.HBox({
										items: [new sap.m.Text({
											text: " ",
										}).addStyleClass("padding"), new sap.ui.core.Icon({
											src: "sap-icon://accept",
											color: "black"
										})]
									})
								);
							} else {
								row.addCell(
									new sap.m.Text({
										text: obj[k]
									})
								);
							}
						}
						return row;
					});
					var tblColorOptions = CDO_controller.getView().byId("tblColorOptions");
					tblColorOptions.setModel(tblModelCol);
					tblColorOptions.bindAggregation("columns", "/columns", function (index, context) {
						return new sap.m.Column({
							header: new sap.m.Label({
								text: context.getObject().Vehicle
							}),
						});
					});
					tblColorOptions.bindItems("/rows", function (index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem();
						for (var k in obj) {
							if (obj[k] == "Y") {
								row.addCell(
									new sap.m.HBox({
										items: [new sap.m.Text({
											text: " ",
										}).addStyleClass("padding"), new sap.ui.core.Icon({
											src: "sap-icon://accept",
											color: "black"
										})]
									})
								);
							} else {
								row.addCell(
									new sap.m.Text({
										text: obj[k]
									})
								);
							}
						}
						return row;
					});
					var tblDimensions = CDO_controller.getView().byId("tblDimensions");
					tblDimensions.setModel(tblModelDim);
					tblDimensions.bindAggregation("columns", "/columns", function (index, context) {
						return new sap.m.Column({
							header: new sap.m.Label({
								text: context.getObject().Vehicle
							}),
						});
					});
					tblDimensions.bindItems("/rows", function (index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem();
						for (var k in obj) {
							if (obj[k] == "Y") {
								row.addCell(
									new sap.m.HBox({
										items: [new sap.m.Text({
											text: " ",
										}).addStyleClass("padding"), new sap.ui.core.Icon({
											src: "sap-icon://accept",
											color: "black"
										})]
									})
								);
							} else {
								row.addCell(
									new sap.m.Text({
										text: obj[k]
									})
								);
							}
						}
						return row;
					});
					var tblOptionPack = CDO_controller.getView().byId("tblOptionPackStat");
					tblOptionPack.setModel("tblModelOpt");

					/*	tblOptionPack.setModel(tblModelOpt);
					tblOptionPack.bindAggregation("columns", "/columns", function (index, context) {
						return new sap.m.Column({
							header: new sap.m.Label({
								text: context.getObject().Vehicle
							}),
						});
					});
					tblOptionPack.bindItems("/rows", function (index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem();
						for (var k in obj) {
							row.addCell(new sap.m.Text({
								text: obj[k]
							}));
						}
						return row;
					});*/
					var tblAPX1 = CDO_controller.getView().byId("tblAPX1");
					tblAPX1.setModel(tblModelApx1);
					tblAPX1.bindAggregation("columns", "/columns", function (index, context) {
						return new sap.m.Column({
							header: new sap.m.Label({
								text: context.getObject().Vehicle, textAlign: "Center"
							}),
						});
					});
					tblAPX1.bindItems("/rows", function (index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem();
						for (var k in obj) {
							if (obj[k] == "Y") {
								row.addCell(
									new sap.m.HBox({
										items: [new sap.m.Text({
											text: " ",
										}).addStyleClass("padding"), new sap.ui.core.Icon({
											src: "sap-icon://accept",
											color: "black"
										})]
									})
								);
							} else {
								row.addCell(
									new sap.m.Text({
										text: obj[k]
									})
								);
							}
						}
						return row;
					});

					var tblAPX = CDO_controller.getView().byId("tblAPX");
					tblAPX.setModel(tblModelApx);
					tblAPX.bindAggregation("columns", "/columns", function (index, context) {
						return new sap.m.Column({
							header: new sap.m.Label({
								text: context.getObject().Vehicle
							}),
						});
					});
					tblAPX.bindItems("/rows", function (index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem();
						for (var k in obj) {
							if (obj[k] == "Y") {
								row.addCell(
									new sap.m.HBox({
										items: [new sap.m.Text({
											text: " ",
										}).addStyleClass("padding"), new sap.ui.core.Icon({
											src: "sap-icon://accept",
											color: "black"
										})]
									})
								);
							} else {
								row.addCell(
									new sap.m.Text({
										text: obj[k]
									})
								);
							}
						}
						return row;
					});
				}
			}
		},

		_onFioriObjectPageHeaderPress: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			var oQueryParams = CDO_controller.getQueryParameters(window.location);

			if (sPreviousHash !== undefined || oQueryParams.navBackToLaunchpad) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(CDO_controller);
				oRouter.navTo("default", true);
			}

		},
		getQueryParameters: function (oLocation) {
			var oQuery = {};
			var aParams = oLocation.search.substring(1).split("&");
			for (var i = 0; i < aParams.length; i++) {
				var aPair = aParams[i].split("=");
				oQuery[aPair[0]] = decodeURIComponent(aPair[1]);
			}
			return oQuery;

		},
		_onCreateVehGuide: function () {

			var sDialogName = "CreateVehicleGuideDialog";
			CDO_controller.mDialogs = CDO_controller.mDialogs || {};
			var oDialog = CDO_controller.mDialogs[sDialogName];

			//	if (!oDialog) {
			oDialog = new CreateVehicleGuideDialog(CDO_controller.getView());
			CDO_controller.mDialogs[sDialogName] = oDialog;
			oDialog.setRouter(CDO_controller.oRouter);
			//	}
			oDialog.open();

		},
		_onCreateWhatsNew: function () {
			var sDialogName = "CreateWhatsNewDialog";
			CDO_controller.mDialogs = CDO_controller.mDialogs || {};
			var oDialog = CDO_controller.mDialogs[sDialogName];

			//	if (!oDialog) {
			oDialog = new CreateWhatsNewDialog(CDO_controller.getView());
			CDO_controller.mDialogs[sDialogName] = oDialog;

			// For navigation.
			oDialog.setRouter(CDO_controller.oRouter);
			//	}
			oDialog.open();
		},
		_onCreateWalkUp: function () {

			var sDialogName = "CreateWalkUpGuide";
			CDO_controller.mDialogs = CDO_controller.mDialogs || {};
			var oDialog = CDO_controller.mDialogs[sDialogName];

			//	if (!oDialog) {
			oDialog = new CreateWalkUpGuide(CDO_controller.getView());
			CDO_controller.mDialogs[sDialogName] = oDialog;

			// For navigation.
			oDialog.setRouter(CDO_controller.oRouter);
			//	}
			oDialog.open();
		},
		_onCreateSupplemental: function () {
			var sDialogName = "CreateSupplementalGuide";
			CDO_controller.mDialogs = CDO_controller.mDialogs || {};
			var oDialog = CDO_controller.mDialogs[sDialogName];

			//	if (!oDialog) {
			oDialog = new CreateSupplementalGuide(CDO_controller.getView());
			CDO_controller.mDialogs[sDialogName] = oDialog;

			// For navigation.
			oDialog.setRouter(CDO_controller.oRouter);
			//	}
			oDialog.open();

		},
		_onCreatePocSum: function () {
			var sDialogName = "CreatePocketSummaryDialog";
			CDO_controller.mDialogs = CDO_controller.mDialogs || {};
			var oDialog = CDO_controller.mDialogs[sDialogName];
			//	if (!oDialog) {
			oDialog = new CreatePocketSummaryDialog(CDO_controller.getView());
			CDO_controller.mDialogs[sDialogName] = oDialog;
			oDialog.setRouter(CDO_controller.oRouter);
			//	}
			oDialog.open();
		},
		onExit: function () {

			var aControls = [{
				"controlId": "Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-2-sectionContent-Fiori_ObjectPage_Table-1-wnw808wyovfxodem91vmf5035_S5",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1538676529951-sectionContent-Fiori_ObjectPage_Table-1-wnw808wyovfxodem91vmf5035_S5",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1538676692578-sectionContent-Fiori_ObjectPage_Table-1539290746962-wnw808wyovfxodem91vmf5035_S5",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1538676734294-sectionContent-Fiori_ObjectPage_Table-1539290840643-wnw808wyovfxodem91vmf5035_S5",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1538676763485-sectionContent-Fiori_ObjectPage_Table-1539291072034-wnw808wyovfxodem91vmf5035_S5",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1538676754780-sectionContent-Fiori_ObjectPage_Table-1539291098748-wnw808wyovfxodem91vmf5035_S5",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1538676721284-sectionContent-Fiori_ObjectPage_Table-1539291137618-wnw808wyovfxodem91vmf5035_S5",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1538676747847-sectionContent-Fiori_ObjectPage_Table-1539291122586-wnw808wyovfxodem91vmf5035_S5",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ObjectPage_ObjectPage_0-wnw808wyovfxodem91vmf5035_S5-sections-Fiori_ObjectPage_Section-1539785895331-sectionContent-Fiori_ObjectPage_Table-1",
				"groups": ["items"]
			}];
			for (var i = 0; i < aControls.length; i++) {
				var oControl = CDO_controller.getView().byId(aControls[i].controlId);
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