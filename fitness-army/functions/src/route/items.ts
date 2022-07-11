const itemsExpressServer = require("express");
const itemsRouter = itemsExpressServer.Router();
const itemsController = require("../controller/items.controller");

itemsRouter.post("/api/create-item", itemsController.postItem);
itemsRouter.get("/api/read-items/:item_id", itemsController.getItemById);
itemsRouter.put("/api/update/:item_id", itemsController.updateItem);
itemsRouter.delete("/api/delete/:item_id", itemsController.deleteItem);
itemsRouter.get("/api/read-items", itemsController.getItems);

module.exports = itemsRouter;
