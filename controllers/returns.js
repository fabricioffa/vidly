const Rental = require("../models/Rental");
const Customer = require("../models/Customer");
const Movie = require("../models/Movie");

module.exports = async (req, res) => {
  const rental = await Rental.findOne({
    customer: req.body.customerId,
    movie: req.body.movieId,
  });
  if (!rental) return res.status(404).send("No rental matchs this combination");

  if (rental.devolutionDate)
    return res.status(400).send("Rental already returned");

  rental.calcRentalFee(req.body.movieId);

  await Movie.findByIdAndUpdate(req.body.movieId, {
    $inc: { numberInStock: 1 },
  });

  await rental.save();

  res.send(rental);
};
