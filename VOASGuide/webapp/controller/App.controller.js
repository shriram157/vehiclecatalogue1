sap.ui.define([
	"com/sap/build/toyota-canada/vehiclesGuideV3/controller/BaseController"
], function (BaseController) {
	"use strict";
	var AppController;

	return BaseController.extend("com.sap.build.toyota-canada.vehiclesGuideV3.controller.App", {
		
		onInit: function () {
			AppController = this;
			// AppController._user();
			AppController.userAPI();
			var bpModel = sap.ui.getCore().getModel("BpDealerModel");
			if (bpModel) {
				if (bpModel.getData()[0].Division == "10") {
					AppController.getView().byId("idLogo").setSrc("images/Toyota.png");
				} else {
					AppController.getView().byId("idLogo").setSrc("images/Lexus.png");
				}
			}
			else{
					AppController.getView().byId("idLogo").setSrc("images/Toyota.png");
			}

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
			var bpModel = new sap.ui.model.json.JSONModel(userAttributesData.attributes);
			sap.ui.getCore().setModel(bpModel, "BpDealerModel");
			var userAttModel = new sap.ui.model.json.JSONModel(userAttributesData.samlAttributes);
			sap.ui.getCore().setModel(userAttModel, "userAttributesModel");
			var userLoggedData = {
				"loggedUserType":["TCI_Admin"] //["TCI_User"]//["Dealer_User"]
			};
			var userModel = new sap.ui.model.json.JSONModel(userLoggedData);
			sap.ui.getCore().setModel(userModel, "userModel");
		},

		onAfterRendering:function(){
		//this.getUserLanguage();	
		this.getBrowserLanguage();
		},

		userAPI: function () {
			var host = AppController.hostAPI();
			$.ajax({
				url: host + "/userDetails/attributes",
				type: "GET",
				dataType: "json",
				async: false,
				success: function (oData) {
					console.log(oData);
					var bpModel = new sap.ui.model.json.JSONModel(oData.attributes);
					sap.ui.getCore().setModel(bpModel, "BpDealerModel");
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
					console.log(Data);
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