export function calculateUserAge(birthDate: string): number {
  const oneDay = 24 * 60 * 60 * 1000;
  const currentDate: Date = new Date(Date.now());
  const userBirthDate: Date = new Date(birthDate);

  const diffDays: number = Math.round(Math.abs((currentDate.valueOf() -
    userBirthDate.valueOf()) / oneDay));
  const diffInYears = Math.floor(diffDays / 365);
  return diffInYears;
}
