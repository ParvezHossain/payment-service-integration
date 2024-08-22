const axios = require("axios");
const formatDate = require("../utils/transformDate");

class Shift4Service {
  async processPayment({
    amount,
    currency,
    cardNumber,
    expMonth,
    expYear,
    cvv,
  }) {
    try {
      const response = await axios.post(
        "https://api.shift4.com/charges",
        {
          amount,
          currency,
          card: {
            number: cardNumber,
            expMonth: expMonth,
            expYear: expYear,
            cvc: cvv,
          },
        },
        {
          auth: {
            username: process.env.SHIFT4_API_KEY,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async paymentStatus({ transactionId }) {
    try {
      const response = await axios.get(
        `https://api.shift4.com/charges/${transactionId}`, // Full URL
        {
          auth: {
            username: process.env.SHIFT4_API_KEY,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return {
        transaction_id: response.data.id,
        created_at: formatDate(response.data.created),
        amount: response.data.amount,
        currency: response.data.currency,
        card_bin: response.data.card.first6,
      };
    } catch (error) {
      logger.error(
        `Error fetching payment status: ${
          error.response?.data || error.message
        }`
      );
      throw new Error(
        `Error fetching payment status: ${
          error.response?.data || error.message
        }`
      );
    }
  }
}

module.exports = new Shift4Service();
