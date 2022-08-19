import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ImageUploaderComponent} from "./image-uploader.component";
import {ReactiveFormsModule} from "@angular/forms";
import {RxReactiveFormsModule} from "@rxweb/reactive-form-validators";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";

@NgModule({
  declarations: [
    ImageUploaderComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    NzFormModule,
    NzInputModule
  ],
  exports: [
    ImageUploaderComponent
  ]
})
export class ImageUploaderModule { }
