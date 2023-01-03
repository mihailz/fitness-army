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
import {isNil} from "ng-zorro-antd/core/util";

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
      switchMap((blog: any) => {
        return this.uploadBlogImage(imageFile, blog)
      })
    );
  }

  updateBlogPost(blog: Blog, imageFile: File | null, cb: (status: boolean) => void): void {
    cb(true);
    this.uploadBlogImage(imageFile, blog)
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
        catchError((error: HttpErrorResponse) => throwError(() => of(error.message))),
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

  uploadBlogImage(file: File | null, blog: Blog): Observable<string> {
    if (isNil(file)) {
      console.log('nema selektirano fajl zemi go postoeckoto url!');
      return of(blog.imageUrl!)
    } else {
      console.log('ima selektirano fajl kreiraj pateka!');
      const path = `${blog.id}`;
      const ref = this.storage.ref(path);
      let imageUrl = "";
      return from(this.storage.upload(path, file))
        .pipe(
          switchMap(() => {
            return ref.getDownloadURL();
          }),
          switchMap((downloadUrl: any) => {
            imageUrl = downloadUrl;
            return from(this.db.collection('blogs').doc(blog.id!).update({imageUrl: downloadUrl}));
          }),
          map(() => imageUrl)
        )
    }
  }

  getBlogPosts(category: string, cb: (status: boolean) => void): void {
    const url = category ? `${this.baseApiHref}/api/blogs?category=${category}` : `${this.baseApiHref}/api/blogs`;
    cb(true);
    this.http.get(url)
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => of(error)))),
      finalize(() => cb(false)
      );
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
