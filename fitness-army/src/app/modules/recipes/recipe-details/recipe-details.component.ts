import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {RecipeApiService} from "../../../service/api/recipe-api.service";
import {map, Observable, Subscription, tap} from "rxjs";
import {RecipeType} from "../../../model/recipe-type";
import {RecipeLevel} from "../../../model/recipe-level";
import {Recipe} from "../../../model/recipe";
import {StarRatingColor} from "../star-rating/star-rating.component";
import {Review} from "../../../model/review";
import {ReviewApiService} from "../../../service/api/review-api.service";
import {ToastrService} from "ngx-toastr";
import {HttpErrorResponse} from "@angular/common/http";
import {User} from "../../../model/user.model";
import {AuthApiService} from "../../../service/api/auth-api.service";
import {UserRoles} from "../../../model/roles";

@Component({
  selector: 'fitness-army-app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss']
})
export class RecipeDetailsComponent implements OnInit, OnDestroy {

  recipe$!: Observable<Recipe>;
  reviews$!: Observable<Review[]>;
  rating$!: Observable<{total: number, rating: number}>
  recipeTypes = RecipeType;
  recipeLevel = RecipeLevel;
  isFetchingData: boolean = false;
  starColor = StarRatingColor.warn;
  loggedInUser!: User | null;
  private subscriptions: Subscription = new Subscription();

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private recipeApiService: RecipeApiService,
              private reviewApiService: ReviewApiService,
              private toastrService: ToastrService,
              private authApiService: AuthApiService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.fetchCurrentRecipe();
    this.getCurrentLoggedInUser();
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  private fetchCurrentRecipe(): void {
    this.setLoading();
    const sub$ = this.activatedRoute.params
      .pipe(
        map((params: Params) => params['id']),
        tap({
          next: (recipeId: string) => {
            this.recipeApiService.getRecipeById(recipeId, (status: boolean) => {
              this.setLoading(false);
              this.recipe$ = this.recipeApiService.recipe$;
              this.reviews$ = this.reviewApiService.reviews$;
              this.rating$ = this.reviewApiService.rating$;
              this.cdr.markForCheck();
              this.cdr.detectChanges();
            })
          }
        })
      ).subscribe();
    this.subscriptions.add(sub$);
  }


  private setLoading(status = true): void {
    this.isFetchingData = status;
  }

  navigateToUpdateRecipe(recipe: Recipe): void {
    this.router.navigate([`/recipes/update/${recipe.id}`]);
  }

  hasRole(): boolean {
    return this.loggedInUser?.role === UserRoles.ADMIN || this.loggedInUser?.role === UserRoles.COACH;
  }

  onReviewCreate(review: Review, recipe: Recipe): void {
    this.setLoading();
    this.reviewApiService.createReview(recipe.id!, review)
      .subscribe({
        next: (review: Review) => {
          this.setLoading(false);
          this.fetchCurrentRecipe();
          console.log(review);
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          this.setLoading(false);
        }
      })
  }

  private getCurrentLoggedInUser(): void {
    const subscription = this.authApiService.user$
      .subscribe({
        next: (user: any) => {
          this.loggedInUser = user;
        },
        error: err => console.log(err)
      });

    this.subscriptions.add(subscription);
  }

  deleteRecipe(recipe: Recipe): void {
    this.setLoading();
    this.recipeApiService.deleteRecipe(recipe.id!, (status: boolean) => {
      this.setLoading(false);
      if (!status) {
        this.toastrService.error("An error has occurred!", "Error");
        return;
      }
      this.router.navigate(['/recipes']);
    })
  }
}
