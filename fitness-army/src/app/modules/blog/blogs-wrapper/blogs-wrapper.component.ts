import {Component, OnDestroy, OnInit} from '@angular/core';
import {NzModalService} from "ng-zorro-antd/modal";
import {CreateBlogModalComponent} from "./create-blog-modal/create-blog-modal.component";
import {BlogApiService} from "../../../service/api/blog-api.service";
import {Blog} from "../../../model/blog";
import {finalize, Subscription} from "rxjs";
import {AuthApiService} from "../../../service/api/auth-api.service";
import {User} from "../../../model/user.model";
import {UserRoles} from "../../../model/roles";
import {BlogService} from "../../../service/data/blog.service";

@Component({
  selector: 'fitness-army-app-blogs-wrapper',
  templateUrl: './blogs-wrapper.component.html',
  styleUrls: ['./blogs-wrapper.component.scss']
})
export class BlogsWrapperComponent implements OnInit, OnDestroy {

  blogs: Blog[] = [];
  isFetchingData: boolean = false;
  loggedInUser!: User | null;
  userRoles = UserRoles;
  private subscriptions: Subscription = new Subscription();

  constructor(private nzModalService: NzModalService,
              private blogApiService: BlogApiService,
              private authApiService: AuthApiService,
              private blogService: BlogService) {
  }

  ngOnInit(): void {
    this.getCurrentLoggedInUser();
    this.listenForBlogCreationStatus();
    this.fetchBlogs();
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  openCreateBlogModal(): void {
    this.nzModalService.create({
      nzContent: CreateBlogModalComponent,
    })
  }

  fetchBlogs(): void {
    this.isFetchingData = true;
    this.blogApiService.getBlogPosts()
      .pipe(
        finalize(() => this.isFetchingData = false)
      )
      .subscribe({
        next: (response: Blog[]) => {
          this.blogs = response;
        },
        error: (err) => {
          console.log(err);
          this.isFetchingData = false;
        }
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
            this.fetchBlogs();
          }
        }
      });
    this.subscriptions.add(subscription);
  }
}

