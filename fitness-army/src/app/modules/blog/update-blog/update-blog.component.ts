import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Blog} from "../../../model/blog";
import {BlogType} from "../../../model/blog-type";
import {finalize, map, Subscription, switchMap} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {BlogApiService} from "../../../service/api/blog-api.service";
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BlogParagraph} from "../../../model/blog-paragraph";
import {NzModalService} from "ng-zorro-antd/modal";
import {AddParagraphModalComponent} from "../add-paragraph-modal/add-paragraph-modal.component";
import {BlogService} from "../../../service/data/blog.service";
import {update} from "@angular/fire/database";
import {MatAccordion} from "@angular/material/expansion";

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
  nzTipMessage: string = '';
  contentTitles: string[] = [];
  private subscriptions: Subscription = new Subscription();

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private blogApiService: BlogApiService,
              private fb: FormBuilder,
              private nzModalService: NzModalService,
              private blogService: BlogService) {
  }

  ngOnInit(): void {
    this.initUpdateBlogForm();
    this.fetchCurrentBlog();
    this.listenForCreatedBlogParagraph();
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

  get blogContent(): FormArray {
    return this.updateBlogForm.controls['content'] as FormArray;
  }

  deleteParagraph(paragraphIndex: number) {
    this.blogContent.removeAt(paragraphIndex);
    this.contentTitles.splice(paragraphIndex, 1);
  }

  addParagraph(paragraph: BlogParagraph) {
    const paragraphFormGroup = this.fb.group({
      title: this.fb.control(paragraph.title),
      content: this.fb.control(paragraph.content)
    });
    this.blogContent.push(paragraphFormGroup);
  }

  updateBlog(): void {
    this.nzTipMessage = 'Updating blog...';
    this.isFetchingData = true;
    if (!this.updateBlogForm.valid) {
      Object.values(this.updateBlogForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
      return;
    }

    const title = this.updateBlogForm.controls['title'].value;
    const content = this.updateBlogForm.controls['content'].value;
    const category = this.updateBlogForm.controls['category'].value;
    const updatedBlog = {
      ...this.blog,
      title: title,
      content: content,
      category: category
    };
    console.log('Update blog: ', updatedBlog);

    this.blogApiService.updateBlogPost(updatedBlog, this.blogImage)
      .pipe(
        finalize(() => {
          this.isFetchingData = false;
          this.nzTipMessage = '';
        })
      )
      .subscribe({
        next: (response) => {
          console.log('updatedBlog: ', response)
        },
        error: (err) => {
          console.log(err);
          this.isFetchingData = false;
          this.nzTipMessage = '';
        }
      })

  }

  openAddParagraphModal(): void {
    this.nzModalService.create({
      nzContent: AddParagraphModalComponent,
      nzFooter: null,
    })
  }

  private listenForCreatedBlogParagraph(): void {
    const subscription = this.blogService.getBlogParagraph()
      .subscribe({
        next: ((blogParagraph: BlogParagraph) => {
          this.addParagraph(blogParagraph);
        })
      });
    this.subscriptions.add(subscription);
  }

  private fetchCurrentBlog(): void {
    this.nzTipMessage = 'Loading blog content...';
    this.isFetchingData = true;
    this.activatedRoute.params
      .pipe(
        map((params: Params) => params['id']),
        switchMap((blogId: string) => {
          return this.blogApiService.getBlogById(blogId);
        })
      ).subscribe({
      next: (blog: Blog) => {
        this.isFetchingData = false;
        this.nzTipMessage = '';
        this.blog = blog;
        if (this.blog) {
          this.populateUpdateBlogForm();
          this.populateUpdateBlogContentFormArray();
        }
      },
      error: err => {
        console.log(err);
        this.nzTipMessage = '';
        this.isFetchingData = false;
      }
    })
  }

  private populateUpdateBlogForm(): void {
    this.updateBlogForm.patchValue({
      title: this.blog.title,
      category: this.blog.category,
      blogImage: this.blog.imageUrl
    });
  }

  private populateUpdateBlogContentFormArray(): FormArray {
    const contentFormArray = new FormArray([]);
    this.blog.content.forEach((paragraph: BlogParagraph, index: number) => {
      let paragraphTitleFormControl = new FormControl('');
      let paragraphContentFormControl = new FormControl('');

      paragraphTitleFormControl.setValue(paragraph.title);
      paragraphContentFormControl.setValue(paragraph.content);
      this.contentTitles.push(paragraph.title);

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
