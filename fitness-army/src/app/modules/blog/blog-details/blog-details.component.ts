import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {map, Observable, Subscription, tap} from "rxjs";
import {BlogApiService} from "../../../service/api/blog-api.service";
import {Blog} from "../../../model/blog";
import {BlogType} from "../../../model/blog-type";
import {AuthApiService} from "../../../service/api/auth-api.service";
import {User} from "../../../model/user.model";
import {UserRoles} from "../../../model/roles";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'fitness-army-app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss'],
})
export class BlogDetailsComponent implements OnInit, OnDestroy {

  blog$!: Observable<Blog | null>;
  blogCategories = BlogType;
  isFetchingData: boolean = false;
  loggedInUser!: User | null;
  private subscriptions: Subscription = new Subscription();

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private blogApiService: BlogApiService,
              private cdr: ChangeDetectorRef,
              private authApiService: AuthApiService,
              private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.fetchCurrentBlog();
    this.getCurrentLoggedInUser();
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

  hasRole(): boolean {
    return this.loggedInUser?.role === UserRoles.ADMIN || this.loggedInUser?.role === UserRoles.COACH;
  }

  private setLoading(status = true): void {
    this.isFetchingData = status;
  }

  private getCurrentLoggedInUser(): void {
    const subscription = this.authApiService.user$
      .subscribe({
        next: (user: any) => {
          this.loggedInUser = user;
        },
        error: err => console.log(err)
      });

    this.subscriptions.add(subscription);
  }

  deleteBlog(blog: Blog): void {
    this.setLoading();
    this.blogApiService.deleteBlog(blog.id!, (status: boolean) => {
      this.setLoading(false);
      if (!status) {
        this.toastrService.error("An error has occurred", "Error");
        return;
      }
      this.toastrService.success("Blog has been deleted!", "Success");
      this.router.navigate(['/blogs']);
    })
  }
}
