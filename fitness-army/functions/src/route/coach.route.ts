const coachExpressServer = require("express");
const coachRouter = coachExpressServer.Router();
const coachController = require("../controller/coach.controller");

coachRouter.post("/api/coaches/create/:coach_id",
    coachController.postCreateCoach);

module.exports = coachRouter;
