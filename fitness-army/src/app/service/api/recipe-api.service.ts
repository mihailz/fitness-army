import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, from, map, switchMap, throwError} from "rxjs";
import {Recipe} from "../../model/recipe";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ImageUploadService} from "./image-upload.service";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RecipeApiService {

  baseApiHref: string = '';

  recipesSubscription = new BehaviorSubject<Recipe[]>([]);
  recipes$ = this.recipesSubscription.asObservable();

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
}
