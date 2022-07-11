const userExpressServer = require("express");

const router = userExpressServer.Router();

const userController = require("../controller/user-controller");

router.post("/api/users/create",
    // isAuthenticated,
    // isAuthorized,
    userController.postCreateUser);

router.get("/api/users/:user_id",
    // isAuthenticated,
    // isAuthorized,
    userController.getUserById
);

router.put("/api/users/update-user/:user_id",
    // isAuthenticated,
    // isAuthorized,
    userController.postUpdateUser
);

router.delete("/api/users/delete/:user_id",
    // isAuthenticated,
    // isAuthorized,
    userController.postDeleteUser
);

router.get("/api/users",
    // isAuthenticated,
    // isAuthorized,
    userController.getAllUsers
);


module.exports = router;
