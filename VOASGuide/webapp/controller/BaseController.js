sap.ui.define([
	"sap/ui/core/mvc/Controller",
	/*"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/oDataModel",*/
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/core/routing/History",
	
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
			//this.nodeJsUrl = this.sPrefix + "/node";
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
			var oI18nModel = new ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			this.getView().setModel(oI18nModel, "i18n");
			var userAttributesModel = sap.ui.getCore().getModel("userAttributesModel");
			var langData, Language;
			if (userAttributesModel) {
				langData = userAttributesModel.getData();
				Language = langData.Language[0];
				if (Language == "English") {
					var i18nModel = new ResourceModel({
						bundleUrl: "i18n/i18n.properties",
						bundleLocale: ("en")
					});
					this.getView().setModel(i18nModel, "i18n");
					this.sCurrentLocale = 'EN';
				} else {
					var i18nModel = new ResourceModel({
						bundleUrl: "i18n/i18n.properties",
						bundleLocale: ("fr")
					});
					this.getView().setModel(i18nModel, "i18n");
					this.sCurrentLocale = 'FR';
				}
			}

		},
		getBrowserLanguage: function () {
			var oI18nModel = new ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			this.getView().setModel(oI18nModel, "i18n");

			var isLocaleSent = window.location.search.match(/language=([^&]*)/i);
			if (isLocaleSent) {
				var sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
			} else {
				var sSelectedLocale = "EN"; // default is english 
			}
			//selected language. 
			// if (window.location.search == "?language=fr") {
			if (sSelectedLocale == "fr" || sSelectedLocale == "fr/") {
				var i18nModel = new ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				this.getView().setModel(i18nModel, "i18n");
				this.sCurrentLocale = 'FR';

			} else {
				var i18nModel = new ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				this.getView().setModel(i18nModel, "i18n");
				this.sCurrentLocale = 'EN';
			}
		},
		returnBrowserLanguage: function () {
			var oI18nModel = new ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			this.getView().setModel(oI18nModel, "i18n");

			var isLocaleSent = window.location.search.match(/language=([^&]*)/i);
			if (isLocaleSent) {
				var sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
			} else {
				var sSelectedLocale = "EN"; // default is english 
			}
			//selected language. 
			// if (window.location.search == "?language=fr") {
			if (sSelectedLocale == "fr" || sSelectedLocale == "fr/"|| sSelectedLocale == "FR"|| sSelectedLocale == "FR/") {
				var i18nModel = new ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				this.getView().setModel(i18nModel, "i18n");
				this.sCurrentLocale = 'FR';

			} else {
				var i18nModel = new ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				this.getView().setModel(i18nModel, "i18n");
				this.sCurrentLocale = 'EN';
			}
			this.getView().setModel(new sap.ui.model.json.JSONModel({"Language" : this.sCurrentLocale}), "ModelLocale");
		
			return this.sCurrentLocale;
		}

	
			/*var i18nModel;
			var sLocale;
			var oI18nModel = new ResourceModel({
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

		// 	 i18nModel = new ResourceModel({
		// 		bundleUrl: "i18n/i18n_fr.properties",
		// 		bundleLocale: ("fr")

		// 	});
		// 	this.getView().setModel(i18nModel, "i18n");
		// 	this.sCurrentLocale = 'FR';
		// 	// set the right image for logo	 - french		

		// 	currentImageSource.setProperty("src", "images/Lexus_FR.png");

		// } else {
		// 	 i18nModel = new ResourceModel({
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