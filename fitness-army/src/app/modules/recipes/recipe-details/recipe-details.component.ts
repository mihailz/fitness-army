import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {RecipeApiService} from "../../../service/api/recipe-api.service";
import {map, Observable, Subscription, tap} from "rxjs";
import {RecipeType} from "../../../model/recipe-type";
import {RecipeLevel} from "../../../model/recipe-level";
import {Recipe} from "../../../model/recipe";

@Component({
  selector: 'fitness-army-app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss']
})
export class RecipeDetailsComponent implements OnInit, OnDestroy {

  recipe$!: Observable<Recipe>;
  recipeTypes = RecipeType;
  recipeLevel = RecipeLevel;
  isFetchingData: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private recipeApiService: RecipeApiService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.fetchCurrentRecipe();
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

}
