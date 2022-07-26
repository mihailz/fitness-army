const userMeasurementsExpressServer = require("express");

const userBodyStatsRouter = userMeasurementsExpressServer.Router();

const userBodyStatsController =
  require("../controller/user-body-stats-controller");

userBodyStatsRouter.post("/api/body-stats/create/:user_id",
    userBodyStatsController.postCreateUserBodyStats);
userBodyStatsRouter.get("/api/body-stats/:user_id",
    userBodyStatsController.getUserBodyStats);
userBodyStatsRouter.put("/api/body-stats/update/:user_id",
    userBodyStatsController.postUpdateUserBodyStats);
userBodyStatsRouter.delete("/api/body-stats/delete/:user_id",
    userBodyStatsController.deleteUserBodyStats);

module.exports = userBodyStatsRouter;
