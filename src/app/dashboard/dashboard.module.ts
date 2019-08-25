import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
// import { BuildingListComponent } from './building-list/building-list.component';
import { ApplianceListComponent } from './appliance-list/appliance-list.component';
import { AreaChartComponent } from './area-chart/area-chart.component';

// import { CommonAppModule } from '../components/common-app.module';
// import { ValetLibraryComponent } from './valet-library.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' }
];


@NgModule({
  declarations: [
    DashboardComponent,
    // BuildingListComponent,
    ApplianceListComponent,
    AreaChartComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    FormsModule,
    HttpClientModule
  ],
  exports: [
    DashboardComponent,
    // BuildingListComponent,
    ApplianceListComponent
  ]
})
export class DashboardModule { }
