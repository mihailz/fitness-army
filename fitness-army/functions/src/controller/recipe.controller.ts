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
      document.data().ingredients,
      document.data().steps,
      document.data().recipeImage,
      document.data().rating,
      document.data().author
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
