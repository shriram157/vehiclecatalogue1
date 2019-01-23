sap.ui.define(["com/sap/build/toyota-canada/vehiclesGuideV3/controller/BaseController",
	"sap/m/MessageBox",
	"./util/SuplementalDialog", "./util/WhatsNewDialog", "./util/WalkupDialog",
	"./util/utilities",
	"sap/ui/core/routing/History"
], function (BaseController, MessageBox, SuplementalDialog, WhatsNewDialog, WalkupDialog, Utilities, History) {
	"use strict";
	var AdminDetailCntroller;
	return BaseController.extend("com.sap.build.toyota-canada.vehiclesGuideV3.controller.AdminDetailsOption", {
		handleRouteMatched: function (oEvent) {
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
		},
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
			alert("Open PDF in New Window");

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
		_deleteWhatNew: function () {
			var errMsg = "Are you sure you want to Delete the selected What's New PDF?"; //AdminDetailCntroller.getView().getModel("i18n").getResourceBundle().getText("deleteError");
			var title = "Delete"; //AdminDetailCntroller.getView().getModel("i18n").getResourceBundle().getText("title1");
			/*	var icon = new sap.ui.core.Icon({
					src: "sap-icon://alert",
					size: "2rem"
				});*/
			/*	var msg = new sap.m.HBox({
				items: [icon, new sap.m.Text({
					text: errMsg
				})]
			});*/
			sap.m.MessageBox.show(errMsg, {
				icon: sap.m.MessageBox.Icon.WARNING,
				title: title,
				actions: [sap.m.MessageBox.Action.DELETE, sap.m.MessageBox.Action.CANCEL],
				onClose: function (sAction) {
					if (sAction === "DELETE") {
						//		AdminDetailCntroller.deleteAtt(evtContext);
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
		_deleteFileSupp: function (evt) {
			var tbl = evt.getSource().getParent().getParent();
			var errMsg = "Are you sure you want to Delete the selected Supplemental Guide?"; //AdminDetailCntroller.getView().getModel("i18n").getResourceBundle().getText("deleteError");
			var title = "Delete"; //AdminDetailCntroller.getView().getModel("i18n").getResourceBundle().getText("title1");
			/*	var icon = new sap.ui.core.Icon({
					src: "sap-icon://alert",
					size: "2rem"
				});*/
			/*	var msg = new sap.m.HBox({
				items: [icon, new sap.m.Text({
					text: errMsg
				})]
			});*/
			sap.m.MessageBox.show(errMsg, {
				icon: sap.m.MessageBox.Icon.WARNING,
				title: title,
				actions: [sap.m.MessageBox.Action.DELETE, sap.m.MessageBox.Action.CANCEL],
				onClose: function (sAction) {
					if (sAction === "DELETE") {
						var evtContext = tbl._aSelectedPaths[0];
						var oIndex = parseInt(evtContext.substring(evtContext.lastIndexOf('/') + 1));
						var model = tbl.getModel();
						console.log(model);
						console.log(model.getData());
						var data = model.getProperty("/");
						data.splice(oIndex, 1);
						console.log(data);
						var modelSupp=sap.ui.getCore().getModel("modelSupp");
						modelSupp.setProperty("/", data);
						modelSupp.setData(data);
						tbl.getModel().refresh();
						console.log(tbl.getModel().getData());
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
		_deleteFileWalkUp: function () {
			var errMsg = "Are you sure you want to Delete the selected Walk Up PDF?"; //AdminDetailCntroller.getView().getModel("i18n").getResourceBundle().getText("deleteError");
			var title = "Delete"; //AdminDetailCntroller.getView().getModel("i18n").getResourceBundle().getText("title1");
			/*	var icon = new sap.ui.core.Icon({
					src: "sap-icon://alert",
					size: "2rem"
				});*/
			/*	var msg = new sap.m.HBox({
				items: [icon, new sap.m.Text({
					text: errMsg
				})]
			});*/
			sap.m.MessageBox.show(errMsg, {
				icon: sap.m.MessageBox.Icon.WARNING,
				title: title,
				actions: [sap.m.MessageBox.Action.DELETE, sap.m.MessageBox.Action.CANCEL],
				onClose: function (sAction) {
					if (sAction === "DELETE") {
						//		AdminDetailCntroller.deleteAtt(evtContext);
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

		onInit: function () {
			AdminDetailCntroller = this;
			AdminDetailCntroller.oRouter = sap.ui.core.UIComponent.getRouterFor(AdminDetailCntroller);
			AdminDetailCntroller.oRouter.getTarget("AdminDetailsOption").attachDisplay(jQuery.proxy(AdminDetailCntroller.handleRouteMatched,
				AdminDetailCntroller));
			sap.ushell.components.suppTbl = AdminDetailCntroller.getView().byId("suppTbl");
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