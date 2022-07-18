import {AbstractControl, ValidationErrors} from "@angular/forms";

export function validatePassword(control: AbstractControl): ValidationErrors | null {
  const password = control.value;
  let numberOfLowerLetters = 0;
  let numberOfCapitalLetters = 0;
  let numberOfDigits = 0;
  let numberOfSpecialCharacters = 0;

  if (!password || password.length < 8) {
    return {
      'passwordInvalid': 'Password is not valid!'
    };
  } else {
    password.split('').forEach((character: string) => {
      if (character >= 'a' && character <= 'z') {
        numberOfLowerLetters++;
      } else if (character >= 'A' && character <= 'Z') {
        numberOfCapitalLetters++;
      } else if (character >= '0' && character <= '9') {
        numberOfDigits++;
      } else {
        numberOfSpecialCharacters++;
      }
    });
    if (numberOfLowerLetters >= 1 && numberOfCapitalLetters >= 1
      && numberOfDigits >= 1 && numberOfSpecialCharacters >= 1) {
      return null;
    } else {
      return {
        'passwordInvalid': 'Password is not valid!'
      };
    }
  }
}
