import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BlogsWrapperComponent} from './blogs-wrapper/blogs-wrapper.component';
import {BlogRoutingModule} from "./blog-routing.module";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzUploadModule} from "ng-zorro-antd/upload";
import {NzIconModule} from "ng-zorro-antd/icon";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzButtonModule} from "ng-zorro-antd/button";
import {ImageUploaderModule} from "../../shared/image-uploader/image-uploader.module";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzSelectModule} from "ng-zorro-antd/select";
import {BlogComponent} from './blogs-wrapper/blog/blog.component';
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzEmptyModule} from "ng-zorro-antd/empty";
import {BlogDetailsComponent} from './blog-details/blog-details.component';
import {UpdateBlogComponent} from './update-blog/update-blog.component';
import {AddParagraphModalComponent} from './add-paragraph-modal/add-paragraph-modal.component';
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {BlogsFilterComponent} from './blogs-wrapper/blogs-filter/blogs-filter.component';
import {MaterialModule} from "../../material.module";
import {AddBlogComponent} from './add-blog/add-blog.component';

@NgModule({
  declarations: [
    BlogsWrapperComponent,
    BlogComponent,
    BlogDetailsComponent,
    UpdateBlogComponent,
    AddParagraphModalComponent,
    BlogsFilterComponent,
    AddBlogComponent
  ],
  imports: [
    CommonModule,
    BlogRoutingModule,
    NzFormModule,
    NzInputModule,
    NzUploadModule,
    NzIconModule,
    ReactiveFormsModule,
    NzButtonModule,
    ImageUploaderModule,
    NzModalModule,
    NzSelectModule,
    NzSpinModule,
    NzEmptyModule,
    NzDropDownModule,
    MaterialModule,
    FormsModule
  ]
})
export class BlogModule {
}
