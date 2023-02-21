import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Blog} from "../../../model/blog";
import {BlogType} from "../../../model/blog-type";
import {map,Subscription, switchMap} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {BlogApiService} from "../../../service/api/blog-api.service";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BlogParagraph} from "../../../model/blog-paragraph";
import {BlogService} from "../../../service/data/blog.service";
import {MatAccordion} from "@angular/material/expansion";
import {ToastrService} from "ngx-toastr";
import {MatDialog} from "@angular/material/dialog";
import {AddParagraphComponent} from "../../../shared/add-paragraph/add-paragraph.component";

@Component({
  selector: 'fitness-army-app-update-blog',
  templateUrl: './update-blog.component.html',
  styleUrls: ['./update-blog.component.scss']
})
export class UpdateBlogComponent implements OnInit, OnDestroy {

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  blog!: Blog;
  isFetchingData: boolean = false;
  updateBlogForm!: FormGroup;
  blogTypes = Object.values(BlogType);
  blogImage!: File;
  uploadedImageUrl!: string | ArrayBuffer;
  private subscriptions: Subscription = new Subscription();

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private blogApiService: BlogApiService,
              private fb: FormBuilder,
              private blogService: BlogService,
              private toastrService: ToastrService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.initUpdateBlogForm();
    this.fetchCurrentBlog();
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  onImageSelect(imageFile: File): void {
    this.blogImage = imageFile;
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onloadend = (e: ProgressEvent<FileReader> | null) => { // function call once readAsDataUrl is completed
      if (e?.target?.['result']) {
        this.uploadedImageUrl = e?.target?.['result'];
      }
    }
  }

  getFControl(path: string): FormControl {
    return this.updateBlogForm.get(path) as FormControl;
  }

  getFControlErrorMessage(path: string): string {
    if (this.updateBlogForm.get(path)?.hasError('email')) {
      return 'Email is invalid!';
    }
    return 'You must enter a value';
  }

  get blogContent(): FormArray {
    return this.updateBlogForm.controls['content'] as FormArray;
  }

  updateBlog(): void {
    this.setLoading();
    const title = this.updateBlogForm.controls['title'].value;
    const content = this.updateBlogForm.controls['content'].value;
    const category = this.updateBlogForm.controls['category'].value;
    const updatedBlog = {
      ...this.blog,
      title: title,
      content: content,
      category: category
    };
    this.blogApiService.updateBlogPost(updatedBlog, this.blogImage, (status, error) => {
      this.setLoading(false);
      if (!status) {
        this.toastrService.error('An unexpected error has occurred!', 'Error');

      }
      this.toastrService.success('The blog has been updated!', 'Success');
    })
  }

  openAddParagraphModal(): void {
    this.dialog.open(AddParagraphComponent)
      .afterClosed()
      .subscribe({
        next: (paragraphForm: FormGroup) => {
          if (paragraphForm) {
            this.blogContent.push(paragraphForm);
          }
        }
      });
  }

  deleteParagraph(paragraphIndex: number) {
    this.blogContent.removeAt(paragraphIndex);
  }

  private fetchCurrentBlog(): void {
    this.setLoading();
    const sub$ = this.activatedRoute.params
      .pipe(
        map((params: Params) => params['id']),
        switchMap((blogId: string) => {
          this.blogApiService.getBlogById(blogId, (status: boolean, error) => {
            this.setLoading(false);
          })
          return this.blogApiService.blog$;
        })
      ).subscribe({
        next: (blog: Blog) => {
          this.blog = blog;
          this.populateUpdateBlogForm(blog);
          this.populateUpdateBlogContentFormArray(blog);
        },
        error: (err) => {
          console.error(err);
        }
      });

    this.subscriptions.add(sub$);
  }

  private setLoading(status = true): void {
    this.isFetchingData = status;
  }

  private populateUpdateBlogForm(blog: Blog): void {
    this.updateBlogForm.patchValue({
      title: blog.title,
      category: blog.category,
      blogImage: blog.imageUrl
    });
  }

  private populateUpdateBlogContentFormArray(blog: Blog): FormArray {
    if (this.blogContent.length > 0) {
      this.blogContent.clear();
    }
    const contentFormArray = new FormArray([]);
    blog.content.forEach((paragraph: BlogParagraph, index: number) => {
      let paragraphTitleFormControl = new FormControl('', [Validators.required]);
      let paragraphContentFormControl = new FormControl('');

      paragraphTitleFormControl.setValue(paragraph.title);
      paragraphContentFormControl.setValue(paragraph.content);

      this.blogContent.push(new FormGroup({
        title: paragraphTitleFormControl,
        content: paragraphContentFormControl
      }));
    });
    return contentFormArray;
  }

  private initUpdateBlogForm(): void {
    this.updateBlogForm = this.fb.group({
      title: this.fb.control('', [Validators.required]),
      content: this.fb.array([]),
      category: this.fb.control('', [Validators.required]),
      blogImage: this.fb.control('', [Validators.required]),
    });
  }
}
