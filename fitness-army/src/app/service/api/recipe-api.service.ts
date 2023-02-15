import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, from, map, of, Subject, switchMap, throwError} from "rxjs";
import {Recipe} from "../../model/recipe";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ImageUploadService} from "./image-upload.service";
import {environment} from "../../../environments/environment";
import {Ingredient} from "../../model/ingredient";
import {User} from "../../model/user.model";
import {NutritionInfo} from "../../model/nutrition-info";

@Injectable({
  providedIn: 'root'
})
export class RecipeApiService {

  baseApiHref: string = '';

  recipesSubscription = new BehaviorSubject<Recipe[]>([]);
  recipes$ = this.recipesSubscription.asObservable();

  recipeSubject: Subject<Recipe> = new Subject<Recipe>();
  recipe$ = this.recipeSubject.asObservable();

  recipesIdsSubject = new BehaviorSubject<string[]>([]);
  recipesIds$ = this.recipesIdsSubject.asObservable();

  currentRecipeIdSubject: Subject<string | null> = new Subject<string | null>();
  currentRecipeId$ = this.currentRecipeIdSubject.asObservable();

  constructor(private http: HttpClient,
              private storage: AngularFireStorage,
              private db: AngularFirestore,
              private imageUploadService: ImageUploadService) {
    this.baseApiHref = environment.applicationApi;
  }

  createRecipe(recipe: Recipe, imageFile: File, cb: (status: boolean, error?: HttpErrorResponse) => void): void {
    this.http.post(`${this.baseApiHref}/api/recipes/create`, {
      recipe: recipe
    }).pipe(
      map((response: any) => response.recipe),
      switchMap((recipe: any) => {
        return this.imageUploadService.uploadImage(imageFile, `images/recipes/${recipe.id}`)
          .pipe(
            switchMap((recipeImageUrl: string) =>
              from(this.db.collection('recipes').doc(recipe.id!).update({recipeImage: recipeImageUrl}))
            ))
      }),
      catchError(err => throwError(() => err))
    ).subscribe({
      next: () => {
        cb(true);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err.message);
        cb(false, err);
      }
    });
  }

  getRecipes(type: string, searchString: string,
             cb: (status: boolean) => void): void {
    const url = `${this.baseApiHref}/api/recipes?type=${type}&searchString=${searchString}`;
    this.http.get(url)
      .pipe(
        map((response: any) => response.data
          .map((recipeItem: any) =>
            new Recipe(
              recipeItem.id,
              recipeItem.title,
              recipeItem.type,
              recipeItem.level,
              recipeItem.totalMinutesNeeded,
              recipeItem.ingredients.map((ingredientItem: any) =>
                new Ingredient(
                  ingredientItem.name,
                  ingredientItem.amount
                )),
              recipeItem.steps.map((step: any) => step.step),
              recipeItem.recipeImage,
              recipeItem.rating,
              recipeItem.servings,
              new User(
                recipeItem.author.uid,
                recipeItem.author.email,
                recipeItem.author.displayName,
                recipeItem.author.photoURL,
              ),
              new NutritionInfo(
                recipeItem.nutritionInfo.calories,
                recipeItem.nutritionInfo.totalFat,
                recipeItem.nutritionInfo.saturatedFat,
                recipeItem.nutritionInfo.cholesterol,
                recipeItem.nutritionInfo.sodium,
                recipeItem.nutritionInfo.carbohydrates,
                recipeItem.nutritionInfo.dietaryFiber,
                recipeItem.nutritionInfo.sugar,
              )
            )
          )
        ),
        catchError((error: HttpErrorResponse) => throwError(() => of(error))),
      )
      .subscribe({
        next: (recipes: Recipe[]) => {
          const recipeIds = recipes.map((recipe: Recipe) => recipe.id!);
          cb(true);
          this.recipesSubscription.next(recipes);
          this.recipesIdsSubject.next(recipeIds);
          console.log('getRecipes: ', recipes);
        },
        error: (error: HttpErrorResponse) => {
          cb(false);
          console.log(error);
        }
      })
  }

  getRecipeById(recipeId: string, cb: (status: boolean) => void): void {
    const url = `${this.baseApiHref}/api/recipes/${recipeId}`;
    this.http.get(url)
      .pipe(
        map((response: any) => response.data),
        map((recipeItem: any) => new Recipe(
          recipeItem.id,
          recipeItem.title,
          recipeItem.type,
          recipeItem.level,
          recipeItem.totalMinutesNeeded,
          recipeItem.ingredients.map((ingredientItem: any) =>
            new Ingredient(
              ingredientItem.name,
              ingredientItem.amount
            )),
          recipeItem.steps.map((step: any) => step.step),
          recipeItem.recipeImage,
          recipeItem.rating,
          recipeItem.servings,
          new User(
            recipeItem.author.uid,
            recipeItem.author.email,
            recipeItem.author.displayName,
            recipeItem.author.photoURL,
          ),
          new NutritionInfo(
            recipeItem.nutritionInfo.calories,
            recipeItem.nutritionInfo.totalFat,
            recipeItem.nutritionInfo.saturatedFat,
            recipeItem.nutritionInfo.cholesterol,
            recipeItem.nutritionInfo.sodium,
            recipeItem.nutritionInfo.carbohydrates,
            recipeItem.nutritionInfo.dietaryFiber,
            recipeItem.nutritionInfo.sugar,
          )
        )),
        catchError((err: HttpErrorResponse) => throwError(() => of(err))),
      ).subscribe({
      next: (recipe: Recipe) => {
        cb(true);
        console.log('recipe: ', recipe);
        this.recipeSubject.next(recipe);
        this.currentRecipeIdSubject.next(recipe.id);
      },
      error: (error: HttpErrorResponse) => {
        cb(false);
        console.log(error);
      }
    })
  }
}
