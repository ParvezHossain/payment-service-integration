const axios = require("axios");

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
      const response = await axios.post("https://api.aci.com/v1/payments", {
        amount,
        currency,
        card: {
          number: cardNumber,
          exp_month: expMonth,
          exp_year: expYear,
          cvv,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("ACI payment processing failed.");
    }
  }
}

module.exports = new AciService();

