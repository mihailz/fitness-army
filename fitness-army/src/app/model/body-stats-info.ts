export class BodyStatsInfo {
  age!: number;
  weight!: number;
  height!: number;
  gender!: string;

  constructor(age: number, weight: number, height: number, gender: string) {
    this.age = age;
    this.weight = weight;
    this.height = height;
    this.gender = gender;
  }
}
