const bcryptjs = require('bcryptjs');
const User = require("../models/User");
const {
  userPostVerifier: postVerifier,
  userPutVerifier: putVerifier,
} = require("../verifiers");

exports.index = async (req, res) => {
    const users = await User.find().select("-__v");

    if (!users.length) return res.send("We're currently out of users");

    res.send(users);
};

exports.register = async (req, res) => {
  const { error } = postVerifier(req.body);

  if (error) {
    let errors = "Atention!\n";
    for (const detail of error.details) {
      errors = `${errors + detail.message}\n`;
    }
    return res.status(400).send(errors);
  }

  if (await User.exists({ email: req.body.email })) return res.status(404).send('User already exists.');

    let { name, email, password, isAdmin = false } = req.body;

    const salt = await bcryptjs.genSalt(10);
    password = await bcryptjs.hash(password, salt);

    const user = await User.create({ name, email, password, isAdmin });
    const { _id } = user;

    const token = user.generateAuthToken();
    if (!token) return res.status(500).send('Could not generate token.');

    res.header('x-auth-token', token).send({ _id, name, email, isAdmin });
};

exports.currentUser = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -__v');
  res.send(user);
}
