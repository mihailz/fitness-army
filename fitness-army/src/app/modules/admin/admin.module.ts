import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdminRoutingModule} from "./admin-routing.module";
import { RegisteredUsersComponent } from './admin-dashboard/registered-users/registered-users.component';
import {NzTableModule} from "ng-zorro-antd/table";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzFormModule} from "ng-zorro-antd/form";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {AdminDashboardComponent} from "./admin-dashboard/admin-dashboard.component";
import {MaterialModule} from "../../material.module";
import {NzSpinModule} from "ng-zorro-antd/spin";

@NgModule({
  declarations: [
    RegisteredUsersComponent,
    AdminDashboardComponent
  ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        NzTableModule,
        NzButtonModule,
        NzFormModule,
        ReactiveFormsModule,
        NzInputModule,
        NzSelectModule,
        FormsModule,
        NzTabsModule,
        MaterialModule,
        NzSpinModule
    ]
})
export class AdminModule { }
