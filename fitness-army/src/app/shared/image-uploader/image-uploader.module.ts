import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ImageUploaderComponent} from "./image-uploader.component";
import {ReactiveFormsModule} from "@angular/forms";
import {RxReactiveFormsModule} from "@rxweb/reactive-form-validators";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [
    ImageUploaderComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  exports: [
    ImageUploaderComponent
  ]
})
export class ImageUploaderModule { }
