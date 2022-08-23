import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {BlogParagraph} from "../../model/blog-paragraph";

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private blogCreated: Subject<boolean> = new Subject<boolean>();
  private blogParagraph: Subject<BlogParagraph> = new Subject<BlogParagraph>();

  constructor() { }

  setBlogCreationStatus(status: boolean): void {
    this.blogCreated.next(status);
  }

  getBlogCreationStatus(): Observable<boolean> {
    return this.blogCreated;
  }

  setBlogParagraph(paragraph: BlogParagraph): void {
    this.blogParagraph.next(paragraph);
  }

  getBlogParagraph(): Observable<BlogParagraph> {
    return this.blogParagraph;
  }
}
