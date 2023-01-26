import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UpdateUserPhotoComponent} from "./update-user-photo.component";
import {MaterialModule} from "../../material.module";

@NgModule({
  declarations: [
    UpdateUserPhotoComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    UpdateUserPhotoComponent
  ]
})
export class UpdateUserPhotoModule {
}
