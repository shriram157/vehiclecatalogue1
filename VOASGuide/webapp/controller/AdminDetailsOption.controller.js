sap.ui.define(["com/sap/build/toyota-canada/vehiclesGuideV3/controller/BaseController",
	"sap/m/MessageBox",
	"./util/SuplementalDialog", "./util/WhatsNewDialog", "./util/WalkupDialog", "./util/CreateVehicleGuideDialog",
	"./util/utilities",
	"sap/ui/core/routing/History", "com/sap/build/toyota-canada/vehiclesGuideV3/Formatter/formatter"
], function (BaseController, MessageBox, SuplementalDialog, WhatsNewDialog, WalkupDialog, CreateVehicleGuideDialog, utilities, History,
	formatter) {
	"use strict";
	var AdminDetailCntroller;
	return BaseController.extend("com.sap.build.toyota-canada.vehiclesGuideV3.controller.AdminDetailsOption", {
		formatter: formatter,
		onInit: function () {
			AdminDetailCntroller = this;
			AdminDetailCntroller.oRouter = sap.ui.core.UIComponent.getRouterFor(AdminDetailCntroller);
			AdminDetailCntroller.oRouter.getTarget("AdminDetailsOption").attachDisplay(jQuery.proxy(AdminDetailCntroller.handleRouteMatched,
				AdminDetailCntroller));
			sap.ushell.components.suppTbl = AdminDetailCntroller.getView().byId("suppTbl");
			sap.ushell.components.walkUpTbl = AdminDetailCntroller.getView().byId("walkUpTbl");
			sap.ushell.components.whatsNewTbl = AdminDetailCntroller.getView().byId("whatsNewTbl");
			AdminDetailCntroller.getBrowserLanguage();
			this.lang = AdminDetailCntroller.returnBrowserLanguage();
			this.lang = this.lang.toUpperCase();
		},
		handleRouteMatched: function (oEvent) {
			var parseArg = JSON.parse(oEvent.getParameters().data.num3);
			//console.log(parseArg[0]);
			var modelDetail = new sap.ui.model.json.JSONModel(parseArg[0]);
			AdminDetailCntroller.getView().setModel(modelDetail, "modelDetail");
			sap.ui.getCore().setModel(modelDetail, "modelAdmin");
			AdminDetailCntroller.suppTableOnPageLoad();
			AdminDetailCntroller.walkUpTableOnPageLoad();
			AdminDetailCntroller.whatsNewTableOnPageLoad();
		},
		suppTableOnPageLoad: function () {
			var modelAdm = sap.ui.getCore().getModel("modelAdmin");
			var modelAdmData = modelAdm.getData();
			var tbl = AdminDetailCntroller.getView().byId("suppTbl");
			var host = AdminDetailCntroller.host();
			var oUrl4 = host + "/Z_VEHICLE_CATALOGUE_SRV/FileReadSet?$filter=(Tab eq 'suppliment')";
			var oUrl3 = host + "/Z_VEHICLE_CATALOGUE_SRV/FileReadSet?$filter=(Tab eq 'suppliment' and Model eq '" + modelAdmData.modelDesc +
				"' and Model_year eq '" + modelAdmData.moYear + "' and Tciseries eq '" + modelAdmData.series + "' and Brand eq '" + modelAdmData.brand +
				"' and Language eq '" + this.lang + "')";
			$.ajax({
				url: oUrl3,
				method: 'GET',
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					var tblModel = new sap.ui.model.json.JSONModel(data.d.results);
					sap.ui.getCore().setModel(tblModel, "suppTblModel");
					tbl.setModel(tblModel, "suppTblModel");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					var errMsg = AdminDetailCntroller.getView().getModel("i18n").getResourceBundle().getText("Error1");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR,
						"Error", sap.m.MessageBox.Action.OK, null, null);
				}
			});
		},
		walkUpTableOnPageLoad: function () {
			var modelAdm = sap.ui.getCore().getModel("modelAdmin");
			var modelAdmData = modelAdm.getData();
			var tbl = AdminDetailCntroller.getView().byId("walkUpTbl");
			var host = AdminDetailCntroller.host();
			var oUrl4 = host + "/Z_VEHICLE_CATALOGUE_SRV/FileReadSet?$filter=(Tab eq 'Walkup')";
			var oUrl3 = host + "/Z_VEHICLE_CATALOGUE_SRV/FileReadSet?$filter=(Tab eq 'Walkup' and Model eq '" + modelAdmData.modelDesc +
				"' and Model_year eq '" + modelAdmData.moYear + "' and Tciseries eq '" + modelAdmData.series + "' and Brand eq '" + modelAdmData.brand +
				"' and Language eq '" + this.lang + "')";
			$.ajax({
				url: oUrl3,
				method: 'GET',
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					console.log(data.d.results);
					var tblModel = new sap.ui.model.json.JSONModel(data.d.results);
					sap.ui.getCore().setModel(tblModel, "walkUpTblModel");
					tbl.setModel(tblModel, "walkUpTblModel");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					var errMsg = AdminDetailCntroller.getView().getModel("i18n").getResourceBundle().getText("Error1");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR,
						"Error", sap.m.MessageBox.Action.OK, null, null);
				}
			});
		},
		whatsNewTableOnPageLoad: function () {
			var modelAdm = sap.ui.getCore().getModel("modelAdmin");
			var modelAdmData = modelAdm.getData();
			var tbl = AdminDetailCntroller.getView().byId("whatsNewTbl");
			var host = AdminDetailCntroller.host();
			var oUrl4 = host + "/Z_VEHICLE_CATALOGUE_SRV/FileReadSet?$filter=(Tab eq 'WhatsNew')";
			var oUrl3 = host + "/Z_VEHICLE_CATALOGUE_SRV/FileReadSet?$filter=(Tab eq 'WhatsNew' and Model eq '" + modelAdmData.modelDesc +
				"' and Model_year eq '" + modelAdmData.moYear + "' and Tciseries eq '" + modelAdmData.series + "' and Brand eq '" + modelAdmData.brand +
				"' and Language eq '" + this.lang + "')";
			$.ajax({
				url: oUrl3,
				method: 'GET',
				async: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					//	console.log(data.d.results);
					var tblModel = new sap.ui.model.json.JSONModel(data.d.results);
					sap.ui.getCore().setModel(tblModel, "whatsNewTblModel");
					tbl.setModel(tblModel, "whatsNewTblModel");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					var errMsg = AdminDetailCntroller.getView().getModel("i18n").getResourceBundle().getText("Error1");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR,
						"Error", sap.m.MessageBox.Action.OK, null, null);
				}
			});
		},
		/*handleRouteMatched: function (oEvent) {
			var sAppId = "App5bb531dd96990b5ac99be4fa";
			var oParams = {};
			if (oEvent.mParameters.data.context) {
				AdminDetailCntroller.sContext = oEvent.mParameters.data.context;
			} else {
				if (AdminDetailCntroller.getOwnerComponent().getComponentData()) {
					var patternConvert = function (oParam) {
						if (Object.keys(oParam).length !== 0) {
							for (var prop in oParam) {
								if (prop !== "sourcePrototype") {
									return prop + "(" + oParam[prop][0] + ")";
								}
							}
						}
					};
					AdminDetailCntroller.sContext = patternConvert(AdminDetailCntroller.getOwnerComponent().getComponentData().startupParameters);
				}
			}
			var oPath;
			if (AdminDetailCntroller.sContext) {
				oPath = {
					path: "/" + AdminDetailCntroller.sContext,
					parameters: oParams
				};
				AdminDetailCntroller.getView().bindObject(oPath);
			}
		},*/
		_onFioriObjectPageHeaderPress: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			var oQueryParams = AdminDetailCntroller.getQueryParameters(window.location);

			if (sPreviousHash !== undefined || oQueryParams.navBackToLaunchpad) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(AdminDetailCntroller);
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
		_createVehGuidePDF: function () {
			var sDialogName = "CreateVehicleGuideDialog";
			AdminDetailCntroller.mDialogs = AdminDetailCntroller.mDialogs || {};
			var oDialog = AdminDetailCntroller.mDialogs[sDialogName];

			//	if (!oDialog) {
			oDialog = new CreateVehicleGuideDialog(AdminDetailCntroller.getView());
			AdminDetailCntroller.mDialogs[sDialogName] = oDialog;
			oDialog.setRouter(AdminDetailCntroller.oRouter);
			//	}
			oDialog.open();

		},
		_uploadWhatNew: function () {

			var sDialogName = "WhatsNewDialog";
			AdminDetailCntroller.mDialogs = AdminDetailCntroller.mDialogs || {};
			var oDialog = AdminDetailCntroller.mDialogs[sDialogName];

			if (!oDialog) {
				oDialog = new WhatsNewDialog(AdminDetailCntroller.getView());
				AdminDetailCntroller.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(AdminDetailCntroller.oRouter);
			}
			oDialog.open();

		},
		_uploadFileSupp: function () {

			var sDialogName = "SuplementalDialog";
			AdminDetailCntroller.mDialogs = AdminDetailCntroller.mDialogs || {};
			var oDialog = AdminDetailCntroller.mDialogs[sDialogName];

			if (!oDialog) {
				oDialog = new SuplementalDialog(AdminDetailCntroller.getView());
				AdminDetailCntroller.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(AdminDetailCntroller.oRouter);
			}
			oDialog.open();

		},
		_deleteWhatNew: function (evt) {
			var modelAdm = sap.ui.getCore().getModel("modelAdmin");
			var modelAdmData = modelAdm.getData();
			var host = AdminDetailCntroller.host();
			var tbl = evt.getSource().getParent().getParent();
			var errMsg = "Are you sure you want to Delete the selected What's New PDF?"; //AdminDetailCntroller.getView().getModel("i18n").getResourceBundle().getText("deleteError");
			var title = "Delete"; //AdminDetailCntroller.getView().getModel("i18n").getResourceBundle().getText("title1");

			sap.m.MessageBox.show(errMsg, {
				icon: sap.m.MessageBox.Icon.WARNING,
				title: title,
				actions: [sap.m.MessageBox.Action.DELETE, sap.m.MessageBox.Action.CANCEL],
				onClose: function (sAction) {
					if (sAction === "DELETE") {

						var evtContext = tbl._aSelectedPaths[0];
						if (evtContext != undefined && evtContext !== null && evtContext != "") {
							var oIndex = parseInt(evtContext.substring(evtContext.lastIndexOf('/') + 1));
							var url = host +
								"/Z_VEHICLE_CATALOGUE_SRV/FileReadSet?$filter=(Language eq 'EN' and Lastupdate eq '20190125' and FileName eq 'lexus.png')";
							var modelSupp = sap.ui.getCore().getModel("whatsNewTblModel");
							var tblData = modelSupp.getData();
							var FileName = tblData[oIndex].FileName;
							var Language = tblData[oIndex].Language;
							var Lastupdate = tblData[oIndex].Lastupdate;
							var url2 = host +
								"/Z_VEHICLE_CATALOGUE_SRV/FileSet(Comment='X',FileName='" + FileName + "',Language='" + Language +
								"',Lastupdate='" + Lastupdate + "',Tab='WhatsNew',Model='" + modelAdmData.modelDesc + "',Model_year='" + modelAdmData.moYear +
								"',Tciseries='" + modelAdmData.series + "',Brand='" + modelAdmData.brand + "')/$value";
							var token;

							$.ajax({
								url: url2,
								type: 'GET',
								beforeSend: function (xhr) {
									xhr.setRequestHeader("X-CSRF-Token", "Fetch");
								},
								complete: function (xhr) {
									token = xhr.getResponseHeader("X-CSRF-Token");
									//oBusyDialog.open();
									$.ajax({
										url: url2,
										method: 'PUT',
										async: false,
										dataType: "json",
										beforeSend: function (xhr) {
											xhr.setRequestHeader('X-CSRF-Token', token);
										},
										success: function (data, textStatus, jqXHR) {
											tblData.splice(oIndex, 1);
											modelSupp.setData(data);
											tbl.setModel(modelSupp);
										},
										error: function (jqXHR, textStatus, errorThrown) {
											var errMsg = AdminDetailCntroller.getView().getModel("i18n").getResourceBundle().getText("Error1");
											sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR,
												"Error", sap.m.MessageBox.Action.OK, null, null);
										}

									});
								}
							});
						}
						tbl.removeSelections("true");
					} else {
						//
					}
				},
				styleClass: "",
				initialFocus: null,
				textDirection: sap.ui.core.TextDirection.Inherit,
				contentWidth: "10rem"
			});
		},
		/*	_deleteFileSupp: function (evt) {
				var tbl = evt.getSource().getParent().getParent();
				var errMsg = "Are you sure you want to Delete the selected Supplemental Guide?"; //AdminDetailCntroller.getView().getModel("i18n").getResourceBundle().getText("deleteError");
				var title = "Delete"; //AdminDetailCntroller.getView().getModel("i18n").getResourceBundle().getText("title1");
				sap.m.MessageBox.show(errMsg, {
					icon: sap.m.MessageBox.Icon.WARNING,
					title: title,
					actions: [sap.m.MessageBox.Action.DELETE, sap.m.MessageBox.Action.CANCEL],
					onClose: function (sAction) {
						if (sAction === "DELETE") {
							var evtContext = tbl._aSelectedPaths[0];
							if (evtContext != undefined && evtContext != null && evtContext != "") {
								var oIndex = parseInt(evtContext.substring(evtContext.lastIndexOf('/') + 1));
								console.log(globalData);
								//	console.log(AdminDetailCntroller.globalData[oIndex]);
								//	console.log(globalData[oIndex]);
								//	var model = tbl.getModel();
								//	console.log(model);
								//	console.log(model.getData());
								//	var data = model.getProperty("/");
								var url=host+"Z_VEHICLE_CATALOGUE_SRV/FileReadSet?$filter=(Language eq 'EN' and Lastupdate eq '20190125' and FileName eq 'lexus.png')"
								if (globalData[oIndex].lang == "EN") {
									console.log(dataEN);
									//	dataEN=[];
									dataEN.splice(0, dataEN.length)
										//dataEN.length=0;
								} else if (globalData[oIndex].lang == "FR") {
									console.log(dataFR);
									//	dataFR=[];
									//dataFR.length=0;
									dataFR.splice(0, dataFR.length)
								}
								globalData.splice(oIndex, 1);
								console.log(globalData);
								//data.splice(oIndex, 1);
								//	console.log(data);
								var modelSupp = sap.ui.getCore().getModel("modelSupp");
								//modelSupp.setProperty("/", data);
								modelSupp.setData(globalData);
								tbl.getModel().refresh();
								console.log(tbl.getModel().getData());
							}
						} else {
							// 
						}
					},
					styleClass: "",
					initialFocus: null,
					textDirection: sap.ui.core.TextDirection.Inherit,
					contentWidth: "10rem"
				});
			},*/
		_deleteFileSupp: function (evt) {
			var modelAdm = sap.ui.getCore().getModel("modelAdmin");
			var modelAdmData = modelAdm.getData();
			var host = AdminDetailCntroller.host();
			var tbl = evt.getSource().getParent().getParent();
			var errMsg = "Are you sure you want to Delete the selected Supplemental Guide?"; //AdminDetailCntroller.getView().getModel("i18n").getResourceBundle().getText("deleteError");
			var title = "Delete"; //AdminDetailCntroller.getView().getModel("i18n").getResourceBundle().getText("title1");
			sap.m.MessageBox.show(errMsg, {
				icon: sap.m.MessageBox.Icon.WARNING,
				title: title,
				actions: [sap.m.MessageBox.Action.DELETE, sap.m.MessageBox.Action.CANCEL],
				onClose: function (sAction) {
					if (sAction === "DELETE") {

						var evtContext = tbl._aSelectedPaths[0];
						if (evtContext != undefined && evtContext != null && evtContext != "") {
							var oIndex = parseInt(evtContext.substring(evtContext.lastIndexOf('/') + 1));
							var url = host +
								"/Z_VEHICLE_CATALOGUE_SRV/FileReadSet?$filter=(Language eq 'EN' and Lastupdate eq '20190125' and FileName eq 'lexus.png')";
							var modelSupp = sap.ui.getCore().getModel("suppTblModel");
							var tblData = modelSupp.getData();
							var FileName = tblData[oIndex].FileName;
							var Language = tblData[oIndex].Language;
							var Lastupdate = tblData[oIndex].Lastupdate;
							var url2 = host +
								"/Z_VEHICLE_CATALOGUE_SRV/FileSet(Comment='X',FileName='" + FileName + "',Language='" + Language +
								"',Lastupdate='" + Lastupdate + "',Tab='suppliment',Model='" + modelAdmData.modelDesc + "',Model_year='" + modelAdmData.moYear +
								"',Tciseries='" + modelAdmData.series + "',Brand='" + modelAdmData.brand + "')/$value";
							var token;

							$.ajax({
								url: url2,
								type: 'GET',
								beforeSend: function (xhr) {
									xhr.setRequestHeader("X-CSRF-Token", "Fetch");
								},
								complete: function (xhr) {
									token = xhr.getResponseHeader("X-CSRF-Token");
									//oBusyDialog.open();
									$.ajax({
										url: url2,
										method: 'PUT',
										async: false,
										dataType: "json",
										beforeSend: function (xhr) {
											xhr.setRequestHeader('X-CSRF-Token', token);
										},
										success: function (data, textStatus, jqXHR) {
											tblData.splice(oIndex, 1);
											modelSupp.setData(data);
											tbl.setModel(modelSupp);
										},
										error: function (jqXHR, textStatus, errorThrown) {
											var errMsg = AdminDetailCntroller.getView().getModel("i18n").getResourceBundle().getText("Error1");
											sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR,
												"Error", sap.m.MessageBox.Action.OK, null, null);
										}

									});
								}
							});
						}
						tbl.removeSelections("true");
					} else {
						// 
					}
				},
				styleClass: "",
				initialFocus: null,
				textDirection: sap.ui.core.TextDirection.Inherit,
				contentWidth: "10rem"
			});
		},

		_uploadFileWalkUp: function () {

			var sDialogName = "WalkupDialog";
			AdminDetailCntroller.mDialogs = AdminDetailCntroller.mDialogs || {};
			var oDialog = AdminDetailCntroller.mDialogs[sDialogName];

			if (!oDialog) {
				oDialog = new WalkupDialog(AdminDetailCntroller.getView());
				AdminDetailCntroller.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(AdminDetailCntroller.oRouter);
			}
			oDialog.open();

		},
		_deleteFileWalkUp: function (evt) {
			var host = AdminDetailCntroller.host();
			var tbl = evt.getSource().getParent().getParent();
			var modelAdm = sap.ui.getCore().getModel("modelAdmin");
			var modelAdmData = modelAdm.getData();
			var errMsg = "Are you sure you want to Delete the selected Walk Up PDF?"; //AdminDetailCntroller.getView().getModel("i18n").getResourceBundle().getText("deleteError");
			var title = "Delete"; //AdminDetailCntroller.getView().getModel("i18n").getResourceBundle().getText("title1");
			sap.m.MessageBox.show(errMsg, {
				icon: sap.m.MessageBox.Icon.WARNING,
				title: title,
				actions: [sap.m.MessageBox.Action.DELETE, sap.m.MessageBox.Action.CANCEL],
				onClose: function (sAction) {
					if (sAction === "DELETE") {
						var evtContext = tbl._aSelectedPaths[0];
						if (evtContext != undefined && evtContext != null && evtContext != "") {

							var oIndex = parseInt(evtContext.substring(evtContext.lastIndexOf('/') + 1));
							var url = host +
								"/Z_VEHICLE_CATALOGUE_SRV/FileReadSet?$filter=(Language eq 'EN' and Lastupdate eq '20190125' and FileName eq 'lexus.png')";
							var modelSupp = sap.ui.getCore().getModel("walkUpTblModel");
							var tblData = modelSupp.getData();
							var FileName = tblData[oIndex].FileName;
							var Language = tblData[oIndex].Language;
							var Lastupdate = tblData[oIndex].Lastupdate;
							var url2 = host +
								"/Z_VEHICLE_CATALOGUE_SRV/FileSet(Comment='X',FileName='" + FileName + "',Language='" + Language +
								"',Lastupdate='" + Lastupdate + "',Tab='Walkup',Model='" + modelAdmData.modelDesc + "',Model_year='" + modelAdmData.moYear +
								"',Tciseries='" + modelAdmData.series + "',Brand='" + modelAdmData.brand + "')/$value";
							var token;

							$.ajax({
								url: url2,
								type: 'GET',
								beforeSend: function (xhr) {
									xhr.setRequestHeader("X-CSRF-Token", "Fetch");
								},
								complete: function (xhr) {
									token = xhr.getResponseHeader("X-CSRF-Token");
									//oBusyDialog.open();
									$.ajax({
										url: url2,
										method: 'PUT',
										async: false,
										dataType: "json",
										beforeSend: function (xhr) {
											xhr.setRequestHeader('X-CSRF-Token', token);
										},
										success: function (data, textStatus, jqXHR) {
											tblData.splice(oIndex, 1);
											modelSupp.setData(data);
											tbl.setModel(modelSupp);
										},
										error: function (jqXHR, textStatus, errorThrown) {
											var errMsg = AdminDetailCntroller.getView().getModel("i18n").getResourceBundle().getText("Error1");
											sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR,
												"Error", sap.m.MessageBox.Action.OK, null, null);
										}

									});
								}
							});
						}
						tbl.removeSelections("true");
					} else {
						//
					}
				},
				styleClass: "",
				initialFocus: null,
				textDirection: sap.ui.core.TextDirection.Inherit,
				contentWidth: "10rem"
			});
		},

		onExit: function () {

			// to destroy templates for bound aggregations when templateShareable is true on exit to prevent duplicateId issue
			var aControls = [{
				"controlId": "Fiori_ObjectPage_ObjectPage_0-7dv6xu49yygm4tzw80vs3ct86_S6-sections-Fiori_ObjectPage_Section-1539460260893-sectionContent-Fiori_ObjectPage_Table-1",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ObjectPage_ObjectPage_0-7dv6xu49yygm4tzw80vs3ct86_S6-sections-Fiori_ObjectPage_Section-1539469900266-sectionContent-Fiori_ObjectPage_Table-1",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1-7dv6xu49yygm4tzw80vs3ct86_S6-sectionContent-Fiori_ObjectPage_Table-1539392797516",
				"groups": ["items"]
			}];
			for (var i = 0; i < aControls.length; i++) {
				var oControl = AdminDetailCntroller.getView().byId(aControls[i].controlId);
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