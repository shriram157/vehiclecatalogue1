sap.ui.define(["com/sap/build/toyota-canada/vehiclesGuideV3/controller/BaseController",
	"sap/m/MessageBox",
	"./util/CreateVehicleGuideDialog", "./util/CreatePocketSummaryDialog",
	"./util/SuplementalDialog", "./util/WalkupDialog", "./util/CreateWhatsNewDialog",
	"./util/utilities",
	"sap/ui/core/routing/History"
], function (BaseController, MessageBox, CreateVehicleGuideDialog, CreatePocketSummaryDialog, SuplementalDialog, WalkupDialog,
	CreateWhatsNewDialog, Utilities, History) {
	"use strict";

	return BaseController.extend("com.sap.build.toyota-canada.vehiclesGuideV3.controller.SearchPage", {
		handleRouteMatched: function (oEvent) {
			var arg = oEvent.getParameter("arguments");

			console.log(arg.context);

			var sAppId = "App5bb531dd96990b5ac99be4fa";

			var oParams = {};

			if (oEvent.mParameters.data.context) {
				this.sContext = oEvent.mParameters.data.context;
				console.log(oEvent.mParameters);
				console.log(oEvent.mParameters.data.context);
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
		_onWhatsNew: function () {

			var sDialogName = "CreateWhatsNewDialog";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];

			if (!oDialog) {
				oDialog = new CreateWhatsNewDialog(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			oDialog.open();

		},
		_onWalkUp: function () {

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
		_onSupplemental: function () {

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
		_onCreateVehGuide: function () {

			var sDialogName = "CreateVehicleGuideDialog";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];

			if (!oDialog) {
				oDialog = new CreateVehicleGuideDialog(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			oDialog.open();

		},
		_onCreatePocSum: function () {
			var sDialogName = "CreatePocketSummaryDialog";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new CreatePocketSummaryDialog(this.getView());
				this.mDialogs[sDialogName] = oDialog;
				oDialog.setRouter(this.oRouter);
			}
			oDialog.open();
		},

		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("SearchPage").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
		},

		_navToDetail: function (oEvent) {
			var oCtx;
			var oBindingContext = oEvent.getParameter("listItem").getBindingContext();
			oCtx = oBindingContext;
			var sPath = oCtx.sPath;
			var sEntityNameSet2 = sPath.split("/")[2];
			this.oRouter.navTo("DetailsOption", {
				num: sEntityNameSet2
			});
		},


		_navToCompare: function (oEvent) {
			var arr = [];
			var oTable = this.getView().byId("idTbl_Search");
			var aContexts = oTable.getSelectedContextPaths(); 
			if(aContexts.length<=5&&aContexts.length>=2){
			for (var i = 0; i < aContexts.length; i++) {
				var index = aContexts[i].split("/")[2];
				arr.push(index);
			}
			var num2 = JSON.stringify(arr);
			this.oRouter.navTo("CompareDetailsOption", {
				num2: num2
			});
		oTable.removeSelections("true");}
		else{
			//	var errMsg = this.getView().getModel("i18n").getResourceBundle().getText(errForm);
			var errMsg="Select atleast 2 and maximum 5 items to compare";
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
					this.doNavigate("DetailsOption", oBindingContext, fnResolve, "");
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});

			},*/
		doNavigate: function (sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oModel = (oBindingContext) ? oBindingContext.getModel() : null;
			console.log(sPath);
			//	var sEntityNameSet2 = sPath.split("/")[2];
			var arr = [];
			arr = sPath;
			console.log(arr);
			var sEntityNameSet;
			if (sPath !== null && sPath !== "") {
				if (sPath.substring(0, 1) === "/") {
					sPath = sPath.substring(1);
				}
				sEntityNameSet = sPath.split("/")[0]; //comment this when service comes
				//	sEntityNameSet = sPath.split("(")[0]; //uncomment this when service comes
			}
			var sNavigationPropertyName;
			var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;
			if (sEntityNameSet !== null) {
				sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet,
					sRouteName);
			}

			if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
				if (sNavigationPropertyName === "") {
					this.oRouter.navTo(sRouteName, {
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

						// If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
						if (sPath === "undefined") {
							this.oRouter.navTo(sRouteName);
						} else {
							this.oRouter.navTo(sRouteName, {
								context: sPath,
								masterContext: sMasterContext
							}, false);
						}
					}.bind(this));
				}
			} else {
				this.oRouter.navTo(sRouteName);
			}

			if (typeof fnPromiseResolve === "function") {
				fnPromiseResolve();
			}

		},

		_onSearchTableUpdate: function (oEvent) {
			var oTable = oEvent.getSource();
			var oHeaderbar = oTable.getAggregation("headerToolbar");
			if (oHeaderbar && oHeaderbar.getAggregation("content")[1]) {
				var oTitle = oHeaderbar.getAggregation("content")[1];
				if (oTable.getBinding("items") && oTable.getBinding("items").isLengthFinal()) {
					oTitle.setText("(" + oTable.getBinding("items").getLength() + ")");
				} else {
					oTitle.setText("(1)");
				}
			}

		},
		/*	_navToCompare: function (oEvent) {

				var oBindingContext = oEvent.getSource().getBindingContext();

				return new Promise(function (fnResolve) {

					this.doNavigate("CompareDetailsOption", oBindingContext, fnResolve, "");
				}.bind(this)).catch(function (err) {
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