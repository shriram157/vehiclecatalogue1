sap.ui.define(["com/sap/build/toyota-canada/vehiclesGuideV3/controller/BaseController",
	"./util/CreateVehicleGuideDialog", "./util/CreatePocketSummaryDialog",
	"./util/SuplementalDialog", "./util/WalkupDialog", "./util/CreateWhatsNewDialog",
	"./util/utilities", "./util/CreateWalkUpGuide", "./util/CreateSupplementalGuide",
	"sap/ui/core/routing/History", "sap/ui/model/json/JSONModel", "com/sap/build/toyota-canada/vehiclesGuideV3/Formatter/formatter"
], function (BaseController, CreateVehicleGuideDialog, CreatePocketSummaryDialog, SuplementalDialog, WalkupDialog,
	CreateWhatsNewDialog, utilities, CreateWalkUpGuide, CreateSupplementalGuide, History, JSONModel, formatter) {
	"use strict";
	var searchController;
	return BaseController.extend("com.sap.build.toyota-canada.vehiclesGuideV3.controller.SearchPage", {
		formatter: formatter,
		onInit: function () {
			searchController = this;
			searchController.oRouter = sap.ui.core.UIComponent.getRouterFor(searchController);
			searchController.oRouter.getTarget("SearchPage").attachDisplay(jQuery.proxy(searchController.handleRouteMatched, searchController));
			searchController.listOfBrand();
			searchController.listOfModelYear();
			//	searchController._listOfBrand();
			searchController.oBusyDialog = new sap.m.BusyDialog({
				showCancelButton: false
			});
		},
	
		refreshTableData: function () {
			var oModel = searchController.getView().getModel("searchTblModel");
			if (oModel !== undefined) {
				var arr = [];
				oModel.setData(arr);
				searchController.getView().byId("idTbl_Search").setModel(oModel);
			}
		},
		pressGo: function () {
			searchController.oBusyDialog.open();
			setTimeout(function () {
				var brandCB = searchController.getView().byId("id_brandCB");
				var modelYearCB = searchController.getView().byId("id_modelYearCB");
				var seriesCB = searchController.getView().byId("id_seriesCB");
				var modelCB = searchController.getView().byId("id_modelCB");
				var suffixCB = searchController.getView().byId("id_suffixCB");
				var modelArr = [];
				var newModelStr = "";
				var modelText = [];
				var modelDescString = "";
				var suffixArr = [];
				var newSuffixStr = "";
				var suffixText = [];
				var suffixDescString;
				var brandCBVal = brandCB.getValue();
				var modelYearCBVal = modelYearCB.getValue();
				var seriesCBVal = seriesCB.getValue();
				var modelValLen = modelCB.getSelectedItems().length;

				if (modelCB.getSelectedItems() != "") {
					for (var i = 0; i < modelValLen; i++) {
						modelText[i] = modelCB.getSelectedItems()[i].mProperties.text;
						var modelText2 = "Model eq '" + modelText[i] + "'";
						modelArr.push(modelText2);
					}
					modelDescString = modelArr.toString();
					newModelStr = modelDescString.replace(/,/g, ' or ');

				} else {
					modelDescString = "";
					newModelStr = "";
				}
				var suffixValLen = suffixCB.getSelectedItems().length;
				if (suffixCB.getSelectedItems() != "") {
					for (var j = 0; j < suffixValLen; j++) {
						suffixText[i] = suffixCB.getSelectedItems()[j].mProperties.text;
						var suffixText2 = "Suffix eq '" + suffixText[i] + "'";
						suffixArr.push(suffixText2);
					}
					suffixDescString = suffixArr.toString();
					newSuffixStr = suffixDescString.replace(/,/g, ' or ');
				} else {
					suffixDescString = "";
					newSuffixStr = "";
				}
				var host = searchController.host();
				var url2 = "";
				if (modelDescString == "" && suffixDescString !== "") {
					console.log("1");
					url2 = host +
						"/Z_VEHICLE_CATALOGUE_SRV/ZC_TABLE_DATA_LOADSet?$filter=(Brand eq  '" + brandCBVal + " ' and TCISeries eq  '" + seriesCBVal +
						"' and (" + newSuffixStr + ") and Modelyear eq  '" + modelYearCBVal + " ')";
				} else if (suffixDescString == "" && modelDescString !== "") {
					console.log("2");
					url2 = host +
						"/Z_VEHICLE_CATALOGUE_SRV/ZC_TABLE_DATA_LOADSet?$filter=(Brand eq  '" + brandCBVal + " ' and TCISeries eq  '" + seriesCBVal +
						" ' and Modelyear eq  '" + modelYearCBVal + " 'and (" + newModelStr + ") )";
				} else if (suffixDescString == "" && modelDescString == "") {
					console.log("3");
					url2 = host +
						"/Z_VEHICLE_CATALOGUE_SRV/ZC_TABLE_DATA_LOADSet?$filter=(Brand eq  '" + brandCBVal + " ' and TCISeries eq  '" + seriesCBVal +
						" ' and Modelyear eq  '" + modelYearCBVal + " ')";
				} else {
					url2 = host +
						"/Z_VEHICLE_CATALOGUE_SRV/ZC_TABLE_DATA_LOADSet?$filter=(Brand eq  '" + brandCBVal + " ' and TCISeries eq  '" + seriesCBVal +
						" ' and Modelyear eq  '" + modelYearCBVal + " ' and (" + newModelStr + ") and (" + newSuffixStr + ") )";
				}
				$.ajax({
					url: url2,
					method: 'GET',
					async: false,
					dataType: 'json',
					success: function (data, textStatus, jqXHR) {
						//var oBusyDialog = this.getView().byId("BusyDialog");

						var tblModel = new sap.ui.model.json.JSONModel(data.d.results);
						tblModel.setSizeLimit(data.d.results.length);
						searchController.getView().setModel(tblModel, "searchTblModel");
						searchController.getView().byId("idTbl_Search").setModel("searchTblModel");
						searchController.oBusyDialog.close();
					},
					error: function (jqXHR, textStatus, errorThrown) {
						searchController.oBusyDialog.close();
						sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR,
							"Error", sap
							.m.MessageBox.Action.OK, null, null);
					}
				});
			}, (1 * 1000));

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
			var modelYearModel = new JSONModel();
			modelYearModel.setData(data);
			searchController.getView().setModel(modelYearModel, "yearModel");
			searchController.getView().byId("id_modelYearCB").setModel("yearModel");
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
			var modelBrandModel = new JSONModel();
			modelBrandModel.setData(data);
			searchController.getView().setModel(modelBrandModel, "brandModel");
			//	searchController.getView().byId("id_brandCB").setModel("brandModel");
		},

		onChange_Brand: function () {
			searchController.getView().byId("filterBar").setShowGoOnFB(false);
			var brandCB = searchController.getView().byId("id_brandCB");
			var modelYearCB = searchController.getView().byId("id_modelYearCB");
			var seriesCB = searchController.getView().byId("id_seriesCB");
			var modelCB = searchController.getView().byId("id_modelCB");
			var suffixCB = searchController.getView().byId("id_suffixCB");
			searchController.refreshTableData();
			modelYearCB.setValue(" ");
			seriesCB.setValue(" ");
			modelCB.setSelectedItems("");
			suffixCB.setSelectedItems("");

			if (brandCB.getValue() != "") {
				modelYearCB.setEnabled(true);
			}

		},
		onChange_ModelYear: function () {
			searchController.getView().byId("filterBar").setShowGoOnFB(false);
			var brandCB = searchController.getView().byId("id_brandCB");
			var modelYearCB = searchController.getView().byId("id_modelYearCB");
			var seriesCB = searchController.getView().byId("id_seriesCB");
			var modelCB = searchController.getView().byId("id_modelCB");
			var suffixCB = searchController.getView().byId("id_suffixCB");

			var brandCBVal = brandCB.getValue();
			var modelYearCBVal = modelYearCB.getValue();
		
			if (seriesCB.getValue() !== "") {
				seriesCB.setValue(" ");
				seriesCB.setSelectedKey(null);
			}
			modelCB.setSelectedItems("");
			suffixCB.setSelectedItems("");
			searchController.refreshTableData();
			if (brandCB.getValue() != "" && modelYearCB.getValue() != "") {
				seriesCB.setEnabled(true);
			}
	
			var host = searchController.host();
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
					if (seriesCB.getValue() !== "") {
						seriesCB.setValue(" ");
						seriesCB.setSelectedKey(null);
					}
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
					searchController.getView().setModel(oModel, "seriesdropDownModel");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},

		onChange_Series: function () {
			var brandCB = searchController.getView().byId("id_brandCB");
			var modelYearCB = searchController.getView().byId("id_modelYearCB");
			var seriesCB = searchController.getView().byId("id_seriesCB");
			var modelCB = searchController.getView().byId("id_modelCB");
			var suffixCB = searchController.getView().byId("id_suffixCB");

			var brandCBVal = brandCB.getValue();
			var modelYearCBVal = modelYearCB.getValue();
			var seriesCBVal = seriesCB.getValue();
			searchController.refreshTableData();
			if (modelCB.getItems()) {
				modelCB.setSelectedItems("");
			}
			if (suffixCB.getItems()) {
				suffixCB.setSelectedItems("");
			}
			if (brandCB.getValue() != "" && modelYearCB.getValue() != "" && seriesCB.getValue() != "") {
				modelCB.setEnabled(true);
			}
			var host = searchController.host();

			searchController.getView().byId("filterBar").setShowGoOnFB(true);
			var url = host +
				"/Z_VEHICLE_CATALOGUE_SRV/ZC_BRAND_MODEL_DETAILSSet?$filter=(Brand eq '" + brandCBVal + "' and Modelyear eq '" + modelYearCBVal +
				"'and TCISeries eq '" + seriesCBVal + "')";
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
							if ($.inArray(data.d.results[i]["ENModelDesc"], arr) < 0) {
								arr[j] = data.d.results[i]["ENModelDesc"];
								j++;

							}
						}
					}
					oModel.setData(arr);
					searchController.getView().setModel(oModel, "dropDownModel");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},

		onChange_Model: function (oEvent) {
			var brandCB = searchController.getView().byId("id_brandCB");
			var modelYearCB = searchController.getView().byId("id_modelYearCB");
			var seriesCB = searchController.getView().byId("id_seriesCB");
			var modelCB = searchController.getView().byId("id_modelCB");
			var suffixCB = searchController.getView().byId("id_suffixCB");

			var modelArr = [];
			var modelDescString;
			var newModelStr = "";
			var modelText = [];
			var brandCBVal = brandCB.getValue();
			var modelYearCBVal = modelYearCB.getValue();
			var seriesCBVal = seriesCB.getValue();
			var modelElemLen = oEvent.getParameter("selectedItems").length;
			searchController.refreshTableData();
			if (suffixCB.getItems()) {
				suffixCB.setSelectedItems("");
			}
			if (brandCB.getValue() != "" && modelYearCB.getValue() != "" && seriesCB.getValue() != "" && modelCB.getItems() != "" &&
				modelElemLen == "1") {
				suffixCB.setEnabled(true);
				var modelValLen = modelCB.getSelectedItems().length;
				for (var i = 0; i < modelValLen; i++) {
					modelText[i] = modelCB.getSelectedItems()[i].mProperties.text;
					var strMo = "Model eq '" + modelText[i] + "'";
					modelArr.push(strMo);
				}
				modelDescString = modelArr.toString();
				newModelStr = modelDescString.replace(/,/g, ' or ');

			} else {
				suffixCB.setEnabled(false);
				modelDescString = "";
				newModelStr = "";
			}
			if (newModelStr !== "") {
				var host = searchController.host();
				var url = host +
					"/Z_VEHICLE_CATALOGUE_SRV/ZC_BRAND_MODEL_DETAILSSet?$filter=(Brand eq  '" + brandCBVal + " ' and TCISeries eq  '" + seriesCBVal +
					" ' and Modelyear eq  '" + modelYearCBVal + " ' and (" + newModelStr + ") )";
				$.ajax({
					url: url,
					method: 'GET',
					//	async: false,
					dataType: 'json',
					success: function (data, textStatus, jqXHR) {
						var oModel = new sap.ui.model.json.JSONModel();
						var arr = [];
						var j = 0;
						for (var c = 0; c < data.d.results.length; c++) {
							for (var i = 0; i < data.d.results.length; i++) {
								if ($.inArray(data.d.results[i]["Suffix"], arr) < 0) {
									arr[j] = data.d.results[i]["Suffix"];
									j++;

								}
							}
						}
						oModel.setData(arr);
						searchController.getView().setModel(oModel, "suffixdropDownModel");
					},
					error: function (jqXHR, textStatus, errorThrown) {
						sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error",
							sap
							.m.MessageBox.Action.OK, null, null);
					}
				});
			}
		},
		onChange_Suffix: function () {
			searchController.refreshTableData();
		},
		handleRouteMatched: function (oEvent) {
			var arg = oEvent.getParameter("arguments");
			var sAppId = "App5bb531dd96990b5ac99be4fa";
			var oParams = {};
			if (oEvent.mParameters.data.context) {
				searchController.sContext = oEvent.mParameters.data.context;
			} else {
				if (searchController.getOwnerComponent().getComponentData()) {
					var patternConvert = function (oParam) {
						if (Object.keys(oParam).length !== 0) {
							for (var prop in oParam) {
								if (prop !== "sourcePrototype") {
									return prop + "(" + oParam[prop][0] + ")";
								}
							}
						}
					};
					searchController.sContext = patternConvert(searchController.getOwnerComponent().getComponentData().startupParameters);
				}
			}
			var oPath;
			if (searchController.sContext) {
				oPath = {
					path: "/" + searchController.sContext,
					parameters: oParams
				};
				searchController.getView().bindObject(oPath);
			}
		},

		_onCreateWhatsNew: function () {
			var sDialogName = "CreateWhatsNewDialog";
			searchController.mDialogs = searchController.mDialogs || {};
			var oDialog = searchController.mDialogs[sDialogName];

			if (!oDialog) {
				oDialog = new CreateWhatsNewDialog(searchController.getView());
				searchController.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(searchController.oRouter);
			}
			oDialog.open();

		},
		_onCreateWalkUp: function () {

			var sDialogName = "CreateWalkUpGuide";
			searchController.mDialogs = searchController.mDialogs || {};
			var oDialog = searchController.mDialogs[sDialogName];

			if (!oDialog) {
				oDialog = new CreateWalkUpGuide(searchController.getView());
				searchController.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(searchController.oRouter);
			}
			oDialog.open();

		},
		_onCreateSupplemental: function () {

			var sDialogName = "CreateSupplementalGuide";
			searchController.mDialogs = searchController.mDialogs || {};
			var oDialog = searchController.mDialogs[sDialogName];

			if (!oDialog) {
				oDialog = new CreateSupplementalGuide(searchController.getView());
				searchController.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(searchController.oRouter);
			}
			oDialog.open();

		},
		_onCreateVehGuide: function () {

			var sDialogName = "CreateVehicleGuideDialog";
			searchController.mDialogs = searchController.mDialogs || {};
			var oDialog = searchController.mDialogs[sDialogName];

			if (!oDialog) {
				oDialog = new CreateVehicleGuideDialog(searchController.getView());
				searchController.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(searchController.oRouter);
			}
			oDialog.open();

		},
		_onCreatePocSum: function () {
			var sDialogName = "CreatePocketSummaryDialog";
			searchController.mDialogs = searchController.mDialogs || {};
			var oDialog = searchController.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new CreatePocketSummaryDialog(searchController.getView());
				searchController.mDialogs[sDialogName] = oDialog;
				oDialog.setRouter(searchController.oRouter);
			}
			oDialog.open();
		},

		_navToDetail: function (oEvent) {
			//	var oBindingContext = oEvent.getParameter("listItem").getBindingContext();
			var sPath = oEvent.getParameter("listItem").oBindingContexts.searchTblModel.sPath;
			var sEntityNameSet2 = sPath.split("/")[1];
			var searchTableData = searchController.getView().getModel("searchTblModel").getData();
			var data = searchTableData[sEntityNameSet2];
			var arr = [{
				"path": sEntityNameSet2,
				"brand": data.Brand,
				"moYear": data.Modelyear,
				"model": data.Model,
				"suffix": data.Suffix,
				"veh": data.Vehicle,
				"msrp": data.MSRP,
				"dealerNet": data.NETPRICE,
				"series": data.TCISeries,
				"ENModelDesc":data.ENModelDesc
			}];
			var routeData = JSON.stringify(arr);
			searchController.oRouter.navTo("DetailsOption", {
				num: routeData
			});
		},

		_navToCompare: function (oEvent) {
			var arr = [];
			var arr_msrp = [];
			var arr_netPrice = [];
			var arrIndex = [];
			var arrIndexStr = "";
			var vehData = "";
			var MSRPData = "";
			var DealerNetData = "";
			var oTable = searchController.getView().byId("idTbl_Search");
			var aContexts = oTable.getSelectedContextPaths();
			var brandCB = searchController.getView().byId("id_brandCB");
			var suffixCB = searchController.getView().byId("id_suffixCB");
			var modelYearCB = searchController.getView().byId("id_modelYearCB");
			var modelCB = searchController.getView().byId("id_modelCB");
			var brandCBVal = brandCB.getValue();
			var SeriesData = searchController.getView().byId("id_seriesCB").getValue();
			var modelYearCBVal = modelYearCB.getValue();
			var modelValLen = modelCB.getSelectedItems().length;
			var modelText = "";
			var modelArr = [];
			var suffixText = "";
			var suffixArr = [];
			var suffixArrFromData = [];
			var suffixDescString = "";
			var suffixDescStringFromModelData = "";
			var modelDescStringFromModelData=" ";
			var modelDescString = "";
			var modelArrFromData = [];
			var modelENModelDesc=[];
		

			if (aContexts.length <= 5 && aContexts.length >= 2) {
				for (var i = 0; i < aContexts.length; i++) {
					var index = aContexts[i].split("/")[1];
					arrIndex.push(index);
					var data = searchController.getView().getModel("searchTblModel").getData();
					console.log(data);
					var indexData = data[index].Vehicle;
					arr.push(indexData);
					var indexDataMSRP = data[index].MSRP;
					arr_msrp.push(indexDataMSRP);
					var indexDataNETPRICE = data[index].NETPRICE;
					arr_netPrice.push(indexDataNETPRICE);
					var indexDataSuffix = data[index].Suffix;
					suffixArrFromData.push(indexDataSuffix);
					var indexDataModel = data[index].Model;
					modelArrFromData.push(indexDataModel);
					var indexENModelDesc=data[index].ENModelDesc;
					modelENModelDesc.push(indexENModelDesc);
				}

				vehData = JSON.stringify(arr);
				MSRPData = JSON.stringify(arr_msrp);
				DealerNetData = JSON.stringify(arr_netPrice);
				arrIndexStr = JSON.stringify(arrIndex);

				if (suffixArrFromData !== "[]") {
					suffixDescStringFromModelData = JSON.stringify(suffixArrFromData);
				} else {
					suffixDescStringFromModelData = "";
				}
					if (modelArrFromData !== "[]") {
						modelDescStringFromModelData = JSON.stringify(modelArrFromData);
					} else {
						modelDescStringFromModelData = "";
					}
				var suffixValLen = suffixCB.getSelectedItems().length;
				 suffixValLen = suffixArrFromData.length;
				
				if (suffixCB.getSelectedItems() != "") {
					for (var j = 0; j < suffixValLen; j++) {
						suffixText = suffixCB.getSelectedItems()[j].mProperties.text;
						suffixArr.push(suffixText);
					}
					suffixDescString = JSON.stringify(suffixArr);
				}
				else{
					suffixDescString="";
				}
			 //suffixArr.toString();
				if (modelCB.getSelectedItems() != "") {
					for (var i = 0; i < modelValLen; i++) {
						modelText = modelCB.getSelectedItems()[i].mProperties.text;
						modelArr.push(modelText);
					}
					modelDescString = JSON.stringify(modelArr); // modelArr.toString();
				} else {
					modelDescString = "";
				}
			
				var arr2 = [{
					"pathVeh": arrIndexStr,
					"brand": brandCBVal,
					"moYear": modelYearCBVal,
					"model": modelDescString,
					"suffix": suffixDescStringFromModelData,
					"suffixDD":suffixDescString,
					"veh": vehData,
					"msrp": MSRPData,
					"dealerNet": DealerNetData,
					"series": SeriesData,
					"modelDesc":modelENModelDesc,
					"modelData": modelDescStringFromModelData

				}];
				console.log(arr2);
				var routeData = JSON.stringify(arr2);
				searchController.oRouter.navTo("CompareDetailsOption", {
					num2: routeData
				});
				oTable.removeSelections("true");
			} else {
				//	var errMsg = searchController.getView().getModel("i18n").getResourceBundle().getText(errForm);
				var errMsg = "Select atleast 2 and maximum 5 items to compare";
				sap.m.MessageBox.show(errMsg, sap
					.m.MessageBox.Icon.ERROR, "Error", sap
					.m.MessageBox.Action.OK, null, null);
				oTable.removeSelections("true");
			}
		},

		/*	_navToDetail: function (oEvent) {
				console.log(oEvent);
				var oBindingContext = oEvent.getParameter("listItem").getBindingContext();
				console.log(oBindingContext);
				return new Promise(function (fnResolve) {
					searchController.doNavigate("DetailsOption", oBindingContext, fnResolve, "");
				}.bind(searchController)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});

			},*/
		doNavigate: function (sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oModel = (oBindingContext) ? oBindingContext.getModel() : null;
			//	console.log(sPath);
			//	var sEntityNameSet2 = sPath.split("/")[2];
			var arr = [];
			arr = sPath;
			//	console.log(arr);
			var sEntityNameSet;
			if (sPath !== null && sPath !== "") {
				if (sPath.substring(0, 1) === "/") {
					sPath = sPath.substring(1);
				}
				sEntityNameSet = sPath.split("/")[0]; //comment searchController when service comes
				//	sEntityNameSet = sPath.split("(")[0]; //uncomment searchController when service comes
			}
			var sNavigationPropertyName;
			var sMasterContext = searchController.sMasterContext ? searchController.sMasterContext : sPath;
			if (sEntityNameSet !== null) {
				sNavigationPropertyName = sViaRelation || searchController.getOwnerComponent().getNavigationPropertyForNavigationWithContext(
					sEntityNameSet,
					sRouteName);
			}

			if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
				if (sNavigationPropertyName === "") {
					searchController.oRouter.navTo(sRouteName, {
						context: sPath,
						masterContext: sMasterContext
					}, false);
				} else {
					oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function (bindingContext) {
						if (bindingContext) {
							sPath = bindingContext.getPath();

							if (sPath.substring(0, 1) === "/") {
								sPath = sPath.substring(1);
							}
						} else {
							sPath = "undefined";
						}

						// If the navigation is a 1-n, sPath would be "undefined" as searchController is not supported in Build
						if (sPath === "undefined") {
							searchController.oRouter.navTo(sRouteName);
						} else {
							searchController.oRouter.navTo(sRouteName, {
								context: sPath,
								masterContext: sMasterContext
							}, false);
						}
					}.bind(searchController));
				}
			} else {
				searchController.oRouter.navTo(sRouteName);
			}

			if (typeof fnPromiseResolve === "function") {
				fnPromiseResolve();
			}

		},

		_onSearchTableUpdate: function (oEvent) {
			var oTable = oEvent.getSource();
			//		console.log(oTable);
			var oHeaderbar = oTable.getAggregation("headerToolbar");
			//		console.log(oHeaderbar);
			if (oHeaderbar && oHeaderbar.getAggregation("content")[1]) {
				var oTitle = oHeaderbar.getAggregation("content")[1];
				//			console.log(oTitle);
				if (oTable.getBinding("items") && oTable.getBinding("items").isLengthFinal()) {
					oTitle.setText("(" + oTable.getBinding("items").getLength() + ")");
					//				console.log(oTable.getBinding("items"));
					//				console.log(oTable.getBinding("items").getLength());
				} else {
					oTitle.setText("(0)");
				}
			}

		},
		/*	_navToCompare: function (oEvent) {

				var oBindingContext = oEvent.getSource().getBindingContext();

				return new Promise(function (fnResolve) {

					searchController.doNavigate("CompareDetailsOption", oBindingContext, fnResolve, "");
				}.bind(searchController)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});

			},*/
		onExit: function () {

			// to destroy templates for bound aggregations when templateShareable is true on exit to prevent duplicateId issue
			var aControls = [{
				"controlId": "Fiori_ListReport_ListReport_0-filterBars-Fiori_ListReport_FilterBar-1-filters-Fiori_ListReport_ComboBoxFilter-1538670414396---1",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ListReport_ListReport_0-filterBars-Fiori_ListReport_FilterBar-1-filters-Fiori_ListReport_ComboBoxFilter-1538673647772---1",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ListReport_ListReport_0-filterBars-Fiori_ListReport_FilterBar-1-filters-Fiori_ListReport_ComboBoxFilter-1538673653531---1",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ListReport_ListReport_0-filterBars-Fiori_ListReport_FilterBar-1-filters-Fiori_ListReport_ComboBoxFilter-1538673654522---1",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ListReport_ListReport_0-filterBars-Fiori_ListReport_FilterBar-1-filters-Fiori_ListReport_ComboBoxFilter-1538673656505---1",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ListReport_ListReport_0-content-Fiori_ListReport_Table-1",
				"groups": ["items"]
			}];
			for (var i = 0; i < aControls.length; i++) {
				var oControl = searchController.getView().byId(aControls[i].controlId);
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