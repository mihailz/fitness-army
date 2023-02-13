import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
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
  private subscriptions: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private authApiService: AuthApiService,
              private recipesApiService: RecipeApiService,
              private router: Router,
              private toastrService: ToastrService) { }

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
    this.dialog.open(AddStepDialogComponent)
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

  private initRecipeForm(): void {
    this.recipeForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      level: new FormControl('', [Validators.required]),
      totalMinutesNeeded: new FormControl('', [Validators.required]),
      ingredients: new FormArray([]),
      steps: new FormArray([]),
      recipeImage: new FormControl('', [Validators.required]),
      rating: new FormControl('', [Validators.required, this.ratingValidator]),
    })
  }

  private ratingValidator(control: AbstractControl): ValidationErrors | null {
    const rating = control.value;
    return (rating >0 && rating <= 5) ? null : {
      'invalidRating': 'Invalid rating'
    }
  }

  private setLoading(status = false): void {
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

  createRecipe(): void {
    this.setLoading();
    const {
      title,
      type,
      level,
      totalMinutesNeeded,
      ingredients,
      steps,
      rating
    } = this.recipeForm.value;

    const newRecipe =
      new Recipe(null,
        title,
        type,
        level,
        totalMinutesNeeded,
        ingredients,
        steps,
        '',
        rating,
        this.currentLoggedInUser!);

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
}
