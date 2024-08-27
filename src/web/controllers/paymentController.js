const apiResponse = require("../../utils/apiResponse");
const PaymentRequestDTO = require("../../dto/paymentRequestDTO");
const transactionService = require("../../core/services/transactionService");
const {
  PaymentServiceFactory,
} = require("../../core/services/paymentServiceFactory");

class PaymentController {
  //shift4 payment handler
  async processShift4Payment(req, res) {
    const { amount, currency, cardNumber, expMonth, expYear, cvv } = req.body;
    const paymentData = new PaymentRequestDTO(
      amount,
      currency,
      cardNumber,
      expMonth,
      expYear,
      cvv
    );
    const shift4Service = PaymentServiceFactory.getService("shift4");

    if (!shift4Service) throw new Error("Invalid payment service type");

    const paymentsResponse = await shift4Service.processPayment(paymentData);

    res.json(
      apiResponse.success(
        "SHIFT4 Payment processed successfully",
        paymentsResponse
      )
    );
  }

  //aci payment handler
  async processAciPayment(req, res) {
    const { amount, currency, cardNumber, expMonth, expYear, cvv } = req.body;

    const paymentData = new PaymentRequestDTO(
      amount,
      currency,
      cardNumber,
      expMonth,
      expYear,
      cvv
    );

    const aciService = PaymentServiceFactory.getService("aci");

    if (!aciService) throw new Error("Invalid payment service type");

    const paymentsResponse = await aciService.processPayment(paymentData);

    res.json(
      apiResponse.success(
        "ACI Payment processed successfully",
        paymentsResponse
      )
    );
  }

  //payment status handler
  async getPaymentStatus(req, res) {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json(
          apiResponse.error("Bad request. Please provide a transaction ID.")
        );
    }

    const transaction = await transactionService.getTransactionById(id);

    if (!transaction) {
      return res
        .status(404)
        .json(apiResponse.error(`No transaction found for ID: ${id}`));
    }

    const { payment_type } = transaction;

    const paymentService = PaymentServiceFactory.getService(payment_type);

    if (!paymentService) {
      return res.status(400).json(apiResponse.error("Invalid payment type"));
    }

    const paymentStatus = await paymentService.paymentStatus(transaction);
    return res.json(
      apiResponse.success(
        "Payment status retrieved successfully",
        paymentStatus
      )
    );
  }
}

module.exports = new PaymentController();
