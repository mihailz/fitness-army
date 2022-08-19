import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private blogCreated: Subject<boolean> = new Subject<boolean>();

  constructor() { }

  setBlogCreationStatus(status: boolean): void {
    this.blogCreated.next(status);
  }

  getBlogCreationStatus(): Observable<boolean> {
    return this.blogCreated;
  }
}
