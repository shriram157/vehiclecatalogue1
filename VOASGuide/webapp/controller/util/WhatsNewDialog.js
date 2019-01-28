sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function (ManagedObject, MessageBox, utilities, History) {

	return ManagedObject.extend("com.sap.build.toyota-canada.vehiclesGuideV3.controller.util.WhatsNewDialog", {
		constructor: function (oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "com.sap.build.toyota-canada.vehiclesGuideV3.fragments.WhatsNewDialog", this);
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
		/*	_uploadPDFFile: function (oEvent) {

				oEvent = jQuery.extend(true, {}, oEvent);
				return new Promise(function (fnResolve) {
						fnResolve(true);
					})
					.then(function (result) {
						alert("This should update or create What's New record.");

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
			},*/
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
					var comment = this._oView.byId("__component0---AdminDetailsOption--whatsNew_TA_Comment").getValue(); // "ok"; 
					var filename = this._oView.byId("__component0---AdminDetailsOption--whatsNewFileUploadId").mProperties.value; //"abc.pdf";
					var date = new Date();
					var date2 = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "yyyyMMdd"
					});
					var date3 = date2.format(date);
					var langSwitchState = this._oView.byId("__component0---AdminDetailsOption--whatsNew_Switch_Lang").mProperties.state;
					var lang = "";
					if (langSwitchState == false) {
						lang = "FR";
					} else {
						lang = "EN";
					}

					//var oURL = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV/FileSet('" + filename + "')/$value";
					var oFileUploader = this._oView.byId("__component0---AdminDetailsOption--whatsNewFileUploadId");
					var oURL4 = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV/FileSet(Comment='" + comment + "',FileName='" + filename + "',Language='" +
						lang + "',Lastupdate='" + date3 + "',Tab='WhatsNew')/$value";
					var oURL2 = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV/FileSet(Comment='" + comment + "',FileName='" + filename + "',Language='" +
						lang + "',Lastupdate='" + date3 + "',Tab='WhatsNew',Model='" + modelAdmData.modelDesc + "',Model_year='" + modelAdmData.moYear +
						"',Tciseries='" + modelAdmData.series + "',Brand='" + modelAdmData.brand + "')/$value";
					var oUrl5 = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV/FileReadSet?$filter=(Tab eq 'WhatsNew')";
				var oUrl3= this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV/FileReadSet?$filter=(Tab eq 'WhatsNew' and Model eq '"+modelAdmData.modelDesc+"' and Model_year eq '"+modelAdmData.moYear+"' and Tciseries eq '"+modelAdmData.series+"' and Brand eq '"+modelAdmData.brand+"')";
					var token;
					var tbl = sap.ushell.components.whatsNewTbl;
					var file = jQuery.sap.domById(oFileUploader.getId() + "-fu").files[0];
					var base64_marker = 'data:' + file.type + ';base64,';
					var reader = new FileReader();
					reader.onload = function readSuccess(evt) {
						var base64Index = evt.target.result.indexOf(base64_marker) + base64_marker.length;
						var _base64 = evt.target.result.substring(base64Index);
						$.ajax({
							url: oURL2,
							type: 'GET',
							beforeSend: function (xhr) {
								xhr.setRequestHeader("X-CSRF-Token", "Fetch");
							},
							complete: function (xhr) {
								token = xhr.getResponseHeader("X-CSRF-Token");
								$.ajax({
									type: 'PUT',
									url: oURL2,
									data: _base64,
									dataType: "application/pdf",
									beforeSend: function (xhr) {
										xhr.setRequestHeader('X-CSRF-Token', token);
									},
									success: function (data) {
										console.log("PUT success: " + data);
										$.ajax({
											url: oUrl3,
											method: 'GET',
											async: false,
											dataType: "json",
											success: function (data, textStatus, jqXHR) {
												console.log("GET success: ");
												console.log(data.d.results);
												var tblModel = new sap.ui.model.json.JSONModel(data.d.results);
												sap.ui.getCore().setModel(tblModel, "whatsNewTblModel");
												tbl.setModel(tblModel, "whatsNewTblModel");
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
										sap.m.MessageBox.show("Error occurred while sending data. Please try again later.", sap.m.MessageBox.Icon.ERROR,
											"Error", sap
											.m.MessageBox.Action.OK, null, null);
									}

								});
							}
						});
					};
					reader.readAsText(file);

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
		/*	afterClose: function () {
				this._oDialog.destroy();
			},*/
		onInit: function () {

			this._oDialog = this.getControl();

		},
		onExit: function () {
			this._oDialog.destroy();

		}

	});
}, /* bExport= */ true);