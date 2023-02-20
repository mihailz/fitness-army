import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {RecipeType} from "../../../model/recipe-type";
import {RecipeLevel} from "../../../model/recipe-level";
import {User} from "../../../model/user.model";
import {map, Subscription, switchMap} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {AuthApiService} from "../../../service/api/auth-api.service";
import {RecipeApiService} from "../../../service/api/recipe-api.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {AddIngredientDialogComponent} from "../add-ingredient-dialog/add-ingredient-dialog.component";
import {AddStepDialogComponent} from "../add-step-dialog/add-step-dialog.component";
import {Recipe} from "../../../model/recipe";
import {Ingredient} from "../../../model/ingredient";

@Component({
  selector: 'fitness-army-app-update-recipe',
  templateUrl: './update-recipe.component.html',
  styleUrls: ['./update-recipe.component.scss']
})
export class UpdateRecipeComponent implements OnInit {

  recipeForm!: FormGroup;
  isFetchingData = false;
  recipeTypes = Object.values(RecipeType);
  recipeLevels = Object.values(RecipeLevel);
  recipeImage!: File;
  currentLoggedInUser!: User | null;
  recipeImageUrl!: string | ArrayBuffer;
  recipe!: Recipe;
  private subscriptions: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private authApiService: AuthApiService,
              private recipesApiService: RecipeApiService,
              private router: Router,
              private toastrService: ToastrService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.initRecipeForm();
    this.getLoggedInUser();
    this.fetchCurrentRecipe();
  }


  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  getFControl(path: string): FormControl {
    return this.recipeForm.get(path) as FormControl;
  }

  getFControlErrorMessage(path: string): string {
    if (this.recipeForm.get(path)?.hasError('invalidRating')) {
      return 'Rating should be between 1-5!';
    }
    return 'Field is required!';
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get steps(): FormArray {
    return this.recipeForm.get('steps') as FormArray;
  }

  deleteIngredient(id: number): void {
    this.ingredients.removeAt(id);
  }

  openAddIngredientDialog() {
    this.dialog.open(AddIngredientDialogComponent)
      .afterClosed()
      .subscribe({
        next: (fGroup: FormGroup) => {
          if (fGroup) {
            this.ingredients.push(fGroup);
          }
        }
      });
  }

  openAddStepDialog(): void {
    this.dialog.open(AddStepDialogComponent, {
      width: '400px'
    })
      .afterClosed()
      .subscribe({
        next: (fGroup: FormGroup) => {
          if (fGroup) {
            this.steps.push(fGroup);
          }
        }
      });
  }

  onImageSelect(imageFile: File): void {
    this.recipeImage = imageFile;
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onloadend = (e: ProgressEvent<FileReader> | null) => { // function call once readAsDataUrl is completed
      if (e?.target?.['result']) {
        this.recipeImageUrl = e?.target?.['result'];
      }
    }
  }

  createRecipe(): void {
    this.setLoading();
    const {
      title,
      type,
      level,
      totalMinutesNeeded,
      preparationTime,
      cookTime,
      ingredients,
      steps,
      rating,
      servings,
      nutritionInfo
    } = this.recipeForm.value;

    const newRecipe =
      new Recipe(null,
        title,
        type,
        level,
        totalMinutesNeeded,
        preparationTime,
        cookTime,
        ingredients,
        steps,
        '',
        rating,
        servings,
        this.currentLoggedInUser!,
        nutritionInfo);

    this.recipesApiService.createRecipe(newRecipe, this.recipeImage, (status) => {
      this.setLoading(false);
      if (!status) {
        this.toastrService.error('An error has occurred!', 'Error');
        return;
      }
      this.toastrService.success('Recipe created!', 'Success');
      this.router.navigate(['/recipes']);
    })
  }

  private fetchCurrentRecipe(): void {
    this.setLoading();
    const sub$ = this.activatedRoute.params
      .pipe(
        map((params: Params) => params['id']),
        switchMap((recipeId: string) => {
          this.recipesApiService.getRecipeById(recipeId, (status: boolean) => {
            this.setLoading(false);
          })
          return this.recipesApiService.recipe$;
        })
      ).subscribe({
        next: (recipe: Recipe) => {
          this.recipe = recipe;
          this.recipeForm.patchValue(recipe);
          this.populateUpdateRecipeIngredientsFormArray(recipe);
          this.populateStepsFormArray(recipe);
        },
        error: (err) => {
          console.log(err);
        }
      })
    this.subscriptions.add(sub$);
  }

  private populateUpdateRecipeIngredientsFormArray(recipe: Recipe): FormArray {
    if (this.ingredients.length > 0) {
      this.ingredients.clear();
    }
    const ingredientsFormArray = new FormArray([]);
    recipe.ingredients.forEach((ingredient: Ingredient, index: number) => {
      let ingredientNameFormControl = new FormControl('', [Validators.required]);
      let ingredientAmountFormControl = new FormControl('', [Validators.required]);

      ingredientNameFormControl.setValue(ingredient.name);
      ingredientAmountFormControl.setValue(ingredient.amount);

      this.ingredients.push(new FormGroup({
        name: ingredientNameFormControl,
        amount: ingredientAmountFormControl
      }));
    });
    return ingredientsFormArray;
  }

  private populateStepsFormArray(recipe: Recipe): FormArray {
    if (this.steps.length > 0) {
      this.steps.clear();
    }
    const stepsFormArray = new FormArray([]);
    recipe.steps.forEach((step: string, index: number) => {
      let stepFormControl = new FormControl('', [Validators.required]);

      stepFormControl.setValue(step);

      this.steps.push(new FormGroup({
        step: stepFormControl,
      }));
    });
    return stepsFormArray;
  }

  private initRecipeForm(): void {
    this.recipeForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      level: new FormControl('', [Validators.required]),
      totalMinutesNeeded: new FormControl('', [Validators.required]),
      preparationTime: new FormControl('', [Validators.required]),
      cookTime: new FormControl('', [Validators.required]),
      ingredients: new FormArray([]),
      steps: new FormArray([]),
      recipeImage: new FormControl('', [Validators.required]),
      servings: new FormControl('', [Validators.required]),
      nutritionInfo: new FormGroup({
        calories: new FormControl('', [Validators.required]),
        totalFat: new FormControl('', [Validators.required]),
        saturatedFat: new FormControl('', [Validators.required]),
        cholesterol: new FormControl('', [Validators.required]),
        sodium: new FormControl('', [Validators.required]),
        carbohydrates: new FormControl('', [Validators.required]),
        dietaryFiber: new FormControl('', [Validators.required]),
        sugar: new FormControl('', [Validators.required]),
        protein: new FormControl('', [Validators.required]),
      })
    })
  }

  private setLoading(status = true): void {
    this.isFetchingData = status;
  }

  private getLoggedInUser(): void {
    const subscription = this.authApiService.user$
      .subscribe({
        next: (user: any) => {
          this.currentLoggedInUser = user;
        }
      });
    this.subscriptions.add(subscription);
  }

  updateRecipe(): void {
    this.setLoading();
    const {
      title,
      type,
      level,
      totalMinutesNeeded,
      preparationTime,
      cookTime,
      ingredients,
      steps,
      servings,
      nutritionInfo
    } = this.recipeForm.value;

    const updatedRecipe =
      new Recipe(this.recipe.id,
        title,
        type,
        level,
        totalMinutesNeeded,
        preparationTime,
        cookTime,
        ingredients,
        steps,
        this.recipe.recipeImage,
        this.recipe.rating,
        servings,
        this.currentLoggedInUser!,
        nutritionInfo);

    this.recipesApiService.updateRecipe(updatedRecipe, this.recipeImage, (status: boolean) => {
      this.setLoading(false);
      if (!status) {
        this.toastrService.error('An error has occurred!', 'Error');
        return;
      }
      this.toastrService.success('Recipe updated!', 'Success');
    })

  }
}
