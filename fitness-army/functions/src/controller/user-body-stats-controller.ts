import {Request, Response} from "express";

const firebaseAdmin = require("firebase-admin");

const db = firebaseAdmin.firestore();

exports.postCreateUserBodyStats = (req: Request, res: Response) => {
  (async () => {
    try {
      const userId = req.params.user_id;
      console.log("Req: ", req.body);
      const userBodyStats = {
        bodyStats: req.body.bodyStatsInfo,
        bodyMassIndex: req.body.bodyMassIndexInfo,
        bodyFatPercentage: req.body.bodyFatPercentageInfo,
        idealBodyWeight: req.body.idealBodyWeight,
      };
      await db.collection("users").doc(userId)
          .collection("measurements").doc(userId)
          .set(userBodyStats, {merge: true});
      return res.status(200).send({
        userBodyStats: userBodyStats,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
};

exports.getUserBodyStats = (req: Request, res: Response) => {
  (async () => {
    try {
      const userId = req.params.user_id;
      const document = db.collection("users").doc(userId)
          .collection("measurements").doc(userId);
      const userMeasurementsDocumentSnapshot = await document.get();
      const userMeasurementsData = userMeasurementsDocumentSnapshot.data();
      console.log("getUserBodyStats: ", userMeasurementsData);
      return res.status(200).send({
        userBodyStats: userMeasurementsData,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
};

exports.postUpdateUserBodyStats = (req: Request, res: Response) => {
  (async () => {
    try {
      const userId = req.params.user_id;
      console.log("update: ", req.body);
      const updatedBodyStats = {
        bodyStats: req.body.bodyStatsInfo,
        bodyMassIndex: req.body.bodyMassIndexInfo,
        bodyFatPercentage: req.body.bodyFatPercentageInfo,
        idealBodyWeight: req.body.idealBodyWeight,
      };
      await db.collection("users").doc(userId)
          .collection("measurements").doc(userId)
          .update(updatedBodyStats);
      return res.status(200).send({
        userBodyStats: updatedBodyStats,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
};

exports.deleteUserBodyStats = (req: Request, res: Response) => {
  (async () => {
    try {
      const userId = req.params.user_id;
      const document = db.collection("users").doc(userId)
          .collection("measurements").doc(userId);
      await document.delete();
      return res.status(200).send({
        message: "Measurement has been deleted successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
};
