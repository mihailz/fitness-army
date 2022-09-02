import {Request, Response} from "express";
const firebaseAdmin = require("firebase-admin");

const db = firebaseAdmin.firestore();

exports.postCreateCoach = (req: Request, res: Response) => {
  (async () => {
    try {
      const userId = req.params.coach_id;
      console.log("postCreateCoach: ", req.params);
      const coachesCollection = db.collection("coaches").doc(userId);
      await coachesCollection.create({
        user: {
          uid: req.body.user.uid,
          email: req.body.user.email,
          displayName: req.body.user.displayName,
          role: req.body.user.role,
          profileImage: req.body.user.profileImage,
        },
      });
      return res.status(200).send({
        message: "User added to coaches collection!!",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
};
