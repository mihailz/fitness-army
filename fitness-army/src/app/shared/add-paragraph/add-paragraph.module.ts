import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from "../../material.module";
import {ReactiveFormsModule} from "@angular/forms";
import {AddParagraphComponent} from "./add-paragraph.component";

@NgModule({
  declarations: [
    AddParagraphComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    AddParagraphComponent
  ]
})
export class AddParagraphModule {
}
