import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page/home-page.component';
import {HomePageRoutingModule} from "./home-page-routing.module";
import {NzButtonModule} from "ng-zorro-antd/button";

@NgModule({
    declarations: [
        HomePageComponent
    ],
    exports: [
        HomePageComponent
    ],
    imports: [
        CommonModule,
        HomePageRoutingModule,
        NzButtonModule
    ]
})
export class HomePageModule { }
