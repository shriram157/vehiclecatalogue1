/*eslint new-cap: 0, no-console: 0, no-shadow: 0, no-unused-vars: 0*/
/*eslint-env es6, node*/

"use strict";

module.exports = function (appContext) {
	var express = require("express");
	var xsenv = require("@sap/xsenv");

	var router = express.Router();

	var mockUserMode = false;
	if (process.env.MOCK_USER_MODE === "true" || process.env.MOCK_USER_MODE === "TRUE") {
		mockUserMode = true;
	}
	var mockUserOrigin = process.env.MOCK_USER_ORIGIN;

	var xsuaaService = xsenv.getServices({
		xsuaa: {
			tag: "xsuaa"
		}
	}).xsuaa;

	router.get("/attributes", (req, res, next) => {
		var logger = req.loggingContext.getLogger("/Application/Route/UserDetails/Attributes");
		var tracer = req.loggingContext.getTracer(__filename);
		try {
			var userProfile = req.user;
			var userAttributes = req.authInfo.userAttributes;
			tracer.debug("User profile from JWT: %s", JSON.stringify(userProfile));
			tracer.debug("User attributes from JWT: %s", JSON.stringify(userAttributes));
	
			// If there is no user type, it is most probably a call from Neo, in which case we can fake the data as TCI user
			if (mockUserMode && mockUserOrigin === req.authInfo.origin) {
				userAttributes = {
					Language: ["English"],
					UserType: ["National"]
				};
				tracer.debug("Mock user mode is enabled and JWT is from origin %s, switch to mock user attributes: %s", req.authInfo.origin, JSON.stringify(
					userAttributes));
			}
	
			var resBody = {
				"userProfile": userProfile,
				"samlAttributes": userAttributes
			};
	
			tracer.debug("Response body: %s", JSON.stringify(resBody));
			return res.type("application/json").status(200).send(resBody);
		} catch (err) {
			next(err);
		}
	});

	router.get("/currentScopesForUser", (req, res, next) => {
		var logger = req.loggingContext.getLogger("/Application/Route/UserDetails/CurrentScopesForUser");
		var tracer = req.loggingContext.getTracer(__filename);
		try {
			var xsAppName = xsuaaService.xsappname;
			var scopes = req.authInfo.scopes;
			var userAttributes = req.authInfo.userAttributes;
	
			tracer.debug("Scopes from JWT: %s", JSON.stringify(scopes));
			tracer.debug("User attributes from JWT: %s", JSON.stringify(userAttributes));
	
			// If there is no user type, it is most probably a call from Neo, in which case we can fake the data as TCI user
			if (mockUserMode && mockUserOrigin === req.authInfo.origin) {
				tracer.debug("Mock user mode is enabled and JWT is from origin %s, switch to mock user type.", req.authInfo.origin);
				return res.type("application/json").status(200).send(JSON.stringify({
					loggedUserType: ["TCI_User"]
				}));
			}
	
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
					tracer.warning("Unrecognized scope: %s", scopes[i]);
				}
			}
	
			var scopeLogMessage = "manageVOASGuide: " + manageVOASGuide + "\n";
			scopeLogMessage += "viewVOASGuidesDealerNet: " + viewVOASGuidesDealerNet + "\n";
			scopeLogMessage += "viewVOASGuidesMSRP: " + viewVOASGuidesMSRP + "\n";
			scopeLogMessage += "viewVOASGuidesUnreleased: " + viewVOASGuidesUnreleased + "\n";
			tracer.debug(scopeLogMessage);
	
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
			tracer.debug("role: %s", role);
	
			return res.type("application/json").status(200).send(JSON.stringify({
				loggedUserType: [
					role
				]
			}));
		} catch (err) {
			next(err);
		}
	});

	return router;
};