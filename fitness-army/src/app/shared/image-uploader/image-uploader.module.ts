import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ImageUploaderComponent} from "./image-uploader.component";
import {ReactiveFormsModule} from "@angular/forms";
import {RxReactiveFormsModule} from "@rxweb/reactive-form-validators";
import {MaterialModule} from "../../material.module";

@NgModule({
  declarations: [
    ImageUploaderComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    ImageUploaderComponent
  ]
})
export class ImageUploaderModule { }
