
const mongoose = require('mongoose');
const express = require("express");
const config = require("config");
const app = express();

require('./startup/loggings')();
require('./startup/routes')(app);
require('./startup/db')(app)
require('./startup/configSettings')();

const port = process.env.PORT || 3333;

if (app.get("env") === "development" || app.get("env") === "production") {
  app.on('connected', () => {
    app.listen(port, () => console.log(`Connected to ${config.get('db')}...`));
  })
}

module.exports = { app, conn: mongoose.connection };
