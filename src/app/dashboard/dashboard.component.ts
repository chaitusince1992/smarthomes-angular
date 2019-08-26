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

  clickedApplianceId;

  structuredHouseData;

  chartDataset;
  oldChartDataset;



  chartData;

  fromDate;
  toDate;

  noHomeSelected: boolean;
  selectedHome;
  // chartDataArray = [];
  ngOnInit() {

    this.apiService.callServicePost('getHomesList', undefined, data => {
      // console.log(data);
      // this.homesList = [data[0], data[1], data[2]];
      this.homesList = [data[0], data[1], data[2], data[3], data[4]];
      /***********
      when selecting all by default
      ************/
      this.clickedHomesCSV = '';
      let clickedHomes = [];
      this.noHomeSelected = false;
      // document.getElementsByClassName("select-all-none")[0].innerHTML = '<img src="assets/img/tick.png" alt="">';
      /* this.homesList.forEach((d, i) => {
        d.clicked = true;
        clickedHomes.push(d.homeId);
        (i === 0) ? this.clickedHomesCSV = this.clickedHomesCSV + d.homeId : this.clickedHomesCSV = this.clickedHomesCSV + "," + d.homeId;
      }); */
      this.homesList.forEach((d, i) => {
        d.clicked = false;
      }); // clicked is coming from backend...
      this.homesList[0].clicked = true;
      this.selectedHome = this.homesList[0];
      clickedHomes.push(this.homesList[0].homeId);
      this.clickedHomesArray = clickedHomes;
      this.clickedHomesCSV = this.homesList[0].homeId;
      /***********
      when selecting all by default
      ************/

      this.apiService.callServiceGet("minAndMax?houseId=" + this.clickedHomesCSV, res => {
        // console.log(res);
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

  applianceSelected(applData) {
    this.applianceList = applData.list;
    this.clickedAppliancesArray = applData.clicked;
    this.clickedApplianceId = applData.clickedId;
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
    }, err => { });
  }

  clickedOnHome(e, houseData, index) {
    // console.log(e, houseData);
    this.selectedHome = houseData;
    houseData.clicked = !houseData.clicked;
    document.getElementsByClassName("each-home select-all")[0]["dataset"].selectState = "some";
    this.clickedHomesCSV = '';

    let clickedHomes = [];

    this.homesList.forEach((d, i) => {
      d.clicked = false;
    }); // clicked is coming from backend...
    this.homesList[index].clicked = true;
    clickedHomes.push(this.homesList[index].homeId);
    this.clickedHomesArray = clickedHomes;
    this.clickedHomesCSV = this.homesList[0].homeId;


    /*
    var itr = 0; 
    this.homesList.forEach(d => {
      if (d.clicked === true) {
        clickedHomes.push(d.homeId);
        (itr === 0) ? this.clickedHomesCSV = this.clickedHomesCSV + d.homeId : this.clickedHomesCSV = this.clickedHomesCSV + "," + d.homeId;
        itr++;
      }
    }) */
    // console.log(this.clickedHomesCSV);
    this.noHomeSelected = true;

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
      // e.currentTarget.children[0].innerHTML = '<img src="assets/img/minus.png" alt="">';
      this.noHomeSelected = true;
      e.currentTarget.dataset.selectState = "none";
    } else if (e.currentTarget.dataset.selectState === "none") {
      this.oldChartDataset = undefined;
      this.ngOnInit();
      e.currentTarget.dataset.selectState = "all";
    }
  }

  timeSliderChanged(sliderData) {
    this.sliderData = sliderData;
    // this.sliderData = {...sliderData}; // to detect changes
  }

  aggregatedChart(e) {
    console.log("aggregated chart", e);
    // angular.element(e.currentTarget).addClass("active");
    e.currentTarget.classList.add("active");
    // angular.element(e.currentTarget.nextElementSibling).removeClass("active");
    e.currentTarget.nextElementSibling.classList.remove("active");
    // this.timeSliderChanged(); //dont delete it
  };
}
