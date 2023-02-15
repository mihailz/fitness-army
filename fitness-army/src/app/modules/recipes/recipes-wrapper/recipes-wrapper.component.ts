import {Component, OnDestroy, OnInit} from '@angular/core';
import {RecipesFilterType} from "../../../model/types/recipes-filter-type";
import {Observable, Subscription} from "rxjs";
import {Recipe} from "../../../model/recipe";
import {User} from "../../../model/user.model";
import {UserRoles} from "../../../model/roles";
import {Router} from "@angular/router";
import {AuthApiService} from "../../../service/api/auth-api.service";
import {RecipeApiService} from "../../../service/api/recipe-api.service";

@Component({
  selector: 'fitness-army-app-recipes-wrapper',
  templateUrl: './recipes-wrapper.component.html',
  styleUrls: ['./recipes-wrapper.component.scss']
})
export class RecipesWrapperComponent implements OnInit, OnDestroy {

  recipes$!: Observable<Recipe[]>;
  isFetchingData: boolean = false;
  loggedInUser!: User | null;
  userRoles = UserRoles;
  private subscriptions: Subscription = new Subscription();

  constructor(private router: Router,
              private authApiService: AuthApiService,
              private recipesApiService: RecipeApiService) { }

  ngOnInit(): void {
    this.getCurrentLoggedInUser();
    this.fetchRecipes('', '');
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  fetchRecipes(type: string, searchString: string): void {
    this.setLoading();
    this.recipesApiService.getRecipes(type, searchString, (status) => {
      this.setLoading(false);
      this.recipes$ = this.recipesApiService.recipes$;
    })
  }

  onFilterSubmit(filterOptions: RecipesFilterType): void {
    const type = filterOptions.type === 'ALL' ?
      '' : filterOptions.type;
    this.fetchRecipes(type, filterOptions.searchKey);
  }

  navigateCreateRecipePage(): void {
    this.router.navigate(['/recipes/create']);
  }

  canSeeAddRecipeButton(): boolean {
    return this.loggedInUser?.role === this.userRoles.COACH
      || this.loggedInUser?.role === this.userRoles.ADMIN;
  }

  goToRecipeDetailsPage(recipe: Recipe): void {
    if (recipe) {
      this.router.navigate([`/recipes/details/${recipe.id}`]);
    }
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

  private setLoading(status = true): void {
    this.isFetchingData = status;
  }
}
