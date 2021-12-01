// const _ = require('lodash');
const bcryptjs = require('bcryptjs');
const User = require("../models/User");
const {
  userPostVerifier: postVerifier,
  userPutVerifier: putVerifier,
} = require("../verifiers");

exports.index = async (req, res) => {
  try {
    const users = await User.find().select("-__v");

    if (!users.length) return res.send("We're currently out of users");

    res.send(users);
  } catch (err) {
    console.log(err);
  }
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

  try {
    let {name, email, password} = req.body;

    const salt = await bcryptjs.genSalt(10);
    password = await bcryptjs.hash(password, salt);

    await User.create({name, email, password});

    res.send({name, email});
  } catch (err) {
    console.log(err);
  }
};

