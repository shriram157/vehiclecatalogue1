jQuery.sap.declare("com.sap.build.toyota-canada.vehiclesGuideV3.Formatter.formatter");

var formatter = {

	formatFeatures: function (str,str2) {
		var feat="";
		if (str) {
		var res = str.replace(/;/g, "#- ");
		feat= res.split('#').join('\n');
		}
		return feat;
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
	}

};