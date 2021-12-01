const mongoose = require('mongoose');

const Customer = mongoose.model('Customer', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLenght: 3,
    maxLength: 30,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    minLenght: 10,
    maxLenght: 18,
    match: /^\+\d+$/
  },
  isGold: {
    type: Boolean,
    required: true,
  },
})
);

module.exports = Customer;
