export class NutritionInfo {

  constructor(public calories: number,
              public totalFat: number,
              public saturatedFat: number,
              public cholesterol: number,
              public sodium: number,
              public carbohydrates: number,
              public dietaryFiber: number,
              public sugar: number) {
    this.calories = calories;
    this.totalFat = totalFat;
    this.saturatedFat = saturatedFat;
    this.cholesterol = cholesterol;
    this.sodium = sodium;
    this.carbohydrates = carbohydrates;
    this.dietaryFiber = dietaryFiber;
    this.sugar = sugar;
  }
}
