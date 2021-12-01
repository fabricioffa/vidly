const Movie = require("../models/Movie");
const { Genre } = require("../models/Genre");
const {
  moviePostVerifier: postVerifier,
  moviePutVerifier: putVerifier,
} = require("../verifiers");

exports.index = async (req, res) => {
  try {
    const movies = await Movie.find().select("-__v");

    if (!movies.length) return res.send("We're currently out of movies");

    res.send(movies);
  } catch (err) {
    console.log(err);
  }
};

exports.register = async (req, res) => {
  const { error } = postVerifier(req.body);

  if (error) {
    let errors = "Atention!\n";
    for (const detail of error.details) {
      errors = `${errors + detail.message}\n`;
    }
    return res.status(400).send(errors);
  }

  try {
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Id doesn't match any genre.");

    const movie = await Movie.create({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
        movies: genre.movies + 1,
        isSafe: genre.isSafe,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    });

    res.send(movie);
  } catch (err) {
    console.log(err);
  }
};

exports.edit = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send("Movie not found.");

    const { error } = putVerifier(req.body);
    if (error) {
      let errors = "Atention!\n";
      for (const detail of error.details) {
        errors = `${errors + detail.message}\n`;
      }
      return res.status(400).send(errors);
    }

    if (req.body.genreId) {
      if (!(await Genre.exists({ _id: req.body.genreId })))
        return res.status(400).send("Id doesn't match any genre.");
    }

    const genre = await Genre.findById(req.body.genreId || movie.genre._id)

    const updatedMovie = await Movie.findOneAndUpdate(
      { _id: req.params.id },
      {
        title: req.body.title ? req.body.title : movie.title,
        genre: { // Could have done: (genre: genre) for short
          _id: req.body.genreId ? req.body.genreId : genre._id,
          name: genre.name,
          movies: genre.movies,
          isSafe: genre.isSafe,
        },
        numberInStock: req.body.numberInStock
          ? req.body.numberInStock
          : movie.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
          ? req.body.dailyRentalRate
          : movie.dailyRentalRate,
      },
      { returnDocument: "after" },
    ).select("-__v");

    res.send(updatedMovie);
  } catch (err) {
    console.log( err);
  }
};

exports.delete = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndRemove(req.params.id).select("-__v");

    if (!movie) return res.status(404).send("Movie not found");

    res.send(movie);
  } catch (err) {
    console.log(err);
  }
};

exports.showOne = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).select("-__v");

    if (!movie) return res.status(404).send("Movie not found");

    res.send(movie);
  } catch (err) {
    console.log(err);
  }
};
