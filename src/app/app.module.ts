import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_ROUTES } from './app.routes';


import { AppComponent } from './app.component';

import { DashboardModule } from './dashboard/dashboard.module';
import { ApiService } from './services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { ConstantsService } from './services/constants.service';


@NgModule({
  declarations: [
    AppComponent,
    // DashboardComponent,
    // ApplianceListComponent,
    // BuildingListComponent
  ],
  imports: [
    BrowserModule,
    DashboardModule,
    HttpClientModule,
    RouterModule.forRoot(APP_ROUTES),
  ],
  providers: [
    ApiService,
    ConstantsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
