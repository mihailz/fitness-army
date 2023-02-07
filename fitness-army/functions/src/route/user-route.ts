const userExpressServer = require("express");

const router = userExpressServer.Router();

const userController = require("../controller/user-controller");

router.post("/api/users/create",
    // isAuthenticated,
    // isAuthorized,
    userController.postCreateUser);

router.post("/api/users/:user_id/update",
    userController.postUpdateUserData
);

router.get("/api/users/:user_id",
    // isAuthenticated,
    // isAuthorized,
    userController.getUserById
);

router.get("/api/users/:user_id/role",
    userController.getUserRole
);

router.put("/api/users/:user_id/password-reset",
    // isAuthenticated,
    // isAuthorized,
    userController.postUpdateUserPassword
);

router.delete("/api/users/delete/:user_id",
    // isAuthenticated,
    // isAuthorized,
    userController.postDeleteUser
);

router.get("/api/users",
    // isAuthenticated,
    // isAuthorized,
    userController.getUsers
);

module.exports = router;
