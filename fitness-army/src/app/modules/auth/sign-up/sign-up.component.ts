import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {AuthApiService} from "../../../service/api/auth-api.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {UserApiService} from "../../../service/api/user-api.service";
import {map, switchMap} from "rxjs";
import {User} from "../../../model/user.model";

@Component({
  selector: 'fitness-army-app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signUpForm!: FormGroup;
  errorMessage: string = '';
  profileImage!: File;

  constructor(
    private router: Router,
    private authApiService: AuthApiService,
    private userApiService: UserApiService,
    private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.initSignupForm();
  }

  signup(): void {
    this.errorMessage = '';
    if (!this.signUpForm.valid) {
      return;
    }
    if (!this.passwordsMatching()) {
      this.errorMessage = 'Passwords did not match please try again!';
      return;
    }
    const userName = this.signUpForm.get('userName')?.value;
    const email = this.signUpForm.get('email')?.value;
    const password = this.signUpForm.get('password')?.value;
    this.authApiService.signup(userName, email, password, "USER", this.profileImage)
      .pipe(
        map((response: any) => response['uid']),
        switchMap((uid: string) => {
          return this.userApiService.getUserData(uid)
        }),
        switchMap((user: User) => {
          return this.userApiService.uploadUserImage(this.profileImage, user.uid)
            .pipe(
              map((imageUrl: string) => new User(
                user.email,
                user.uid,
                user.displayName,
                user.role,
                imageUrl
              ))
            )
        }),
        switchMap((user: User) => {
          const queryParam = {'update_password': true};
          return this.userApiService.updateUser(user, queryParam);
        })
      ).subscribe({
        next: (response: Object) => {
          console.log('signUp: ', response);
          this.toastrService.success('The account was created successfully!', 'Account created!');
          this.router.navigate(['/auth/login']);
        },
        error: err => {
          console.log(err);
          this.errorMessage = 'An error has occurred please try again!';
          this.signUpForm.reset();
        }
      });
  }

  signUpWIthGoogleProvider(): void {
    this.authApiService.googleAuth()
      .subscribe({
        next: ((response) => {
          this.toastrService.success('User logged in successfully!', 'Login success');
          this.router.navigate(['/home']);
        }),
        error: err => console.log(err)
      });
  }

  onImageSelect(file: File): void {
    this.profileImage = file;
  }

  private initSignupForm(): void {
    this.signUpForm = new FormGroup({
      userName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, this.validatePassword]),
      confirmPassword: new FormControl('', Validators.required),
      profileImage: new FormControl('', [Validators.required])
    });
  }

  private validatePassword(control: AbstractControl): ValidationErrors | null {
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

  private passwordsMatching(): boolean {
    const password = this.signUpForm.get('password')?.value;
    const confirmPassword = this.signUpForm.get('confirmPassword')?.value;

    return password === confirmPassword;
  }

}
