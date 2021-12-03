const { Genre } = require("../models/Genre");
const {
  genrePostVerifier: postVerifier,
  genrePutVerifier: putVerifier,
} = require("../verifiers");

exports.index = async (req, res) => {
  const genres = await Genre.find().select("-__v");

  if (!genres.length) return res.send("We're currently out of genres");
  res.send(genres);
};

exports.register = async (req, res) => {
  const { error } = postVerifier(req.body);

  if (error) {
    let errors = "Atention!\n";
    for (const detail of error.details) {
      errors = `${errors + detail.message}\n`;
    }
    console.log("Entrei aqui no erro do JOI");
    return res.status(400).send(errors);
  }

  const genre = await Genre.create({
    name: req.body.name,
    movies: req.body.movies,
    isSafe: req.body.isSafe,
  });
  res.send(genre);
};

exports.edit = async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send("Genre not found");

  const { error } = putVerifier(req.body);
  if (error) {
    let errors = "Atention!\n";
    for (const detail of error.details) {
      errors = `${errors + detail.message}\n`;
    }
    return res.status(400).send(errors);
  }

  const genreUpdated = await Genre.findOneAndUpdate(
    { _id: req.params.id },
    {
      name: req.body.name ? req.body.name : genre.name,
      movies:
        req.body.movies !== undefined ? req.body.movies : "genre".movies,
      isSafe: req.body.isSafe ? req.body.isSafe : genre.isSafe,
    },
    { returnDocument: "after" }
  ).select("-__v");

  res.send(genreUpdated);
};

exports.delete = async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id).select("-__v");

  if (!genre) return res.status(404).send("Genre not found");

  res.send(genre);
};

exports.showOne = async (req, res) => {
  const genre = await Genre.findById(req.params.id).select("-__v");

  if (!genre) return res.status(404).send("Genre not found");

  res.send(genre);
};
