const express = require("express");
const objectsRoutesInit = require("./objects.routes");
const authRouteInit = require("./auth.routes");
const usersRouteInit = require("./users.routes");

const routeInit = (app, express) => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  usersRouteInit(app);
  objectsRoutesInit(app);
  authRouteInit(app);
};

module.exports = {
  routeInit
};
