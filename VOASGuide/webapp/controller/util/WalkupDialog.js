sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function (ManagedObject, MessageBox, utilities, History) {

	return ManagedObject.extend("com.sap.build.toyota-canada.vehiclesGuideV3.controller.util.WalkupDialog", {
		constructor: function (oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "com.sap.build.toyota-canada.vehiclesGuideV3.fragments.WalkupDialog", this);
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
			var comment = this._oView.byId("__component0---AdminDetailsOption--walkUp_TA_Comment"); //.getValue(); // "ok"; 
			var filename = this._oView.byId("__component0---AdminDetailsOption--walkUpFileUploadId"); //.mProperties.value; //"abc.pdf";
			var langSwitch = this._oView.byId("__component0---AdminDetailsOption--walkUp_Switch_Lang");
			comment.setValue("");
			filename.setValue("");
			langSwitch.setState(true);
			this._oControl.close();
		},

		setRouter: function (oRouter) {
			this.oRouter = oRouter;

		},
		getBindingParameters: function () {
			return {};

		},
		 //onChange: function(oEvent) {  
           
   //         var oUploadCollection = oEvent.getSource();
			// // var _csrfToken = this.getModel().getHeaders()['x-csrf-token'];
			// var _csrfToken = this._oODataModel.getHeaders()['x-csrf-token'];
			// var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
			// 	name: "x-csrf-token",
			// 	value: _csrfToken
			// });
			// oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
        // }, 
        // onBeforeUploadStarts: function(oEvent) {
			// var ReqDocno = this.getView().getBindingContext().getObject().ReqDocno;

	// 	var modelAdm = sap.ui.getCore().getModel("modelAdmin");
	// 		var modelAdmData = modelAdm.getData();
	// var comment = this._oView.byId("__component0---AdminDetailsOption--walkUp_TA_Comment").getValue(); // "ok"; 
	// 				// var filename = this._oView.byId("__component0---AdminDetailsOption--walkUpFileUploadId").mProperties.value; //"abc.pdf";
	// 				var date = new Date();
	// 				var date2 = sap.ui.core.format.DateFormat.getDateInstance({
	// 					pattern: "yyyyMMdd"
	// 				});
	// 				var date3 = date2.format(date);
	// 				var langSwitchState = this._oView.byId("__component0---AdminDetailsOption--walkUp_Switch_Lang").mProperties.state;
	// 				var lang = "";
	// 				if (langSwitchState == false) {
	// 					lang = "FR";
	// 				} else {
	// 					lang = "EN";
	// 				}

	
	
	// 		var oReqDocno = new sap.m.UploadCollectionParameter({
	// 			name: "Comment",
	// 			value: comment
	// 		});
	// 		oEvent.getParameters().addHeaderParameter(oReqDocno);

// 			var oReqType = new sap.m.UploadCollectionParameter({
// 				name: "Language",
// 				value: lang
// 			});
// 			oEvent.getParameters().addHeaderParameter(oReqType);
// var oUpdate = new sap.m.UploadCollectionParameter({
// 				name: "Lastupdate",
// 				value: date3
// 			});
// 			oEvent.getParameters().addHeaderParameter(oUpdate);
			
// 			var oTab = new sap.m.UploadCollectionParameter({
// 				name: "Tab",
// 				value: "Walkup"
// 			});
// 			oEvent.getParameters().addHeaderParameter(oTab);
// 				var oModelDesc = new sap.m.UploadCollectionParameter({
// 				name: "Model",
// 				value: modelAdmData.modelDesc
// 			});
// 			oEvent.getParameters().addHeaderParameter(oModelDesc);
// 				var oModelYear = new sap.m.UploadCollectionParameter({
// 				name: "Model_year",
// 				value: modelAdmData.moYear
// 			});
// 			oEvent.getParameters().addHeaderParameter(oModelYear);
// 		var oSeries = new sap.m.UploadCollectionParameter({
// 				name: "Tciseries",
// 				value: modelAdmData.series
// 			});
// 			oEvent.getParameters().addHeaderParameter(oSeries);
		// 		var oBrand = new sap.m.UploadCollectionParameter({
		// 		name: "x-csrf-token",
		// 		value: "Vikr8t-rcA4NOkt4nq9Sag=="
		// 	});
		// 	oEvent.getParameters().addHeaderParameter(oBrand);
					
		// 	var oFileName = new sap.m.UploadCollectionParameter({
		// 		name: "slug",
		// 		value: oEvent.getParameter("fileName")
		// 	});
		// 	oEvent.getParameters().addHeaderParameter(oFileName);
		// },
        
		_uploadPDFFile: function (oEvent) {
			var modelAdm = sap.ui.getCore().getModel("modelAdmin");
			var modelAdmData = modelAdm.getData();
			oEvent = jQuery.extend(true, {}, oEvent);
			return new Promise(function (fnResolve) {
					fnResolve(true);
				})
				.then(function (result) {
					var sLocation = window.location.host;
					var sLocation_conf = sLocation.search("webide");
					if (sLocation_conf == 0) {
						this.sPrefix = "/voasguide_node";
					} else {
						this.sPrefix = "";
					}
					this.nodeJsUrl = this.sPrefix + "/node";
					var comment = this._oView.byId("__component0---AdminDetailsOption--walkUp_TA_Comment").getValue(); // "ok"; 
					var filename = this._oView.byId("__component0---AdminDetailsOption--walkUpFileUploadId").mProperties.value; //"abc.pdf";
					var date = new Date();
					var date2 = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "yyyyMMdd"
					});
					var date3 = date2.format(date);
					var langSwitchState = this._oView.byId("__component0---AdminDetailsOption--walkUp_Switch_Lang").mProperties.state;
					var lang = "";
					if (langSwitchState == false) {
						lang = "FR";
					} else {
						lang = "EN";
					}
			var oBusyDialog = new sap.m.BusyDialog({
				showCancelButton: false
			});
					//var oURL = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV/FileSet('" + filename + "')/$value";
					var oFileUploader = this._oView.byId("__component0---AdminDetailsOption--walkUpFileUploadId");
					var oURL4 = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV/FileSet(Comment='" + comment + "',FileName='" + filename + "',Language='" +
						lang + "',Lastupdate='" + date3 + "',Tab='Walkup')/$value";
					var oURL2 = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV/FileSet(Comment='" + comment + "',FileName='" + filename + "',Language='" +
						lang + "',Lastupdate='" + date3 + "',Tab='Walkup',Model='" + modelAdmData.modelDesc + "',Model_year='" + modelAdmData.moYear +
						"',Tciseries='" + modelAdmData.series + "',Brand='" + modelAdmData.brand + "')/$value";
					var oUrl5 = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV/FileReadSet?$filter=(Tab eq 'Walkup')";
					var oUrl3 = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV/FileReadSet?$filter=(Tab eq 'Walkup' and Model eq '" + modelAdmData.modelDesc +
						"' and Model_year eq '" + modelAdmData.moYear + "' and Tciseries eq '" + modelAdmData.series + "' and Brand eq '" +
						modelAdmData.brand + "')";
					var token;
					var tbl = sap.ushell.components.walkUpTbl;
					var file = jQuery.sap.domById(oFileUploader.getId() + "-fu").files[0];
					//var base64_marker = 'data:' + file.type + ';base64,';
					var reader = new FileReader();
					reader.readAsArrayBuffer(file);
					reader.onload = function readSuccess(evt) {
						var fileString = evt.target.result;
						//var base64Index = evt.target.result.indexOf(base64_marker) + base64_marker.length;
						//var _base64 = evt.target.result.substring(base64Index);
						$.ajax({
							url: oURL2,
							type: 'GET',
							beforeSend: function (xhr) {
								xhr.setRequestHeader("X-CSRF-Token", "Fetch");
							},
							complete: function (xhr) {
								token = xhr.getResponseHeader("X-CSRF-Token");
								oBusyDialog.open(); 

							$.ajax({
									type: 'PUT',
									url: oURL2,
									data: fileString,
									processData: false,
									beforeSend: function (xhr) {
										xhr.setRequestHeader('X-CSRF-Token', token);
										xhr.setRequestHeader('Content-Type', "application/pdf");
									},
									success: function (data) {
					oBusyDialog.close(); 

										console.log("PUT success: " + data);
										$.ajax({
											url: oUrl3,
											method: 'GET',
											async: false,
											dataType: 'json',
											success: function (data, textStatus, jqXHR) {
												console.log("GET success: ");
												console.log(data.d.results);
												var tblModel = new sap.ui.model.json.JSONModel(data.d.results);
												sap.ui.getCore().setModel(tblModel, "walkUpTblModel");
												tbl.setModel(tblModel, "walkUpTblModel");
											},
											error: function (jqXHR, textStatus, errorThrown) {

												sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR,
													"Error",
													sap
													.m.MessageBox.Action.OK, null, null);
											}
										});
									},
									error: function (data) {
		oBusyDialog.close(); 

										sap.m.MessageBox.show("Error occurred while sending data. Please try again later.", sap.m.MessageBox.Icon.ERROR,
											"Error", sap
											.m.MessageBox.Action.OK, null, null);
									}

								});
							}
						});
					};
					//reader.readAsDataURL(file);
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
		_onButtonPress1: function () {

			this.close();

		},
		onInit: function () {

			this._oDialog = this.getControl();

		},
		onExit: function () {
			this._oDialog.destroy();

		}

	});
}, /* bExport= */ true);