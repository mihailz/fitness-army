import { Injectable } from '@angular/core';
import {Storage, ref, uploadBytes, getDownloadURL} from "@angular/fire/storage";
import {from, Observable, switchMap} from "rxjs";
import {AngularFireStorage} from "@angular/fire/compat/storage";

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  constructor(private storage: Storage,
              private angularFireStorage: AngularFireStorage) { }

  uploadImage(image: File, path: string): Observable<string> {
    const storageRef = ref(this.storage, path);
    const uploadTask = from(uploadBytes(storageRef, image));

    return uploadTask
      .pipe(
        switchMap((result) => getDownloadURL(result.ref)),
      );
  }

  deleteImage(photoId: string, path: string): Observable<any> {
    return from(this.angularFireStorage.storage.ref(path).delete());
  }
}
