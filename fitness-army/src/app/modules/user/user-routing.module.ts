import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Route, RouterModule} from "@angular/router";
import {UserProfileComponent} from "./user-profile/user-profile.component";
import {UpdateUserBodyStatsComponent} from "./user-profile/update-user-body-stats/update-user-body-stats.component";

const routes: Route[] = [
  {
    path: 'profile',
    component: UserProfileComponent
  },
  {
    path: 'profile/update',
    component: UpdateUserBodyStatsComponent
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
