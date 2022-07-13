import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdminRoutingModule} from "./admin-routing.module";
import { RegisteredUsersComponent } from './registered-users/registered-users.component';
import {NzTableModule} from "ng-zorro-antd/table";
import {NzButtonModule} from "ng-zorro-antd/button";

@NgModule({
  declarations: [
    RegisteredUsersComponent
  ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        NzTableModule,
        NzButtonModule
    ]
})
export class AdminModule { }
