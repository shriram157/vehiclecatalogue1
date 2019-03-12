jQuery.sap.declare("com.sap.build.toyota-canada.vehiclesGuideV3.Formatter.formatter");

var formatter = {

	formatOptPack: function (str, str2) {
		var feature = "";
		if (str) {
			var res = str.replace(/;/g, "#- ");
			feature = res.split('#').join('\n');
		}
		return feature;
	},
	formatFeatures: function (str, str2) {
		var feat = "";
		var feature = "";
		if (str) {
			var res = str.replace(/;/g, "#- ");
			feat = res.split('#').join('\n');
			feature = "- " + feat;
		}
		return feature;
		///////////
		/*	var res5 = str.replace(/;/g, "#! ");;
			var extra = res5.split('#');
			var len = extra.length;
		//	console.log(len);
			var lendiv = Math.floor(len / 2);
			var arr = [];
			for (var i = 0; i < lendiv; i++) {
				arr.push(extra[i]);
			}
			var string = arr.toString();
		//	console.log(string);

			var arr2 = [];
			for (var q = lendiv; q < len; q++) {
				arr2.push(extra[q]);
			}
			var string2 = arr2.toString();
		//	console.log(string2);
			var res2 = string2.replace(/!/g, "#- ");
			var rturnRes = res2.split('#').join('\n');
*/
		//	console.log(rturnRes);
		///////////

	},
	formatVehicle: function (modelYear, modelCode, ENmodelName, FRmodelName, suff, ENsuffDesc, FRsuffDesc, lang) {
		var vehicle = "";
		if (lang === "FR") {
			vehicle = modelYear + "-" + modelCode + "\n" + FRmodelName + "\n" + "SFX-" + suff + "\n" + FRsuffDesc;
		} else {
			vehicle = modelYear + "-" + modelCode + "\n" + ENmodelName + "\n" + "SFX-" + suff + "\n" + ENsuffDesc;
		}

		return vehicle;
	},
	formatManagePageDate: function (str, str2) {
		var date = "";
		var time="";
		var timeStamp="";
		if (str != "" && str != " " && str != null && str != undefined) {
			var year = str.slice(0, 4);
			var month = str.slice(4, 6);
			var day = str.slice(6, 8);
			date = year + "-" + month + "-" + day;
		}
		if (str2 != "" && str2 != " " && str2 != null && str2 != undefined) {
			var hour = str.slice(0, 2);
			var min = str.slice(2, 4);
			var sec = str.slice(4, 6);
			time = hour + ":" + min + ":" + sec;
		}
		timeStamp=date+ " "+time;
		return timeStamp;
	},
	formatSuffix: function (str, str2) {
		var sufStr = "";
		if (str) {
			var res = " ";
			res = str.substring(0, 1);
			sufStr = "SFX- " + res;
		}
		return sufStr;
	},
	formatSuffixInList: function (str, str2) {
		var sufStr = "";
		if (str) {
			var res = " ";
			res = str.substring(0, 1);
			sufStr = res;
		}
		return sufStr;
	},
	fnFormatIcon: function (val) {
		var sTrimval = "";
		if (val == "yes") {
			return "sap-icon://accept";
		} else {
			return sTrimval;
		}
	},
	decimalFormatter: function (oDecVal, oDecVal2) {

		if (oDecVal != undefined && oDecVal != null && !isNaN(oDecVal) && oDecVal != "") {
			var returnString = "";
			var returnVal = "";
			returnVal = parseInt(oDecVal);
			var commaVal = returnVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			returnString = "$" + commaVal;
			if (returnVal == 0.00) {
				return "";
			} else {
				return returnString;
			}
		} else {
			return "";
		}
	},
	decimalFormatterDealer: function (oDecVal, oDecVal2) {

		if (oDecVal != undefined && oDecVal != null && !isNaN(oDecVal) && oDecVal != "") {
			var returnString = "";
			var returnVal = "";
			returnVal = parseInt(oDecVal);
			var commaVal = returnVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			returnString = "$" + commaVal;
			if (returnVal == 0.00) {
				return "";
			} else {
				return returnString;
			}
		} else {
			return "";
		}
	},
	decimalFormatterDealerMSRP: function (oDecVal, msrp, lang) {
		console.log("language is: " + lang);
		var returnVal = "";
		var returnVal2 = " ";
		var commaVal2 = "";
		var commaVal = "";
		var returnString = "";
		if (oDecVal != undefined && oDecVal != null && !isNaN(oDecVal) && oDecVal != "") {
			returnVal = parseInt(oDecVal);
			commaVal = returnVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
		if (msrp != undefined && msrp != null && !isNaN(msrp) && msrp != "") {
			returnVal2 = parseInt(msrp);
			commaVal2 = returnVal2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}

		if (lang === "FR") {
			returnString = "Prix net conc.: $" + commaVal + "PDSF: $" + commaVal2;
			if (returnVal == 0.00 && returnVal2 == 0) {
				return "Prix net conc.:  PDSF:";
			} else {
				return returnString;
			}
		} else {
			returnString = "Dealer Net: $" + commaVal + "MSRP: $" + commaVal2;
			if (returnVal == 0.00 && returnVal2 == 0) {
				return "DealerNet:  MSRP:";
			} else {
				return "Dealer Net: $" + commaVal + "MSRP: $" + commaVal2;
			}
		}
		//	return returnString;

	}

};

/*	decimalFormatter: function (oDecVal, oDecVal2) {
			//	oDecVal="67894320.89";
			if (oDecVal != undefined && oDecVal != null && !isNaN(oDecVal) && oDecVal != "") {
				var returnVal = parseInt(oDecVal);
				var commaVal = returnVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				// console.log(commaVal);
				var returnString = "MSRP: $" + commaVal;
				if (returnVal == 0.00) {
					return "MSRP: $0";
				} else {
					return returnString;
				}
			} else {
				return "MSRP: $";
			}
		},
		decimalFormatterDealer: function (oDecVal, oDecVal2) {
			if (oDecVal != undefined && oDecVal != null && !isNaN(oDecVal) && oDecVal != "") {
				var returnVal = parseInt(oDecVal);
				var commaVal = returnVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				var returnString = "Dealer Net: $" + commaVal;
				if (returnVal == 0.00) {
					return "Dealer Net: $0";
				} else {
					return returnString;
				}
			} else {
				return "Dealer Net: $";
			}
		},
		decimalFormatterDealerMSRP: function (oDecVal, msrp) {
			if (oDecVal != undefined && oDecVal != null && !isNaN(oDecVal) && oDecVal != "") {
				var returnVal = parseInt(oDecVal);
				var returnVal2 = parseInt(msrp);
				var commaVal = returnVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				var commaVal2 = returnVal2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				var returnString = "Dealer Net: $" + commaVal + "MSRP: $" + commaVal2;
				if (returnVal == 0.00 && returnVal2 == 0) {
					return "Dealer Net: $0 MSRP: $0";
				} else {
					return returnString;
				}
			} else {
				return "Dealer Net: $  MSRP: $";
			}
		}
	*/