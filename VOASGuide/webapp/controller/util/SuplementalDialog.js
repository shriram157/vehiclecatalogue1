/*var globalData = [];
var dataEN;
var dataFR;*/
sap.ui.define([
	"com/sap/build/toyota-canada/vehiclesGuideV3/controller/BaseController",
	"com/sap/build/toyota-canada/vehiclesGuideV3/libs/jQuery.base64",
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History", "sap/ui/model/odata/v2/ODataModel"
], function (BaseController, base64, ManagedObject, MessageBox, utilities, History, ODataModel) {
	var supCont;

	return ManagedObject.extend("com.sap.build.toyota-canada.vehiclesGuideV3.controller.util.SuplementalDialog", {

		onInit: function () {
			supCont = this;
			this._oDialog = this.getControl();
		},

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
			var comment = this._oView.byId("__component0---AdminDetailsOption--Supp_TA_Comment"); //.getValue(); // "ok"; 
			var filename = this._oView.byId("__component0---AdminDetailsOption--suppFileUploadId"); //.mProperties.value; //"abc.pdf";
			var langSwitch = this._oView.byId("__component0---AdminDetailsOption--Supp_Switch_Lang");
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
					var comment = this._oView.byId("__component0---AdminDetailsOption--Supp_TA_Comment").getValue(); // "ok"; 
					var filename = this._oView.byId("__component0---AdminDetailsOption--suppFileUploadId").mProperties.value; //"abc.pdf";
					var date = new Date();
					var date2 = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "yyyyMMdd"
					});
					var date3 = date2.format(date);
					var langSwitchState = this._oView.byId("__component0---AdminDetailsOption--Supp_Switch_Lang").mProperties.state;
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
					var oFileUploader = this._oView.byId("__component0---AdminDetailsOption--suppFileUploadId");
					var oURL4 = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV/FileSet(Comment='" + comment + "',FileName='" + filename + "',Language='" +
						lang + "',Lastupdate='" + date3 + "',Tab='suppliment')/$value";
					//Model='Camry',Model_year='2018',Tciseries ='Cam',Brand='Toyota'
					var oUrl5 = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV/FileReadSet?$filter=(Tab eq 'suppliment')";
					//and Model eq 'CamryLE' and Model_year eq '2018' and Tciseries eq 'CAMRY' and Brand eq 'TOYOTA'
					var oUrl3 = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV/FileReadSet?$filter=(Tab eq 'suppliment' and Model eq '" + modelAdmData.modelDesc +
						"' and Model_year eq '" + modelAdmData.moYear + "' and Tciseries eq '" + modelAdmData.series + "' and Brand eq '" +
						modelAdmData.brand + "')";
					var oURL2 = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV/FileSet(Brand='" + modelAdmData.brand + "',Model='" + modelAdmData.modelDesc + "',Tciseries='" + modelAdmData.series + "',Model_year='" + modelAdmData.moYear + "',Tab='suppliment',Language='" + lang + "',Lastupdate='" + date3 + "',Comment='" + comment + "',FileName='" + filename + "')";
					/*var oURL2 = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV/FileSet(Comment='" + comment + "',FileName='" + filename + "', 
						"',Tab='suppliment',Language='" +, lang + "',Lastupdate='" + date3 + "',
						Lastupdate='" + date3 + "',,Model_year='" + modelAdmData.moYear +
						"',Brand='" + modelAdmData.brand + "')/$value";*/
					var token;
					var tbl = sap.ushell.components.suppTbl;
					var file = jQuery.sap.domById(oFileUploader.getId() + "-fu").files[0];
					//var base64_marker = 'data:' + file.type + ';base64,';
					var reader = new FileReader();
					reader.readAsArrayBuffer(file);
					reader.onload = function readSuccess(evt) {
						//var base64Index = evt.target.result.indexOf(base64_marker) + base64_marker.length;
						//var _base64 = evt.target.result.substring(base64Index);
						var fileString = evt.target.result;
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
									//data: _base64,
									//dataType: 'json',
									data: fileString,
									processData: false,
									beforeSend: function (xhr) {
										xhr.setRequestHeader('X-CSRF-Token', token);
										xhr.setRequestHeader('Content-Type', "application/pdf");
									},
									success: function (data) {
										oBusyDialog.close();
										console.log("PUT success");
										//	var errMsg = this._oView.getModel("i18n").getResourceBundle().getText("Error1");
										//	console.log(errMsg);
										$.ajax({
											url: oUrl3,
											method: 'GET',
											async: false,
											dataType: 'json',
											success: function (data, textStatus, jqXHR) {
												console.log("GET success: ");
												console.log(data.d.results);
												var tblModel = new sap.ui.model.json.JSONModel(data.d.results);
												sap.ui.getCore().setModel(tblModel, "suppTblModel");
												tbl.setModel(tblModel, "suppTblModel");
											},
											error: function (jqXHR, textStatus, errorThrown) {
												//var errMsg = this._oView.getModel("i18n").getResourceBundle().getText("Error1");
												sap.m.MessageBox.show("Error occurred while fetching data. Please try again later.", sap.m.MessageBox.Icon.ERROR,
													"Error", sap.m.MessageBox.Action.OK, null, null);
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
					oBusyDialog.close();
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
		/*	_uploadPDFFile: function (oEvent) {

					oEvent = jQuery.extend(true, {}, oEvent);
					return new Promise(function (fnResolve) {
							fnResolve(true);
						})
						.then(function (result) {
							var tbl = sap.ushell.components.suppTbl;
							var comment = this._oView.byId("__component0---AdminDetailsOption--Supp_TA_Comment").getValue(); // "ok"; 
							var filename = this._oView.byId("__component0---AdminDetailsOption--suppFileUploadId").mProperties.value; //"abc.pdf";
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

							if (lang == "FR") {
								dataFR = {
									comment: comment,
									lang: "FR",
									filename: filename,
									date: date3
								};
							} else if (lang == "EN") {
								dataEN = {
									comment: comment,
									lang: "EN",
									filename: filename,
									date: date3
								};
							}
							globalData = [dataEN, dataFR]; //data.push(dataEN,dataFR);
							var model = new sap.ui.model.json.JSONModel(globalData);
							sap.ui.getCore().setModel(model,"modelSupp");
							var suppmodel=sap.ui.getCore().getModel("modelSupp");
						//	model.setData(data);
							tbl.setModel(suppmodel);

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

		/*	_uploadPDFFile: function (oEvent) {
				var sLocation = window.location.host;
				var sLocation_conf = sLocation.search("webide");
				if (sLocation_conf == 0) {
					this.sPrefix = "/voasguide_node";
				} else {
					this.sPrefix = "";
				}
				this.nodeJsUrl = this.sPrefix + "/node";
				var oFileUploader = this._oView.byId("__component0---AdminDetailsOption--suppFileUploadId");
				var sFileName = this._oView.byId("__component0---AdminDetailsOption--suppFileUploadId").mProperties.value; //"abc.pdf";
				var oURL = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV/FileSet('" + sFileName + "')/$value";
				var file = jQuery.sap.domById(oFileUploader.getId() + "-fu").files[0];
				var base64_marker = 'data:' + file.type + ';base64,';
				var reader = new FileReader();

				reader.onload = function readSuccess(evt) {
					var base64Index = evt.target.result.indexOf(base64_marker) + base64_marker.length;
					var _base64 = evt.target.result.substring(base64Index);
					//	console.log(base64);
					$.ajax({
						url:oURL,
						type: "GET",
						beforeSend: function (xhr) {
							xhr.setRequestHeader("X-CSRF-Token", "Fetch");
						},
						complete: function (xhr) {
							var token = xhr.getResponseHeader("X-CSRF-Token");
							$.ajax({
								type: 'PUT',
								url: oURL,
								data: _base64,
								dataType: "application/pdf",
								//	dataType: "application/pdf",
								beforeSend: function (xhr) {
									xhr.setRequestHeader('X-CSRF-Token', token);
								},
								success: function (data) {
									console.log(data);
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
			},*/

		/*	this.oUploadedFile = file; //oEvent.getParameter("files")[0];
			reader.readAsBinaryString(this.oUploadedFile);

			reader.onload = $.proxy(function (e) {
				if (reader.result) {
					reader.content = reader.result;
				}
				this.oBase = btoa(reader.content);
			}, this);*/

		//reader.readAsDataURL(file);

		//},

		_onButtonPress1: function () {
			this.close();
		},

		onExit: function () {
			this._oDialog.destroy();
		}
	});
}, true);

/*	var oURL = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV/FileSet('" + filename + "')/$value";
	$.ajax({
		type: 'PUT',
		url: oURL,
		cache: false,
		//	data: dataString,
		dataType: 'json',
		success: function (data) {
			console.log(data);
		},
		error: function (data) {
			sap.m.MessageBox.show("Error occurred while sending data. Please try again later.", sap.m.MessageBox.Icon.ERROR,
				"Error", sap
				.m.MessageBox.Action.OK, null, null);
		}

	});*/

/*	$.ajax({
							url: oURL,
							type: "GET",
							beforeSend: function (xhr) {
								xhr.setRequestHeader("X-CSRF-Token", "Fetch");
							},
							complete: function (xhr) {
								var token = xhr.getResponseHeader("X-CSRF-Token");
								$.ajax({
									type: 'PUT',
									url: oURL,
									dataType: "application/pdf",
									beforeSend: function (xhr) {
										xhr.setRequestHeader('X-CSRF-Token', token);
									},
									success: function (data) {
										console.log(data);

									},
									error: function (data) {
										sap.m.MessageBox.show("Error occurred while sending data. Please try again later.", sap.m.MessageBox.Icon.ERROR,
											"Error", sap
											.m.MessageBox.Action.OK, null, null);
									}

								});
							}
						});*/