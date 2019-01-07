sap.ui.define([
	"com/sap/build/toyota-canada/vehiclesGuideV3/controller/BaseController",
	"sap/m/MessageBox",
	"./util/CreateVehicleGuideDialog",
	"./util/utilities",
	"sap/ui/core/routing/History"
	//	"./util/formatter"
], function (BaseController, MessageBox, CreateVehicleGuideDialog, Utilities,
	History) {
	"use strict";
	var CDO_controller;
	return BaseController.extend("com.sap.build.toyota-canada.vehiclesGuideV3.controller.CompareDetailsOption", {
		//	formatter: formatter,
		onInit: function () {
			CDO_controller = this;
			CDO_controller.oRouter = sap.ui.core.UIComponent.getRouterFor(CDO_controller);
			CDO_controller.oRouter.getTarget("CompareDetailsOption").attachDisplay(jQuery.proxy(CDO_controller.handleRouteMatched,
				CDO_controller));
		},

		handleUITable: function () {
			var columnData = [{
				columnName: "firstName"
			}, {
				columnName: "lastName"
			}, {
				columnName: "department"
			}];

			var rowData = [{
				firstName: "yes",
				lastName: "yes",
				department: ""
			}, {

				lastName: "Messi",
				firstName: "Ronald",
				department: "Football"
			}, {
				firstName: "Mohan",
				lastName: "Lal",
				department: "yes"
			}, {
				firstName: "yes",
				lastName: "Lal",
				department: "Film"
			}];

			var oTable = CDO_controller.getView().byId("pwrTrn");

			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({
				rows: rowData,
				columns: columnData
			});
			oTable.setModel(oModel);
			oTable.bindColumns("/columns", function (sId, oContext) {
				var columnName = oContext.getObject().columnName;
				console.log(columnName);
				return new sap.ui.table.Column({
					label: columnName,
					//  template: new sap.ui.core.Icon({ 
					//		src:"{{path:'{columnName}'} , formatter: 'com.sap.build.toyota-canada.vehiclesGuideV3.controller.util.formatter.fnFormatIcon'}"})
					template: new sap.m.Text({
						text: "{" + columnName + "}"
					}),
					/*  template:  new sap.ui.core.Icon({
            src: {
              path: "{"+columnName+"}",
              formatter: function(v) {
              	console.log(v);
                if (v === "yes") {
                  return 'sap-icon://accept';
                }
               else {
                  return 'sap-icon://nurse';
                }
              }
            }
          })*/
				});
			});

			oTable.bindRows("/rows");
		},
		formatfunc: function (x) {
			console.log(x);
			var returnCom = "";
			if (x == "yes") {
				returnCom = " sap-icon://accept ";
			} else {
				returnCom = " ";
			}
			console.log(returnCom)
			return returnCom;
		},
		setDataToTable: function () {
		/*	var brandCBVal = searchController.getView().byId("id_brandCB").getValue();
			var modelYearCBVal = searchController.getView().byId("id_modelYearCB").getValue();
			var seriesCBVal = searchController.getView().byId("id_seriesCB").getValue();
			var modelCBVal = searchController.getView().byId("id_modelCB").getItems();
			var suffixCBVal = searchController.getView().byId("id_suffixCB").getItems();*/
			var host = CDO_controller.host();
			var url = host +
			//	"/Z_VEHICLE_CATALOGUE_SRV/ZC_TABLE_DATA?$filter=(Brand eq 'TOYOTA' and Modelyear eq '2018' and suffix eq 'BC' and Model eq 'YZ3DCT' )";
			//	"/Z_VEHICLE_CATALOGUE_SRV/ZC_TABLE_DATA?$filter=(Brand eq '"+brandCBVal+"' and Modelyear eq '"+modelYearCBVal+"' and suffix eq '"+suffixCBVal+"' and Model eq '"+modelCBVal+"' )";
			"/Z_VEHICLE_CATALOGUE_SRV/ZC_TABLE_DATA?$filter=(Brand eq 'TOYOTA'and Modelyear eq '2018' and suffix eq 'ML' and Model eq 'YZ3DCT')";
			$.ajax({
				url: url,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					var tblModel = new sap.ui.model.json.JSONModel(data.d.results);
				//	tblModel.setSizeLimit(data.d.results.length);
					CDO_controller.getView().setModel(tblModel, "searchTblModel");
				//	searchController.getView().byId("idTbl_Search").setModel("searchTblModel");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			});

		},
		handleRouteMatched: function (oEvent) {
			var fixedData = {
				Category: " "
			};
			var aData = {
				"interior": [{
					desc: "1qwertyuiopasdfghjklzxcvbnmqwertyuiopasdf",
					cat1: "cat1",
					cat2: "cat2",
					cat3: "cat3",
					cat4: "cat4",
					cat5: "cat5"
				}, {
					desc: "2qwertyuiopasdfghjklzxcvbnmqwertyuiopasdf",
					cat1: "cat1",
					cat2: "yes",
					cat3: "yes",
					cat4: "yes",
					cat5: "yes"
				}, {
					desc: "3qwertyuiopasdfghjklzxcvbnmqwertyuiopasdf",
					cat1: "yes",
					cat2: "yes",
					cat3: "yes",
					cat4: "yes",
					cat5: "yes"
				}],
				"exterior": [{
					desc: "4qwertyuiopasdfghjklzxcvbnmqwertyuiopasdf",
					cat1: "yes",
					cat2: "yes",
					cat3: "yes",
					cat4: "yes",
					cat5: "yes"
				}, {
					desc: "5qwertyuiopasdfghjklzxcvbnmqwertyuiopasdf",
					cat1: "yes",
					cat2: "yes",
					cat3: "yes",
					cat4: "yes",
					cat5: "yes"
				}]
			};
			var aColumnData = [];
			aColumnData.push(fixedData);

			var arg2 = oEvent.getParameters().data.num2;
			var parseArg = JSON.parse(arg2);
			var len = parseArg.length;
			var host = CDO_controller.host();
			var url = host +
			//	"/Z_VEHICLE_CATALOGUE_SRV/ZC_TABLE_DATA?$filter=(Brand eq 'TOYOTA' and Modelyear eq '2018' and suffix eq 'BC' and Model eq 'YZ3DCT' )";
			//	"/Z_VEHICLE_CATALOGUE_SRV/ZC_TABLE_DATA?$filter=(Brand eq '"+brandCBVal+"' and Modelyear eq '"+modelYearCBVal+"' and suffix eq '"+suffixCBVal+"' and Model eq '"+modelCBVal+"' )";
			"/Z_VEHICLE_CATALOGUE_SRV/ZC_TABLE_DATA?$filter=(Brand eq 'TOYOTA'and Modelyear eq '2018' and suffix eq 'ML' and Model eq 'YZ3DCT')";
			$.ajax({
				url: url,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					var tblModel = new sap.ui.model.json.JSONModel(data.d.results);
				//	tblModel.setSizeLimit(data.d.results.length);
					CDO_controller.getView().setModel(tblModel, "searchTblModel");
				//	searchController.getView().byId("idTbl_Search").setModel("searchTblModel");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR, "Error", sap
						.m.MessageBox.Action.OK, null, null);
				}
			});
			var model =	CDO_controller.getView().getModel("searchTblModel");
			//new sap.ui.getCore().getModel('employee');
			var empData =model.getData();

			var nModel = new sap.ui.model.json.JSONModel();
			var arrNewData = [];
			var modLen = model.getData().length;
			for (var i = 0; i < len; i++) {
				for (var j = 0; j < modLen; j++) {
					if (parseArg[i] == j) {
						aColumnData.push(empData[j]);
						arrNewData.push(empData[j]);
						break;
					}
				}
			}

			nModel.setData(arrNewData);
			CDO_controller.getView().setModel(nModel, "compareModel");

			var tblModel2 = new sap.ui.model.json.JSONModel();
			tblModel2.setData({
				columns: aColumnData,
				rows: aData
			});
			/*	for (var i = 0; i < len; i++) {
				for (var j = 0; j < modLen; j++) {
					if (parseArg[i] == j) {
						aColumnData.push(empData[j]);
						arrNewData.push(empData[j]);
						break;
					}
				}
			}*/
			CDO_controller.getView().setModel(tblModel2, "dataModel");
			console.log(CDO_controller.getView().getModel("compareModel").getData);
			console.log(CDO_controller.getView().getModel("dataModel"));
			var tblExterior = CDO_controller.getView().byId("tblExterior");
			tblExterior.setModel(tblModel2);
			tblExterior.bindAggregation("columns", "/columns", function (index, context) {
				return new sap.m.Column({
					header: new sap.m.Label({
						text: context.getObject().Category
					}),
				});
			});
			tblExterior.bindItems("/rows/exterior", function (index, context) {
				var obj = context.getObject();
				var x;
				var row = new sap.m.ColumnListItem();
				for (var k in obj) {
					x = obj[k];
					/*	row.addCell(new sap.m.Text({
						text: x*/
					row.addCell(
						new sap.m.Text({
							text: {
								parts: ['x'],
								formatter: CDO_controller.formatfunc(x)
							}
						}));
				}
				return row;
			});

			var tblInterior = CDO_controller.getView().byId("tblInterior");
			tblInterior.setModel(tblModel2);
			tblInterior.bindAggregation("columns", "/columns", function (index, context) {
				return new sap.m.Column({
					header: new sap.m.Label({
						text: context.getObject().Category
					}),
				});
			});
			tblInterior.bindItems("/rows/interior", function (index, context) {
				var obj = context.getObject();
				var row = new sap.m.ColumnListItem();

				for (var k in obj) {
					row.addCell(new sap.m.Text({
						text: obj[k]
					}));
				}

				return row;
			});
			CDO_controller.handleUITable();
			/*	var tblPowertrain = CDO_controller.getView().byId("tblPowertrain");
				tblPowertrain.setModel(tblModel2);
				tblPowertrain.bindAggregation("columns", "/columns", function (index, context) {
					return new sap.m.Column({
						header: new sap.m.Label({
							text: context.getObject().Category
						}),
					});
				});*/
			var tblSafety = CDO_controller.getView().byId("tblSafety");
			tblSafety.setModel(tblModel2);
			tblSafety.bindAggregation("columns", "/columns", function (index, context) {
				return new sap.m.Column({
					header: new sap.m.Label({
						text: context.getObject().Category
					}),
				});
			});
			var tblInfotainment = CDO_controller.getView().byId("tblInfotainment");
			tblInfotainment.setModel(tblModel2);
			tblInfotainment.bindAggregation("columns", "/columns", function (index, context) {
				return new sap.m.Column({
					header: new sap.m.Label({
						text: context.getObject().Category
					}),
				});
			});
			var tblColorOptions = CDO_controller.getView().byId("tblColorOptions");
			tblColorOptions.setModel(tblModel2);
			tblColorOptions.bindAggregation("columns", "/columns", function (index, context) {
				return new sap.m.Column({
					header: new sap.m.Label({
						text: context.getObject().Category
					}),
				});
			});
			var tblDimensions = CDO_controller.getView().byId("tblDimensions");
			tblDimensions.setModel(tblModel2);
			tblDimensions.bindAggregation("columns", "/columns", function (index, context) {
				return new sap.m.Column({
					header: new sap.m.Label({
						text: context.getObject().Category
					}),
				});
			});
			var tblOptionPack = CDO_controller.getView().byId("tblOptionPack");
			tblOptionPack.setModel(tblModel2);
			tblOptionPack.bindAggregation("columns", "/columns", function (index, context) {
				return new sap.m.Column({
					header: new sap.m.Label({
						text: context.getObject().Category
					}),
				});
			});
			var tblAPX = CDO_controller.getView().byId("tblAPX");
			tblAPX.setModel(tblModel2);
			tblAPX.bindAggregation("columns", "/columns", function (index, context) {
				return new sap.m.Column({
					header: new sap.m.Label({
						text: context.getObject().Category
					}),
				});
			});

		},

		/*handleRouteMatched: function (oEvent) {
			var sAppId = "App5bb531dd96990b5ac99be4fa";
			var oParams = {};
			if (oEvent.mParameters.data.context) {
				CDO_controller.sContext = oEvent.mParameters.data.context;
			} else {
				if (CDO_controller.getOwnerComponent().getComponentData()) {
					var patternConvert = function (oParam) {
						if (Object.keys(oParam).length !== 0) {
							for (var prop in oParam) {
								if (prop !== "sourcePrototype") {
									return prop + "(" + oParam[prop][0] + ")";
								}
							}
						}
					};
					CDO_controller.sContext = patternConvert(CDO_controller.getOwnerComponent().getComponentData().startupParameters);
				}
			}
			var oPath;
			if (CDO_controller.sContext) {
				oPath = {
					path: "/" + CDO_controller.sContext,
					parameters: oParams
				};
				CDO_controller.getView().bindObject(oPath);
			}
		},
*/
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
		_onFioriObjectPageActionButtonPress: function () {

			var sDialogName = "CreateVehicleGuideDialog";
			CDO_controller.mDialogs = CDO_controller.mDialogs || {};
			var oDialog = CDO_controller.mDialogs[sDialogName];

			if (!oDialog) {
				oDialog = new CreateVehicleGuideDialog(CDO_controller.getView());
				CDO_controller.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(CDO_controller.oRouter);
			}
			oDialog.open();

		},

		onExit: function () {

			// to destroy templates for bound aggregations when templateShareable is true on exit to prevent duplicateId issue
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

/*		handleRouteMatched: function (oEvent) {
			var arg2=oEvent.getParameters().data.num2;
			var parseArg=JSON.parse(arg2);
			var len=parseArg.length;
			var model = new sap.ui.getCore().getModel('employee');
			CDO_controller.getView().setModel(model);
			for(var i=0; i<len;i++){
				var	oView = CDO_controller.getView();
				oView.bindElement({
				path: "/"+(parseArg[i])
			});
			}
		
		},*/