export class IdealBodyWeight {
  constructor(public idealWeight: number) {
    this.idealWeight = parseFloat(idealWeight.toFixed(1));
  }
}
