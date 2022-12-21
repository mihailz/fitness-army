import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Route, RouterModule} from "@angular/router";
import {UserProfileComponent} from "./user-profile/user-profile.component";
import {UserInfoComponent} from "./user-profile/user-info/user-info.component";

const routes: Route[] = [
  {
    path: 'profile',
    component: UserProfileComponent,
    children: [
      {
        path: '',
        component: UserInfoComponent
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
export class UserRoutingModule { }
