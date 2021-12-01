const mongoose = require('mongoose');
const Customer = require('./Customer');

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
  checkOutDate: {
    type: Date,
    default: Date.now,
  },
  devolutionDate: {
    type: Date,
    },
  paymentForm: {
    type: String,
    required: true,
    trim: true,
    min: 5,
    max: 255,
    enum: ['creditcard', 'money', 'crypto'],
  },
});

rentalSchema.pre('save', async function() {
  const isGold = await Customer.exists({ _id: this.customer, isGold: true });

  if (isGold) return this.devolutionDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90 );

  return this.devolutionDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 );
});

const Rental = mongoose.model('Rental', rentalSchema);

module.exports = Rental;
