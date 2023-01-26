import {Request, Response} from "express";
import {BlogPostModelDto} from "../model/blog-post.model.dto";

const firebaseAdmin = require("firebase-admin");

const uuid = require("uuid");

const db = firebaseAdmin.firestore();

exports.postCreateBlogPost = (req: Request, res: Response) => {
  (async () => {
    try {
      const blogId = uuid.v4();
      const blog = {
        ...req.body.blog, id: blogId,
      };
      await db.collection("blogs")
          .doc(blogId)
          .set(blog, {merge: true});
      return res.status(200).send({
        blog: blog,
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
      const searchString = req.query.searchString;
      let blogs: BlogPostModelDto[] = [];
      const blogsSnapshot =
        (category && category.length !== 0) ?
        await blogsCollection.where("category", "==", category).get() :
        await blogsCollection.get();
      blogs = mapBlogsData(blogsSnapshot.docs);
      const filteredBlogs = (searchString && searchString.length !== 0) ?
        blogs.filter((blog: BlogPostModelDto) =>
          blog.title.toLowerCase()
              .includes(searchString.toString().toLowerCase())) :
        blogs;
      return res.status(200)
          .send(
              {data: filteredBlogs}
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

exports.getBlogPost = (req: Request, res: Response) => {
  (async () => {
    try {
      const blogId = req.params.blog_id;
      const blogDocumentRef = await db.collection("blogs").doc(blogId).get();
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
      const updatedBlog = {
        author: req.body.blog.author,
        title: req.body.blog.title,
        content: req.body.blog.content,
        category: req.body.blog.category,
        imageUrl: req.body.blog.imageUrl,
      };
      await db.collection("blogs").doc(blogId).update(updatedBlog);
      return res.status(200).send({
        blog: updatedBlog,
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
