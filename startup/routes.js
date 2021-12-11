const express = require("express");
const routes = require('../routes');
const { errorHandler } = require('../middlewares/middlewares');
const morgan = require("morgan");

module.exports = (app) => {
  if (app.get("env") === "development") app.use(morgan("tiny"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(routes);
  app.use(errorHandler);
};
