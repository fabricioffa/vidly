const Joi = require("joi");

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
    title: Joi.string().min(3).max(20).lowercase().trim().required(),
    genreId: Joi.string().alphanum().trim().required(),
    numberInStock: Joi.number().integer().min(0).max(500).positive().required(),
    dailyRentalRate: Joi.number().integer().min(0).max(500).positive().required(),
  });

  return schema.validate(body, { abortEarly: false });
}

exports.moviePutVerifier = (body) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(20).lowercase().trim(),
    genreId: Joi.string().alphanum().trim(),
    numberInStock: Joi.number().integer().min(0).max(500).positive(),
    dailyRentalRate: Joi.number().integer().min(0).max(500).positive(),
  });

  return schema.validate(body, { abortEarly: false });
}

exports.rentalPostVerifier = (body) => {
  const schema = Joi.object({
    costumerId: Joi.string().alphanum().trim().required(),
    movieId: Joi.string().alphanum().trim().required(),
    paymentForm: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(body, { abortEarly: false });
}

exports.rentalPostVerifier = (body) => {
  const schema = Joi.object({
    customerId: Joi.string().alphanum().trim().required(),
    movieId: Joi.string().alphanum().trim().required(),
    paymentForm: Joi.string().min(5).max(255).valid('creditcard', 'money', 'crypto').required(),
  });

  return schema.validate(body, { abortEarly: false });
}
