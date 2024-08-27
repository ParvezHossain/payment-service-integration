const Joi = require("joi");
const paymentValidation = require("../../core/validations/payment");

// Middleware to validate the request body
const validatePaymentInput = (req, res, next) => {
  const { error } = paymentValidation.validate(req.body);

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
