const reviewExpressServer = require("express");
const reviewRouter = reviewExpressServer.Router();

const reviewController = require("../controller/review.controller");

reviewRouter.post("/api/recipes/:recipe_id/reviews/create",
    reviewController.postCreateReview);

reviewRouter.get("/api/recipes/:recipe_id/reviews",
    reviewController.getRecipeReviews);

reviewRouter.delete("/api/reviews/:review_id/delete",
    reviewController.deleteReview);

reviewRouter.delete("/api/recipes/:recipe_id/reviews/delete",
    reviewController.deleteRecipeReviews);

module.exports = reviewRouter;
