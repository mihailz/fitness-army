import { Request, Response } from 'express';

const firebaseAdmin = require('firebase-admin');

const db = firebaseAdmin.firestore();

exports.postCreateComment = (req: Request, res: Response) => {
  (async () => {
    try {
      const userId = req.body.user.id;
      const commentsCollection = db.collection('comments').doc(userId);
      await commentsCollection.create({
        commentId: userId,
        content: req.body.content,
        dateCreated: new Date().toDateString(),
        author: req.body.user,
      });

      return res.status(200).send({
        message: 'The comment has been created successfully',
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: 'The comment can not be created!',
      });
    }
  })();
};
