import {Request, Response} from "express";

const firebaseAdmin = require("firebase-admin");

const uuid = require("uuid");

const db = firebaseAdmin.firestore();

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

  // exports.getRecipes = (req: Request, res: Response) => {
  //   (async () => {
  //     try {
  //       const recipesCollection = db.collection("recipes");
  //       const recipeType = req.query.type;
  //       const searchString = req.query.searchString;
  //       let recipes = [];
  //       const blogsSnapshot =
  //         (recipeType && recipeType.length !== 0) ?
  //           await recipesCollection.where("type", "==", recipeType).get() :
  //           await recipesCollection.get();
  //       recipes = blogsSnapshot.docs;
  //       const filteredRecipes = (searchString && searchString.length !== 0) ?
  //         recipes.filter((recipe: any) =>
  //           recipe.name.toLowerCase()
  //               .includes(searchString.toString().toLowerCase())) : recipes;
  //       return res.status(200).send({
  //         data: filteredRecipes,
  //       });
  //     } catch (error) {
  //       console.log(error);
  //       return res.status(500).send(error);
  //     }
  //   })();
  // };
};
