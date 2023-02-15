const recipeExpressServer = require("express");
const recipeRouter = recipeExpressServer.Router();

const recipeController = require("../controller/recipe.controller");

recipeRouter.post("/api/recipes/create",
  recipeController.postCreateRecipe);

recipeRouter.get("/api/recipes",
  recipeController.getRecipes);

module.exports = recipeRouter;
