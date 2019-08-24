import { Component, OnInit } from '@angular/core';
import { RouteConfigLoadStart, Router, RouteConfigLoadEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';

  ngOnInit() {

  }

  constructor(private router: Router) {

    router.events.subscribe((val) => {
      // showing loader before loading lazy module
      if (val instanceof RouteConfigLoadStart) {
        console.log("Module loading started");
      }
      if (val instanceof RouteConfigLoadEnd) {
        console.log("Module loading ended");
      }
    })
  }
}