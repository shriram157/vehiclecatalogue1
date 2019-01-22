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
	}

};