import {Component, Input, OnInit} from '@angular/core';
import {Recipe} from "../../../../model/recipe";
import {StarRatingColor} from "../../star-rating/star-rating.component";
import {ReviewApiService} from "../../../../service/api/review-api.service";
import {Observable} from "rxjs";

@Component({
  selector: 'fitness-army-app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss']
})
export class RecipeCardComponent implements OnInit {

  @Input() recipe!: Recipe;
  rating!: number;

  constructor() { }

  ngOnInit(): void {
  }
}
