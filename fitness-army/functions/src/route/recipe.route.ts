const recipeExpressServer = require("express");
const recipeRouter = recipeExpressServer.Router();

const recipeController = require("../controller/recipe.controller");

recipeRouter.post("/api/recipes/create",
  recipeController.postCreateRecipe);

module.exports = recipeRouter;
