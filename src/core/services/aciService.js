const axios = require("axios");
const logger = require("../../config/logger");
const transactionService = require("./transactionService");
const { v4: uuidv4 } = require("uuid");
const PaymentResponseDTO = require("../../dto/paymentResponseDTO");
const PyamentStatusDTO = require("../../dto/paymentStatusDTO");

class AciService {
  constructor() {
    this.baseUrl = "https://eu-test.oppwa.com/v1";
  }
  async processPayment({
    amount,
    currency,
    cardNumber,
    expMonth,
    expYear,
    cvv,
  }) {
    const data = new URLSearchParams({
      entityId: process.env.ACI_ENTITY_ID,
      amount: `${amount}`,
      currency: currency,
      paymentBrand: "VISA",
      paymentType: "DB",
      "card.number": cardNumber,
      "card.holder": "Jane Jones",
      "card.expiryMonth": expMonth,
      "card.expiryYear": expYear,
      "card.cvv": cvv,
    });

    const response = await axios.post(`${this.baseUrl}/payments`, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${process.env.ACI_API_KEY}`,
      },
    });

    const result = response.data;

    // Generate a unique custom_tnx_id using uuid
    const custom_tnx_id = uuidv4();

    const paymentsResponse = new PaymentResponseDTO(
      custom_tnx_id,
      result.id,
      result.amount,
      result.currency,
      result.card.bin,
      result.timestamp
    );

    await transactionService.saveTransaction(paymentsResponse, "ACI");

    return paymentsResponse;
  }
  async paymentStatus(transaction) {
    const { custom_tnx_id, tnx_details } = transaction;
    const details = JSON.parse(tnx_details);
    return new PyamentStatusDTO(
      "successfull",
      custom_tnx_id,
      details?.amount,
      details?.currency,
      details?.card_bin
    );
  }
}

module.exports = new AciService();
