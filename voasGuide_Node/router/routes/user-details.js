/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, quotes: 0, no-use-before-define: 0, new-cap:0 */
"use strict";

module.exports = function (appContext) {
	var express = require('express');
	var request = require('request');
	var xsenv = require("@sap/xsenv");

	var auth64;

	var routerLogger = appContext.createLogContext().getLogger("/Application/Route/UserDetails");
	var uaaService = xsenv.getServices({
		uaa: {
			tag: "xsuaa"
		}
	});
	var uaa = uaaService.uaa;
	if (!uaa) {
		routerLogger.error('uaa service not found');
		res.status(401).json({
			message: "uaa service not found"
		});
		return;
	}

//var express = require('express');
// const correlator = require('correlation-id');
var app = express();
  
//	var app = express.Router();
	var options = {};

	 
	options = Object.assign(options, xsenv.getServices({
		api: {
			name: "VEHICLE_CATALOGUE_APIM_CUPS"
		}
	}));

	var uname = options.api.user,
		pwd = options.api.password,
		url = options.api.host,
		APIKey = options.api.APIKey,
		client = options.api.client;

	auth64 = 'Basic ' + new Buffer(uname + ':' + pwd).toString('base64');

	var reqHeader = {
		"Authorization": auth64,
		"Content-Type": "application/json",
		"APIKey": APIKey,
		"x-csrf-token": "Fetch"
	};

	//Security Attributes received via UserAttributes via Passport
	app.get("/attributes", (req, res) => {
		var logger = req.loggingContext.getLogger("/Application/Route/UserDetails/Attributes");
		var tracer = req.loggingContext.getTracer(__filename);
		
		logger.info("attributes fetch started");
			//	res.type("application/json").status(200).send(JSON.stringify(req.authInfo.userAttributes));
		var receivedData = {};

		var sendToUi = {
			"attributes": [],
			"samlAttributes": [],
			legacyDealer: "",
			legacyDealerName: ""
		};
		
// =====================================================================================

       logger.info("user Attributes: %s", req.authInfo.userAttributes);

	//	console.log(req.authInfo.userAttributes);
		var parsedData = JSON.stringify(req.authInfo.userAttributes);
	//	console.log('After Json Stringify', parsedData);
 
        logger.info('After Json Stringify: %s', parsedData);
		var obj = JSON.stringify(req.authInfo.userAttributes);
		var obj_parsed = JSON.parse(obj);

		var csrfToken;
		var samlData = parsedData;
        
			var obj_data = JSON.parse(parsedData);
		console.log('saml data', samlData);
			  logger.info('saml data: %s', samlData);
		console.log('send to ui data', sendToUi);
			  logger.info('send to ui data: %s', sendToUi);
		let checkSAMLDetails;
		try {
			checkSAMLDetails = obj_data.DealerCode[0];
		} catch (e) {
		  logger.info("No SAML Authentication happened Must be local Run")
 
			var nosamlData = true;
		}


		// } else {
			sendToUi.samlAttributes.push(obj_parsed);
	//	}

		//		 console.log('After Json Stringify', parsedData);

		// =========================================
		var obj_data = JSON.parse(parsedData);
	  logger.info('after json Parse: %s', obj_data);
		var userType = obj_data.UserType[0];

		if (userType == 'Dealer') {
			var legacyDealer = obj_data.DealerCode[0];
		}
		
		if (userType == 'Zone') {
			var zoneToWhichUSerBelongs = obj_data.Zone;
		}
		// var userType = obj_data.UserType[0];
        logger.info('Dealer Number logged in and accessed parts Availability App: %s', legacyDealer);


		if (userType == 'Dealer') {

			var url1 = "/API_BUSINESS_PARTNER/A_BusinessPartner/?$format=json&$filter=SearchTerm2 eq'" + legacyDealer +
				"' &$expand=to_Customer&$format=json&?sap-client=" + client;

		} else {
          
 //           if (userType == 'Zone') {
            	
 //// he is a zone user.            	
 //           	var userZone;
 //           	  switch (zoneToWhichUSerBelongs) {
 //                   case "1":
 //                      userZone = "1000";
 //                       break;
 //                   case "2":
 //                       userZone = "2000";
 //                       break;
 //                   case "3":
 //                      userZone = "3000";   
 //                       break;
 //                   case "4":
 //                      userZone = "5000";
 //                       break;
 //                   case "5":
 //                       userZone = "4000";  
 //                       break;
 //                   case "7":
 //                        userZone = "9000";  
 //                       break;                      
                        
                        
 //                   default:


 //                   }
            	
            	
 //           	var url1 = "API_BUSINESS_PARTNER/A_CustomerSalesArea?&sap-client=" + client +"&$format=json&$filter=SalesOffice eq "+ userZone ; 
            	
            	
            	
 //           } else {
			var url1 = "/API_BUSINESS_PARTNER/A_BusinessPartner/?$format=json&$expand=to_Customer&?sap-client=" + client +
				"&$filter=(BusinessPartnerType eq 'Z001' or BusinessPartnerType eq 'Z004' or BusinessPartnerType eq 'Z005') and zstatus ne 'X' &$orderby=BusinessPartner asc";
         //   }
		}
	  logger.info('Final url being fetched: %s', url + url1);
	  
	  
		request({
			url: url + url1,
			headers: reqHeader

		}, function (error, response, body) {

			var attributeFromSAP;
			if (!error && response.statusCode == 200) {
				csrfToken = response.headers['x-csrf-token'];

				var json = JSON.parse(body);
		 

				for (var i = 0; i < json.d.results.length; i++) {

					receivedData = {};

					var BpLength = json.d.results[i].BusinessPartner.length;
					receivedData.BusinessPartnerName = json.d.results[i].OrganizationBPName1;
					receivedData.BusinessPartnerKey = json.d.results[i].BusinessPartner;
					receivedData.BusinessPartner = json.d.results[i].BusinessPartner.substring(5, BpLength);
					receivedData.BusinessPartnerType = json.d.results[i].BusinessPartnerType;
					receivedData.SearchTerm2 = json.d.results[i].SearchTerm2;

					let attributeFromSAP;
					try {
						attributeFromSAP = json.d.results[i].to_Customer.Attribute1;
					} catch (e) {
					  logger.info("The Data is sent without Attribute value for the BP: %s", json.d.results[i].BusinessPartner);
					}

					switch (attributeFromSAP) {
					case "01":
						receivedData.Division = "10";
						receivedData.Attribute = "01"
						break;
					case "02":
						receivedData.Division = "20";
						receivedData.Attribute = "02"
						break;
					case "03":
						receivedData.Division = "Dual";
						receivedData.Attribute = "03"
						break;
					case "04":
						receivedData.Division = "10";
						receivedData.Attribute = "04"
						break;
					case "05":
						receivedData.Division = "Dual";
						receivedData.Attribute = "05"
						break;
					default:
						receivedData.Division = "10"; //  lets put that as a toyota dealer
						receivedData.Attribute = "01"

					}

				if ((receivedData.BusinessPartner == legacyDealer || receivedData.SearchTerm2 == legacyDealer)  && (userType == 'Dealer')) {
						sendToUi.legacyDealer = receivedData.BusinessPartner,
							sendToUi.legacyDealerName = receivedData.BusinessPartnerName
						sendToUi.attributes.push(receivedData);
						break;
					}

					if (userType == 'Dealer') {
						continue;
					} else {
						sendToUi.attributes.push(receivedData);
					}
				}

				res.type("application/json").status(200).send(sendToUi);
			  logger.info('Results sent successfully');
			} else {

				var result = JSON.stringify(body);
				res.type('application/json').status(400).send(result);
			}
		});
		


	});

    // call with multiple requests. 
    
    app.get("/currentScopesForUser", (req, res) => {
		var logger = req.loggingContext.getLogger("/Application/Route/UserDetails/CurrentScopesForUser");
		var tracer = req.loggingContext.getTracer(__filename);
		var xsAppName = uaa.xsappname
		var scopes = req.authInfo.scopes;
		var userAttributes = req.authInfo.userAttributes;

		var role = "Unknown";
		var manageVOASGuide = false;
		var viewVOASGuidesDealerNet = false;
		var viewVOASGuidesMSRP = false;
		var viewVOASGuidesUnreleased = false;

		for (var i = 0; i < scopes.length; i++) {
			if (scopes[i] === xsAppName + ".Manage_VOAS_Guides") {
				manageVOASGuide = true;
			} else if (scopes[i] === xsAppName + ".View_VOAS_Guides_Dealer_Net") {
				viewVOASGuidesDealerNet = true;
			} else if (scopes[i] === xsAppName + ".View_VOAS_Guides_MSRP") {
				viewVOASGuidesMSRP = true;
			} else if (scopes[i] === xsAppName + ".View_VOAS_Guides_Unreleased") {
				viewVOASGuidesUnreleased = true;
			} else {
				console.warn("Unrecognized scope: " + scopes[i]);
			}
		};

		console.log("manageVOASGuide: " + manageVOASGuide);
		console.log("viewVOASGuidesDealerNet: " + viewVOASGuidesDealerNet);
		console.log("viewVOASGuidesMSRP: " + viewVOASGuidesMSRP);
		console.log("viewVOASGuidesUnreleased: " + viewVOASGuidesUnreleased);

		if (!manageVOASGuide && viewVOASGuidesDealerNet && viewVOASGuidesMSRP && !viewVOASGuidesUnreleased) {
			role = (userAttributes.UserType[0] === "Dealer") ? "Dealer_Admin" : "TCI_User_Dealer_Net";
		} else if (!manageVOASGuide && !viewVOASGuidesDealerNet && viewVOASGuidesMSRP && !viewVOASGuidesUnreleased) {
			role = (userAttributes.UserType[0] === "Dealer") ? "Dealer_User" : "TCI_User";
		} else if (manageVOASGuide && viewVOASGuidesDealerNet && viewVOASGuidesMSRP && viewVOASGuidesUnreleased) {
			role = "TCI_Admin";
		} else if (!manageVOASGuide && !viewVOASGuidesDealerNet && viewVOASGuidesMSRP && viewVOASGuidesUnreleased) {
			role = "TCI_User_Preliminary";
		} else if (!manageVOASGuide && viewVOASGuidesDealerNet && viewVOASGuidesMSRP && viewVOASGuidesUnreleased) {
			role = "TCI_User_Preliminary_Dealer_Net";
		}
		console.log("role: " + role);

		return res.type("text/plain").status(200).send(JSON.stringify({
			loggedUserType: [
				role
			]
		}));
	});
	return app;
};