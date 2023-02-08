export class BodyStatsInfo {

  constructor(public age: number,
              public birthDate: string,
              public weight: number,
              public height: number,
              public gender: string) {
    this.age = age;
    this.birthDate = birthDate;
    this.weight = weight;
    this.height = height;
    this.gender = gender;
  }
}
