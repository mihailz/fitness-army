import {Ingredient} from "./ingredient";
import {User} from "./user.model";

export class Recipe {

  constructor(public id: string | null,
              public title: string,
              public type: string,
              public level: string,
              public totalMinutesNeeded: number,
              public ingredients: Ingredient[],
              public steps: string[],
              public recipeImage: string,
              public rating: number,
              public author: User) {
    this.id = id;
    this.title = title;
    this.type = type;
    this.level = level;
    this.totalMinutesNeeded = totalMinutesNeeded;
    this.ingredients = ingredients;
    this.steps = steps;
    this.recipeImage = recipeImage;
    this.rating = rating;
    this.author = author;
  }
}
