const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const routes = require("./routes");
// const homeRouter = require("./routes/home");
// const genresRouter = require("./routes/genres");
// const moviesRouter = require("./routes/movies");
// const customersRouter = require("./routes/customers");
// const rentalsRouter = require("./routes/rentals");
const app = express();

mongoose.connect('mongodb://localhost:27017/vidly')
  .then(() => app.emit('connected'))
  .catch((err) => console.log(err))

app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(routes)
// app.use("/", homeRouter);
// app.use("/api/genres", genresRouter);
// app.use("/api/customers", customersRouter);
// app.use("/api/movies", moviesRouter);
// app.use("/api/rentals", rentalsRouter);

if (app.get("env") === "development") app.use(morgan("tiny"));

//  Configuration
console.log(`Aplication name: ${config.get("name")}`);
console.log(`Aplication default port: ${config.get("default port")}`);

const port = process.env.PORT || 3333;
app.on('connected', () => {
  app.listen(port, () => console.log(`Listening on port ${port}`));
})
