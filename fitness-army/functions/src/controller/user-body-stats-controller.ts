import {Request, Response} from "express";

const firebaseAdmin = require("firebase-admin");

const db = firebaseAdmin.firestore();

exports.postCreateUserBodyStats = (req: Request, res: Response) => {
  (async () => {
    try {
      const userId = req.params.user_id;
      const document = db.collection("users").doc(userId)
          .collection("measurements").doc(userId);
      await document.create({
        userBodyStats: {
          bodyStats: req.body.bodyStatsInfo,
          bodyMassIndex: req.body.bodyMassIndexInfo,
          bodyFatPercentage: req.body.bodyFatPercentageInfo,
        },
      });
      return res.status(200).send({
        message: "Measurement has been created successfully!",
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
      let userMeasurementsDto = {};
      userMeasurementsData ? userMeasurementsDto =
        userMeasurementsData.userBodyStats : null;
      return res.status(200).send({
        userBodyStats: userMeasurementsDto,
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
      const document = db.collection("users").doc(userId)
          .collection("measurements").doc(userId);
      await document.update({
        bodyStats: req.body.bodyStatsInfo,
        bodyMassIndex: req.body.bodyMassIndexInfo,
        bodyFatPercentage: req.body.bodyFatPercentageInfo,
      });
      return res.status(200).send({
        message: "Measurement has been updated successfully!",
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
