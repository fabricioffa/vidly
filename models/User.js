const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLenght: 3,
    maxLength: 40,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    minLenght: 8,
    maxLenght: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLenght: 8,
    maxLenght: 255,
  },
})
);

module.exports = User;
