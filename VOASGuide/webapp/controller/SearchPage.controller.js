sap.ui.define(["com/sap/build/toyota-canada/vehiclesGuideV3/controller/BaseController",
	"sap/m/MessageBox",
	"./util/CreateVehicleGuideDialog", "./util/CreatePocketSummaryDialog",
	"./util/SuplementalDialog", "./util/WalkupDialog", "./util/CreateWhatsNewDialog",
	"./util/utilities", "./util/CreateWalkUpGuide", "./util/CreateSupplementalGuide",
	"sap/ui/core/routing/History", "sap/ui/model/json/JSONModel"
], function (BaseController, MessageBox, CreateVehicleGuideDialog, CreatePocketSummaryDialog, SuplementalDialog, WalkupDialog,
	CreateWhatsNewDialog, Utilities, CreateWalkUpGuide, CreateSupplementalGuide, History, JSONModel) {
	"use strict";
	var searchController;
	return BaseController.extend("com.sap.build.toyota-canada.vehiclesGuideV3.controller.SearchPage", {

		onInit: function () {
			searchController = this;
			searchController.oRouter = sap.ui.core.UIComponent.getRouterFor(searchController);
			searchController.oRouter.getTarget("SearchPage").attachDisplay(jQuery.proxy(searchController.handleRouteMatched, searchController));
			searchController.listOfBrand();
			searchController.listOfModelYear();
		},

		listOfModelYear: function () {
			var d = new Date();
			var currentModelYear = d.getFullYear();
			var oldYear=currentModelYear - 1;
			var nextModelYear = currentModelYear + 1;
			var nextModelYear2 = currentModelYear + 2;
			var nextModelYear3 = currentModelYear + 3;
			var data = {
				"modelYear": [{
					"key": "5",
					"text": oldYear
				},{
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
			searchController.getView().byId("id_brandCB").setModel("brandModel");
		},

	/*	resetTable: function () {
			var oTable = searchController.getView().byId("idTbl_Search");
			var data = [{
				Brand: "",
				Features: "",
				MSRP: "",
				Model: "",
				Modelyear: "",
				NETPRICE: "",
				Suffix: "",
				Vehicle: "",
				flagged: ""
			}];
			var oModel = new sap.ui.model.json.JSONModel(data);
			oTable.setModel(oModel);
		},*/

	/*	setSeriesTableData: function () {
			var brandCBVal = searchController.getView().byId("id_brandCB").getValue();
			var modelYearCBVal = searchController.getView().byId("id_modelYearCB").getValue();
			var seriesCBVal = searchController.getView().byId("id_seriesCB").getValue();
			var modelCBVal = searchController.getView().byId("id_modelCB").getItems();
			var suffixCBVal = searchController.getView().byId("id_suffixCB").getItems();
			var host = searchController.host();
			var url = host +
				//	"/Z_VEHICLE_CATALOGUE_SRV/ZC_TABLE_DATA?$filter=(Brand eq 'TOYOTA' and Modelyear eq '2018' and suffix eq 'BC' and Model eq 'YZ3DCT' )";
				//	"/Z_VEHICLE_CATALOGUE_SRV/ZC_TABLE_DATA?$filter=(Brand eq '"+brandCBVal+"' and Modelyear eq '"+modelYearCBVal+"' and suffix eq '"+suffixCBVal+"' and Model eq '"+modelCBVal+"' )";
				//"/Z_VEHICLE_CATALOGUE_SRV/ZC_TABLE_DATA?$filter=(Brand eq 'TOYOTA'and Modelyear eq '2018' and suffix eq 'ML' and Model eq 'YZ3DCT')";
				"/Z_VEHICLE_CATALOGUE_SRV/ZC_TABLE_DATA_LOADSet?$filter=(Brand eq  'TOYOTA ' and Model eq  'YZ3DCT ' and Modelyear eq  '2018 ' and Suffix eq  'AB ')";
			//"/Z_VEHICLE_CATALOGUE_SRV/ZC_TABLE_DATA_LOAD";
			$.ajax({
				url: url,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					console.log(data.d.results);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},*/

		onChange_Brand: function () {
			var brandCB = searchController.getView().byId("id_brandCB");
			var modelYearCB = searchController.getView().byId("id_modelYearCB");
			var seriesCB = searchController.getView().byId("id_seriesCB");
			var modelCB = searchController.getView().byId("id_modelCB");
			var suffixCB = searchController.getView().byId("id_suffixCB");

			modelYearCB.setValue("");
			seriesCB.setValue("");
			modelCB.setSelectedItems("");
			suffixCB.setSelectedItems("");

			if (brandCB.getValue() != "") {
				modelYearCB.setEnabled(true);
			}

		},
		onChange_ModelYear: function () {
			var brandCB = searchController.getView().byId("id_brandCB");
			var modelYearCB = searchController.getView().byId("id_modelYearCB");
			var seriesCB = searchController.getView().byId("id_seriesCB");
			var modelCB = searchController.getView().byId("id_modelCB");
			var suffixCB = searchController.getView().byId("id_suffixCB");

			var brandCBVal = brandCB.getValue();
			var modelYearCBVal = modelYearCB.getValue();

			seriesCB.setValue("");
			modelCB.setSelectedItems("");
			suffixCB.setSelectedItems("");

			if (brandCB.getValue() != "" && modelYearCB.getValue() != "") {
				seriesCB.setEnabled(true);
			}

			var host = searchController.host();
			//	"/Z_VEHICLE_CATALOGUE_SRV/ZC_BRAND_MODEL_DETAIL?$filter=(Brand%20eq%20%27"+ brandCBVal+"%27%20and%20Modelyear%20eq%20%27"+modelYearCBVal+"%27)";*/
			var url = host +
				"/Z_VEHICLE_CATALOGUE_SRV/ZC_BRAND_MODEL_DETAIL?$filter=(Brand eq '" + brandCBVal + "' and Modelyear eq '" + modelYearCBVal + "')";

			$.ajax({
				url: url,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					var oModel = new sap.ui.model.json.JSONModel(data.d.results);
					searchController.getView().setModel(oModel, "dropDownModel");
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

			//modelCB.setSelectedItems("");
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
			var url = host +
				//	"/Z_VEHICLE_CATALOGUE_SRV/ZC_BRAND_MODEL_DETAIL?$filter=(Brand eq %27TOYOTA%27 and Modelyear eq %272020%27 and TCISeries eq %27COR%27)";
				"/Z_VEHICLE_CATALOGUE_SRV/ZC_BRAND_MODEL_DETAIL?$filter=(Brand eq '" + brandCBVal + "' and Modelyear eq '" + modelYearCBVal +
				"'and TCISeries eq '" + seriesCBVal + "')";
			var url2 = host +
				"/Z_VEHICLE_CATALOGUE_SRV/ZC_TABLE_DATA_LOADSet?$filter=(Brand eq  '" + brandCBVal + " ' and TCISeries eq  '" + seriesCBVal +
				" ' and Modelyear eq  '" + modelYearCBVal + " ')";
			$.ajax({
				url: url,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					var oModel = new sap.ui.model.json.JSONModel(data.d.results);
					searchController.getView().setModel(oModel, "dropDownModel");
					if (seriesCB.getValue() != "") {
						$.ajax({
							url: url2,
							method: 'GET',
							async: false,
							dataType: 'json',
							success: function (data, textStatus, jqXHR) {
								var tblModel = new sap.ui.model.json.JSONModel(data.d.results);
								tblModel.setSizeLimit(data.d.results.length);
								searchController.getView().setModel(tblModel, "searchTblModel");
								searchController.getView().byId("idTbl_Search").setModel("searchTblModel");
							},
							error: function (jqXHR, textStatus, errorThrown) {
								sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR,
									"Error", sap
									.m.MessageBox.Action.OK, null, null);
							}
						});
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},

		onChange_Model: function () {
			var brandCB = searchController.getView().byId("id_brandCB");
			var modelYearCB = searchController.getView().byId("id_modelYearCB");
			var seriesCB = searchController.getView().byId("id_seriesCB");
			var modelCB = searchController.getView().byId("id_modelCB");
			var suffixCB = searchController.getView().byId("id_suffixCB");
			var modelArr = [];
			var modelDescString;
			var brandCBVal = brandCB.getValue();
			var modelYearCBVal = modelYearCB.getValue();
			var seriesCBVal = seriesCB.getValue();

			if (suffixCB.getItems()) {
				suffixCB.setSelectedItems("");
			}

			if (brandCB.getValue() != "" && modelYearCB.getValue() != "" && seriesCB.getValue() != "" && modelCB.getItems() != "") {
				suffixCB.setEnabled(true);
				var modelValLen = modelCB.getSelectedItems().length;
				console.log(modelValLen);

				for (var i = 0; i < modelValLen; i++) {
					modelArr.push(modelCB.getSelectedItems()[i].mProperties.text);
				}
				modelDescString = modelArr.toString();
			}
			var host = searchController.host();
			var url = host +

					"/Z_VEHICLE_CATALOGUE_SRV/ZC_BRAND_MODEL_DETAIL?$filter=(Brand eq '" + brandCBVal + "' and Modelyear eq '" + modelYearCBVal +
					"'and TCISeries eq '" + seriesCBVal + "' and ENModelDesc eq '" + modelDescString + "' )";
			/*	"/Z_VEHICLE_CATALOGUE_SRV/ZC_BRAND_MODEL_DETAIL?$filter=( Modelyear eq '" + modelYearCBVal + "' and ENModelDesc eq '" +
				modelDescString + "' )";*/
			var url2 = host +
				"/Z_VEHICLE_CATALOGUE_SRV/ZC_TABLE_DATA_LOADSet?$filter=(Brand eq  '" + brandCBVal + " ' and TCISeries eq  '" + seriesCBVal +
				" ' and Modelyear eq  '" + modelYearCBVal + " 'and ENModelDesc eq '" + modelDescString + "' )"; 
			$.ajax({
				url: url,
				method: 'GET',
				//	async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {

					var oModel = new sap.ui.model.json.JSONModel(data.d.results);
					searchController.getView().setModel(oModel, "suffixdropDownModel");
					if (seriesCB.getValue() != "") {
						$.ajax({
							url: url2,
							method: 'GET',
							async: false,
							dataType: 'json',
							success: function (data, textStatus, jqXHR) {
								searchController.getView().getModel("searchTblModel").setData(data.d.results);
								searchController.getView().byId("idTbl_Search").setModel("searchTblModel");
							},
							error: function (jqXHR, textStatus, errorThrown) {
								sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR,
									"Error", sap
									.m.MessageBox.Action.OK, null, null);
							}
						});
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
		},
		onChange_Suffix: function () {

			var brandCB = searchController.getView().byId("id_brandCB");
			var modelYearCB = searchController.getView().byId("id_modelYearCB");
			var seriesCB = searchController.getView().byId("id_seriesCB");
			var modelCB = searchController.getView().byId("id_modelCB");
			var suffixCB = searchController.getView().byId("id_suffixCB");
			var modelArr = [];
			var modelDescString;
			var suffixArr = [];
			var suffixDescString;
			var brandCBVal = brandCB.getValue();
			var modelYearCBVal = modelYearCB.getValue();
			var seriesCBVal = seriesCB.getValue();

			var modelValLen = modelCB.getSelectedItems().length;

			for (var i = 0; i < modelValLen; i++) {
				modelArr.push(modelCB.getSelectedItems()[i].mProperties.text);
			}
			modelDescString = modelArr.toString();
			for (var j = 0; j < modelValLen; j++) {
				suffixArr.push(suffixCB.getSelectedItems()[j].mProperties.text);
			}
			suffixDescString = suffixArr.toString();

			var host = searchController.host();

			var url2 = host +
				"/Z_VEHICLE_CATALOGUE_SRV/ZC_TABLE_DATA_LOADSet?$filter=(Brand eq  '" + brandCBVal + " ' and suffix  eq  '" + suffixDescString +
				" ' and Modelyear eq  '" + modelYearCBVal + " 'and ENModelDesc eq '" + modelDescString + "' )";

			$.ajax({
				url: url2,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					searchController.getView().getModel("searchTblModel").setData(data.d.results);
					searchController.getView().byId("idTbl_Search").setModel("searchTblModel");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR,
						"Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			});

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
			var oCtx;
			var oBindingContext = oEvent.getParameter("listItem").getBindingContext();
			oCtx = oBindingContext;
			var sPath = oCtx.sPath;
			var sEntityNameSet2 = sPath.split("/")[2];
			searchController.oRouter.navTo("DetailsOption", {
				num: sEntityNameSet2
			});
		},

		_navToCompare: function (oEvent) {
			var arr = [];
			var oTable = searchController.getView().byId("idTbl_Search");
			var aContexts = oTable.getSelectedContextPaths();
			//	console.log(aContexts);
			if (aContexts.length <= 5 && aContexts.length >= 2) {
				for (var i = 0; i < aContexts.length; i++) {
					var index = aContexts[i].split("/")[1];
					//			console.log(index);
					arr.push(index);
				}
				//		console.log(arr);
				var num2 = JSON.stringify(arr);
				//		console.log(num2);
				searchController.oRouter.navTo("CompareDetailsOption", {
					num2: num2
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