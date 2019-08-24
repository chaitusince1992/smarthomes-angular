import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-appliance-list',
  templateUrl: './appliance-list.component.html',
  styleUrls: ['./appliance-list.component.scss']
})
export class ApplianceListComponent implements OnInit {

  @Input() applianceList;
  constructor() { }

  ngOnInit() {
  }
  mouseoverOnAppl(e, isClicked) {
    if (isClicked)
      d3.selectAll("g.each-area")
        .transition()
        .duration(250)
        .attr("fill-opacity", (a, b, c) => {
          if (c[b].id === "each-area" + e.currentTarget.dataset.areaId) {
            return 0.5;
          } else {
            return 0.2;
          }
        })
        .attr("stroke", (a, b, c) => {
          if (c[b].id === "each-area" + e.currentTarget.dataset.areaId) {
            return d3.select(c[b]).attr("fill");
          } else {
            return "none";
          }
        })
    // angular.element(e.currentTarget).addClass("hover");
    // angular.element(e.currentTarget.nextElementSibling).addClass("nearby")
    // angular.element(e.currentTarget.previousElementSibling).addClass("nearby")
    e?e.currentTarget.classList.add("hover"):'';
    e?e.currentTarget.nextElementSibling.classList.add("nearby"):'';
    e?e.currentTarget.nextElementSibling.classList.add("nearby"):'';
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
    e?e.currentTarget.classList.remove("hover"):'';
    e?e.currentTarget.nextElementSibling.classList.remove("nearby"):'';
    e?e.currentTarget.nextElementSibling.classList.remove("nearby"):'';
  }
}
