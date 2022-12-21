import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {UserRoutingModule} from "./user-routing.module";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {UserInfoComponent} from './user-profile/user-info/user-info.component';
import {NzImageModule} from "ng-zorro-antd/image";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {ReactiveFormsModule} from "@angular/forms";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NgxEchartsModule} from "ngx-echarts";
import * as echarts from 'echarts';
import {ChartsModule} from "ng2-charts";
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzIconModule} from "ng-zorro-antd/icon";


@NgModule({
  declarations: [
    UserProfileComponent,
    UserInfoComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    NzTabsModule,
    NzImageModule,
    NzFormModule,
    NzDatePickerModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzInputModule,
    NzRadioModule,
    NzSpinModule,
    NgxEchartsModule.forRoot({
      echarts
    }),
    ChartsModule,
    NzLayoutModule,
    NzDropDownModule,
    NzIconModule
  ]
})
export class UserModule {
}
