import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Blog} from "../../model/blog";
import {
  BehaviorSubject,
  catchError,
  from,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  throwError
} from "rxjs";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {BlogParagraph} from "../../model/blog-paragraph";
import {User} from "../../model/user.model";
import {isNil} from "ng-zorro-antd/core/util";
import {ImageUploadService} from "./image-upload.service";

@Injectable({
  providedIn: 'root'
})
export class BlogApiService {

  baseApiHref: string = '';

  blogsSubject: Subject<Blog[]> = new BehaviorSubject<Blog[]>([]);
  blogs$ = this.blogsSubject.asObservable();

  blogSubject: Subject<Blog> = new Subject<Blog>();
  blog$ = this.blogSubject.asObservable();

  constructor(private http: HttpClient,
              private storage: AngularFireStorage,
              private db: AngularFirestore,
              private imageUploadService: ImageUploadService) {
    this.baseApiHref = environment.applicationApi;
  }

  createBlogPost(blog: Blog, imageFile: File, cb: (status: boolean, error?: HttpErrorResponse) => void): void {
   this.http.post(`${this.baseApiHref}/api/blogs/create/${blog.author.uid}`, {
      blog: blog
    }).pipe(
      map((response: any) => response.blog),
      switchMap((blog: any) => {
        return this.imageUploadService.uploadImage(imageFile, `images/blog/${blog.id}`)
          .pipe(
            switchMap((blogImageUrl: string) =>
            from(this.db.collection('blogs').doc(blog.id!).update({imageUrl: blogImageUrl}))
          ))
      }),
     catchError(err => throwError(() => err))
    ).subscribe({
     next: () => {
       cb(true);
     },
     error: (err: HttpErrorResponse) => {
       console.error(err.message);
       cb(false, err);
     }
   });
  }

  updateBlogPost(blog: Blog, imageFile: File, cb: (status: boolean, error?: HttpErrorResponse) => void): void {
    this.updateBlogImage(blog, imageFile, `images/blog/${blog.id}`)
      .pipe(
        switchMap((blogImageUrl: string) => this.http.put(`${this.baseApiHref}/api/blogs/update/${blog.id}`, {
          blog: {...blog, imageUrl: blogImageUrl}
        })),
        map((response: any) => response.blog),
        map((blogData: any) => new Blog(
          blog.id,
          new User(
            blogData.author.uid,
            blogData.author.email,
            blogData.author.displayName,
            blogData.author.profileImage,
          ),
          blogData.title,
          blogData.content.map((blogParagraph: any) => new BlogParagraph(
            blogParagraph.title,
            blogParagraph.content
          )),
          blogData.category,
          blogData.dateCreated,
          blogData.imageUrl
        )),
        catchError((error: HttpErrorResponse) => throwError(() => error.message)),
      ).subscribe({
      next: (blog: Blog) => {
        cb(true);
        console.log('updatedBlog: ', blog)
        this.blogSubject.next(blog);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        cb(false, err);
      }
    })
  }

  updateBlogImage(blog: Blog, file: File | null, path: string): Observable<string> {
    if (isNil(file)) {
      return of(blog.imageUrl!)
    } else {
      return this.imageUploadService.uploadImage(file, path);
    }
  }

  getBlogPosts(category: string, searchString: string,
               cb: (status: boolean, error?: HttpErrorResponse) => void): void {
    const url = `${this.baseApiHref}/api/blogs?category=${category}&searchString=${searchString}`;
    this.http.get(url)
      .pipe(
        map((response: any) => response.data
          .map((blogItem: any) =>
            new Blog(
              blogItem.id,
              new User(
                blogItem.author.uid,
                blogItem.author.email,
                blogItem.author.displayName,
                blogItem.author.profileImage,
              ),
              blogItem.title,
              blogItem.content.map((blogParagraph: any) => new BlogParagraph(
                blogParagraph.title,
                blogParagraph.content
              )),
              blogItem.category,
              blogItem.dateCreated,
              blogItem.imageUrl
            )
          )
        ),
        catchError((error: HttpErrorResponse) => throwError(() => of(error))),
      )
      .subscribe({
        next: (blogs: Blog[]) => {
          cb(true);
          this.blogsSubject.next(blogs);
        },
        error: (err) => {
          console.log(err);
          cb(false, err);
        }
      });
  }

  getBlogById(blogId: string, cb: (status: boolean, error?: HttpErrorResponse) => void): void {
    this.http.get(`${this.baseApiHref}/api/blogs/${blogId}`)
      .pipe(
        map((response: any) => response.data),
        map((blogData: any) => new Blog(
          blogData.id,
          new User(
            blogData.author.uid,
            blogData.author.email,
            blogData.author.displayName,
            blogData.author.profileImage,
          ),
          blogData.title,
          blogData.content.map((blogParagraph: any) => new BlogParagraph(
            blogParagraph.title,
            blogParagraph.content
          )),
          blogData.category,
          blogData.dateCreated,
          blogData.imageUrl
        )),
        catchError((err: HttpErrorResponse) => throwError(() => of(err))),
      ).subscribe({
      next: (blog: Blog) => {
        cb(true);
        this.blogSubject.next(blog);
      },
      error: (err) => {
        console.log(err);
        cb(false, err);
      }
    });
  }

  deleteBlog(blogId: string, cb: (status: boolean) => void): void {
    const url = `${this.baseApiHref}/api/blogs/${blogId}/delete`;
    this.http.delete(url)
      .pipe(
        catchError((err: HttpErrorResponse) => throwError(() => of(err))),
      ).subscribe({
      next: () => {
        cb(true);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        cb(false);
      }
    })
  }
}
