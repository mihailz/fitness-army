import {Ingredient} from "./ingredient";
import {User} from "./user.model";
import {NutritionInfo} from "./nutrition-info";

export class Recipe {

  constructor(public id: string | null,
              public title: string,
              public type: string,
              public level: string,
              public totalMinutesNeeded: string,
              public preparationTime: string,
              public cookTime: string,
              public ingredients: Ingredient[],
              public steps: string[],
              public recipeImage: string,
              public rating: number,
              public servings: string,
              public author: User,
              public nutritionInfo: NutritionInfo) {
    this.id = id;
    this.title = title;
    this.type = type;
    this.level = level;
    this.totalMinutesNeeded = totalMinutesNeeded;
    this.preparationTime = preparationTime;
    this.cookTime = cookTime;
    this.ingredients = ingredients;
    this.steps = steps;
    this.recipeImage = recipeImage;
    this.rating = rating;
    this.servings = servings;
    this.author = author;
    this.nutritionInfo = nutritionInfo;
  }
}
