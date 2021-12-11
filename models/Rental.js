const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  customer: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'Customer',
  },
  movie: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'Movie',
  },
  dateOut: {
    type: Date,
    default: Date.now,
  },
  devolutionDate: {
    type: Date,
    },
  rentalFee: {
    type: Number,
    min: 5,
    max: 255,
  },
});

rentalSchema.methods.calcRentalFee = async function (movieId) {
  const {
    movie: { dailyRentalRate },
  } = await Rental.findOne({ movie: movieId })
    .populate({
      path: "movie",
      select: "dailyRentalRate -_id",
    })
    .select("movie -_id");

  this.devolutionDate = Date.now();
  
  const rentingDays = Math.floor(
    (this.devolutionDate - this.dateOut) / (1000 * 60 * 60 * 24)
  );
  this.rentalFee = rentingDays * dailyRentalRate;
};

// rentalSchema.pre('save', async function() {
//   const isGold = await Customer.exists({ _id: this.customer, isGold: true });

//   if (isGold) return this.devolutionDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90 );

//   return this.devolutionDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 );
// });

const Rental = mongoose.model('Rental', rentalSchema);

module.exports = Rental;
