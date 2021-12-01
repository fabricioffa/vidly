const router = require("express").Router();
const { Genre } = require("../models/Genre");
const {
  genrePostVerifier: postVerifier,
  genrePutVerifier: putVerifier,
} = require("../verifiers");

router.get("/", async (req, res) => {
  try {
    const genres = await Genre.find().select("-__v");

    if (!genres.length) return res.send("We're currently out of genres");

    res.send(genres);
  } catch (err) {
    console.log(err);
  }
});

router.post("/", async (req, res) => {
  const { error } = postVerifier(req.body);

  if (error) {
    let errors = "Atention!\n";
    for (const detail of error.details) {
      errors = `${errors + detail.message}\n`;
    }
    return res.status(400).send(errors);
  }

  try {
    const genre = await Genre.create({
      name: req.body.name,
      movies: req.body.movies,
      isSafe: req.body.isSafe,
    });

    res.send(genre);
  } catch (err) {
    console.log(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (!(await Genre.exists({ _id: req.params.id })))
      return res.status(404).send("Genre not found");

    const { error } = putVerifier(req.body);
    if (error) {
      let errors = "Atention!\n";
      for (const detail of error.details) {
        errors = `${errors + detail.message}\n`;
      }
      return res.status(400).send(errors);
    }

    const genre = await Genre.findOneAndUpdate(
      { _id: req.params.id },
      {
        name: req.body.name ? req.body.name : genre.name,
        movies:
          req.body.movies !== undefined ? req.body.movies : "genre".movies,
        isSafe: req.body.isSafe ? req.body.isSafe : genre.isSafe,
      },
      { returnDocument: "after" }
    ).select("-__v");

    res.send(genre);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const genre = await Genre.findByIdAndRemove(req.params.id).select("-__v");

    if (!genre) return res.status(404).send("Genre not found");

    res.send(genre);
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id).select("-__v");

    if (!genre) return res.status(404).send("Genre not found");

    res.send(genre);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
