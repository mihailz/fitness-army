import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {NzModalService} from "ng-zorro-antd/modal";
import {BlogApiService} from "../../../service/api/blog-api.service";
import {Blog} from "../../../model/blog";
import {filter, finalize, fromEvent, map, Observable, Subscription} from "rxjs";
import {AuthApiService} from "../../../service/api/auth-api.service";
import {User} from "../../../model/user.model";
import {BlogService} from "../../../service/data/blog.service";
import {UserRoles} from "../../../model/roles";
import {CreateBlogModalComponent} from "./create-blog-modal/create-blog-modal.component";
import {ThemePalette} from "@angular/material/core";
import {ProgressSpinnerMode} from "@angular/material/progress-spinner";
import {BlogsFilter} from "../../../model/types/blogs-filter-type";

@Component({
  selector: 'fitness-army-app-blogs-wrapper',
  templateUrl: './blogs-wrapper.component.html',
  styleUrls: ['./blogs-wrapper.component.scss']
})
export class BlogsWrapperComponent implements OnInit, OnDestroy {

  blogs$!: Observable<Blog[]>;
  filteredBlogs$!: Observable<Blog[]>;
  isFetchingData: boolean = false;
  loggedInUser!: User | null;
  userRoles = UserRoles;
  selectedBlogCategory: string = '';
  private subscriptions: Subscription = new Subscription();

  constructor(private nzModalService: NzModalService,
              private blogApiService: BlogApiService,
              private authApiService: AuthApiService,
              private blogService: BlogService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.getCurrentLoggedInUser();
    this.listenForBlogCreationStatus();
    this.fetchBlogs('');
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  fetchBlogs(category: string, searchString = ''): void {
    this.blogApiService.getBlogPosts(category, searchString,(status: boolean) => {
      this.setLoading(status);
      this.blogs$ = this.blogApiService.blogs$;
    });
  }

  onFilterSubmit(filterOptions: BlogsFilter): void {
    this.fetchBlogs(filterOptions.category, filterOptions.searchKey);
  }

  openCreateBlogModal(): void {
    this.nzModalService.create({
      nzContent: CreateBlogModalComponent,
      nzFooter: null,
    })
  }

  private getCurrentLoggedInUser(): void {
    const subscription = this.authApiService.user$
      .subscribe({
        next: (user: User | null) => {
          this.loggedInUser = user;
        },
        error: err => console.log(err)
      });

    this.subscriptions.add(subscription);
  }

  private listenForBlogCreationStatus(): void {
    const subscription = this.blogService.getBlogCreationStatus()
      .subscribe({
        next: (status: boolean) => {
          if (status) {
            this.fetchBlogs('');
          }
        }
      });
    this.subscriptions.add(subscription);
  }

  private setLoading(status = true): void {
    this.isFetchingData = status;
  }
}

