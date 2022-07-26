export class BodyMassIndexInfoModelDto {
  bmi: number;
  health: string;
  healthyBmiRange: string;

  constructor(bmi: number, health: string, healthyBmiRange: string) {
    this.bmi = bmi;
    this.health = health;
    this.healthyBmiRange = healthyBmiRange;
  }
}
