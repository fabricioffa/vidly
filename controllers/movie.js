const Movie = require("../models/Movie");
const { Genre } = require("../models/Genre");

exports.index = async (req, res) => {
  const movies = await Movie.find().select("-__v");

  if (!movies.length) return res.send("We're currently out of movies");

  res.send(movies);
};

exports.register = async (req, res) => {
  const genre = await Genre.findByIdAndUpdate(req.body.genreId, {
    $inc: { movies: 1 },
  }).session(session);
  if (!genre) return res.status(400).send("Id doesn't match any genre.");

  const movie = await Movie.create({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
      movies: genre.movies,
      isSafe: genre.isSafe,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  res.send(movie);
};

exports.edit = async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send("Movie not found.");

  if (req.body.genreId) {
    if (!(await Genre.exists({ _id: req.body.genreId })))
      return res.status(400).send("Id doesn't match any genre.");
  }

  const genre = await Genre.findById(req.body.genreId || movie.genre._id);

  const updatedMovie = await Movie.findOneAndUpdate(
    { _id: req.params.id },
    {
      title: req.body.title ? req.body.title : movie.title,
      genre: {
        // Could have done: (genre: genre) for short
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
    { returnDocument: "after" }
  ).select("-__v");

  res.send(updatedMovie);
};

exports.delete = async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id).select("-__v");

  if (!movie) return res.status(404).send("Movie not found");

  res.send(movie);
};

exports.showOne = async (req, res) => {
  const movie = await Movie.findById(req.params.id).select("-__v");

  if (!movie) return res.status(404).send("Movie not found");

  res.send(movie);
};
