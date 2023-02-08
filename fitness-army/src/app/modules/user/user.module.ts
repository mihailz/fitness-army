import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {UserRoutingModule} from "./user-routing.module";
import {ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../../material.module";
import { BmiChartComponent } from './user-profile/bmi-chart/bmi-chart.component';
import { CreateUserBodyStatsComponent } from './user-profile/create-user-body-stats/create-user-body-stats.component';
import {ChartsModule} from "ng2-charts";
import { BmiRangeComponent } from './user-profile/bmi-range/bmi-range.component';
import { UpdateUserBodyStatsComponent } from './user-profile/update-user-body-stats/update-user-body-stats.component';

@NgModule({
  declarations: [
    UserProfileComponent,
    BmiChartComponent,
    CreateUserBodyStatsComponent,
    BmiRangeComponent,
    UpdateUserBodyStatsComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    ChartsModule
  ]
})
export class UserModule {
}
