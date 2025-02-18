import {Request, Response} from "express";
import {RecipeModelDto} from "../model/recipe.model.dto";

const firebaseAdmin = require("firebase-admin");

const uuid = require("uuid");

const db = firebaseAdmin.firestore();

exports.getRecipes = (req: Request, res: Response) => {
  (async () => {
    try {
      const recipesCollection = db.collection("recipes");
      const recipeType = req.query.type;
      const searchString = req.query.searchString;
      let recipes: RecipeModelDto[] = [];
      const recipesSnapshot =
        (recipeType && recipeType.length !== 0) ?
          await recipesCollection.where("type", "==", recipeType)
              .get() :
          await recipesCollection.get();
      recipes = mapRecipesData(recipesSnapshot.docs);
      const filteredRecipes = (searchString && searchString.length !== 0) ?
        recipes.filter((recipe: RecipeModelDto) =>
          recipe.title.toLowerCase()
              .includes(searchString.toString().toLowerCase())) :
        recipes;
      console.log("recipes: ", filteredRecipes);
      return res.status(200).send({
        data: filteredRecipes,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
};

function mapRecipesData(documents: any): RecipeModelDto[] {
  return documents.map((document: any) => new RecipeModelDto(
      document.data().id,
      document.data().title,
      document.data().type,
      document.data().level,
      document.data().totalMinutesNeeded,
      document.data().preparationTime,
      document.data().cookTime,
      document.data().ingredients,
      document.data().steps,
      document.data().recipeImage,
      document.data().rating,
      document.data().servings,
      document.data().author,
      document.data().nutritionInfo
  ));
}

exports.postCreateRecipe = (req: Request, res: Response) => {
  (async () => {
    try {
      const recipeUid = uuid.v4();
      const recipe = {...req.body.recipe, id: recipeUid};
      await db.collection("recipes")
          .doc(recipeUid)
          .set(recipe, {merge: true});
      return res.status(200).send({
        recipe: recipe,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
};

exports.getRecipe = (req: Request, res: Response) => {
  (async () => {
    try {
      const recipeId = req.params.recipe_id;
      const recipeDocumentRef = await
      db.collection("recipes").doc(recipeId).get();
      const recipeData = recipeDocumentRef.data();
      return res.status(200).send({
        data: recipeData,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
};

exports.postUpdateRecipe = (req: Request, res: Response) => {
  (async () => {
    try {
      const recipeId = req.params.recipe_id;
      const updatedRecipe = {
        title: req.body.recipe.title,
        type: req.body.recipe.type,
        level: req.body.recipe.level,
        totalMinutesNeeded: req.body.recipe.totalMinutesNeeded,
        preparationTime: req.body.recipe.preparationTime,
        cookTime: req.body.recipe.cookTime,
        ingredients: req.body.recipe.ingredients,
        steps: req.body.recipe.steps,
        recipeImage: req.body.recipe.recipeImage,
        rating: req.body.recipe.rating,
        servings: req.body.recipe.servings,
        author: req.body.recipe.author,
        nutritionInfo: req.body.recipe.nutritionInfo,
      };
      await db.collection("recipes").doc(recipeId)
          .update(updatedRecipe);
      return res.status(200).send({
        recipe: updatedRecipe,
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  })();
};

exports.deleteRecipe = (req: Request, res: Response) => {
  (async () => {
    try {
      const recipeId = req.params.recipe_id;
      await db.collection("recipes").doc(recipeId)
          .delete();
      return res.status(200).send({
        message: "Recipe has been deleted",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
};
