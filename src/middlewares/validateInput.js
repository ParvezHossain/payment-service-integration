const Joi = require("joi");

// Define the validation schema using Joi
const paymentSchema = Joi.object({
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).required(),
  cardNumber: Joi.string().creditCard().required(),
  expMonth: Joi.string().length(2).required(),
  expYear: Joi.string().length(4).required(),
  cvv: Joi.string().length(3).required(),
});

// Middleware to validate the request body
const validatePaymentInput = (req, res, next) => {
  const { error } = paymentSchema.validate(req.body, { abortEarly: false });

  if (error) {
    // Send a 400 Bad Request response with the validation error details
    return res.status(400).json({
      error: "Validation failed",
      details: error.details.map((detail) => detail.message),
    });
  }
  next();
};

module.exports = validatePaymentInput;
