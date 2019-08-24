import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-building-list',
  templateUrl: './building-list.component.html',
  styleUrls: ['./building-list.component.scss']
})
export class BuildingListComponent implements OnInit {

  @Input() homesList;
  constructor() { }

  ngOnInit() {
  }

}
