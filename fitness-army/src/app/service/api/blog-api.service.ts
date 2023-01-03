import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Blog} from "../../model/blog";
import {
  BehaviorSubject,
  catchError, finalize,
  from,
  map,
  Observable,
  of,
  share,
  shareReplay,
  Subject,
  switchMap,
  tap,
  throwError
} from "rxjs";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {BlogParagraph} from "../../model/blog-paragraph";
import {User} from "../../model/user.model";
import {stat} from "fs";

@Injectable({
  providedIn: 'root'
})
export class BlogApiService {

  baseApiHref: string = '';

  blogsSubject: Subject<Blog[]> = new Subject<Blog[]>();
  blogs$ = this.blogsSubject.asObservable();

  blogSubject: Subject<Blog> = new Subject<Blog>();
  blog$ = this.blogSubject.asObservable();

  constructor(private http: HttpClient,
              private storage: AngularFireStorage,
              private db: AngularFirestore) {
    this.baseApiHref = environment.applicationApi;
  }

  createBlogPost(blog: Blog, imageFile: File): Observable<any> {
    return this.http.post(`${this.baseApiHref}/api/blogs/create/${blog.author.uid}`, {
      blog: blog
    }).pipe(
      map((response: any) => response.blogId),
      switchMap((blogId: string) => {
        return this.uploadBlogImage(imageFile, blogId)
      })
    );
  }

  updateBlogPost(blog: Blog, imageFile: File, cb: (status: boolean) => void): void {
    cb(true);
    this.uploadBlogImage(imageFile, blog.id!)
      .pipe(
        switchMap((blogImageUrl: string) => {
          return this.http.put(`${this.baseApiHref}/api/blogs/update/${blog.id}`, {
            blog: {...blog, imageUrl: blogImageUrl}
          });
        }),
        map((response: any) => response.blog),
        map((blogData: any) => new Blog(
          blogData.id,
          new User(
            blogData.author.email,
            blogData.author.uid,
            blogData.author.displayName,
            blogData.author.role,
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
        catchError((error: HttpErrorResponse) => throwError(() => of(error))),
        finalize(() => cb(false))
      ).subscribe({
      next: (blog: Blog) => {
        this.blogSubject.next(blog);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err)
      }
    })
  }

  uploadBlogImage(file: File, blogId: string): Observable<string> {
    const path = `${blogId}`;
    const ref = this.storage.ref(path);
    let imageUrl = "";
    return from(this.storage.upload(path, file))
      .pipe(
        switchMap(() => {
          return ref.getDownloadURL();
        }),
        switchMap((downloadUrl: any) => {
          imageUrl = downloadUrl;
          return from(this.db.collection('blogs').doc(blogId).update({imageUrl: downloadUrl}));
        }),
        map(() => imageUrl)
      )
  }

  getBlogPosts(category: string, cb: (status: boolean) => void): void {
    const url = category ? `${this.baseApiHref}/api/blogs?category=${category}` : `${this.baseApiHref}/api/blogs`;
    cb(true);
    this.http.get(url)
      .pipe(
        map((response: any) => response.data
            .map((blogItem: any) =>
              new Blog(
                blogItem.id,
                new User(
                  blogItem.author.email,
                  blogItem.author.uid,
                  blogItem.author.displayName,
                  blogItem.author.role,
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
            ),
          catchError((error: HttpErrorResponse) => throwError(() => of(error)))),
        finalize(() => cb(false))
      ).subscribe({
      next: (blogs: Blog[]) => {
        this.blogsSubject.next(blogs);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


  getBlogByIdTest(blogId: string, cb: (status: boolean) => void): void {
    cb(true);
    this.http.get(`${this.baseApiHref}/api/blogs/${blogId}`)
      .pipe(
        map((response: any) => response.data),
        map((blogData: any) => new Blog(
          blogData.id,
          new User(
            blogData.author.email,
            blogData.author.uid,
            blogData.author.displayName,
            blogData.author.role,
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
        finalize(() => cb(false))
      ).subscribe({
      next: (blog: Blog) => {
        this.blogSubject.next(blog);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getBlogById(blogId: string): Observable<Blog> {
    return this.http.get(`${this.baseApiHref}/api/blogs/${blogId}`)
      .pipe(
        map((response: any) => response.data),
        map((blogData: any) => new Blog(
          blogData.id,
          new User(
            blogData.author.email,
            blogData.author.uid,
            blogData.author.displayName,
            blogData.author.role,
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
        ))
      );
  }
}
