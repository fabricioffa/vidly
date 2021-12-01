const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi); // or /^[0-9a-fA-F]{24}$/

exports.genrePostVerifier = (body) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(20).required().pattern(/\d/, { name: 'no numbers allowed', invert: true }),
    movies: Joi.number().integer().positive().min(1).max(500).required(),
    isSafe: Joi.boolean().required(),
  });

  return schema.validate(body, { convert: false, abortEarly: false });
};

exports.genrePutVerifier = (body) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(20).pattern(/\d/, { name: 'no numbers allowed', invert: true }),
    movies: Joi.number().integer().min(1).max(500).positive(),
    isSafe: Joi.boolean(),
  });

  return schema.validate(body, { convert: false, abortEarly: false });
};

exports.customerPostVerifier = (body) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).trim().pattern(/\d/, { name: 'no numbers allowed', invert: true }).required(),
    phone: Joi.string()
      .min(10)
      .max(18)
      .trim()
      .pattern(/^\+\d+$/, 'phone format')
      .required(),
    isGold: Joi.boolean().required(),
  });

  return schema.validate(body, { abortEarly: false });
};

exports.customerPutVerifier = (body) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).trim().pattern(/\d/, { name: 'no numbers allowed', invert: true }),
    phone: Joi.string()
      .min(10)
      .max(18)
      .trim()
      .pattern(/^\+\d+$/, 'phone format'),
    isGold: Joi.boolean(),
  });

  return schema.validate(body, { abortEarly: false });
};

exports.moviePostVerifier = (body) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).lowercase().trim().required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().integer().min(0).max(500).positive().required(),
    dailyRentalRate: Joi.number().integer().min(0).max(500).positive().required(),
  });

  return schema.validate(body, { abortEarly: false });
};

exports.moviePutVerifier = (body) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).lowercase().trim(),
    genreId: Joi.objectId(),
    numberInStock: Joi.number().integer().min(0).max(500).positive(),
    dailyRentalRate: Joi.number().integer().min(0).max(500).positive(),
  });

  return schema.validate(body, { abortEarly: false });
};

exports.rentalPostVerifier = (body) => {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
    paymentForm: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(body, { abortEarly: false });
};

exports.rentalPutVerifier = (body) => {
  const schema = Joi.object({
    customerId: Joi.objectId(),
    movieId: Joi.objectId(),
    paymentForm: Joi.string().min(5).max(255).valid('creditcard', 'money', 'crypto'),
  });

  return schema.validate(body, { abortEarly: false });
};

exports.userPostVerifier = (body) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(40).lowercase().trim().required(),
    email: Joi.string().min(8).max(50).email().required(),
    password: Joi.string().min(8).max(255).required(),
  });

  return schema.validate(body, { abortEarly: false });
};

exports.userPutVerifier = (body) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(40).lowercase().trim(),
    email: Joi.string().min(8).max(255).email(),
    password: Joi.string().min(8).max(255),
  });

  return schema.validate(body, { abortEarly: false });
};

exports.userLoginVerifier = (body) => {
  const schema = Joi.object({
    email: Joi.string().min(8).max(50).email().required(),
    password: Joi.string().min(8).max(255).required(),
  });

  return schema.validate(body, { abortEarly: false });
};

