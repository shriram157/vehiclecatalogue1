sap.ui.define([
	"com/sap/build/toyota-canada/vehiclesGuideV3/controller/BaseController"
], function (BaseController) {
	"use strict";
	var AppController;

	return BaseController.extend("com.sap.build.toyota-canada.vehiclesGuideV3.controller.App", {
		onInit: function () {
			AppController = this;
			AppController.userAPI();
			var urlParamsModel = sap.ui.getCore().getModel("urlParamsModel");
			var logoPath = "images/Toyota.png";
			if (urlParamsModel && urlParamsModel.getData().Division === "20") {
				logoPath = "images/Lexus.png";
			}
			AppController.getView().byId("idLogo").setSrc(logoPath);
		},

		_user: function () {
			var userAttributesData = {
				"attributes": [{
					"BusinessPartnerName": "Don Valley North Toyota",
					"BusinessPartnerKey": "2400042120",
					"BusinessPartner": "42120",
					"BusinessPartnerType": "Z001",
					"SearchTerm2": "42120",
					"Division": "10", //20 lexus
					"Attribute": "01"
				}],
				"samlAttributes": {
					"DealerCode": ["42120"],
					"Language": ["English"],
					"UserType": ["Dealer"]
				},
				"legacyDealer": "42120",
				"legacyDealerName": "Don Valley North Toyota"
			};
			var userAttModel = new sap.ui.model.json.JSONModel(userAttributesData.samlAttributes);
			sap.ui.getCore().setModel(userAttModel, "userAttributesModel");
			var userLoggedData = {
				"loggedUserType": ["TCI_Admin"] //["TCI_User"]//["Dealer_User"]
			};
			var userModel = new sap.ui.model.json.JSONModel(userLoggedData);
			sap.ui.getCore().setModel(userModel, "userModel");
		},

		onAfterRendering: function () {
			this.getView().setModel(this.getOwnerComponent().getModel("i18n"), "i18n");
		},

		userAPI: function () {
			// Store URL params into a model
			var urlParamsModel = new sap.ui.model.json.JSONModel();
			var division = jQuery.sap.getUriParameters().get('Division');
			if (!division) {
				division = "10";
			}
			var language = jQuery.sap.getUriParameters().get('Language');
			if (!language) {
				language = "en";
			}
			urlParamsModel.setData({
				Division: division,
				Language: language
			});
			sap.ui.getCore().setModel(urlParamsModel, "urlParamsModel");

			var host = AppController.hostAPI();
			$.ajax({
				url: host + "/userDetails/attributes",
				type: "GET",
				dataType: "json",
				async: false,
				success: function (oData) {
					var userAttModel = new sap.ui.model.json.JSONModel(oData.samlAttributes);
					sap.ui.getCore().setModel(userAttModel, "userAttributesModel");
				},
				error: function (response) {
					console.log("error in user Detail Attributes API");
				}
			});
			$.ajax({
				url: host + "/userDetails/currentScopesForUser",
				type: "GET",
				dataType: "json",
				async: false,
				success: function (Data) {
					var userModel = new sap.ui.model.json.JSONModel(Data);
					sap.ui.getCore().setModel(userModel, "userModel");
				},
				error: function () {
					console.log("error in user API");
				}
			});
		}

	});

});
