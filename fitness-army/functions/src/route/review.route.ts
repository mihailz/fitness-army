const reviewExpressServer = require("express");
const reviewRouter = reviewExpressServer.Router();

const reviewController = require("../controller/review.controller");

reviewRouter.post("/api/recipes/:recipe_id/reviews/create",
    reviewController.postCreateReview);

reviewRouter.get("/api/recipes/:recipe_id/reviews",
    reviewController.getRecipeReviews);

module.exports = reviewRouter;
