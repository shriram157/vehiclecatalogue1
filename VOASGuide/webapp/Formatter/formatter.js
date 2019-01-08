jQuery.sap.declare("com.sap.build.toyota-canada.vehiclesGuideV3.Formatter.formatter");

var formatter = {

	formatFeatures: function (str,str2) {
		
	
		var feat="";
		if (str) {
		var res = str.replace(/;/g, "#- ");
		feat= res.split('#').join('\n');
		}
		return feat;
	}

};