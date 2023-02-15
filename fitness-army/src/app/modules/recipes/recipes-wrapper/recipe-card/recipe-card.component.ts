import {Component, Input, OnInit} from '@angular/core';
import {Recipe} from "../../../../model/recipe";
import {StarRatingColor} from "../../star-rating/star-rating.component";

@Component({
  selector: 'fitness-army-app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss']
})
export class RecipeCardComponent implements OnInit {

  @Input() recipe!: Recipe;
  starColor:StarRatingColor = StarRatingColor.warn;
  rating!: number;

  constructor() { }

  ngOnInit(): void {
    this.rating = this.recipe.rating;
  }

  onRatingChanged(rating: number): void {
    this.rating = rating;
  }
}
