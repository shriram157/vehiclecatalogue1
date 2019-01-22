var data = [];
var dataEN;
var dataFR;
sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function (ManagedObject, MessageBox, Utilities, History) {
	var supCont;
		
	return ManagedObject.extend("com.sap.build.toyota-canada.vehiclesGuideV3.controller.util.SuplementalDialog", {
	
		constructor: function (oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "com.sap.build.toyota-canada.vehiclesGuideV3.fragments.SuplementalDialog", this);
			this._bInit = false;
		},

		exit: function () {
			delete this._oView;
		},

		getView: function () {
			return this._oView;
		},

		getControl: function () {
			return this._oControl;
		},

		getOwnerComponent: function () {
			return this._oView.getController().getOwnerComponent();
		},

		open: function () {
			var oView = this._oView;
			var oControl = this._oControl;

			if (!this._bInit) {

				// Initialize our fragment
				this.onInit();

				this._bInit = true;

				// connect fragment to the root view of this component (models, lifecycle)
				oView.addDependent(oControl);
			}

			var args = Array.prototype.slice.call(arguments);
			if (oControl.open) {
				oControl.open.apply(oControl, args);
			} else if (oControl.openBy) {
				oControl.openBy.apply(oControl, args);
			}
		},

		close: function () {
			this._oControl.close();
		},

		setRouter: function (oRouter) {
			this.oRouter = oRouter;

		},
		getBindingParameters: function () {
			return {};

		},
		_uploadPDFFile: function (oEvent) {

			oEvent = jQuery.extend(true, {}, oEvent);
			return new Promise(function (fnResolve) {
					fnResolve(true);
				})
				.then(function (result) {
					var tbl = sap.ushell.components.suppTbl;
					var comment =this._oView.byId("__component0---AdminDetailsOption--Supp_TA_Comment").getValue();// "ok"; 
					var filename = this._oView.byId("__component0---AdminDetailsOption--suppFileUploadId").mProperties.value;//"abc.pdf";
					var date = new Date();
					var date2 = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "yyyy/MM/dd"
					});
					var date3 = date2.format(date);
					var langSwitchState = this._oView.byId("__component0---AdminDetailsOption--Supp_Switch_Lang").mProperties.state;
					var lang = "";
					if (langSwitchState == true) {
						lang = "FR";
					} else {
						lang = "EN";
					}
					console.log(lang);
						if (lang == "FR") {
				 dataFR={
						comment: comment,
						lang: "FR",
						filename: filename,
						date: date3
					};
						} else if (lang == "EN") {
					 dataEN ={
						comment: comment,
						lang: "EN",
						filename: filename,
						date: date3
					};
						}
				
					data = [dataEN, dataFR];//data.push(dataEN,dataFR);
					
					var model = new sap.ui.model.json.JSONModel();
					model.setData(data);
					tbl.setModel(model);
			//		alert("This should update or create What's New record.");
				}.bind(this))
				.then(function (result) {
					if (result === false) {
						return false;
					} else {
						this.close();
					}
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
		},
		/*console.log(data);
			console.log( this._oView);
				console.log(this._oControl);
					console.log(this._oView.byId("__component0---AdminDetailsOption--Supp_TA_Comment"));
					console.log(this._oView.byId("__component0---AdminDetailsOption--Supp_TA_Comment").getValue());
					console.log(this._oView.byId("__component0---AdminDetailsOption--suppFileUploadId"));
				console.log(this._oView.byId("__component0---AdminDetailsOption--suppFileUploadId").getParameters());*/
			
		_onButtonPress1: function () {

			this.close();

		},
		onInit: function () {
			supCont = this;
			this._oDialog = this.getControl();

		},
		onExit: function () {
			this._oDialog.destroy();

		}

	});
}, /* bExport= */ true);