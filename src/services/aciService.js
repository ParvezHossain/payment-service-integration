const axios = require("axios");
const logger = require("../config/logger");

class AciService {
  async processPayment({
    amount,
    currency,
    cardNumber,
    expMonth,
    expYear,
    cvv,
  }) {
    try {
      const data = new URLSearchParams({
        entityId: process.env.ACI_ENTITY_ID,
        amount: amount.toString(),
        currency: currency,
        paymentBrand: "VISA",
        paymentType: "DB",
        "card.number": cardNumber,
        "card.holder": "Jane Jones",
        "card.expiryMonth": expMonth,
        "card.expiryYear": expYear,
        "card.cvv": cvv,
      });

      const response = await axios.post(
        "https://eu-test.oppwa.com/v1/payments",
        data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              `Bearer ${process.env.ACI_API_KEY}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      logger.error(error)
      throw new Error("ACI payment processing failed.");
    }
  }
}

module.exports = new AciService();
