const Joi = require("joi");
const paymentSchema = Joi.object({
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).required(),
  cardNumber: Joi.string().creditCard().required(),
  expMonth: Joi.string().length(2).required(),
  expYear: Joi.string().length(4).required(),
  cvv: Joi.string().length(3).required(),
});

function validate(data) {
  return paymentSchema.validate(data, { abortEarly: false });
}

module.exports = { validate };
