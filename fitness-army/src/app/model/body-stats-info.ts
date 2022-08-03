export class BodyStatsInfo {
  age!: number;
  birthDate!: string;
  weight!: number;
  height!: number;
  gender!: string;

  constructor(age: number, birthDate: string, weight: number, height: number, gender: string) {
    this.age = age;
    this.birthDate = birthDate;
    this.weight = weight;
    this.height = height;
    this.gender = gender;
  }
}
