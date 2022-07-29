export class BodyFatPercentage {
  bodyFatPercentage!: number;
  fatMassWeight!: number;
  leanMassWeight!: number;


  constructor(bodyFatPercentage: number, fatMassWeight: number, leanMassWeight: number) {
    this.bodyFatPercentage = parseFloat(bodyFatPercentage.toFixed(1));
    this.fatMassWeight = parseFloat(fatMassWeight.toFixed(1));
    this.leanMassWeight = parseFloat(leanMassWeight.toFixed(1));
  }
}
