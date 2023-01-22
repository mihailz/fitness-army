import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {SignUpComponent} from './sign-up/sign-up.component';
import {AuthRoutingModule} from "./auth-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {VerifyEmailComponent} from "./verify-email/verify-email.component";
import {ImageUploaderModule} from "../../shared/image-uploader/image-uploader.module";
import {MaterialModule} from "../../material.module";

@NgModule({
  declarations: [
    LoginComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ImageUploaderModule,
    MaterialModule
  ]
})
export class AuthModule {
}
