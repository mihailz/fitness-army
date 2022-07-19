import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Route, RouterModule} from "@angular/router";
import {RegisteredUsersComponent} from "./registered-users/registered-users.component";
import {EditUserComponent} from "./registered-users/edit-user/edit-user.component";

const routes: Route[] = [
  {
    path: '',
    redirectTo: 'users'
  },
  {
    path: 'users',
    component: RegisteredUsersComponent
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
