jQuery.sap.declare("com.sap.build.toyota-canada.vehiclesGuideV3.Formatter.formatter");

var formatter = {

	formatFeatures: function (str,str2) {
		var feat="";
		var feature="";
		if (str) {
		var res = str.replace(/;/g, "#- ");
		feat= res.split('#').join('\n');
		feature="- "+ feat;
		}
		return feature;
	},
	formatVehicle: function (modelYear,modelCode,modelName,suff,suffDesc) {
		var vehicle="";	
		vehicle =  modelYear + "-" + modelCode + "\n" + modelName+"\n" +"SFX-"+suff+"\n" +suffDesc;
		return vehicle;
	},
	formatSuffix: function (str,str2) {
		var sufStr="";
		if (str) {
			var res=" ";
			res = str.substring(0, 1);
			sufStr="SFX- "+ res;
		}
		return sufStr;
	},
	formatSuffixInList: function (str,str2) {
		var sufStr="";
		if (str) {
			var res=" ";
			res = str.substring(0, 1);
			sufStr= res;
		}
		return sufStr;
	},
	fnFormatIcon: function (val) {
		var sTrimval = "";
		if (val=="yes") {
			return "sap-icon://accept";
		} else {
			return sTrimval;
		}
	},
	decimalFormatter: function (oDecVal,oDecVal2) {
            if (oDecVal != undefined && oDecVal != null && !isNaN(oDecVal)&& oDecVal!="") {
                var returnVal = parseInt(oDecVal);
                var returnString="MSRP: $"+returnVal;
                if (returnVal == 0.00) {
                    return "MSRP: $0";
                } else {
                    return returnString;
                }
            } else {
                return "MSRP: $";
            }
        },
        	decimalFormatterDealer: function (oDecVal,oDecVal2) {
            if (oDecVal != undefined && oDecVal != null && !isNaN(oDecVal)&& oDecVal!="") {
                var returnVal = parseInt(oDecVal);
                var returnString="Dealer Net: $"+returnVal;
                if (returnVal == 0.00) {
                    return "Dealer Net: $0";
                } else {
                    return returnString;
                }
            } else {
                return "Dealer Net: $";
            }
        },
        decimalFormatterDealerMSRP: function (oDecVal,msrp) {
            if (oDecVal != undefined && oDecVal != null && !isNaN(oDecVal)&& oDecVal!="") {
                var returnVal = parseInt(oDecVal);
                var returnVal2 = parseInt(msrp);
                var returnString="Dealer Net: $"+returnVal + "MSRP: $"+returnVal2;
                if (returnVal == 0.00&&returnVal2==0) {
                    return "Dealer Net: $0 MSRP: $0";
                } else {
                    return returnString;
                }
            } else {
                return "Dealer Net: $  MSRP: $";
            }
        }


};