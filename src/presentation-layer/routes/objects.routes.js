const objectsController = require("../controllers/objects.controller");

module.exports = function(app) {
  app.get("/api/objects/", objectsController.getObjects);
  app.patch("/api/objects/", objectsController.updateObject);
  app.delete("/api/objects/", objectsController.removeObject);
  app.post("/api/objects/", objectsController.addObject);
};