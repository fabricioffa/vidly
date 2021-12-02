const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const routes = require("./routes");
const app = express();

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined!');
  console.log(config.get('jwtPrivateKey'));
  process.exit(1);
}

mongoose.connect('mongodb://localhost:27017/vidly')
  .then(() => app.emit('connected'))
  .catch((err) => console.log(err))

app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(routes)


if (app.get("env") === "development") app.use(morgan("tiny"));

//  Configuration
console.log(`Aplication name: ${config.get("name")}`);
console.log(`Aplication default port: ${config.get("default port")}`);

const port = process.env.PORT || 3333;
app.on('connected', () => {
  app.listen(port, () => console.log(`Listening on port ${port}`));
})
