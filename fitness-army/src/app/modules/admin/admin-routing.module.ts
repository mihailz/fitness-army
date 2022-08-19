import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Route, RouterModule} from "@angular/router";
import {RegisteredUsersComponent} from "./admin-dashboard/registered-users/registered-users.component";
import {AdminDashboardComponent} from "./admin-dashboard/admin-dashboard.component";

const routes: Route[] = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      {
        path: 'users',
        component: RegisteredUsersComponent
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }
