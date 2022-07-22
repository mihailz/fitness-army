const userMeasurementsExpressServer = require("express");

const userBodyMeasurementsRouter = userMeasurementsExpressServer.Router();

const userMeasurementsController =
  require("../controller/user-measurements-controller");

userBodyMeasurementsRouter.post("/api/user-measurements/create/:user_id",
    userMeasurementsController.postCreateUserMeasurements);
userBodyMeasurementsRouter.get("/api/user-measurements/:user_id",
    userMeasurementsController.getUserMeasurements);
userBodyMeasurementsRouter.put("/api/user-measurements/update/:user_id",
    userMeasurementsController.postUpdateUserMeasurements);
userBodyMeasurementsRouter.delete("/api/measurements/delete/:user_id",
    userMeasurementsController.deleteUserMeasurements);

module.exports = userBodyMeasurementsRouter;
