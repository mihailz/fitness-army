const recipeExpressServer = require("express");
const recipeRouter = recipeExpressServer.Router();

const recipeController = require("../controller/recipe.controller");

recipeRouter.post("/api/recipes/create",
    recipeController.postCreateRecipe);

recipeRouter.get("/api/recipes",
    recipeController.getRecipes);

recipeRouter.get("/api/recipes/:recipe_id",
    recipeController.getRecipe);

recipeRouter.put("/api/recipes/:recipe_id/update",
    recipeController.postUpdateRecipe);

module.exports = recipeRouter;
