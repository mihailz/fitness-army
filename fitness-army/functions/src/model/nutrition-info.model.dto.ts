export class NutritionInfoModelDto {
  constructor(public calories: string,
              public totalFat: string,
              public saturatedFat: string,
              public cholesterol: string,
              public sodium: string,
              public carbohydrates: string,
              public dietaryFiber: string,
              public protein: string,
              public sugar: string) {
  }
}
