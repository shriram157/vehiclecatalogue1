sap.ui.define(["com/sap/build/toyota-canada/vehiclesGuideV3/controller/BaseController",
	"./util/CreatePocketSummaryDialog", "./util/CreateWhatsNewDialog", "./util/CreateWalkUpGuide",
	"./util/CreateSupplementalGuide", "./util/CreateVehicleGuideDialog",
	"sap/m/MessageBox", "./util/utilities",
	"sap/ui/core/routing/History", "com/sap/build/toyota-canada/vehiclesGuideV3/Formatter/formatter"
], function (BaseController, CreatePocketSummaryDialog, CreateWhatsNewDialog, CreateWalkUpGuide, CreateSupplementalGuide,
	CreateVehicleGuideDialog, MessageBox, utilities, History, formatter) {
	"use strict";
	var DetailController;
	return BaseController.extend("com.sap.build.toyota-canada.vehiclesGuideV3.controller.DetailsOption", {
		formatter: formatter,
		onInit: function () {
			DetailController = this;
			//	this.getUserLanguage();
			this.getBrowserLanguage();
			// var oSect = this.getView().byId("sect");
			// oSect.scrollTo(0,0);
			DetailController.oRouter = sap.ui.core.UIComponent.getRouterFor(DetailController);
			DetailController.oRouter.getTarget("DetailsOption").attachDisplay(jQuery.proxy(DetailController.handleRouteMatched,
				DetailController));
			//DetailController.getView().byId("manageSeriesBtnId").setEnabled(true);
			//DetailController._readUser();
			DetailController.language = DetailController.returnBrowserLanguage();
		},
		onAfterRendering: function () {
			DetailController._readUser();
			this.oObjectPageLayout = this.getView().byId("ObjectPage");
this.oTargetSubSection = this.getView().byId("power");
this.oObjectPageLayout.addEventDelegate({
onAfterRendering: jQuery.proxy(function () {
			//need to wait for the scrollEnablement to be active
			jQuery.sap.delayedCall(500, this.oObjectPageLayout, this.oObjectPageLayout.scrollToSection, [this.oTargetSubSection.getId()]);
			}, this)
});
		},
		formatFeatures: function (str) {
			var feat = "";
			var feature = "";
			if (str) {
				var slicestr = str.slice(1);
				console.log(slicestr);
				var res5 = slicestr.replace(/;/g, "#! ");
				var extra = res5.split('#');
				console.log(extra);
				var len = extra.length;
				//	console.log(len);
				var lendiv = Math.floor(len / 2);
				var arr = [];
				for (var i = 0; i < lendiv; i++) {
					arr.push(extra[i]);
				}
				console.log(arr);
				var string = arr.toString();
				console.log(string);
				var res9 = string.replace(/!/g, "#- ");
				console.log(res9);
				var rturnRes1 = res9.split('#').join('\n');
				console.log(rturnRes1);

				/*var arr2 = [];
				for (var q = lendiv; q < len; q++) {
					arr2.push(extra[q]);
				}
				var string2 = arr2.toString();
				
				var res2 = string2.replace(/!/g, "#- ");
				var rturnRes = res2.split('#').join('\n');
				*/
			}
			return "- " + rturnRes1;
		},
		formatFeatures1: function (str) {
			var feat = "";
			var feature = "";
			if (str) {
				/*	var res = str.replace(/;/g, "#- ");
					feat = res.split('#').join('\n');
					feature = feat;*/
				////
				var slicestring = str.slice(1);
				var res5 = slicestring.replace(/;/g, "#! ");
				var extra = res5.split('#');
				//	console.log(extra);
				var len = extra.length;
				console.log(len);
				var lendiv = Math.floor(len / 2);
				/*var arr = [];
				for (var i = 0; i < lendiv; i++) {
					arr.push(extra[i]);
				}
				var string = arr.toString();
				
				var res9 = string.replace(/!/g, "#- ");
				var rturnRes1 = res9.split('#').join('\n');
				*/

				var arr2 = [];
				for (var q = lendiv; q < len; q++) {
					arr2.push(extra[q]);
				}
				console.log(arr2);
				var string2 = arr2.toString();
				console.log(string2);
				var slicedStr2 = string2.slice(2);
				console.log(slicedStr2);
				var res2 = slicedStr2.replace(/!/g, "#- ");
				console.log(res2);
				var rturnRes = res2.split('#').join('\n');
				console.log(rturnRes);
			}
			return "- " + rturnRes;
		},
		_readUser: function () {
			var userModel = sap.ui.getCore().getModel("userModel");
			if (userModel) {
				var userData = userModel.getData();
				if (userData.loggedUserType[0] == "TCI_Admin") {
					DetailController.getView().byId("manageSeriesBtnId").setEnabled(true);
				} else {
					DetailController.getView().byId("manageSeriesBtnId").setEnabled(false);
				}
			}
		},

		handleRouteMatched: function (oEvent) {

			var parseArg = JSON.parse(oEvent.getParameters().data.num);
			var modelDetail = new sap.ui.model.json.JSONModel(parseArg[0]);
			var veh = parseArg[0].veh;
			var suffix = parseArg[0].suffix;
			var brandCB = parseArg[0].brand;
			var vehSuffix = veh + suffix;
			DetailController.getView().setModel(modelDetail, "modelDetail");
			if (brandCB == "TOYOTA") {
				sap.ui.getCore().byId("__xmlview0--idLogo").setSrc("images/Toyota.png");
				var disclaimerT= DetailController.getView().getModel("i18n").getResourceBundle().getText("Toyota_Disclaimer");
			DetailController.getView().byId("tADetailDisclaimer").setText(disclaimerT);
				
				
				

			} else {
				sap.ui.getCore().byId("__xmlview0--idLogo").setSrc("images/Lexus.png");
			
				
			var disclaimerL= DetailController.getView().getModel("i18n").getResourceBundle().getText("Lexus_Disclaimer");
			DetailController.getView().byId("tADetailDisclaimer").setText(disclaimerL);
			}
			DetailController.user = parseArg[0].user; //DetailController.getLoggedUser();

			var host = DetailController.host();
			var urlTable = host + "/Z_VEHICLE_CATALOGUE_SRV/ZC_VOAS_COMP_HEADERSet?$filter=(User eq  '" + DetailController.user +
				"' and IN_Vehicle1 eq '" + vehSuffix +
				"' and Language eq '" + DetailController.language + "') &$expand=ZCVOASDEEP";
			$.ajax({
				url: urlTable,
				method: 'GET',
				async: false,
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {
					var tblModel = new sap.ui.model.json.JSONModel(data.d.results);
					DetailController.getView().setModel(tblModel, "TblModel");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					var errMsg = DetailController.getView().getModel("i18n").getResourceBundle().getText("Error1");
					sap.m.MessageBox.show(errMsg, sap.m.MessageBox.Icon.ERROR, "Error",
						sap.m.MessageBox.Action.OK, null, null);
				}
			});
			var fixedData = {
				'veh': ''
			};
			var fixedData2 = {
				'veh': veh + "  - SFX " + suffix,
			};
			var fixedDataCol = {
				'veh': veh,
			};
			var aColumnData = [];
			aColumnData.push(fixedData);
			aColumnData.push(fixedData);
			aColumnData.push(fixedData2);
			var aColumnDataCol = [];
			aColumnDataCol.push(fixedData);
			aColumnDataCol.push(fixedData);
			aColumnDataCol.push(fixedDataCol);

			var emptydata = [];

			emptydata.push(fixedData);
			emptydata.push(fixedData);
			emptydata.push(fixedData);

			if (DetailController.getView().getModel("TblModel")) {
				var dat = DetailController.getView().getModel("TblModel").getData();
				var dtExt = "",
					dtInt = "",
					dtPwr = "",
					dtSaf = "",
					dtInfo = "",
					dtCol = "",
					dtDim = "",
					dtOpt = "",
					dtApx = "";

				for (var j = 0; j < dat.length; j++) {
					if (dat[j].Super_catgy == "EXTERIOR") {
						dtExt = dat[j].ZCVOASDEEP.results;
					}
					if (dat[j].Super_catgy == "INTERIOR") {
						dtInt = dat[j].ZCVOASDEEP.results;
					}
					if (dat[j].Super_catgy == "POWERTRAIN/MECHANICAL") {
						dtPwr = dat[j].ZCVOASDEEP.results;
					}
					if (dat[j].Super_catgy == "SAFETY/CONVENIENCE") {
						dtSaf = dat[j].ZCVOASDEEP.results;
					}
					if (dat[j].Super_catgy == "INFOTAINMENT") {
						dtInfo = dat[j].ZCVOASDEEP.results;
					}
					if (dat[j].Super_catgy == "COLOR OPTIONS") {
						dtCol = dat[j].ZCVOASDEEP.results;
					}
					if (dat[j].Super_catgy == "DIMENSIONS & SPECS") {
						dtDim = dat[j].ZCVOASDEEP.results;
					}
					if (dat[j].Super_catgy == "APX") {
						dtApx = dat[j].ZCVOASDEEP.results;
					}
					if (dat[j].Super_catgy == "OPTION PACKAGES") {
						dtOpt = dat[j].ZCVOASDEEP.results;
					}

				}

				var dataExterior = [];
				for (var i = 0; i < dtExt.length; i++) {
					/*if (DetailController.language == "FR") {
						dataExterior.push({
							"Category_en": dtExt[i].Category_en,
							"Cust_fac_desc_en": dtExt[i].Cust_fac_desc_fr,
							"Vehicle1": dtExt[i].Vehicle1
						});
					} else {*/
					dataExterior.push({
						"Category_en": dtExt[i].Cust_fac_desc_en,
						"Cust_fac_desc_en": "", //dtExt[i].Cust_fac_desc_en,
						"Vehicle1": dtExt[i].Vehicle1
					});
					//	}

				}
				var dataInterior = [];
				for (var i = 0; i < dtInt.length; i++) {
					/*if (DetailController.language == "FR") {
						dataInterior.push({
							"Category_en": dtInt[i].Category_en,
							"Cust_fac_desc_en": dtInt[i].Cust_fac_desc_fr,
							"Vehicle1": dtInt[i].Vehicle1
						});
					} else {*/
					dataInterior.push({
						"Category_en": dtInt[i].Cust_fac_desc_en,
						"Cust_fac_desc_en": "", //dtInt[i].Cust_fac_desc_en,
						"Vehicle1": dtInt[i].Vehicle1
					});
					//}

				}
				var dataInfo = [];
				for (var i = 0; i < dtInfo.length; i++) {
					/*	if (DetailController.language == "FR") {
							dataInfo.push({
								"Category_en": dtInfo[i].Category_en,
								"Cust_fac_desc_en": dtInfo[i].Cust_fac_desc_fr,
								"Vehicle1": dtInfo[i].Vehicle1
							});
						} else {*/
					dataInfo.push({
						"Category_en": dtInfo[i].Cust_fac_desc_en,
						"Cust_fac_desc_en": "", // dtInfo[i].Cust_fac_desc_en,
						"Vehicle1": dtInfo[i].Vehicle1
					});
					//	}

				}
				var dataPwr = [];
				for (var i = 0; i < dtPwr.length; i++) {
					/*if (DetailController.language == "FR") {
						dataPwr.push({
							"Category_en": dtPwr[i].Category_en,
							"Cust_fac_desc_en": dtPwr[i].Cust_fac_desc_fr,
							"Vehicle1": dtPwr[i].Vehicle1
						});
					} else {*/
					dataPwr.push({
						"Category_en": dtPwr[i].Cust_fac_desc_en,
						"Cust_fac_desc_en": "", //dtPwr[i].Cust_fac_desc_en,
						"Vehicle1": dtPwr[i].Vehicle1
					});
					//	}

				}
				var dataSafety = [];
				for (var i = 0; i < dtSaf.length; i++) {
					/*	if (DetailController.language == "FR") {
							dataSafety.push({
								"Category_en": dtSaf[i].Category_en,
								"Cust_fac_desc_en": dtSaf[i].Cust_fac_desc_fr,
								"Vehicle1": dtSaf[i].Vehicle1
							});
						} else {*/
					dataSafety.push({
						"Category_en": dtSaf[i].Cust_fac_desc_en,
						"Cust_fac_desc_en": "", //dtSaf[i].Cust_fac_desc_en,
						"Vehicle1": dtSaf[i].Vehicle1
					});
					//	}

				}

				var dataColour = [];

				for (var i = 0; i < dtCol.length; i++) {
					var msrp = [],
						net = [];
					if (dtCol[i].MSRP != undefined && dtCol[i].MSRP != null && !isNaN(dtCol[i].MSRP) && dtCol[i].MSRP != "") {
						msrp[i] = "  $" + parseInt(dtCol[i].MSRP);
					} else {
						msrp[i] = "";
					}
					if (dtCol[i].NETPRICE != undefined && dtCol[i].NETPRICE != null && !isNaN(dtCol[i].NETPRICE) && dtCol[i].NETPRICE != "") {
						net[i] = "  $" + parseInt(dtCol[i].NETPRICE);
					} else {
						net[i] = "";
					}
					var msrpF = DetailController.getView().getModel("i18n").getResourceBundle().getText("MSRPWithoutDoll");
					var netPriceF = DetailController.getView().getModel("i18n").getResourceBundle().getText("DealerNetWithoutDoll");

					dataColour.push({
						"Category_en": dtCol[i].EXT + "-" + dtCol[i].EXT_DESC + "\n" + dtCol[i].INT_DESC,
						//"Cust_fac_desc_en": "MSRP: $ " + msrp[i] + "\nDealer Net: $" + net[i],
						"Cust_fac_desc_en": msrpF + msrp[i] + "\n" + netPriceF + net[i],
						"Vehicle1": dtCol[i].Vehicle1
					});
				}
				var dataDim = [];
				for (var i = 0; i < dtDim.length; i++) {
					/*	if (DetailController.language == "FR") {
							dataDim.push({
								"Category_en": dtDim[i].Dimensions,
								"Cust_fac_desc_en": dtDim[i].Cust_fac_desc_fr,
								"Vehicle1": dtDim[i].Vehicle1
							});

						} else {*/
					dataDim.push({
						"Category_en": dtDim[i].Dimensions,
						"Cust_fac_desc_en": "", // dtDim[i].Cust_fac_desc_en,
						"Vehicle1": dtDim[i].Vehicle1
					});
					//	}

				}
				var dataOpt = [];
				for (var i = 0; i < dtOpt.length; i++) {

					var msrp = [],
						net = [];
					if (dtOpt[i].MSRP != undefined && dtOpt[i].MSRP != null && !isNaN(dtOpt[i].MSRP) && dtOpt[i].MSRP != "") {
						msrp[i] = "  $" + parseInt(dtOpt[i].MSRP);
					} else {
						msrp[i] = "";
					}
					if (dtOpt[i].NETPRICE != undefined && dtOpt[i].NETPRICE != null && !isNaN(dtOpt[i].NETPRICE) && dtOpt[i].NETPRICE != "") {
						net[i] = "  $" + parseInt(dtOpt[i].NETPRICE);
					} else {
						net[i] = "";
					}

					var feature = [];
					var str = dtOpt[i].OptionPackages;
					if (str) {
						var res = str.replace(/;/g, "#- ");
						feature[i] = res.split('#').join('\n');
					}
					var feature2 = [];
					var str2 = dtOpt[i].OptionPackages1;
					if (str2) {
						var res2 = str2.replace(/;/g, "#- ");
						feature2[i] = res2.split('#').join('\n');
					}
					var msrpF = DetailController.getView().getModel("i18n").getResourceBundle().getText("MSRPWithoutDoll");
					var netPriceF = DetailController.getView().getModel("i18n").getResourceBundle().getText("DealerNetWithoutDoll");

					dataOpt.push({
						//	"Category_en": dtOpt[i].Vehicle1 + "\n" + "MSRP: $ " + msrp[i] + "\nDealer Net: $" + net[i],
						"Category_en": dtOpt[i].Vehicle1 + "\n" + msrpF + msrp[i] + "\n" + netPriceF + net[i],
						"Vehicle1": feature[i], //dtOpt[i].OptionPackages,
						"Vehicle2": feature2[i] //dtOpt[i].OptionPackages1
					});
				}
				var fixedDataOptPackage = {
					'optPack': "Package Details"
				};
				var fixedDataOptPackage2 = {
					'optPack': "",
				};
				var aColumnDataOpt = [];
				aColumnDataOpt.push(fixedDataOptPackage2);
				aColumnDataOpt.push(fixedDataOptPackage);
				aColumnDataOpt.push(fixedDataOptPackage2);
				var dataApx = [];
				for (var i = 0; i < dtApx.length; i++) {
					/*if(DetailController.language=="FR"){
					}
					else{
						
					}*/
					dataApx.push({
						"Category_en": dtApx[i].APX,
						"Cust_fac_desc_en": "", //dtApx[i].INT_DESC,
						"Vehicle1": dtApx[i].Vehicle1
					});
				}
				var dataApx1 = [];
				for (var i = 0; i < dtApx.length; i++) {
					var msrp = [],
						net = [];
					if (dtApx[i].MSRP != undefined && dtApx[i].MSRP != null && !isNaN(dtApx[i].MSRP) && dtApx[i].MSRP != "") {
						msrp[i] = "  $" + parseInt(dtApx[i].MSRP);
					} else {
						msrp[i] = "";
					}
					if (dtApx[i].NETPRICE != undefined && dtApx[i].NETPRICE != null && !isNaN(dtApx[i].NETPRICE) && dtApx[i].NETPRICE != "") {
						net[i] = "  $" + parseInt(dtApx[i].NETPRICE);
					} else {
						net[i] = "";
					}
					var msrpF = DetailController.getView().getModel("i18n").getResourceBundle().getText("MSRPWithoutDoll");
					var netPriceF = DetailController.getView().getModel("i18n").getResourceBundle().getText("DealerNetWithoutDoll");
					var dtApxDesc = [];
					var dtApxDesc2 = [];
					dtApxDesc[i] = DetailController.formatFeatures(dtApx[i].INT_DESC);
					dtApxDesc2[i] = DetailController.formatFeatures1(dtApx[i].INT_DESC);
					dataApx1.push({
						/*	"Category_en": dtApx[i].APX + "\n" + msrpF + msrp[i] + "\n" + netPriceF + net[i],
							//dtApx[i].APX + "\n" + dtApxDesc + "\n" + msrpF + msrp[i] + "\n" + netPriceF + net[i],
							"Cust_fac_desc_en":dtApxDesc[i],// "", //dtApx[i].INT_DESC,
							"Vehicle1": dtApxDesc2[i], //dtApx[i].INT_DESC, //dtApx[i].Vehicle1,
						//	"Vehicle2": dtApxDesc2[i], //dtApx[i].INT_DESC,//dtApx[i].Vehicle2*/
						"Category_en": dtApx[i].APX + "\n" + msrpF + msrp[i] + "\n" + netPriceF + net[i],
						//dtApx[i].APX + "\n" + dtApxDesc + "\n" + msrpF + msrp[i] + "\n" + netPriceF + net[i],
						"Cust_fac_desc_en": dtApxDesc[i], //"", //dtApx[i].INT_DESC,
						"Vehicle1": dtApxDesc2[i], //dtApx[i].INT_DESC, //dtApx[i].Vehicle1,
						"Vehicle2": "", //dtApxDesc2[i], //dtApx[i].INT_DESC,//dtApx[i].Vehicle2
						"Vehicle3": dtApx[i].Vehicle3,
						"Vehicle4": dtApx[i].Vehicle4,
						"Vehicle5": dtApx[i].Vehicle5

					});
				}
				var tblModelExt = new sap.ui.model.json.JSONModel();
				tblModelExt.setData({
					columns: aColumnData,
					rows: dataExterior
				});
				var tblModelInt = new sap.ui.model.json.JSONModel();
				tblModelInt.setData({
					columns: aColumnData,
					rows: dataInterior
				});
				var tblModelPwr = new sap.ui.model.json.JSONModel();
				tblModelPwr.setData({
					columns: aColumnData,
					rows: dataPwr
				});
				var tblModelInfo = new sap.ui.model.json.JSONModel();
				tblModelInfo.setData({
					columns: aColumnData,
					rows: dataInfo
				});
				var tblModelSaf = new sap.ui.model.json.JSONModel();
				tblModelSaf.setData({
					columns: aColumnData,
					rows: dataSafety
				});

				var tblModelCol = new sap.ui.model.json.JSONModel();
				tblModelCol.setData({
					columns: aColumnData,
					rows: dataColour
				});

				var tblModelOpt = new sap.ui.model.json.JSONModel();
				tblModelOpt.setData({
					columns: aColumnDataOpt,
					rows: dataOpt
				});
				var tblModelDim = new sap.ui.model.json.JSONModel();
				tblModelDim.setData({
					columns: aColumnData,
					rows: dataDim
				});
				var tblModelApx = new sap.ui.model.json.JSONModel();
				tblModelApx.setData({
					columns: aColumnData,
					rows: dataApx
				});
				var tblModelApx1 = new sap.ui.model.json.JSONModel();
				tblModelApx1.setData({
					columns: emptydata,
					rows: dataApx1
				});
				var tblExterior = DetailController.getView().byId("DetailtblExterior");
				tblExterior.setModel(tblModelExt);
				tblExterior.bindAggregation("columns", "/columns", function (index, context) {
					return new sap.m.Column({
						header: new sap.m.Label({
							text: context.getObject().veh
						}),
					});
				});
				tblExterior.bindItems("/rows", function (index, context) {
					var obj = context.getObject();
					var row = new sap.m.ColumnListItem();
					for (var k in obj) {
						if (obj[k] == "Y") {
							row.addCell(
								new sap.m.HBox({
									items: [new sap.m.Text({
										text: " ",
									}).addStyleClass("padding"), new sap.ui.core.Icon({
										src: "sap-icon://accept",

									})]
								})
							);
						} else {
							row.addCell(
								new sap.m.Text({
									text: obj[k]
								})
							);
						}
					}
					return row;
				});

				var tblInterior = DetailController.getView().byId("DetailtblInterior");
				tblInterior.setModel(tblModelInt);
				tblInterior.bindAggregation("columns", "/columns", function (index, context) {
					return new sap.m.Column({
						header: new sap.m.Label({
							text: context.getObject().veh
						}),
					});
				});
				tblInterior.bindItems("/rows", function (index, context) {
					var obj = context.getObject();
					var row = new sap.m.ColumnListItem();
					for (var k in obj) {
						if (obj[k] == "Y") {
							row.addCell(
								new sap.m.HBox({
									items: [new sap.m.Text({
										text: " ",
									}).addStyleClass("padding"), new sap.ui.core.Icon({
										src: "sap-icon://accept",

									})]
								})
							);
						} else {
							row.addCell(
								new sap.m.Text({
									text: obj[k]
								})
							);
						}
					}
					return row;
				});

				var tblPowertrain = DetailController.getView().byId("DetailtblpwrTrn");
				tblPowertrain.setModel(tblModelPwr);
				tblPowertrain.bindAggregation("columns", "/columns", function (index, context) {
					return new sap.m.Column({
						header: new sap.m.Label({
							text: context.getObject().veh
						}),
					});
				});
				tblPowertrain.bindItems("/rows", function (index, context) {
					var obj = context.getObject();
					var row = new sap.m.ColumnListItem();
					for (var k in obj) {
						if (obj[k] == "Y") {
							row.addCell(
								new sap.m.HBox({
									items: [new sap.m.Text({
										text: " ",
									}).addStyleClass("padding"), new sap.ui.core.Icon({
										src: "sap-icon://accept",

									})]
								})
							);
						} else {
							row.addCell(
								new sap.m.Text({
									text: obj[k]
								})
							);
						}
					}
					return row;
				});
				var tblSafety = DetailController.getView().byId("DetailtblSafety");
				tblSafety.setModel(tblModelSaf);
				tblSafety.bindAggregation("columns", "/columns", function (index, context) {
					return new sap.m.Column({
						header: new sap.m.Label({
							text: context.getObject().veh
						}),
					});
				});
				tblSafety.bindItems("/rows", function (index, context) {
					var obj = context.getObject();
					var row = new sap.m.ColumnListItem();
					for (var k in obj) {
						if (obj[k] == "Y") {
							row.addCell(
								new sap.m.HBox({
									items: [new sap.m.Text({
										text: " ",
									}).addStyleClass("padding"), new sap.ui.core.Icon({
										src: "sap-icon://accept",

									})]
								})
							);
						} else {
							row.addCell(
								new sap.m.Text({
									text: obj[k]
								})
							);
						}
					}
					return row;
				});
				var tblInfotainment = DetailController.getView().byId("DetailtblInfotainment");
				tblInfotainment.setModel(tblModelInfo);
				tblInfotainment.bindAggregation("columns", "/columns", function (index, context) {
					return new sap.m.Column({
						header: new sap.m.Label({
							text: context.getObject().veh
						}),
					});
				});
				tblInfotainment.bindItems("/rows", function (index, context) {
					var obj = context.getObject();
					var row = new sap.m.ColumnListItem();
					for (var k in obj) {
						if (obj[k] == "Y") {
							row.addCell(
								new sap.m.HBox({
									items: [new sap.m.Text({
										text: " ",
									}).addStyleClass("padding"), new sap.ui.core.Icon({
										src: "sap-icon://accept",

									})]
								})
							);
						} else {
							row.addCell(
								new sap.m.Text({
									text: obj[k]
								})
							);
						}
					}
					return row;
				});
				var tblColorOptions = DetailController.getView().byId("DetailtblColorOptions");
				tblColorOptions.setModel(tblModelCol);
				tblColorOptions.bindAggregation("columns", "/columns", function (index, context) {
					return new sap.m.Column({
						header: new sap.m.Label({
							text: context.getObject().veh
						}),hAlign:"Center"
					});
				});
				tblColorOptions.bindItems("/rows", function (index, context) {
					var obj = context.getObject();
					var row = new sap.m.ColumnListItem();
					for (var k in obj) {
						if (obj[k] == "Y") {
							row.addCell(
								new sap.m.HBox({
									items: [new sap.m.Text({
										text: " ",
									}).addStyleClass("padding"), new sap.ui.core.Icon({
										src: "sap-icon://accept",

									})]
								})
							);
						} else {
							row.addCell(
								new sap.m.Text({
									text: obj[k]
								})
							);
						}
					}
					return row;
				});
				var tblDimensions = DetailController.getView().byId("DetailtblDimensions");
				tblDimensions.setModel(tblModelDim);
				tblDimensions.bindAggregation("columns", "/columns", function (index, context) {
					return new sap.m.Column({
						header: new sap.m.Label({
							text: context.getObject().veh
						}),
					});
				});
				tblDimensions.bindItems("/rows", function (index, context) {
					var obj = context.getObject();
					var row = new sap.m.ColumnListItem();
					for (var k in obj) {
						if (obj[k] == "Y") {
							row.addCell(
								new sap.m.HBox({
									items: [new sap.m.Text({
										text: " ",
									}).addStyleClass("padding"), new sap.ui.core.Icon({
										src: "sap-icon://accept",

									})]
								})
							);
						} else {
							row.addCell(
								new sap.m.Text({
									text: obj[k]
								})
							);
						}
					}
					return row;
				});
				var tblOptionPack = DetailController.getView().byId("DetailtblOptionPack");
				tblOptionPack.setModel(tblModelOpt);
				tblOptionPack.bindAggregation("columns", "/columns", function (index, context) {
					return new sap.m.Column({
						header: new sap.m.Label({
							text: context.getObject().optPack
						}),
					});
				});
				tblOptionPack.bindItems("/rows", function (index, context) {
					var obj = context.getObject();
					var row = new sap.m.ColumnListItem();
					for (var k in obj) {
						if (obj[k] == "Y") {
							row.addCell(
								new sap.m.HBox({
									items: [new sap.m.Text({
										text: " ",
									}).addStyleClass("padding"), new sap.ui.core.Icon({
										src: "sap-icon://accept",

									})]
								})
							);
						} else {
							row.addCell(
								new sap.m.Text({
									text: obj[k]
								})
							);
						}
					}
					return row;
				});
				var tblAPX1 = DetailController.getView().byId("DetailtblAPX1");
				tblAPX1.setModel(tblModelApx1);
				tblAPX1.bindAggregation("columns", "/columns", function (index, context) {
					return new sap.m.Column({
						header: new sap.m.Label({
							text: context.getObject().Vehicle
						})
					});
				});
				tblAPX1.bindItems("/rows", function (index, context) {
					var obj = context.getObject();
					var row = new sap.m.ColumnListItem();
					for (var k in obj) {
						if (obj[k] == "Y") {
							row.addCell(
								new sap.m.HBox({
									items: [new sap.m.Text({
										text: " ",
									}).addStyleClass("padding"), new sap.ui.core.Icon({
										src: "sap-icon://accept",
										color: "black"
									})]
								})
							);
						} else {
							row.addCell(
								new sap.m.Text({
									text: obj[k]
								})
							);
						}
					}
					return row;
				});

				var tblAPX = DetailController.getView().byId("DetailtblAPX");
				tblAPX.setModel(tblModelApx);
				tblAPX.bindAggregation("columns", "/columns", function (index, context) {
					return new sap.m.Column({
						header: new sap.m.Label({
							text: context.getObject().veh
						}),
					});
				});
				tblAPX.bindItems("/rows", function (index, context) {
					var obj = context.getObject();
					var row = new sap.m.ColumnListItem();
					for (var k in obj) {
						if (obj[k] == "Y") {
							row.addCell(
								new sap.m.HBox({
									items: [new sap.m.Text({
										text: " ",
									}).addStyleClass("padding"), new sap.ui.core.Icon({
										src: "sap-icon://accept",

									})]
								})
							);
						} else {
							row.addCell(
								new sap.m.Text({
									text: obj[k]
								})
							);
						}
					}
					return row;
				});
			}
		},
		_onFioriObjectPageHeaderPress: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			var oQueryParams = DetailController.getQueryParameters(window.location);

			if (sPreviousHash !== undefined || oQueryParams.navBackToLaunchpad) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(DetailController);
				oRouter.navTo("default", true);
			}

		},
		getQueryParameters: function (oLocation) {
			var oQuery = {};
			var aParams = oLocation.search.substring(1).split("&");
			for (var i = 0; i < aParams.length; i++) {
				var aPair = aParams[i].split("=");
				oQuery[aPair[0]] = decodeURIComponent(aPair[1]);
			}
			return oQuery;
			//	console.log(oQuery);
		},
		_onCreateVehGuide: function () {

			var sDialogName = "CreateVehicleGuideDialog";
			DetailController.mDialogs = DetailController.mDialogs || {};
			var oDialog = DetailController.mDialogs[sDialogName];

			//	if (!oDialog) {
			oDialog = new CreateVehicleGuideDialog(DetailController.getView());
			DetailController.mDialogs[sDialogName] = oDialog;
			oDialog.setRouter(DetailController.oRouter);
			//	}
			oDialog.open();

		},
		_onCreateWhatsNew: function () {
			var sDialogName = "CreateWhatsNewDialog";
			DetailController.mDialogs = DetailController.mDialogs || {};
			var oDialog = DetailController.mDialogs[sDialogName];

			//	if (!oDialog) {
			oDialog = new CreateWhatsNewDialog(DetailController.getView());
			DetailController.mDialogs[sDialogName] = oDialog;

			// For navigation.
			oDialog.setRouter(DetailController.oRouter);
			//	}
			oDialog.open();
		},
		_onCreateWalkUp: function () {

			var sDialogName = "CreateWalkUpGuide";
			DetailController.mDialogs = DetailController.mDialogs || {};
			var oDialog = DetailController.mDialogs[sDialogName];

			//	if (!oDialog) {
			oDialog = new CreateWalkUpGuide(DetailController.getView());
			DetailController.mDialogs[sDialogName] = oDialog;

			// For navigation.
			oDialog.setRouter(DetailController.oRouter);
			//	}
			oDialog.open();
		},
		_onCreateSupplemental: function () {
			var sDialogName = "CreateSupplementalGuide";
			DetailController.mDialogs = DetailController.mDialogs || {};
			var oDialog = DetailController.mDialogs[sDialogName];

			//	if (!oDialog) {
			oDialog = new CreateSupplementalGuide(DetailController.getView());
			DetailController.mDialogs[sDialogName] = oDialog;

			// For navigation.
			oDialog.setRouter(DetailController.oRouter);
			//	}
			oDialog.open();

		},
		_onCreatePocSum: function () {
			var sDialogName = "CreatePocketSummaryDialog";
			DetailController.mDialogs = DetailController.mDialogs || {};
			var oDialog = DetailController.mDialogs[sDialogName];
			//	if (!oDialog) {
			oDialog = new CreatePocketSummaryDialog(DetailController.getView());
			DetailController.mDialogs[sDialogName] = oDialog;
			oDialog.setRouter(DetailController.oRouter);
			//	}
			oDialog.open();
		},
		manageSeries: function () {
			var model = DetailController.getView().getModel("modelDetail");
			var data = model.getData();

			var arr = [{
				"brand": data.brand,
				"moYear": data.moYear,
				"series": data.series,
				"suffix": data.suffix,
				"model": data.model,
				"modelDesc": data.ENModelDesc
			}];
			var routeData = JSON.stringify(arr);
			DetailController.oRouter.navTo("AdminDetailsOption", {
				num3: routeData
			});

		},
		_onFioriObjectPageActionButtonPress4: function (oEvent) { //Manage series page

			var oBindingContext = oEvent.getSource().getBindingContext();
			//		console.log(oBindingContext);
			return new Promise(function (fnResolve) {

				DetailController.doNavigate("AdminDetailsOption", oBindingContext, fnResolve, "");
			}.bind(DetailController)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		doNavigate: function (sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oModel = (oBindingContext) ? oBindingContext.getModel() : null;
			//	console.log(sPath);
			//	console.log(oModel);
			var sEntityNameSet;
			if (sPath !== null && sPath !== "") {
				if (sPath.substring(0, 1) === "/") {
					sPath = sPath.substring(1);
				}
				sEntityNameSet = sPath.split("(")[0];
			}
			var sNavigationPropertyName;
			var sMasterContext = DetailController.sMasterContext ? DetailController.sMasterContext : sPath;

			if (sEntityNameSet !== null) {
				sNavigationPropertyName = sViaRelation || DetailController.getOwnerComponent().getNavigationPropertyForNavigationWithContext(
					sEntityNameSet,
					sRouteName);
			}
			//	console.log(sNavigationPropertyName);
			if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
				if (sNavigationPropertyName === "") {
					DetailController.oRouter.navTo(sRouteName, {
						context: sPath,
						masterContext: sMasterContext
					}, false);
				} else {
					oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function (bindingContext) {
						if (bindingContext) {
							sPath = bindingContext.getPath();
							if (sPath.substring(0, 1) === "/") {
								sPath = sPath.substring(1);
							}
						} else {
							sPath = "undefined";
						}

						// If the navigation is a 1-n, sPath would be "undefined" as DetailController is not supported in Build
						if (sPath === "undefined") {
							DetailController.oRouter.navTo(sRouteName);
						} else {
							DetailController.oRouter.navTo(sRouteName, {
								context: sPath,
								masterContext: sMasterContext
							}, false);
						}
					}.bind(DetailController));
				}
			} else {
				DetailController.oRouter.navTo(sRouteName);
			}

			if (typeof fnPromiseResolve === "function") {
				fnPromiseResolve();
			}
			//		console.log(sPath);
		},

		onExit: function () {

			// to destroy templates for bound aggregations when templateShareable is true on exit to prevent duplicateId issue
			var aControls = [{
				"controlId": "Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-2-sectionContent-Fiori_ObjectPage_Table-1",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1538676529951-sectionContent-Fiori_ObjectPage_Table-1",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1538676692578-sectionContent-Fiori_ObjectPage_Table-1539290746962",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1538676734294-sectionContent-Fiori_ObjectPage_Table-1539290840643",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1538676763485-sectionContent-Fiori_ObjectPage_Table-1539291072034",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1538676754780-sectionContent-Fiori_ObjectPage_Table-1539291098748",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1538676721284-sectionContent-Fiori_ObjectPage_Table-1539291137618",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1538676747847-sectionContent-Fiori_ObjectPage_Table-1539291122586",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1539785703581-sectionContent-Fiori_ObjectPage_Table-1",
				"groups": ["items"]
			}];
			for (var i = 0; i < aControls.length; i++) {
				var oControl = DetailController.getView().byId(aControls[i].controlId);
				for (var j = 0; j < aControls[i].groups.length; j++) {
					var sAggregationName = aControls[i].groups[j];
					var oBindingInfo = oControl.getBindingInfo(sAggregationName);
					var oTemplate = oBindingInfo.template;
					oTemplate.destroy();
				}
			}

		}
	});
}, true);