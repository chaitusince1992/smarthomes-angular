import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ConstantsService } from '../services/constants.service';
// import * as d3 from 'd3';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private apiService: ApiService, private constants: ConstantsService) { }

  homesList;
  clickedHomesArray;
  clickedHomesCSV = "";

  sliderData;


  applianceList;
  clickedAppliancesArray;
  clickedAppliancesCSV;
  // applianceObject = {};
  clickedApplianceId;

  structuredHouseData;

  chartDataset;
  oldChartDataset;



  chartData;

  fromDate;
  toDate;

  // chartDataArray = [];
  ngOnInit() {

    this.apiService.callServicePost('getHomesList', undefined, data => {
      console.log(data);
      this.homesList = [data[0], data[1]];
      /***********
      when selecting all by default
      ************/
      this.clickedHomesCSV = '';
      let clickedHomes = [];
      document.getElementsByClassName("select-all-none")[0].innerHTML = '<img src="assets/img/tick.png" alt="">';
      this.homesList.forEach((d, i) => {
        d.clicked = true;
        clickedHomes.push(d.homeId);
        (i === 0) ? this.clickedHomesCSV = this.clickedHomesCSV + d.homeId : this.clickedHomesCSV = this.clickedHomesCSV + "," + d.homeId;
      });
      this.clickedHomesArray = clickedHomes;
      /***********
      when selecting all by default
      ************/

      this.apiService.callServiceGet("minAndMax?houseId=" + this.clickedHomesCSV, res => {
        console.log(res);
        this.sliderData = {
          scaleRange: [res.min, res.max],
          values: [new Date(res.max).getTime() - 2700000000, new Date(res.max).getTime()]
        }
        // this.getApplianceList();
      }, err => {

      });
    }, err => {

    });
  }

  // getApplianceList() {
  //   console.log(this.clickedHomesArray);
  //   this.apiService.callServicePost('getApplianceList', {
  //     homes: this.clickedHomesArray
  //   }, houseData => { //get the appliance list
  //     console.log(houseData);
  //     this.applianceList = houseData;
  //     /********
  //     Do some default things here like making data object to get complete data
  //     ********/
  //     this.clickedAppliancesArray = [];
  //     this.clickedAppliancesCSV = '';
  //     var itr = 0;
  //     houseData.forEach((d, i) => {
  //       d.color = this.constants.applBgColor(this.constants.colorArray[d.applianceId]);
  //       d.borderColor = this.constants.colorArray[d.applianceId];
  //       if (d.clicked === true) {
  //         this.clickedAppliancesArray.push(d.applianceId);
  //         (itr === 0) ? this.clickedAppliancesCSV = this.clickedAppliancesCSV + d.applianceId : this.clickedAppliancesCSV = this.clickedAppliancesCSV + "," + d.applianceId;
  //         itr++;
  //       }
  //     })
  //     this.applianceList = houseData;
  //     console.log(this.clickedAppliancesCSV);

  //   }, err => {

  //   });
  // }

  applianceSelected(applData) {
    this.applianceList = applData.list;
    this.clickedAppliancesArray = applData.clicked;
    this.clickedApplianceId = applData.clickedId;
    // this.timeSliderSVGApi(); // dont delete
  }
  /***********
  Same used below in clickedOnAppl method also
  *************/
  consumptionDetails() {
    this.apiService.callServicePost("allApplHomesSummary", {
      from: this.sliderData.values[0],
      to: this.sliderData.values[1],
      houseData: this.structuredHouseData
    }, res => {
      console.log(res, this.applianceList);
      var applListTemp = this.applianceList;
      this.applianceList.forEach((d, i) => {
        d.unitsConsumed = (Math.floor(res[0]["y" + d.applianceId] * 100 / (60 * 1000)) / 100) + " Units"
        d.percentage = (Math.floor(res[0]["y" + d.applianceId] * 10000 / res[0]["total"]) / 100) + "%"
      })
      // this.timeSliderChanged(); // don't delete it
    }, err => { });
  }

  clickedOnHome(e, houseData) {
    console.log(e, houseData);
    document.getElementsByClassName("each-home select-all")[0]["dataset"].selectState = "some";
    if (houseData.clicked) {
      // angular.element(e.currentTarget).removeClass("active");
      e.currentTarget.classList.remove('active');
      houseData.clicked = false;
    } else {
      // angular.element(e.currentTarget).addClass("active");
      e.currentTarget.classList.add('active');
      houseData.clicked = true;
    }
    console.log(this.homesList);
    this.clickedHomesCSV = '';
    var itr = 0;
    let clickedHomes = [];
    this.homesList.forEach(d => {
      if (d.clicked === true) {
        clickedHomes.push(d.homeId);
        (itr === 0) ? this.clickedHomesCSV = this.clickedHomesCSV + d.homeId : this.clickedHomesCSV = this.clickedHomesCSV + "," + d.homeId;
        itr++;
      }
    })
    this.clickedHomesArray = clickedHomes;
    console.log(this.clickedHomesCSV);
    document.getElementsByClassName("select-all-none")[0].innerHTML = '<img src="assets/img/minus.png" alt="">';
    // this.applianceObject = {}; //resetting the appliance array

    /*****************************
    Revalidate below code
    ******************************/


    if (this.clickedHomesArray.length === 0) {
      alert("At least select a home.");
      return;
    }
    this.applianceList = []; //empty the array before rebinding
    this.oldChartDataset = undefined;
    this.apiService.callServiceGet("minAndMax?houseId=" + this.clickedHomesCSV, res => {
      console.log(res);
      this.sliderData = {
        scaleRange: [res.min, res.max],
        values: [new Date(res.max).getTime() - 2700000000, new Date(res.max).getTime()]
      }
      // this.getApplianceList(); // dont delete
    }, err => {

    });
  }

  clickedOnSelectAllNone(e) {
    if (e.currentTarget.dataset.selectState === "all" || e.currentTarget.dataset.selectState === "some") {
      this.clickedHomesArray = [];
      this.clickedHomesCSV = "";
      this.homesList.forEach(d => {
        d.clicked = false;
      })
      var homeArray = document.getElementsByClassName("each-home active");
      for (let i = 0; i < homeArray.length; i++) {
        let home = homeArray[i];
        home.classList.remove("active")
      }
      document.getElementsByClassName("area-group")[0].remove();
      // angular.element(homeArray).removeClass("active"); // dont delete this
      // d3.select("svg g.area-group").remove(); // don't delete this
      this.applianceList = [];
      e.currentTarget.children[0].innerHTML = '<img src="assets/img/minus.png" alt="">';
      e.currentTarget.dataset.selectState = "none";
    } else if (e.currentTarget.dataset.selectState === "none") {
      this.oldChartDataset = undefined;
      this.ngOnInit();
      e.currentTarget.dataset.selectState = "all";
    }
  }

  // clickedOnAppl(e, data) {
  //   console.log(e, data);
  //   this.clickedApplianceId = data.applianceId;
  //   if (data.clicked) {
  //     // angular.element(e.currentTarget).removeClass("active");
  //     e.currentTarget.classList.remove("active");
  //     data.clicked = false;
  //     // angular.element(e.currentTarget).css({
  //     //   background: '',
  //     //   borderColor: ''
  //     // }) // do not remove
  //   } else {
  //     // angular.element(e.currentTarget).addClass("active");
  //     e.currentTarget.classList.remove("add");
  //     data.clicked = true;
  //     var colorToStyle = this.constants.applBgColor(this.constants.colorArray[data.applianceId]);
  //     // angular.element(e.currentTarget).css({
  //     //   background: colorToStyle,
  //     //   borderColor: this.constants.colorArray[data.applianceId]
  //     // }) // do not remove
  //   }
  //   this.clickedAppliancesArray = [];
  //   this.clickedAppliancesCSV = '';
  //   var itr = 0;
  //   this.applianceList.forEach(d => {
  //     if (d.clicked === true) {
  //       this.clickedAppliancesArray.push(d.applianceId);
  //       (itr === 0) ? this.clickedAppliancesCSV = this.clickedAppliancesCSV + d.applianceId : this.clickedAppliancesCSV = this.clickedAppliancesCSV + "," + d.applianceId;
  //       itr++;
  //     }
  //   })
  //   console.log(this.clickedAppliancesArray, this.clickedHomesArray);



  //   var chartDataArray = [];
  //   this.chartData.forEach(a => {
  //     var eachPoint = {};
  //     var total = 0;
  //     for (var key in a) {
  //       if (key.indexOf("y") === -1) {
  //         eachPoint[key] = a[key];
  //       } else {
  //         this.clickedAppliancesArray.forEach(b => {
  //           if (b === Number(key.split("y")[1])) {
  //             eachPoint[key] = a[key];
  //             total += a[key];
  //           }
  //         })
  //       }
  //     }
  //     eachPoint['total'] = total;
  //     chartDataArray.push(eachPoint);
  //   });
  //   // this.chartCreate(chartDataArray); // uncomment it and dont delete it
  // };

  timeSliderChanged(sliderData) {
    this.sliderData = sliderData;
    // this.sliderData = {...sliderData}; // to detect changes
  }
  // timeSliderChanged(sliderData?) {
  //   console.log(this.applianceList);
  //   var fromDate = new Date(this.sliderData.values[0]).toDateString();
  //   var toDate = new Date(this.sliderData.values[1]).toDateString();
  //   this.fromDate = fromDate.split(" ")[1] + " " + fromDate.split(" ")[2] + ", " + fromDate.split(" ")[3];
  //   this.toDate = toDate.split(" ")[1] + " " + toDate.split(" ")[2] + ", " + toDate.split(" ")[3];
  //   this.apiService.callServicePost("allApplHomesData", {
  //     from: this.sliderData.values[0],
  //     to: this.sliderData.values[1],
  //     houseData: this.structuredHouseData
  //   }, res => {
  //     console.log(res);
  //     if (res.length === 0) {
  //       res = this.dummyDataObject();
  //     }
  //     res.forEach((a, i) => {
  //       var total = 0;
  //       for (var key in a) {
  //         if (key.indexOf("y") > -1) {
  //           total += a[key]
  //         }
  //       }
  //       a["total"] = total;
  //       a["angle"] = i * 2 * Math.PI / res.length;
  //     })
  //     this.chartData = res;
  //     /* var chartDataArray = [];
  //     this.chartData.forEach(a => {
  //       var eachPoint = {};
  //       var total = 0;
  //       for (var key in a) {
  //         if (key.indexOf("y") === -1) {
  //           eachPoint[key] = a[key];
  //         } else {
  //           this.clickedAppliancesArray.forEach(b => {
  //             if (b === Number(key.split("y")[1])) {
  //               eachPoint[key] = a[key];
  //               total += a[key];
  //             }
  //           })
  //         }
  //       }
  //       eachPoint['total'] = total;
  //       chartDataArray.push(eachPoint);
  //     }); */
  //     // this.chartCreate(chartDataArray); //uncomment it don't dlete it
  //   }, err => { });
  // }

  // chartDataFlag: boolean = false;

  // timeSliderSVGApi() {
  //   /********************
  //   To get normal data
  //   ********************/
  //   this.apiService.callServicePost("applHomeReqBody", {
  //     homes: this.clickedHomesArray,
  //     appliances: this.clickedAppliancesArray
  //   }, data => {
  //     this.structuredHouseData = data;
  //     this.apiService.callServicePost("allApplHomesDataNormal", {
  //       from: this.sliderData.scaleRange[0],
  //       to: this.sliderData.scaleRange[1],
  //       houseData: this.structuredHouseData
  //     }, res => {

  //       // this.timeSliderChart(res)
  //       this.timeSliderChartData = res;
  //       this.consumptionDetails(); // delete it later
  //     }, err => { })
  //   }, err => { })
  // }

  // timeSliderChartData;


  /*   dummyDataObject() {
      var res = [];
      for (var i = 0; i < 24; i++) {
        res.push({});
        res[i]["x"] = i;
        res[i]["total"] = 0;
        for (var key in this.structuredHouseData.appliances) {
          res[i]["y" + key] = 0;
        }
      }
      return res;
    } */

  aggregatedChart(e) {
    console.log("aggregated chart", e);
    // angular.element(e.currentTarget).addClass("active");
    e.currentTarget.classList.add("active");
    // angular.element(e.currentTarget.nextElementSibling).removeClass("active");
    e.currentTarget.nextElementSibling.classList.remove("active");
    // this.timeSliderChanged(); //dont delete it
  };
}
