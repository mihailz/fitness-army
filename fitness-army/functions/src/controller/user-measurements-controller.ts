import {Request, Response} from "express";
import {MeasurementModelDto} from "../model/measurement.model.dto";
import {calculateUserAge} from "../functions/calculate-user-age";

const firebaseAdmin = require("firebase-admin");

const db = firebaseAdmin.firestore();

exports.postCreateUserMeasurements = (req: Request, res: Response) => {
  (async () => {
    try {
      const userId = req.params.user_id;
      const document = db.collection("users").doc(userId)
          .collection("measurements").doc(userId);
      await document.create({
        birthDate: req.body.birthDate,
        weight: req.body.weight,
        height: req.body.height,
        gender: req.body.gender,
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

exports.getUserMeasurements = (req: Request, res: Response) => {
  (async () => {
    try {
      const userId = req.params.user_id;
      const document = db.collection("users").doc(userId)
          .collection("measurements").doc(userId);
      const userMeasurementsDocumentSnapshot = await document.get();
      const userMeasurementsData = userMeasurementsDocumentSnapshot.data();
      const userMeasurementsDto: MeasurementModelDto =
        new MeasurementModelDto(
            calculateUserAge(userMeasurementsData.birthDate),
            userMeasurementsData.weight,
            userMeasurementsData.height,
            userMeasurementsData.gender
        );
      return res.status(200).send({
        userMeasurements: userMeasurementsDto,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
};

exports.postUpdateUserMeasurements = (req: Request, res: Response) => {
  (async () => {
    try {
      const userId = req.params.user_id;
      const document = db.collection("users").doc(userId)
          .collection("measurements").doc(userId);
      await document.update({
        birthDate: req.body.birthDate,
        weight: req.body.weight,
        height: req.body.height,
        gender: req.body.gender,
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

exports.deleteUserMeasurements = (req: Request, res: Response) => {
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
