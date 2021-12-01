const router = require("express").Router();
const Rental = require("../models/Rental");
const Customer = require('../models/Customer');
const Movie = require('../models/Movie');
const {
  rentalPostVerifier: postVerifier,
  rentalPutVerifier: putVerifier,
} = require("../verifiers");

router.get("/", async (req, res) => {
  try {
    const rentals = await Rental.find().select("-__v");

    if (!rentals.length) return res.send("We're currently out of rentals");

    res.send(rentals);
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
    if (!await Customer.exists({ _id: req.body.customerId })) return res.status(400).send("Id doesn't match any customer.");

    if (!await Movie.exists({ _id: req.body.movieId })) return res.status(400).send("Id doesn't match any movie.");

    const rental = await Rental.create({
      customer: req.body.customerId,
      movie: req.body.movieId,
      paymentForm: req.body.paymentForm,
    });

    res.send(rental);
  } catch (err) {
    console.log(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!movie) return res.status(404).send("Movie not found.");

    const { error } = putVerifier(req.body);
    if (error) {
      let errors = "Atention!\n";
      for (const detail of error.details) {
        errors = `${errors + detail.message}\n`;
      }
      return res.status(400).send(errors);
    }

    if (!await Customer.exists({ _id: req.body.customerId || rental.customer })) return res.status(400).send("Id doesn't match any customer.");

    if (!await Movie.exists({ _id: req.body.movieId || rental.movie })) return res.status(400).send("Id doesn't match any movie.");

    const updatedRental = await Rental.findOneAndUpdate(
      { _id: req.params.id },
      {
        customer: req.body.customerId ? req.body.customerId : rental.customer,
        movie: req.body.movieId ? req.body.movieId : rental.movie,
        paymentForm: req.body.paymentForm
          ? req.body.paymentForm
          : rental.movie,
      },
      { returnDocument: "after" },
    ).select("-__v");

    res.send(updatedRental);
  } catch (err) {
    console.log( err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const rental = await Rental.findByIdAndRemove(req.params.id).select("-__v");

    if (!rental) return res.status(404).send("Rental not found");

    res.send(rental);
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id).select("-__v");

    if (!rental) return res.status(404).send("Rental not found");

    res.send(rental);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
