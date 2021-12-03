const jwt = require('jsonwebtoken');
const config = require('config');
const winston = require('winston');

exports.authUser = (req, res, next) => {
  const token = req.header('x-auth-token')
  if (!token) return res.status(401).send('Access denied: no token provided');

  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    next();
  }
  catch (err) {
    return res.status(400).send('Access denied: invalid token.')
  }
}

exports.isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) return res.status(403).send('Access denied.');
  next();
};

exports.errorHandler = (err, req, res, next) => {
  winston.error(err.message, err);
  if (err) return res.status(500).send('Something occurred!');
};

exports.apllyTryCatch = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (err) {
      next(err);
    }
  };
};

