export class BodyMassIndexStats {
  bmi!: number;
  health!: string;
  healthyBmiRange!: string;

  constructor(bmi: number, health: string, healthyBmiRange: string) {
    this.bmi = bmi ? parseFloat(bmi.toFixed(1)) : bmi;
    this.health = health;
    this.healthyBmiRange = healthyBmiRange;
  }
}
