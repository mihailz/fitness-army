const usersCommentsExpressServer = require('express');
const usersCommentsRouter = usersCommentsExpressServer.Router();
const commentsController = require('../controller/comments.controller');
//Get all coments from all users
usersCommentsRouter.get("/api/comments");

//Get all comments from particular user
usersCommentsRouter.get("/api/comments/:user_id");

//Create a comment
usersCommentsRouter.post(
  "/api/comments/create",
  commentsController.postCreateComment
);

//Update a comment
usersCommentsRouter.put("/api/comments/update/:comment_id");

//Delete a comment
usersCommentsRouter.delete("/api/comments/delete/:comment_id");

module.exports = usersCommentsRouter;
