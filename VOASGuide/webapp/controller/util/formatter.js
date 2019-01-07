jQuery.sap.declare("com.sap.build.toyota-canada.vehiclesGuideV3.controller.util.formatter");

com.sap.build.toyota-canada.vehiclesGuideV3.controller.util.formatter = {

	fnFormatIcon: function (val) {
		var sTrimval = "";
		if (val=="yes") {
			return "sap-icon://accept";
		} else {
			return sTrimval;
		}
	}
	
};