import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Route, RouterModule} from "@angular/router";
import {BlogsWrapperComponent} from "./blogs-wrapper/blogs-wrapper.component";
import {BlogDetailsComponent} from "./blog-details/blog-details.component";
import {UpdateBlogComponent} from "./update-blog/update-blog.component";

const routes: Route[] = [
  {
    path: '',
    component: BlogsWrapperComponent
  },
  {
    path: 'details/:id',
    component: BlogDetailsComponent
  },
  {
    path: 'update/:id',
    component: UpdateBlogComponent
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
