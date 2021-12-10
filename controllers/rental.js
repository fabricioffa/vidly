const Rental = require("../models/Rental");
const Customer = require("../models/Customer");
const Movie = require("../models/Movie");

exports.index = async (req, res) => {
  const rentals = await Rental.find()
    .populate("customer movie", "name title -_id")
    .select("-__v");

  if (!rentals.length) return res.send("We're currently out of rentals");

  res.send(rentals);
};

exports.register = async (req, res) => {
  if (!(await Customer.exists({ _id: req.body.customerId })))
    return res.status(400).send("Id doesn't match any customer.");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Id doesn't match any movie.");

  const rental = await Rental.create({
    customer: req.body.customerId,
    movie: req.body.movieId,
    paymentForm: req.body.paymentForm,
  });

  movie.numberInStock--;
  movie.save();

  res.send(rental);
};

exports.edit = async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(404).send("Rental not found.");

  if (!(await Customer.exists({ _id: req.body.customerId || rental.customer })))
    return res.status(400).send("Id doesn't match any customer.");

  if (!(await Movie.exists({ _id: req.body.movieId || rental.movie })))
    return res.status(400).send("Id doesn't match any movie.");

  const updatedRental = await Rental.findOneAndUpdate(
    { _id: req.params.id },
    {
      customer: req.body.customerId ? req.body.customerId : rental.customer,
      movie: req.body.movieId ? req.body.movieId : rental.movie,
      paymentForm: req.body.paymentForm
        ? req.body.paymentForm
        : rental.paymentForm,
    },
    { returnDocument: "after" }
  )
    .populate("customer movie", "name title -_id")
    .select("-__v");

  res.send(updatedRental);
};

exports.delete = async (req, res) => {
  const rental = await Rental.findByIdAndRemove(req.params.id)
    .populate("customer movie", "name title -_id")
    .select("-__v");

  if (!rental) return res.status(404).send("Rental not found");

  res.send(rental);
};

exports.showOne = async (req, res) => {
  const rental = await Rental.findById(req.params.id)
    .populate("customer movie", "name title -_id")
    .select("-__v");

  if (!rental) return res.status(404).send("Rental not found");

  res.send(rental);
};
