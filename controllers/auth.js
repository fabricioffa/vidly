// const _ = require('lodash');
const bcryptjs = require('bcryptjs');
const User = require("../models/User");
const {
  userLoginVerifier: loginVerifier,
} = require("../verifiers");

exports.login = async (req, res) => {
  const { error } = loginVerifier(req.body);

  if (error) {
    let errors = "Atention!\n";
    for (const detail of error.details) {
      errors = `${errors + detail.message}\n`;
    }
    return res.status(400).send(errors);
  }

  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send("Invalid email or password.");

    if (!bcryptjs.compare(req.body.password, user.password))
      return res.status(401).send("Invalid password.");

    res.send(true)
  } catch (err) {
    console.log(err);
  }
};
