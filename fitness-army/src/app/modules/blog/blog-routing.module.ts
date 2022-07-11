import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Route, RouterModule} from "@angular/router";
import {BlogsWrapperComponent} from "./blogs-wrapper/blogs-wrapper.component";

const routes: Route[] = [
  {
    path: '',
    component: BlogsWrapperComponent
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
export class BlogRoutingModule { }
