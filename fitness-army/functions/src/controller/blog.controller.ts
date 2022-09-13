import {Request, Response} from "express";
import {BlogPostModelDto} from "../model/blog-post.model.dto";

const firebaseAdmin = require("firebase-admin");

const uuid = require("uuid");

const db = firebaseAdmin.firestore();

exports.postCreateBlogPost = (req: Request, res: Response) => {
  (async () => {
    try {
      const blogId = uuid.v4();
      const blogsCollection = db.collection("blogs").doc(blogId);
      console.log("postCreateBlogPost-body: ", req.body);
      await blogsCollection.create({
        ...req.body.blog, id: blogId,
      });
      return res.status(200).send({
        blogId: blogId,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
};

exports.getBlogs = (req: Request, res: Response) => {
  (async () => {
    try {
      const blogsCollection = db.collection("blogs");
      const category = req.query.category;
      let blogs: BlogPostModelDto[] = [];
      await blogsCollection.get()
          .then((blogsSnapshot: any) => {
            let documents;
            if (category && category !== "ALL") {
              documents = blogsSnapshot.docs.filter((document: any) => {
                return document.data().category === category;
              });
              blogs = mapBlogsData(documents);
            } else {
              documents = blogsSnapshot.docs;
              blogs = mapBlogsData(documents);
            }
          });
      return res.status(200)
          .send(
              {data: blogs}
          );
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
};

function mapBlogsData(documents: any): BlogPostModelDto[] {
  return documents.map((document: any) => new BlogPostModelDto(
      document.data().id,
      document.data().author,
      document.data().title,
      document.data().content,
      document.data().category,
      document.data().dateCreated,
      document.data().imageUrl,
  ));
}

exports.getBlogPostsByCategory = (req: Request, res: Response) => {
  (async () => {
    try {
      const blogsCollection = db.collection("blogs");
      const category = req.query.category;
      const blogs: BlogPostModelDto[] = [];
      await blogsCollection.get()
          .then((blogsSnapShop: any) => {
            const documents = blogsSnapShop.docs.filter((document: any) => {
              return document.data().category === category;
            });
            console.log("filteredDocuments: ", documents);
            for (const document of documents) {
              blogs.push(new BlogPostModelDto(
                  document.data().id,
                  document.data().author,
                  document.data().title,
                  document.data().content,
                  document.data().category,
                  document.data().dateCreated,
                  document.data().imageUrl,
              ));
            }
          });
      return res.status(200).send(
          {data: blogs}
      );
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
};

exports.getBlogPost = (req: Request, res: Response) => {
  (async () => {
    try {
      const blogId = req.params.blog_id;
      const blogDocument = db.collection("blogs").doc(blogId);
      const blogDocumentRef = await blogDocument.get();
      const blogData = blogDocumentRef.data();
      return res.status(200).send({
        data: blogData,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
};

exports.updateBlog = (req: Request, res: Response) => {
  (async () => {
    try {
      const blogId = req.params.blog_id;
      const blogDocument = db.collection("blogs").doc(blogId);
      await blogDocument.update({
        author: req.body.blog.author,
        title: req.body.blog.title,
        content: req.body.blog.content,
        category: req.body.blog.category,
        imageUrl: req.body.blog.imageUrl,
      });
      return res.status(200).send({
        message: "Blog has been updated!",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
};

exports.deleteBlog = (req: Request, res: Response) => {
  (async () => {
    try {
      const blogId = req.params.blog_id;
      const blogDocument = db.collection("blogs").doc(blogId);
      await blogDocument.delete();
      return res.status(200).send({
        message: "Blog has been deleted",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
};
