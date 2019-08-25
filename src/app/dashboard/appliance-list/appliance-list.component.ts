import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import { ConstantsService } from '../../services/constants.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-appliance-list',
  templateUrl: './appliance-list.component.html',
  styleUrls: ['./appliance-list.component.scss']
})
export class ApplianceListComponent implements OnInit, OnChanges {

  // @Input() applianceList;
  @Input() clickedHomesArray;
  @Input() sliderData;
  @Output() applianceSelected: EventEmitter<any> = new EventEmitter<any>();
  applianceList;
  clickedAppliancesArray;
  clickedAppliancesCSV;
  clickedApplianceId;


  constructor(
    private constants: ConstantsService,
    private apiService: ApiService
  ) { }


  ngOnInit() {
    this.getApplianceList();
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes, "changed");
    if (changes.clickedHomesArray && !changes.clickedHomesArray.firstChange) {
      this.getApplianceList();
    }
    if (changes.sliderData && !changes.sliderData.firstChange) {
      this.consumptionDetails();
    }
    // You can also use categoryId.previousValue and 
    // categoryId.firstChange for comparing old and new values

  }

  mouseoverOnAppl(e, isClicked) {
    if (isClicked)
      d3.selectAll("g.each-area")
        .transition()
        .duration(250)
        .attr("fill-opacity", (a, b, c: any) => {
          if (c[b].id === "each-area" + e.currentTarget.dataset.areaId) {
            return 0.5;
          } else {
            return 0.2;
          }
        })
        .attr("stroke", (a, b, c: any) => {
          if (c[b].id === "each-area" + e.currentTarget.dataset.areaId) {
            return d3.select(c[b]).attr("fill");
          } else {
            return "none";
          }
        })
    // angular.element(e.currentTarget).addClass("hover");
    // angular.element(e.currentTarget.nextElementSibling).addClass("nearby")
    // angular.element(e.currentTarget.previousElementSibling).addClass("nearby")
    e.currentTarget.classList.add("hover");
    e.currentTarget.nextElementSibling ?
      e.currentTarget.nextElementSibling.classList.add("nearby") : '';
    e.currentTarget.previousElementSibling ?
      e.currentTarget.previousElementSibling.classList.add("nearby") : '';
  }


  mouseleaveOnAppl(e, isClicked) {
    if (isClicked)
      d3.selectAll("g.each-area")
        .transition()
        .duration(250)
        .attr("fill-opacity", 0.5)
        .attr("stroke", (a, b, c) => {
          return d3.select(c[b]).attr("fill");
        });
    // angular.element(e.currentTarget).removeClass("hover");
    // angular.element(e.currentTarget.nextElementSibling).removeClass("nearby")
    // angular.element(e.currentTarget.previousElementSibling).removeClass("nearby")
    e ? e.currentTarget.classList.remove("hover") : '';
    e.currentTarget.nextElementSibling ?
      e.currentTarget.nextElementSibling.classList.remove("nearby") : '';
    e.currentTarget.previousElementSibling ?
      e.currentTarget.previousElementSibling.classList.remove("nearby") : '';
  }

  clickedOnAppl(e, data) {
    // console.log(e, data);
    this.clickedApplianceId = data.applianceId;
    if (data.clicked) {
      // angular.element(e.currentTarget).removeClass("active");
      e.currentTarget.classList.remove("active");
      data.clicked = false;
      e.currentTarget.style.backgroundColor = '';
      e.currentTarget.style.borderColor = '';
      // angular.element(e.currentTarget).css({
      //   background: '',
      //   borderColor: ''
      // }) // do not remove
    } else {
      // angular.element(e.currentTarget).addClass("active");
      e.currentTarget.classList.remove("add");
      data.clicked = true;
      var colorToStyle = this.constants.applBgColor(this.constants.colorArray[data.applianceId]);

      e.currentTarget.style.backgroundColor = colorToStyle;
      e.currentTarget.style.borderColor = this.constants.colorArray[data.applianceId];
      // angular.element(e.currentTarget).css({
      //   background: colorToStyle,
      //   borderColor: this.constants.colorArray[data.applianceId]
      // }) // do not remove
    }
    this.clickedAppliancesArray = [];
    this.clickedAppliancesCSV = '';
    var itr = 0;
    this.applianceList.forEach(d => {
      if (d.clicked === true) {
        this.clickedAppliancesArray.push(d.applianceId);
        (itr === 0) ? this.clickedAppliancesCSV = this.clickedAppliancesCSV + d.applianceId : this.clickedAppliancesCSV = this.clickedAppliancesCSV + "," + d.applianceId;
        itr++;
      }
    })
    // console.log(this.clickedAppliancesArray, this.clickedHomesArray);
    this.applianceSelected.emit({
      csv: this.clickedAppliancesCSV,
      list: this.applianceList,
      clicked: this.clickedAppliancesArray,
      clickedId: this.clickedApplianceId
    });
  };

  getApplianceList() {
    // console.log(this.clickedHomesArray);
    this.apiService.callServicePost('getApplianceList', {
      homes: this.clickedHomesArray
    }, houseData => { //get the appliance list
      console.log(houseData);
      // this.applianceList = houseData;
      /********
      Do some default things here like making data object to get complete data
      ********/
      this.clickedAppliancesArray = [];
      this.clickedAppliancesCSV = '';
      var itr = 0;
      houseData.forEach((d, i) => {
        d.color = this.constants.applBgColor(this.constants.colorArray[d.applianceId]);
        d.borderColor = this.constants.colorArray[d.applianceId];
        if (d.clicked === true) {
          this.clickedAppliancesArray.push(d.applianceId);
          (itr === 0) ? this.clickedAppliancesCSV = this.clickedAppliancesCSV + d.applianceId : this.clickedAppliancesCSV = this.clickedAppliancesCSV + "," + d.applianceId;
          itr++;
        }
      })
      this.applianceList = houseData;
      // console.log(this.clickedAppliancesCSV);
      this.applianceSelected.emit({
        csv: this.clickedAppliancesCSV,
        list: this.applianceList,
        clicked: this.clickedAppliancesArray,

        clickedId: this.clickedApplianceId
      });
      this.consumptionDetails();

    }, err => {

    });
  }
  consumptionDetails() {
    this.apiService.callServicePost("applHomeReqBody", {
      homes: this.clickedHomesArray,
      appliances: this.clickedAppliancesArray
    }, data => {
      this.apiService.callServicePost("allApplHomesSummary", {
        from: this.sliderData.values[0],
        to: this.sliderData.values[1],
        houseData: data
      }, res => {
        // console.log(res, this.applianceList);
        this.applianceList.forEach((d, i) => {
          d.unitsConsumed = (Math.floor(res[0]["y" + d.applianceId] * 100 / (60 * 1000)) / 100) + " Units"
          d.percentage = (Math.floor(res[0]["y" + d.applianceId] * 10000 / res[0]["total"]) / 100) + "%"
        })
        // this.timeSliderChanged(); // don't delete it
      }, err => { });
    }, err => {

    })

  }

}
