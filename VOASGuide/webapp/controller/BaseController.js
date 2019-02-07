sap.ui.define([
	"sap/ui/core/mvc/Controller",
	/*"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/oDataModel",*/
	"/sap/ui/model/resource/ResourceModel",
	"sap/ui/core/routing/History"
], function (Controller, ResourceModel, History) {
	"use strict";
	var baseController;
	return Controller.extend("com.sap.build.toyota-canada.vehiclesGuideV3.controller.BaseController", {
		onInit: function () {
			baseController = this;
			var r = baseController.getRouter();
			r.attachBypassed(function (evt) {
				var hash = evt.getParameter('hash');
				jQuery.sap.log.info("sorry invalid hash " + hash + ". Try valid hash");
			});
			r.attachRouteMatched(function (evt) {
				var name = evt.getParameter('name');
				jQuery.sap.log.info("Route name is : " + name);
			});
		},
		getLoggedUser:function(){
			var host=this.hostAPI();
			var user="";
	/*	$.ajax({
				url: host + "/userDetails/currentScopesForUser",
				type: "GET",
				dataType: "json",
				success: function (Data) {
					console.log(Data);
					var userModel = new sap.ui.model.json.JSONModel(Data);
					var userData=userModel.getData();
					user=userData.loggedUserType;
				},
				error: function () {
					console.log("error in user API");
				}
			});	*/
			return user;
		},

		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(baseController);
		},

		host: function () {
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");
			if (sLocation_conf == 0) {
				this.sPrefix = "/voasguide_node";
			} else {
				this.sPrefix = "";
			}
			this.nodeJsUrl = this.sPrefix + "/node";

			return this.nodeJsUrl;
		},
		hostAPI: function () {
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");
			if (sLocation_conf == 0) {
				this.sPrefix = "/voasguide_node";
			} else {
				this.sPrefix = "";
			}
			//	this.nodeJsUrl = this.sPrefix + "/node";
			return this.sPrefix;
		},
		onNavBack: function (oEvent) {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			var oQueryParams = this.getQueryParameters(window.location);

			if (sPreviousHash !== undefined || oQueryParams.navBackToLaunchpad) {
				window.history.go(-1);
			} else {
				//	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				baseController.getRouter().navTo("default", true);
			}
		},

		notfound: function () {
			baseController.getRouter().getTargets().display("notFound", { //go to not found
				fromTarget: "SearchPage" //go to view 1 from not found 
			});
		},
		getUserLanguage: function () {
			var oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			this.getView().setModel(oI18nModel, "i18n");
			var userAttributesModel = sap.ui.getCore().getModel("userAttributesModel");
			var langData, Language;
			if (userAttributesModel) {
				langData = userAttributesModel.getData();
				Language = langData[0].Language[0];
				if (Language == "English") {
					var i18nModel = new sap.ui.model.resource.ResourceModel({
						bundleUrl: "i18n/i18n.properties",
						bundleLocale: ("en")
					});
					this.getView().setModel(i18nModel, "i18n");
					this.sCurrentLocale = 'EN';
				} else {
					var i18nModel = new sap.ui.model.resource.ResourceModel({
						bundleUrl: "i18n/i18n.properties",
						bundleLocale: ("fr")
					});
					this.getView().setModel(i18nModel, "i18n");
					this.sCurrentLocale = 'FR';
				}
			}

		},
		getBrowserLanguage: function () {
			var oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			this.getView().setModel(oI18nModel, "i18n");

			var isLocaleSent = window.location.search.match(/language=([^&]*)/i);
			console.log(isLocaleSent);
			if (isLocaleSent) {
				var sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
			} else {
				var sSelectedLocale = "EN"; // default is english 
			}
			console.log(sSelectedLocale);
			//selected language. 
			// if (window.location.search == "?language=fr") {
			if (sSelectedLocale == "fr" || sSelectedLocale == "fr/") {
				var i18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				this.getView().setModel(i18nModel, "i18n");
				this.sCurrentLocale = 'FR';

			} else {
				var i18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				this.getView().setModel(i18nModel, "i18n");
				this.sCurrentLocale = 'EN';
			}
		},
		returnBrowserLanguage: function () {
			var oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			this.getView().setModel(oI18nModel, "i18n");

			var isLocaleSent = window.location.search.match(/language=([^&]*)/i);
			console.log(isLocaleSent);
			if (isLocaleSent) {
				var sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
			} else {
				var sSelectedLocale = "EN"; // default is english 
			}
			console.log(sSelectedLocale);
			//selected language. 
			// if (window.location.search == "?language=fr") {
			if (sSelectedLocale == "fr" || sSelectedLocale == "fr/"|| sSelectedLocale == "FR"|| sSelectedLocale == "FR/") {
				var i18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				this.getView().setModel(i18nModel, "i18n");
				this.sCurrentLocale = 'FR';

			} else {
				var i18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				this.getView().setModel(i18nModel, "i18n");
				this.sCurrentLocale = 'EN';
			}
			return this.sCurrentLocale;
		},

		handleBaseLinkPress: function (oEvent) {
				this.oBundle = this.getView().getModel("i18n").getResourceBundle();
				var oGetText = oEvent.getSource().getText();
				if (oGetText === this.oBundle.getText("menu1")) {
					this.getOwnerComponent().getRouter().navTo("RetailSoldOrderA"); //page 1
				} else if (oGetText === this.oBundle.getText("menu2")) {
					this.getOwnerComponent().getRouter().navTo("RetailSoldOrderSummary"); //page 10
				} else if (oGetText === this.oBundle.getText("menu3")) {
					this.getOwnerComponent().getRouter().navTo("CreateFleetSoldOrder"); //page 11
				} else if (oGetText === this.oBundle.getText("menu4")) { //dicey sol, check it again 
					//this.getOwnerComponent().getRouter().navTo("FleetSoldOrderSummary");
					if (this.requestStatus == "Pending Fulfilment") {
						this.getOwnerComponent().getRouter().navTo("FleetSoldOrder_ZoneApproval"); //page 13
					} else if (this.requestStatus == "Approved") { //processed
						this.getOwnerComponent().getRouter().navTo("FleetSoldOrder_ProcessedView"); // page 14
					} else {
						this.getOwnerComponent().getRouter().navTo("FleetSoldOrderSummary"); //page 15 
					}
				} else if (oGetText === this.oBundle.getText("menu5")) {
					this.getOwnerComponent().getRouter().navTo("FleetSoldOrderDetails"); //page 16
				} else if (oGetText === this.oBundle.getText("menu6")) {
					this.getOwnerComponent().getRouter().navTo("FleetSoldOrderDetails"); //page 16
				} else if (oGetText === this.oBundle.getText("menu7")) {
					this.getOwnerComponent().getRouter().navTo("RetailSoldOrderB"); //page 2
				} else if (oGetText === this.oBundle.getText("menu8")) {
					this.getOwnerComponent().getRouter().navTo("NationalFleetSoldOrderView"); //page 19
				}

			}
			/*var i18nModel;
			var sLocale;
			var oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			this.getView().setModel(oI18nModel, "i18n");*/
			// sLocale = sap.ui.getCore().getConfiguration().getLanguage();
			// if (sLocale=="en"||sLocale=="en-US"){
			// 	i18nModel = new ResourceModel({
			// 	bundleName: "com.sap.build.toyota-canada.vehiclesGuideV3.i18n.i18n_en"	
			// });
			// this.getView().setModel(i18nModel, "i18n");
			// }
			// else if (sLocale=="de"){
			// 	i18nModel = new ResourceModel({
			// 	bundleName: "com.sap.build.toyota-canada.vehiclesGuideV3.i18n.i18n_de"	
			// });
			// this.getView().setModel(i18nModel, "i18n");
			// }
			// else{
			// 		i18nModel = new ResourceModel({
			// 	bundleName: "com.sap.build.toyota-canada.vehiclesGuideV3.i18n.i18n_en"	
			// });
			// this.getView().setModel(i18nModel, "i18n");
			// }

		// console.log(window.location.search);
		// 	var currentImageSource = this.getView().byId("idLexusLogo");
		// 	if (window.location.search == "?language=fr") {

		// 	 i18nModel = new sap.ui.model.resource.ResourceModel({
		// 		bundleUrl: "i18n/i18n_fr.properties",
		// 		bundleLocale: ("fr")

		// 	});
		// 	this.getView().setModel(i18nModel, "i18n");
		// 	this.sCurrentLocale = 'FR';
		// 	// set the right image for logo	 - french		

		// 	currentImageSource.setProperty("src", "images/Lexus_FR.png");

		// } else {
		// 	 i18nModel = new sap.ui.model.resource.ResourceModel({
		// 		bundleUrl: "i18n/i18n_en.properties",
		// 		bundleLocale: ("en")

		// 	});
		// 	this.getView().setModel(i18nModel, "i18n");
		// 	this.sCurrentLocale = 'EN';
		// 	// set the right image for logo			
		// //	var currentImageSource = this.getView().byId("idLexusLogo");
		// 	currentImageSource.setProperty("src", "images/Lexus_EN.png");

		// }

		// var oModeli18n = this.getView().getModel("i18n");
		// this._oResourceBundle = oModeli18n.getResourceBundle();
		// console.log(this._oResourceBundle);

		/*
				onNavBack: function (oEvent) {
					var oHistory, sPreviousHash;
					oHistory = History.getInstance();
					console.log(oHistory);
					sPreviousHash = oHistory.getPreviousHash();
					console.log(sPreviousHash);
					console.log(window.history);
					if (sPreviousHash !== undefined) {
						window.history.go(-1);
					} else {
						baseController.getRouter().navTo("default", {}, true); // has the value true and makes sure that the
						//	hash is replaced /*no history
					}
				}*/

	});
});