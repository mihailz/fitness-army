export class NutritionInfoModelDto {
  constructor(public calories: number,
              public totalFat: number,
              public saturatedFat: number,
              public cholesterol: number,
              public sodium: number,
              public carbohydrates: number,
              public dietaryFiber: number,
              public sugar: number) {
  }
}
