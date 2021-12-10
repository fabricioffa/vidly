const mongoose = require("mongoose");
const config = require("config");

module.exports = (app) => {
  mongoose
    .connect(config.get("db"))
    .then(() => app.emit("connected"))
    .catch((err) => console.error("Connection error:\n", err));
};
