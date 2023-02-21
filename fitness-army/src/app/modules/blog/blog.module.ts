import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BlogsWrapperComponent} from './blogs-wrapper/blogs-wrapper.component';
import {BlogRoutingModule} from "./blog-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ImageUploaderModule} from "../../shared/image-uploader/image-uploader.module";
import {BlogComponent} from './blogs-wrapper/blog/blog.component';
import {BlogDetailsComponent} from './blog-details/blog-details.component';
import {UpdateBlogComponent} from './update-blog/update-blog.component';
import {BlogsFilterComponent} from './blogs-wrapper/blogs-filter/blogs-filter.component';
import {MaterialModule} from "../../material.module";
import {AddBlogComponent} from './add-blog/add-blog.component';
import {AddParagraphModule} from "../../shared/add-paragraph/add-paragraph.module";

@NgModule({
  declarations: [
    BlogsWrapperComponent,
    BlogComponent,
    BlogDetailsComponent,
    UpdateBlogComponent,
    BlogsFilterComponent,
    AddBlogComponent
  ],
  imports: [
    CommonModule,
    BlogRoutingModule,
    ReactiveFormsModule,
    ImageUploaderModule,
    MaterialModule,
    FormsModule,
    AddParagraphModule
  ]
})
export class BlogModule {
}
