const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLenght: 3,
    maxLength: 20,
    lowercase: true,
    trim: true,
  },
  movies: {
    type: Number,
    required: true,
    min: 1,
    max: 500,
    set: (v) => Math.round(v),
    get: (v) => Math.round(v),
  },
  isSafe: {
    type: Boolean,
    required: true,
  },
})

const Genre = mongoose.model('Genre', genreSchema);

exports.Genre = Genre;
exports.genreSchema = genreSchema;
