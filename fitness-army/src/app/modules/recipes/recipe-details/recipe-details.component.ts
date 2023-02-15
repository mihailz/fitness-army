import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RecipeApiService} from "../../../service/api/recipe-api.service";
import {Observable, Subscription} from "rxjs";
import {RecipeType} from "../../../model/recipe-type";
import {RecipeLevel} from "../../../model/recipe-level";

@Component({
  selector: 'fitness-army-app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss']
})
export class RecipeDetailsComponent implements OnInit, OnDestroy {

  recipe$!: Observable<RecipeApiService | null>;
  recipeTypes = RecipeType;
  recipeLevel = RecipeLevel;
  isFetchingData: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private recipeApiService: RecipeApiService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  navigateToRecipesPage(): void {
    this.router.navigate(['/recipes']);
  }

  private fetchCurrentRecipe(): void {

  }

  private setLoading(status = true): void {
    this.isFetchingData = status;
  }

}
