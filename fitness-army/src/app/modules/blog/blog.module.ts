import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogsWrapperComponent } from './blogs-wrapper/blogs-wrapper.component';
import {BlogRoutingModule} from "./blog-routing.module";
import { CreateBlogModalComponent } from './blogs-wrapper/create-blog-modal/create-blog-modal.component';
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzUploadModule} from "ng-zorro-antd/upload";
import {NzIconModule} from "ng-zorro-antd/icon";
import {ReactiveFormsModule} from "@angular/forms";
import {NzButtonModule} from "ng-zorro-antd/button";
import {ImageUploaderModule} from "../../shared/image-uploader/image-uploader.module";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzSelectModule} from "ng-zorro-antd/select";
import { BlogComponent } from './blogs-wrapper/blog/blog.component';
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzEmptyModule} from "ng-zorro-antd/empty";
import { BlogDetailsComponent } from './blog-details/blog-details.component';

@NgModule({
  declarations: [
    BlogsWrapperComponent,
    CreateBlogModalComponent,
    BlogComponent,
    BlogDetailsComponent
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
    NzEmptyModule
  ]
})
export class BlogModule { }
