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

    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send("Invalid email or password.");

    if (!await bcryptjs.compare(req.body.password, user.password))
      return res.status(401).send("Invalid password.");

    const token = user.generateAuthToken();
    if (!token) return res.status(500).send('Could not generate token.');

    res.send(token);
};
