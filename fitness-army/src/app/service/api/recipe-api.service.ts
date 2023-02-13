import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, from, map, switchMap, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ImageUploadService} from "./image-upload.service";
import {response} from "express";

@Injectable({
  providedIn: 'root'
})
export class RecipeApiService {

  baseApiHref: string = '';

  recipesSubscription = new BehaviorSubject<any>([]);
  recipes$ = this.recipesSubscription.asObservable();

  constructor(private http: HttpClient,
              private db: AngularFirestore,
              private imageUploadService: ImageUploadService) {
    this.baseApiHref = environment.applicationApi;
  }

  createRecipe(recipe: any, recipeImage: File, cb: (status: boolean) => void): void {
    this.http.post(`${this.baseApiHref}/api/recipes/create`, {
      recipe: recipe
    }).pipe(
      map((response: any) => response.recipe),
      switchMap((recipe: any) => {
        console.log('FE: createRecipe: ', response);
        return this.imageUploadService.uploadImage(recipeImage, `images/recipes/${recipe.id}`)
          .pipe(
            switchMap((recipeImageUrl: string) =>
             from(this.db.collection('recipes').doc(recipe.id).update({photoURL: recipeImageUrl}))
            ),
            catchError(error => throwError(() => error))
          )
      })
    ).subscribe({
      next: () => {
        cb(true);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        cb(false);
      }
    })
  }
}
