import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validator,
  Validators
} from "@angular/forms";
import {RecipeType} from "../../../model/recipe-type";
import {RecipeLevel} from "../../../model/recipe-level";
import {MatDialog} from "@angular/material/dialog";
import {AddIngredientDialogComponent} from "../add-ingredient-dialog/add-ingredient-dialog.component";
import {AddStepDialogComponent} from "../add-step-dialog/add-step-dialog.component";
import {Subscription} from "rxjs";
import {Recipe} from "../../../model/recipe";
import {AuthApiService} from "../../../service/api/auth-api.service";
import {User} from "../../../model/user.model";
import {RecipeApiService} from "../../../service/api/recipe-api.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NutritionInfoDialogComponent} from "../nutrition-info-dialog/nutrition-info-dialog.component";

@Component({
  selector: 'fitness-army-app-create-recipe',
  templateUrl: './create-recipe.component.html',
  styleUrls: ['./create-recipe.component.scss']
})
export class CreateRecipeComponent implements OnInit, OnDestroy {

  recipeForm!: FormGroup;
  isFetchingData = false;
  recipeTypes = Object.values(RecipeType);
  recipeLevels = Object.values(RecipeLevel);
  recipeImage!: File;
  currentLoggedInUser!: User | null;
  recipeImageUrl!: string | ArrayBuffer;
  showNutritionInfo: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private authApiService: AuthApiService,
              private recipesApiService: RecipeApiService,
              private router: Router,
              private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.initRecipeForm();
    this.getLoggedInUser();
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

  openAddNutritionInfoDialog(): void {
    this.dialog.open(NutritionInfoDialogComponent, {
      width: '600px'
    })
      .afterClosed()
      .subscribe({
        next: (fGroup: FormGroup) => {
          if (fGroup) {
            this.recipeForm.get('nutritionInfo')?.patchValue(fGroup.getRawValue());
            this.showNutritionInfo = true;
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
    if (this.recipeForm.invalid) {
      return;
    }

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
        0,
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
}
