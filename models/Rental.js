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

// rentalSchema.pre('save', async function() {
//   const isGold = await Customer.exists({ _id: this.customer, isGold: true });

//   if (isGold) return this.devolutionDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90 );

//   return this.devolutionDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 );
// });

const Rental = mongoose.model('Rental', rentalSchema);

module.exports = Rental;
