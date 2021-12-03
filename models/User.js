const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
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
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  }
})

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
};

const User = mongoose.model('User', userSchema);



module.exports = User;
