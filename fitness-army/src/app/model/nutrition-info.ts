export class NutritionInfo {

  constructor(public calories: string,
              public totalFat: string,
              public saturatedFat: string,
              public cholesterol: string,
              public sodium: string,
              public carbohydrates: string,
              public dietaryFiber: string,
              public protein: string,
              public sugar: string) {
    this.calories = calories;
    this.totalFat = totalFat;
    this.saturatedFat = saturatedFat;
    this.cholesterol = cholesterol;
    this.sodium = sodium;
    this.carbohydrates = carbohydrates;
    this.dietaryFiber = dietaryFiber;
    this.protein = protein;
    this.sugar = sugar;
  }
}
