export class BodyFatPercentage {
  bodyFatPercentage!: number;
  fatMassWeight!: number;
  leanMassWeight!: number;


  constructor(bodyFatPercentage: number, fatMassWeight: number, leanMassWeight: number) {
    this.bodyFatPercentage = bodyFatPercentage;
    this.fatMassWeight = fatMassWeight;
    this.leanMassWeight = leanMassWeight;
  }
}
