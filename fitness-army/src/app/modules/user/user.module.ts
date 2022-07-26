import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import {UserRoutingModule} from "./user-routing.module";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import { UserInfoComponent } from './user-profile/user-info/user-info.component';
import { BmiCalculatorComponent } from './user-profile/bmi-calculator/bmi-calculator.component';
import {NzImageModule} from "ng-zorro-antd/image";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {ReactiveFormsModule} from "@angular/forms";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {BmiApiInterceptor} from "./user-profile/interceptor/bmi-api.interceptor";

@NgModule({
  declarations: [
    UserProfileComponent,
    UpdateUserComponent,
    UserInfoComponent,
    BmiCalculatorComponent
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
    NzRadioModule
  ],
  providers: [
  ]
})
export class UserModule { }
