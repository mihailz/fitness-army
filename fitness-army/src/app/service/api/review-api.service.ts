import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Review} from "../../model/review";
import {BehaviorSubject, catchError, map, Observable, of, tap, throwError} from "rxjs";
import {User} from "../../model/user.model";

@Injectable({
  providedIn: 'root'
})
export class ReviewApiService {

  baseApiHref: string = '';
  reviewsSubject = new BehaviorSubject<Review[]>([]);
  reviews$ = this.reviewsSubject.asObservable();
  ratingSubject = new BehaviorSubject({
    total: 0,
    rating: 0
  });
  rating$ = this.ratingSubject.asObservable();

  constructor(private http: HttpClient) {
    this.baseApiHref = environment.applicationApi;
  }

  createReview(recipeId: string, review: Review): Observable<Review> {
    const url = `${this.baseApiHref}/api/recipes/${recipeId}/reviews/create`;
    return this.http.post(url, review)
      .pipe(
        map((responseData: any) => responseData.review),
        map((response: any) => new Review(
          response.id,
          new User(
            response.author.uid,
            response.author.email,
            response.author.displayName,
            response.author.photoURL,
          ),
          response.dateCreated,
          response.rating,
          response.content,
          response.likes
        )),
        catchError((error: HttpErrorResponse) => throwError(() => of(error))),
      );
  }

  getReviews(recipeId: string): void {
    const url = `${this.baseApiHref}/api/recipes/${recipeId}/reviews`;
    this.http.get(url)
      .pipe(
        map((response: any) => response.data
          .map((reviewItem: any) => new Review(
            reviewItem.id,
            new User(
              reviewItem.author.uid,
              reviewItem.author.email,
              reviewItem.author.displayName,
              reviewItem.author.photoURL,
            ),
            reviewItem.dateCreated,
            reviewItem.rating,
            reviewItem.content,
            reviewItem.likes
          ))),
        catchError((error: HttpErrorResponse) => throwError(() => of(error))),
      ).subscribe({
      next: (reviews: Review[]) => {
        const totalRating = reviews.reduce((accumulator, currentElement) =>
          accumulator += currentElement.rating, 0);
        this.ratingSubject.next({
          total: reviews.length,
          rating: totalRating / reviews.length
        });
        this.reviewsSubject.next(reviews);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }
}
