import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogsWrapperComponent } from './blogs-wrapper/blogs-wrapper.component';
import {BlogRoutingModule} from "./blog-routing.module";

@NgModule({
  declarations: [
    BlogsWrapperComponent
  ],
  imports: [
    CommonModule,
    BlogRoutingModule
  ]
})
export class BlogModule { }
