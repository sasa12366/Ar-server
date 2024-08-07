const usersController = require("../controllers/users.controller");
const authJwt = require("../middleware/auth-jwt.middleware");

module.exports = function (app) {
  app.get(
    "/api/users/",
    [authJwt.verifyToken, authJwt.isUser],
    usersController.getUser
  );
  app.patch(
    "/api/users/",
    [authJwt.verifyToken, authJwt.isUser],
    usersController.updateUser
  );
  app.post(
    "/api/users/",
    [authJwt.verifyToken, authJwt.isUser],
    usersController.addUser
  );
};
