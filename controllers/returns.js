const Rental = require("../models/Rental");
const Customer = require("../models/Customer");
const Movie = require("../models/Movie");
const {
  rentalPostVerifier: postVerifier,
  rentalPutVerifier: putVerifier,
} = require("../verifiers");

module.exports = async (req, res) => {
  const { error } = postVerifier(req.body);
  if (error) {
    let errors = "Atention!\n";
    for (const detail of error.details) {
      errors = `${errors + detail.message}\n`;
    }
    return res.status(400).send(errors);
  }

  const rental = await Rental.findOne({
    customer: req.body.customerId,
    movie: req.body.movieId,
  });
  if (!rental) return res.status(404).send("No rental matchs this combination");

  if (rental.devolutionDate)
    return res.status(400).send("Rental already returned");

  const {
    movie: { dailyRentalRate },
  } = await Rental.findOne({ movie: req.body.movieId })
    .populate({
      path: "movie",
      select: "dailyRentalRate -_id",
    })
    .select("movie -_id");

  rental.devolutionDate = Date.now();
  const rentingDays = Math.floor(
    (rental.devolutionDate - rental.dateOut) / (1000 * 60 * 60 * 24)
  );
  rental.rentalFee = rentingDays * dailyRentalRate;

  await Movie.findByIdAndUpdate(req.body.movieId, {
    $inc: { numberInStock: 1 },
  });

  await rental.save();

  res.status(200).send(rental);
};
