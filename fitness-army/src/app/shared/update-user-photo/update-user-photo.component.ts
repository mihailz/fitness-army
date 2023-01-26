import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ImageUploadService} from "../../service/api/image-upload.service";
import {ToastrService} from "ngx-toastr";
import {concatMap, from, switchMap, tap} from "rxjs";
import {AuthApiService} from "../../service/api/auth-api.service";
import {User} from "../../model/user.model";

@Component({
  selector: 'fitness-army-app-update-user-photo',
  templateUrl: './update-user-photo.component.html',
  styleUrls: ['./update-user-photo.component.scss']
})
export class UpdateUserPhotoComponent {

  imageFile!: File;
  userProfilePhoto!: ArrayBuffer | string;
  defaultUserPhoto = './assets/images/user_default_image.png';

  constructor(@Inject(MAT_DIALOG_DATA) private user: User,
              private dialogRef: MatDialogRef<UpdateUserPhotoComponent>,
              private imageUploadService: ImageUploadService,
              private toastrService: ToastrService,
              private authApiService: AuthApiService) {
    this.userProfilePhoto = this.user.photoURL;
  }

  onSaveClick(): void {
    if (this.userProfilePhoto !== this.defaultUserPhoto) {
      this.imageUploadService.uploadImage(this.imageFile, `images/profile/${this.user.uid}`)
        .pipe(
          concatMap((photoURL: string) => {
              return from(this.authApiService.updateProfileData({photoURL}))
                .pipe(
                  tap({
                    next: () => {
                      this.authApiService.userSubject.next({...this.user, photoURL: photoURL});
                    }
                  }),
                  switchMap(() => this.authApiService.rememberMe$),
                  tap({
                    next: (rememberMe: boolean) => {
                      if (rememberMe) {
                        this.authApiService.saveUserInLocalStorage();
                      }
                    }
                  })
                )
            }
          )).subscribe({
        next: () => {
          this.toastrService.success('Profile image updated!', 'Success');
          this.dialogRef.close();
        }
      });
    } else {
      console.log('Deleting image: ');
      this.imageUploadService.deleteImage(this.user.uid, `images/profile/${this.user.uid}`)
        .pipe(
          switchMap(() =>
            this.authApiService.updateProfileData({photoURL: ''})
              .pipe(
                tap({
                  next: () => {
                    this.authApiService.userSubject.next({...this.user, photoURL: ''})
                  }
                }),
                switchMap(() => this.authApiService.rememberMe$),
                tap({
                  next: (rememberMe: boolean) => {
                    if (rememberMe) {
                     this.authApiService.saveUserInLocalStorage();
                    }
                  }
                })
              ))
        ).subscribe({
        next: () => {
          this.toastrService.success('Profile image removed!', 'Success');
          this.dialogRef.close();
        }
      });
    }

  }

  onImageSelect(event: Event): void {
    const imageUploaderInput = (<HTMLInputElement>event.target);
    if (imageUploaderInput.files?.length) {
      this.imageFile = imageUploaderInput.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.imageFile);
      reader.onloadend = (e: ProgressEvent<FileReader> | null) => { // function call once readAsDataUrl is completed
        if (e?.target?.['result']) {
          this.userProfilePhoto = e?.target?.['result'];
        }
      }
    }
  }

  clearImage(): void {
    this.userProfilePhoto = this.defaultUserPhoto;
  }

}
