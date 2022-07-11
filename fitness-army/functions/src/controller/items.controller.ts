import {Request, Response} from "express";

const admin = require("firebase-admin");

const db = admin.firestore();

// Create an item
exports.postItem = (req: Request, res: Response) => {
  (async () => {
    try {
      const collection = db.collection("items").doc(`/${req.body.id}/`);
      await collection.create({
        item: req.body.item,
      });
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
};

// Get item by id
exports.getItemById = (req: Request, res: Response) => {
  (async () => {
    try {
      // Here we get a reference to the document at the specified path
      const document = db.collection("items").doc(req.params.item_id);
      // Get the document snapshot that contains the whole document(returns promise
      // we need to await for the response)
      const item = await document.get();
      // Get the document data
      const response = item.data();
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
};

// Get all items
exports.getItems = (req: Request, res: Response) => {
  (async () => {
    try {
      const documentsCollection = db.collection("items");
      const response: { id: number; item: any; }[] = [];
      await documentsCollection.get()
          .then((documentsSnapshot: any) => {
            const documents = documentsSnapshot.docs;
            for (const document of documents) {
              response.push({
                id: document.id,
                item: document.data().item,
              });
            }
          });
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
};

// Update item
exports.updateItem = (req: Request, res: Response) => {
  (async () => {
    try {
      const document = db.collection("items").doc(req.params.item_id);
      await document.update({
        item: req.body.item,
      });
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
};

// Delete item
exports.deleteItem = (req: Request, res: Response) => {
  (async () => {
    try {
      const document = db.collection("items").doc(req.params.item_id);
      await document.delete();

      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
};
