import {Component, Input, OnInit} from '@angular/core';
import {Review} from "../../../model/review";

@Component({
  selector: 'fitness-army-app-recipe-reviews',
  templateUrl: './recipe-reviews.component.html',
  styleUrls: ['./recipe-reviews.component.scss']
})
export class RecipeReviewsComponent implements OnInit {

  @Input() reviews: Review[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
