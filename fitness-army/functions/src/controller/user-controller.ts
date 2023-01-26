import {Request, Response} from "express";
import {UserModelDto} from "../model/user.model.dto";

const admin = require("firebase-admin");

const db = admin.firestore();

exports.postCreateUser = (req: Request, res: Response) => {
  (async () => {
    try {
      await db.collection("users").doc(req.body.uid)
          .create({
            uid: req.body.uid,
            email: req.body.email,
            displayName: req.body.displayName,
            role: req.body.role,
          });
      return res.status(201).send({
        message: "User created successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
};

exports.getUsers = (req: Request, res: Response) => {
  (async () => {
    try {
      const userRole = req.query.user_role;
      console.log("getUsersByRole - userRole", userRole);
      const usersCollection = db.collection("users");
      const users: UserModelDto[] = [];
      await usersCollection.get()
          .then((usersSnapshot: any) => {
            let documents;
            if (userRole !== "ALL") {
              documents = usersSnapshot.docs
                  .filter((userDocumentSnapshot: any) =>
                    userDocumentSnapshot.data().role === userRole
                  );
            } else {
              documents = usersSnapshot.docs;
            }
            for (const document of documents) {
              users.push(new UserModelDto(
                  document.data().uid,
                  document.data().email,
                  document.data().password,
                  document.data().displayName,
                  document.data().role,
                  document.data().photoURL
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
          userData.role,
          userData.photoURL
      );
      return res.status(200).send({
        user: user,
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  })();
};

exports.getUserRole = (req: Request, res: Response) => {
  (async () => {
    try {
      const userId = req.params.user_id;
      const document = db.collection("users").doc(userId);
      const userDocumentSnapshot = await document.get();
      const userData = userDocumentSnapshot.data();
      return res.status(200).send({
        role: userData.role,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
};

exports.postUpdateUserPassword = (req: Request, res: Response) => {
  (async () => {
    try {
      const userId = req.params.user_id;
      await admin.auth().updateUser(userId, {
        password: req.body.password,
      });
      return res.status(200).send({message: "User successfully updated!"});
    } catch (error) {
      console.log(error);
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

