import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Route, RouterModule} from "@angular/router";
import {RecipesWrapperComponent} from "./recipes-wrapper/recipes-wrapper.component";
import {CreateRecipeComponent} from "./create-recipe/create-recipe.component";

const routes: Route[] = [
  {
    path: '',
    component: RecipesWrapperComponent
  },
  {
    path: 'create',
    component: CreateRecipeComponent
  }
]

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
export class RecipesRoutingModule { }
