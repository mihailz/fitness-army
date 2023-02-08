export class BodyMassIndexStats {

  constructor(public bmi: number,
              public health: string,
              public healthyBmiRange: string) {
    this.bmi = bmi ? parseFloat(bmi.toFixed(1)) : bmi;
    this.health = health;
    this.healthyBmiRange = healthyBmiRange;
  }
}
