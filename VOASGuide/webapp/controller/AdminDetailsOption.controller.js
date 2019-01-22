sap.ui.define(["com/sap/build/toyota-canada/vehiclesGuideV3/controller/BaseController",
	"sap/m/MessageBox",
	"./util/SuplementalDialog", "./util/WhatsNewDialog", "./util/WalkupDialog",
	"./util/utilities",
	"sap/ui/core/routing/History"
], function (BaseController, MessageBox, SuplementalDialog, WhatsNewDialog, WalkupDialog, Utilities, History) {
	"use strict";

	return BaseController.extend("com.sap.build.toyota-canada.vehiclesGuideV3.controller.AdminDetailsOption", {
		handleRouteMatched: function (oEvent) {
			var sAppId = "App5bb531dd96990b5ac99be4fa";
			var oParams = {};
			if (oEvent.mParameters.data.context) {
				this.sContext = oEvent.mParameters.data.context;
			} else {
				if (this.getOwnerComponent().getComponentData()) {
					var patternConvert = function (oParam) {
						if (Object.keys(oParam).length !== 0) {
							for (var prop in oParam) {
								if (prop !== "sourcePrototype") {
									return prop + "(" + oParam[prop][0] + ")";
								}
							}
						}
					};
					this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);
				}
			}
			var oPath;
			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}
		},
			_uploadPDFFileSup: function (oEvent) {
alert("This should update or create What's New record.");

			oEvent = jQuery.extend(true, {}, oEvent);
			return new Promise(function (fnResolve) {
					fnResolve(true);
				})
				.then(function (result) {
					////////////////////////////
					
					
					
					///////////////
					alert("This should update or create What's New record.");

				}.bind(this))
				.then(function (result) {
					if (result === false) {
						return false;
					} else {

						this.close();

					}
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
		},

		_onFioriObjectPageHeaderPress: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			var oQueryParams = this.getQueryParameters(window.location);

			if (sPreviousHash !== undefined || oQueryParams.navBackToLaunchpad) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
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
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];

			if (!oDialog) {
				oDialog = new WhatsNewDialog(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			oDialog.open();

		},
			_uploadFileSupp: function () {

			var sDialogName = "SuplementalDialog";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];

			if (!oDialog) {
				oDialog = new SuplementalDialog(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			oDialog.open();

		},
		_deleteWhatNew: function () {
			var errMsg = "Are you sure you want to Delete the selected What's New PDF?"; //this.getView().getModel("i18n").getResourceBundle().getText("deleteError");
			var title = "Delete"; //this.getView().getModel("i18n").getResourceBundle().getText("title1");
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
						//		this.deleteAtt(evtContext);
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
			console.log(evt.getSource().oParent);
			console.log(evt.getSource().getParent());
			var tbl=evt.getSource().getParent().getParent();
			var errMsg = "Are you sure you want to Delete the selected Supplemental Guide?"; //this.getView().getModel("i18n").getResourceBundle().getText("deleteError");
			var title = "Delete"; //this.getView().getModel("i18n").getResourceBundle().getText("title1");
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
						console.log(tbl.getSelectedItem());
						console.log(tbl.getBindingContext());
//							console.log(tbl.getSelectedIndex());
					//	var evtContext=tbl.getSelectedItem();
							//	this.deleteAtt(evtContext);
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
		deleteAtt: function (evtContext) {
			var oTable = this.getView().byId("suppTbl");
			var sPath = evtContext.sPath;
			var oIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));
			var model = oTable.getModel();
			var data = model.getProperty("/");
			data.splice(oIndex, 1);
			model.setProperty("/", data);
			oTable.getModel().refresh();
			this.getView().getModel().refresh(true);
		},
		_uploadFileWalkUp: function () {

			var sDialogName = "WalkupDialog";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];

			if (!oDialog) {
				oDialog = new WalkupDialog(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			oDialog.open();

		},
		_deleteFileWalkUp: function () {
			var errMsg = "Are you sure you want to Delete the selected Walk Up PDF?"; //this.getView().getModel("i18n").getResourceBundle().getText("deleteError");
			var title = "Delete"; //this.getView().getModel("i18n").getResourceBundle().getText("title1");
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
						//		this.deleteAtt(evtContext);
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
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("AdminDetailsOption").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			sap.ushell.components.suppTbl=this.getView().byId("suppTbl");
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
				var oControl = this.getView().byId(aControls[i].controlId);
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