const axios = require("axios");
const formatDate = require("../../utils/transformDate");
const transactionService = require("./transactionService");
const { v4: uuidv4 } = require("uuid");
const PaymentResponseDTO = require("../../dto/paymentResponseDTO");
const logger = require("../../config/logger");
const PyamentStatusDTO = require("../../dto/paymentStatusDTO");

class Shift4Service {
  constructor() {
    this.baseUrl = "https://api.shift4.com";
  }
  async processPayment({
    amount,
    currency,
    cardNumber,
    expMonth,
    expYear,
    cvv,
  }) {
    const response = await axios.post(
      `${this.baseUrl}/charges`,
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

    const result = response.data;

    // Generate a unique custom_tnx_id using uuid
    const custom_tnx_id = uuidv4();

    const paymentsResponse = new PaymentResponseDTO(
      custom_tnx_id,
      result.id,
      `${result.amount}`,
      result.currency,
      result.card.first6,
      formatDate(result.created)
    );

    await transactionService.saveTransaction(paymentsResponse, "SHIFT4");

    return paymentsResponse;
  }

  async paymentStatus(transaction) {
    const { custom_tnx_id, tnx_id } = transaction;

    const response = await axios.get(
      `${this.baseUrl}/charges/${tnx_id}`, // Full URL
      {
        auth: {
          username: process.env.SHIFT4_API_KEY,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const { data } = response;
    return new PyamentStatusDTO(
      data.status,
      custom_tnx_id,
      data.amount,
      data.currency,
      data.card.first6
    );
  }
}

module.exports = new Shift4Service();
