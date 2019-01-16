sap.ui.define(["com/sap/build/toyota-canada/vehiclesGuideV3/controller/BaseController",
	"sap/m/MessageBox",
	"./util/CreateVehicleGuideDialog",
	"./util/utilities",
	"sap/ui/core/routing/History"
], function (BaseController, MessageBox, CreateVehicleGuideDialog, Utilities, History) {
	"use strict";

	return BaseController.extend("com.sap.build.toyota-canada.vehiclesGuideV3.controller.DetailsOption", {
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("DetailsOption").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

		},

		handleRouteMatched: function (oEvent) {
			console.log(oEvent.getParameters());
			console.log(oEvent.getParameters().data.num);
				var parseArg = JSON.parse(oEvent.getParameters().data.num);
			console.log(parseArg[0].path);
			var modelDetail = new sap.ui.model.json.JSONModel(parseArg);
			this.getView().setModel(modelDetail, "modelDetail");
			console.log(this.getView().getModel("modelDetail").getData());
		/*	var arg2 = oEvent.getParameters().data.num;
			var pt = "/" + "(" + arg2 + ")";
			var oView = this.getView();
			oView.bindElement({
				path: "/" + (arg2)
			});*/

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
			console.log(oQuery);
		},
		_onFioriObjectPageActionButtonPress: function () {

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
		_onFioriObjectPageActionButtonPress1: function () {

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
		_onFioriObjectPageActionButtonPress2: function () {

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
		_onFioriObjectPageActionButtonPress3: function () {

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
		_onFioriObjectPageActionButtonPress4: function (oEvent) { //Manage series page

			var oBindingContext = oEvent.getSource().getBindingContext();
			console.log(oBindingContext);
			return new Promise(function (fnResolve) {

				this.doNavigate("AdminDetailsOption", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		doNavigate: function (sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oModel = (oBindingContext) ? oBindingContext.getModel() : null;
			console.log(sPath);
			console.log(oModel);
			var sEntityNameSet;
			if (sPath !== null && sPath !== "") {
				if (sPath.substring(0, 1) === "/") {
					sPath = sPath.substring(1);
				}
				sEntityNameSet = sPath.split("(")[0];
			}
			var sNavigationPropertyName;
			var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;

			if (sEntityNameSet !== null) {
				sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet,
					sRouteName);
			}
			console.log(sNavigationPropertyName);
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
			console.log(sPath);
		},

		onExit: function () {

			// to destroy templates for bound aggregations when templateShareable is true on exit to prevent duplicateId issue
			var aControls = [{
				"controlId": "Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-2-sectionContent-Fiori_ObjectPage_Table-1",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1538676529951-sectionContent-Fiori_ObjectPage_Table-1",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1538676692578-sectionContent-Fiori_ObjectPage_Table-1539290746962",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1538676734294-sectionContent-Fiori_ObjectPage_Table-1539290840643",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1538676763485-sectionContent-Fiori_ObjectPage_Table-1539291072034",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1538676754780-sectionContent-Fiori_ObjectPage_Table-1539291098748",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1538676721284-sectionContent-Fiori_ObjectPage_Table-1539291137618",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1538676747847-sectionContent-Fiori_ObjectPage_Table-1539291122586",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1539785703581-sectionContent-Fiori_ObjectPage_Table-1",
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
}, true);