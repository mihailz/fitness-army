import {Request, Response} from "express";
import {ReviewModelDto} from "../model/review.model.dto";

const firebaseAdmin = require("firebase-admin");

const uuid = require("uuid");

const db = firebaseAdmin.firestore();

exports.postCreateReview = (req: Request, res: Response) => {
  (async () => {
    try {
      const recipeId = req.params.recipe_id;
      const reviewUid = uuid.v4();
      const author = req.body.author;
      let review = {};
      const reviewsSnapshot = await db.collection("recipes")
          .doc(recipeId).collection("reviews").get();
      const reviewsDocs = reviewsSnapshot.docs;
      const existingReviewForCurrentUser = reviewsDocs.find((document: any) =>
        document.data().author.email === author.email);
      if (existingReviewForCurrentUser) {
        const existingReviewId = existingReviewForCurrentUser.data().id;
        review = {...req.body, id: existingReviewId};
        await db.collection("recipes")
            .doc(recipeId).collection("reviews").doc(existingReviewId)
            .update(review);
      } else {
        review = {...req.body, id: reviewUid};
        await db.collection("recipes")
            .doc(recipeId).collection("reviews").doc(reviewUid)
            .set(review, {merge: true});
      }
      return res.status(200).send({
        review: review,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
};

exports.getRecipeReviews = (req: Request, res: Response) => {
  (async () => {
    try {
      const recipeId = req.params.recipe_id;
      const reviewsSnapshot = await db.collection("recipes")
          .doc(recipeId).collection("reviews")
          .get();
      let reviews: ReviewModelDto[] = [];
      reviews = mapReviewData(reviewsSnapshot.docs);
      return res.status(200).send({
        data: reviews,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
};

function mapReviewData(documents: any): ReviewModelDto[] {
  return documents.map((document: any) => new ReviewModelDto(
      document.data().id,
      document.data().author,
      document.data().dateCreated,
      document.data().rating,
      document.data().content,
      document.data().likes,
  ));
}
