import {Request, Response} from "express";
import {UserModelDto} from "../model/user.model.dto";
const admin = require("firebase-admin");

const db = admin.firestore();

exports.postCreateUser = (req: Request, res: Response) => {
  (async () => {
    try {
      const {uid} = await admin.auth().createUser({
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
      });
      await admin.auth.setCustomUserClaims(uid, {
        role: req.body.role,
      });
      const collection = db.collection("users").doc(uid);
      await collection.create({
        uid: uid,
        displayName: req.body.displayName,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
      });
      return res.status(201).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
};

exports.getAllUsers = (req: Request, res: Response) => {
  (async () => {
    try {
      const usersCollection = db.collection("users");
      const users: UserModelDto[] = [];
      await usersCollection.get()
          .then((usersSnapshot: any) => {
            const documents = usersSnapshot.docs;
            for (const document of documents) {
              users.push(new UserModelDto(
                  document.data().uid,
                  document.data().email,
                  document.data().password,
                  document.data().displayName,
                  document.data().role
              ));
            }
          });
      return res.status(200).send({
        users: users,
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  })();
};

exports.getUserById = (req: Request, res: Response) => {
  (async () => {
    try {
      const userId = req.params.user_id;
      const document = db.collection("users").doc(userId);
      const userDocumentSnapshot = await document.get();
      const userData = userDocumentSnapshot.data();
      const user: UserModelDto = new UserModelDto(
          userData.uid,
          userData.email,
          userData.password,
          userData.displayName,
          userData.role
      );
      return res.status(200).send({
        user: user,
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  })();
};

exports.postUpdateUser = (req: Request, res: Response) => {
  (async () => {
    try {
      const userId = req.params.user_id;
      const document = db.collection("users").doc(userId);
      console.log(req.body);
      await admin.auth().updateUser(userId, {
        displayName: req.body.displayName,
        email: req.body.email,
        password: req.body.password,
      });
      await document.update({
        displayName: req.body.displayName,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
      });
      return res.status(200).send({message: "updated"});
    } catch (error) {
      return res.status(500).send(error);
    }
  })();
};

exports.postDeleteUser = (req: Request, res: Response) => {
  (async () => {
    try {
      const userID = req.params.user_id;
      const document = db.collection("users").doc(userID);
      await admin.auth().deleteUser(userID);
      await document.delete();
      return res.status(204).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  })();
};

