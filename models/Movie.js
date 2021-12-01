const mongoose = require("mongoose");
const { genreSchema } = require("../models/Genre");

const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      minLenght: 3,
      maxLength: 50,
      lowercase: true,
      trim: true,
    },
    genre: {
      type: genreSchema,
      require: true,
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 500,
      set: (v) => Math.floor(v),
      get: (v) => Math.floor(v),
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 0,
      max: 500,
    },
  })
);

module.exports = Movie;
