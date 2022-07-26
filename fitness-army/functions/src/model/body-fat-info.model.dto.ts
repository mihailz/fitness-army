export class BodyFatInfoModelDto {
  bodyFatPercentage: number;
  fatMassWeight: number;
  leanMassWeight: number;

  // eslint-disable-next-line max-len
  constructor(bodyFatPercentage: number, fatMassWeight: number, leanMassWeight: number) {
    this.bodyFatPercentage = bodyFatPercentage;
    this.fatMassWeight = fatMassWeight;
    this.leanMassWeight = leanMassWeight;
  }
}
