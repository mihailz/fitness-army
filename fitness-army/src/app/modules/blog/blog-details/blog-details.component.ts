import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {map, Subscription, switchMap} from "rxjs";
import {BlogApiService} from "../../../service/api/blog-api.service";
import {Blog} from "../../../model/blog";
import {BlogType} from "../../../model/blog-type";

@Component({
  selector: 'fitness-army-app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent implements OnInit, OnDestroy {

  blog!: Blog;
  blogCategories = BlogType;
  isFetchingData: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private blogApiService: BlogApiService) {
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

  navigateToUpdateBlogPage(): void {
    this.router.navigate([`/blogs/update/${this.blog.id}`]);
  }

  private fetchCurrentBlog(): void {
    this.isFetchingData = true;
    const sub$ = this.activatedRoute.params
      .pipe(
        map((params: Params) => params['id']),
        switchMap((blogId: string) => {
          return this.blogApiService.getBlogById(blogId);
        })
      ).subscribe({
        next: (blog: Blog) => {
          console.log('Blog: ', blog);
          this.isFetchingData = false;
          this.blog = blog;
        },
        error: err => {
          console.log(err);
        }
      });
    this.subscriptions.add(sub$);
  }
}
