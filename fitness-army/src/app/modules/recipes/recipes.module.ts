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
import {MtxPopoverModule} from "@ng-matero/extensions/popover";
import { RecipeReviewsComponent } from './recipe-reviews/recipe-reviews.component';
import { RecipeReviewComponent } from './recipe-reviews/recipe-review/recipe-review.component';
import { CreateReviewComponent } from './create-review/create-review.component';

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
    NutritionInfoDialogComponent,
    RecipeReviewsComponent,
    RecipeReviewComponent,
    CreateReviewComponent
  ],
    imports: [
        CommonModule,
        RecipesRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        ImageUploaderModule,
        MtxPopoverModule
    ]
})
export class RecipesModule { }
