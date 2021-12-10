const bcryptjs = require("bcryptjs");
const User = require("../models/User");

exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  if (!(await bcryptjs.compare(req.body.password, user.password)))
    return res.status(401).send("Invalid password.");

  const token = user.generateAuthToken();
  if (!token) return res.status(500).send("Could not generate token.");

  res.send(token);
};
