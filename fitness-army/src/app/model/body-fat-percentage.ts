export class BodyFatPercentage {
  bodyFatPercentage!: number;
  fatMassWeight!: number;
  leanMassWeight!: number;


  constructor(bodyFatPercentage: number, fatMassWeight: number, leanMassWeight: number) {
    this.bodyFatPercentage = bodyFatPercentage ? parseFloat(bodyFatPercentage.toFixed(1)) : bodyFatPercentage;
    this.fatMassWeight = fatMassWeight ? parseFloat(fatMassWeight.toFixed(1)) : fatMassWeight;
    this.leanMassWeight = leanMassWeight ? parseFloat(leanMassWeight.toFixed(1)) : leanMassWeight;
  }
}
