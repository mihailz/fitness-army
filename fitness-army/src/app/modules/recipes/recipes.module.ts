import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipesWrapperComponent } from './recipes-wrapper/recipes-wrapper.component';
import { RecipeCardComponent } from './recipes-wrapper/recipe-card/recipe-card.component';
import { UpdateRecipeComponent } from './update-recipe/update-recipe.component';
import { CreateRecipeComponent } from './create-recipe/create-recipe.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import {RecipesRoutingModule} from "./recipes-routing.module";
import {MaterialModule} from "../../material.module";
import {ReactiveFormsModule} from "@angular/forms";
import { AddIngredientDialogComponent } from './add-ingredient-dialog/add-ingredient-dialog.component';
import { AddStepDialogComponent } from './add-step-dialog/add-step-dialog.component';
import {ImageUploaderModule} from "../../shared/image-uploader/image-uploader.module";
import { RecipesFilterComponent } from './recipes-wrapper/recipes-filter/recipes-filter.component';
import { StarRatingComponent } from './star-rating/star-rating.component';
import { NutritionInfoDialogComponent } from './nutrition-info-dialog/nutrition-info-dialog.component';

@NgModule({
  declarations: [
    RecipesWrapperComponent,
    RecipeCardComponent,
    UpdateRecipeComponent,
    CreateRecipeComponent,
    RecipeDetailsComponent,
    AddIngredientDialogComponent,
    AddStepDialogComponent,
    RecipesFilterComponent,
    StarRatingComponent,
    NutritionInfoDialogComponent
  ],
  imports: [
    CommonModule,
    RecipesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    ImageUploaderModule
  ]
})
export class RecipesModule { }
