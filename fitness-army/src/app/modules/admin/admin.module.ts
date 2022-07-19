import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdminRoutingModule} from "./admin-routing.module";
import { RegisteredUsersComponent } from './registered-users/registered-users.component';
import {NzTableModule} from "ng-zorro-antd/table";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzFormModule} from "ng-zorro-antd/form";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzSelectModule} from "ng-zorro-antd/select";

@NgModule({
  declarations: [
    RegisteredUsersComponent
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
  ]
})
export class AdminModule { }
