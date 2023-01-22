import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {BlogType} from "../../../model/blog-type";
import {User} from "../../../model/user.model";
import {finalize, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {AuthApiService} from "../../../service/api/auth-api.service";
import {BlogApiService} from "../../../service/api/blog-api.service";
import {BlogService} from "../../../service/data/blog.service";
import {Blog} from "../../../model/blog";
import {MatDialog} from "@angular/material/dialog";
import {AddParagraphComponent} from "../../../shared/add-paragraph/add-paragraph.component";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'fitness-army-app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.scss']
})
export class AddBlogComponent implements OnInit {

  @ViewChild('paragraphTitle') paragraphTitleInput!: ElementRef;
  @ViewChild('paragraphContent') paragraphContentInput!: ElementRef;
  blogPostForm!: FormGroup;

  blogTypes = Object.values(BlogType);
  currentLoggedInUser!: User | null;
  isCreatingBlog: boolean = false;
  blogImage!: File;
  contentTitles: string[] = [];
  blogImageUrl!: string | ArrayBuffer;
  private subscriptions: Subscription = new Subscription();

  constructor(private router: Router,
              private authApiService: AuthApiService,
              private blogApiService: BlogApiService,
              private toastrService: ToastrService,
              public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initForms();
    this.getLoggedInUser();
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  createBlog(): void {
    if (this.blogPostForm.invalid) {
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
    this.setLoading();
    const category = this.blogPostForm.get('category')?.value;
    const newBlogPost = new Blog(null, this.currentLoggedInUser!,
      title, content, category, new Date(Date.now()), '');

    this.blogApiService.createBlogPost(newBlogPost, this.blogImage, (state: boolean, err) => {
     this.setLoading(false);
      if (!state) {
        this.toastrService.error('An unexpected error has occurred!', 'Error');
        return;
      }
      this.router.navigate(['blogs']);
      this.toastrService.success('The blog has been created!', 'Success');
    });

  }

  getFControl(path: string): FormControl {
    return this.blogPostForm.get(path) as FormControl;
  }

  getFControlErrorMessage(path: string): string {
    if (this.blogPostForm.get(path)?.hasError('email')) {
      return 'Email is invalid!';
    }
    return 'Field is required!';
  }

  onImageSelect(imageFile: File): void {
    this.blogImage = imageFile;
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onloadend = (e: ProgressEvent<FileReader> | null) => { // function call once readAsDataUrl is completed
      if (e?.target?.['result']) {
        this.blogImageUrl = e?.target?.['result'];
      }
    }
  }

  get blogContent(): FormArray {
    return this.blogPostForm.get('content') as FormArray;
  }

  deleteBlogParagraph(paragraphIndex: number): void {
    this.blogContent.removeAt(paragraphIndex);
    this.contentTitles.splice(paragraphIndex, 1);
  }

  enterInEditMode(paragraphIndex: number): void {
    this.setParagraphEditMode(paragraphIndex, true);
    this.blogContent.at(paragraphIndex).get('title')?.enable();
    this.blogContent.at(paragraphIndex).get('content')?.enable();
  }

  exitEditMode(paragraphIndex: number): void {
    this.setParagraphEditMode(paragraphIndex, false);
    this.blogContent.at(paragraphIndex).get('title')?.disable();
    this.blogContent.at(paragraphIndex).get('content')?.disable();
  }

  editBlogParagraph(paragraphIndex: number, updatedTitle: string, updatedContent: string): void {
    this.blogContent.controls[paragraphIndex].patchValue({
      title: updatedTitle,
      content: updatedContent
    });
    this.contentTitles[paragraphIndex] = updatedTitle;
  }

  openAddParagraphDialog() {
    this.dialog.open(AddParagraphComponent)
      .afterClosed()
      .subscribe({
        next: (fGroup: FormGroup) => {
          console.log('afterClosed: ', fGroup);
          this.addParagraphToBlogContent(fGroup)
        }
      });
  }

  private initForms(): void {
    this.blogPostForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      content:  new FormArray([]),
      category: new FormControl('', [Validators.required]),
      blogImage: new FormControl('', [Validators.required]),
    });
  }

  private setParagraphEditMode(paragraphIndex: number, isEditing: boolean): void {
    this.blogContent.at(paragraphIndex).patchValue({
      isUpdating: isEditing,
    });
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

  private addParagraphToBlogContent(form: FormGroup): void {
    const paragraphTitle = form.get('title')?.value;
    this.blogContent.push(form);
    this.blogContent.controls.map((fGroup: AbstractControl) => {
      fGroup.get('title')?.disable();
      fGroup.get('content')?.disable();
    });
    this.contentTitles.push(paragraphTitle);
  }

  private setLoading(state = true): void {
    this.isCreatingBlog = state;
  }
}
