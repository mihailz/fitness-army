const blogsExpressServer = require("express");
const blogsRouter = blogsExpressServer.Router();

const blogController = require("../controller/blog.controller");

// eslint-disable-next-line max-len
blogsRouter.post("/api/blogs/create/:author_id", blogController.postCreateBlogPost);
blogsRouter.get("/api/blogs", blogController.getBlogs);
blogsRouter.get("/api/blogs/:blog_id", blogController.getBlogPost);
blogsRouter.put("/api/blogs/update/:blog_id", blogController.updateBlog);
blogsRouter.delete("/api/blogs/:blog_id/delete", blogController.deleteBlog);

module.exports = blogsRouter;
