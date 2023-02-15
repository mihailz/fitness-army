import {UserModelDto} from "./user.model.dto";
import {IngredientModelDto} from "./ingredient.model.dto";
import {NutritionInfoModelDto} from "./nutrition-info.model.dto";

export class RecipeModelDto {
  constructor(public id: string | null,
              public title: string,
              public type: string,
              public level: string,
              public totalMinutesNeeded: number,
              public ingredients: IngredientModelDto[],
              public steps: string[],
              public recipeImage: string,
              public rating: number,
              public author: UserModelDto,
              public nutritionInfo: NutritionInfoModelDto) {
  }
}
