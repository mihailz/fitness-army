import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Route, RouterModule} from "@angular/router";
import {UserProfileComponent} from "./user-profile/user-profile.component";
import {UpdateUserComponent} from "./update-user/update-user.component";

const routes: Route[] = [
  {
    path: 'profile',
    component: UserProfileComponent
  },
  {
    path: 'update',
    component: UpdateUserComponent
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
export class UserRoutingModule { }
