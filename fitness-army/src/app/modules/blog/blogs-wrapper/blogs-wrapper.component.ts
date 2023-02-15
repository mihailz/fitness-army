import {Component, OnDestroy, OnInit} from '@angular/core';
import {BlogApiService} from "../../../service/api/blog-api.service";
import {Blog} from "../../../model/blog";
import {Observable, Subscription} from "rxjs";
import {AuthApiService} from "../../../service/api/auth-api.service";
import {User} from "../../../model/user.model";
import {UserRoles} from "../../../model/roles";
import {BlogsFilter} from "../../../model/types/blogs-filter-type";
import {BlogFilterCategories} from "../../../model/blog-type";
import {Router} from "@angular/router";

@Component({
  selector: 'fitness-army-app-blogs-wrapper',
  templateUrl: './blogs-wrapper.component.html',
  styleUrls: ['./blogs-wrapper.component.scss']
})
export class BlogsWrapperComponent implements OnInit, OnDestroy {

  blogs$!: Observable<Blog[]>;
  isFetchingData: boolean = false;
  loggedInUser!: User | null;
  userRoles = UserRoles;
  private subscriptions: Subscription = new Subscription();

  constructor(private router: Router,
              private blogApiService: BlogApiService,
              private authApiService: AuthApiService) {
  }

  ngOnInit(): void {
    this.getCurrentLoggedInUser();
    this.fetchBlogs('', '');
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  fetchBlogs(category: string, searchString: string): void {
    this.setLoading();
    this.blogApiService.getBlogPosts(category, searchString,(status: boolean) => {
      this.setLoading(false);
      this.blogs$ = this.blogApiService.blogs$;
    });
  }

  onFilterSubmit(filterOptions: BlogsFilter): void {
    const category = filterOptions.category === BlogFilterCategories.ALL ?
      '' : filterOptions.category;
    this.fetchBlogs(category, filterOptions.searchKey);
  }

  navigateToAddBlogPage(): void {
    this.router.navigate(['/blogs/create']);
  }

  canSeeAddBlogButton(): boolean {
    return this.loggedInUser?.role === this.userRoles.COACH
    || this.loggedInUser?.role === this.userRoles.ADMIN;
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

  private setLoading(status = true): void {
    this.isFetchingData = status;
  }
}

