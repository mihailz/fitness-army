import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {map, Observable, Subscription, tap} from "rxjs";
import {BlogApiService} from "../../../service/api/blog-api.service";
import {Blog} from "../../../model/blog";
import {BlogType} from "../../../model/blog-type";

@Component({
  selector: 'fitness-army-app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss'],
})
export class BlogDetailsComponent implements OnInit, OnDestroy {

  blog$!: Observable<Blog | null>;
  blogCategories = BlogType;
  isFetchingData: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private blogApiService: BlogApiService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.fetchCurrentBlog();
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  navigateToBlogsPage(): void {
    this.router.navigate(['/blogs']);
  }

  navigateToUpdateBlogPage(blog: Blog): void {
    if (blog) {
      this.router.navigate([`/blogs/update/${blog.id}`]);
    }
  }

  private fetchCurrentBlog(): void {
    this.setLoading();
    const sub$ = this.activatedRoute.params
      .pipe(
        map((params: Params) => params['id']),
        tap({
          next: (blogId: string) => {
            this.blogApiService.getBlogById(blogId, (status: boolean) => {
              this.setLoading(false);
              this.blog$ = this.blogApiService.blog$;
              this.cdr.markForCheck();
              this.cdr.detectChanges();
            })
          }
        })
      ).subscribe();
    this.subscriptions.add(sub$);
  }

  private setLoading(status = true): void {
    this.isFetchingData = status;
  }
}
