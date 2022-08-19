import {Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {NzModalRef} from "ng-zorro-antd/modal";
import {BlogType} from "../../../../model/blog-type";
import {Blog} from "../../../../model/blog";
import {AuthApiService} from "../../../../service/api/auth-api.service";
import {finalize, Subscription, tap} from "rxjs";
import {User} from "../../../../model/user.model";
import {Router} from "@angular/router";
import {BlogApiService} from "../../../../service/api/blog-api.service";
import {BlogService} from "../../../../service/data/blog.service";

@Component({
  selector: 'fitness-army-app-create-blog-modal',
  templateUrl: './create-blog-modal.component.html',
  styleUrls: ['./create-blog-modal.component.scss']
})
export class CreateBlogModalComponent implements OnInit, OnDestroy {

  @ViewChild('paragraphTitle') paragraphTitleInput!: ElementRef;
  @ViewChild('paragraphContent') paragraphContentInput!: ElementRef;
  blogPostForm!: FormGroup;
  blogTypes = Object.values(BlogType);
  currentLoggedInUser!: User | null;
  isCreatingBlog: boolean = false;
  blogImage!: File;
  private subscriptions: Subscription = new Subscription();

  constructor(private router: Router,
              private nzModalRef: NzModalRef,
              private authApiService: AuthApiService,
              private blogApiService: BlogApiService,
              private blogService: BlogService
              ) { }

  ngOnInit(): void {
    this.initForm();
    this.getLoggedInUser();
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  onCreateBlog(): void {
    this.isCreatingBlog = true
    if (!this.blogPostForm.valid) {
      Object.values(this.blogPostForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
      return;
    }

    const title = this.blogPostForm.get('title')?.value;
    const content = this.blogPostForm.get('content')?.value
      .map((paragraph: {title: string, content: string, isUpdating: boolean}) => {
        return {
          title: paragraph.title,
          content: paragraph.content
        }
      });
    const category = this.blogPostForm.get('category')?.value;
    const newBlogPost = new Blog(null, this.currentLoggedInUser!, title, content, category, new Date(Date.now()), '');

    this.blogApiService.createBlogPost(newBlogPost, this.blogImage)
      .pipe(
        finalize(() => this.isCreatingBlog = false)
      )
      .subscribe({
        next: (response) => {
          this.blogService.setBlogCreationStatus(true);
          this.closeModal();
        },
        error: (err) => {
          console.log(err);
          this.blogService.setBlogCreationStatus(false);
          this.isCreatingBlog = false;
        }
      })
  }

  closeModal(): void {
    this.nzModalRef.close();
  }

  onImageSelect(imageFile: File): void {
    this.blogImage = imageFile;
  }

  private initForm(): void {
    this.blogPostForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      content:  new FormArray([]),
      category: new FormControl('', [Validators.required]),
      blogImage: new FormControl('', [Validators.required]),
    })
  }

  get blogContent(): FormArray {
    return this.blogPostForm.get('content') as FormArray;
  }

  addParagraphToBlogContent(paragraphTitle: string, paragraphContent: string): void {
    if (paragraphTitle !== '' || paragraphContent !== '') {
      this.blogContent.push(new FormGroup({
        title: new FormControl(paragraphTitle),
        content: new FormControl(paragraphContent),
        isUpdating: new FormControl(false)
      }));
      this.paragraphTitleInput.nativeElement.value = '';
      this.paragraphContentInput.nativeElement.value = '';
    }
  }

  deleteBlogParagraph(paragraphIndex: number): void {
    if (this.blogContent.length !== 1) {
      this.blogContent.removeAt(paragraphIndex);
    }
  }

  enterInEditMode(paragraphIndex: number): void {
    this.setParagraphEditMode(paragraphIndex, true);
  }

  setParagraphEditMode(paragraphIndex: number, isEditing: boolean): void {
    this.blogContent.controls[paragraphIndex].patchValue({
      isUpdating: isEditing
    })
  }

  editBlogParagraph(paragraphIndex: number, updatedTitle: string, updatedContent: string): void {
    this.blogContent.controls[paragraphIndex].patchValue({
      title: updatedTitle,
      content: updatedContent
    });
  }

  exitEditMode(paragraphIndex: number): void {
    this.setParagraphEditMode(paragraphIndex, false);
  }

  private getLoggedInUser(): void {
    const subscription = this.authApiService.user$
      .subscribe({
        next: (user: User | null) => {
          this.currentLoggedInUser = user;
        }
      });
    this.subscriptions.add(subscription);
  }
}
