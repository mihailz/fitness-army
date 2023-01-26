import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators
} from "@angular/forms";
import {AuthApiService} from "../../../service/api/auth-api.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {UserApiService} from "../../../service/api/user-api.service";
import {from, Subscription, tap} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'fitness-army-app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {

  @ViewChild(FormGroupDirective) private formDirective!: FormGroupDirective;
  signUpForm!: FormGroup;
  profileImage!: File;
  passwordsDoNotMatch = false;
  hide = true;
  userProfileImageUrl!: string | ArrayBuffer;
  isLoading = false;
  private subs$ = new Subscription();

  constructor(
    private router: Router,
    private authApiService: AuthApiService,
    private userApiService: UserApiService,
    private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.initSignupForm();
    const sub$ = from(this.signUpForm.valueChanges)
      .pipe(
        tap({
          next: () => {
            if (this.passwordsDoNotMatch) {
              this.passwordsDoNotMatch = false;
            }
          }
        })
      ).subscribe();
    this.subs$.add(sub$);
  }

  ngOnDestroy(): void {
    this.subs$?.unsubscribe();
  }

  signup(): void {
    if (this.signUpForm.invalid) {
      this.resetForm();
      return;
    }
    if (!this.arePasswordsMatched()) {
      this.passwordsDoNotMatch = true;
      return;
    }
    this.setLoading();
    const {userName, email, password} = this.signUpForm.value;
    this.authApiService.signup(userName, email, password, "USER",
      (status: boolean, err: HttpErrorResponse | undefined) => {
      this.setLoading(false);
        if (!status) {
          this.toastrService.error('Unexpected error has occurred!', 'Error');
          return;
        }
        this.toastrService.success('The account was created successfully!', 'Account created!');
        this.router.navigate(['/auth/login']);
    });
  }

  resetForm(): void {
    setTimeout(() => {
      this.signUpForm.reset();
      this.formDirective.resetForm();
    }, 0);
  }

  getFControl(path: string): FormControl {
    return this.signUpForm.get(path) as FormControl;
  }

  getFControlErrorMessage(path: string): string {
    if (this.signUpForm.get(path)?.hasError('email')) {
      return 'Email is invalid!';
    }
    if (this.signUpForm.get(path)?.hasError('minlength')) {
      return 'Password should be at least 6 characters long!';
    }
    return 'You must enter a value';
  }

  // signUpWIthGoogleProvider(): void {
  //   this.authApiService.googleAuth()
  //     .subscribe({
  //       next: ((response) => {
  //         this.toastrService.success('User logged in successfully!', 'Login success');
  //         this.router.navigate(['/home']);
  //       }),
  //       error: err => console.log(err)
  //     });
  // }

  onImageSelect(file: File): void {
    this.profileImage = file;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = (e: ProgressEvent<FileReader> | null) => {
      if (e?.target?.['result']) {
        this.userProfileImageUrl = e?.target?.['result'];
      }
    }
  }

  arePasswordsMatched(): boolean {
    const password = this.getFControl('password').value;
    const confirmPassword = this.getFControl('confirmPassword').value;
    return password === confirmPassword;
  }

  private initSignupForm(): void {
    this.signUpForm = new FormGroup({
      userName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  private setLoading(state = true): void {
    this.isLoading = state;
  }

}
