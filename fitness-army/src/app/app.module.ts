import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../environments/environment";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {TokenInterceptor} from "./interceptor/token.interceptor";
import {ToastrModule} from "ngx-toastr";
import {AuthGuard} from "./guard/auth.guard";
import {NZ_I18N} from 'ng-zorro-antd/i18n';
import {en_US} from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {FormsModule} from '@angular/forms';
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {BmiApiInterceptor} from "./modules/user/user-profile/interceptor/bmi-api.interceptor";
import {RoleGuard} from "./guard/role.guard";
import {ChartsModule} from "ng2-charts";
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzIconModule} from "ng-zorro-antd/icon";
import {MaterialModule} from "./material.module";
import {UpdateUserPhotoModule} from "./shared/update-user-photo/update-user-photo.module";
import {getAuth, provideAuth} from "@angular/fire/auth";
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {getStorage, provideStorage} from "@angular/fire/storage";

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    provideAuth(() => getAuth()),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideStorage(() => getStorage()),
    ToastrModule.forRoot({
      timeOut: 3000,
      progressBar: true,
      preventDuplicates: true
    }),
    AngularFirestoreModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    NzDropDownModule,
    ChartsModule,
    NzLayoutModule,
    NzIconModule,
    MaterialModule,
    UpdateUserPhotoModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BmiApiInterceptor,
      multi: true
    },
    AuthGuard,
    RoleGuard,
    {provide: NZ_I18N, useValue: en_US}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
