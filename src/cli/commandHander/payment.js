const paymentValidator = require("../../core/validations/payment");
const PaymentRequestDTO = require("../../dto/paymentRequestDTO");
const transactionService = require("../../core/services/transactionService");
const {
  PaymentServiceFactory,
} = require("../../core/services/paymentServiceFactory");

class PaymentCommandHandler {
  async payment(options, gateway) {
    const { error, value: data } = paymentValidator.validate(options);
    if (error) throw error;

    const paymentService = PaymentServiceFactory.getService(gateway);

    if (!paymentService)
      throw new Error(
        "Invalid payment gateway, supported gateway [shift4, aci]"
      );

    const { amount, currency, cardNumber, expMonth, expYear, cvv } = data;

    const paymentData = new PaymentRequestDTO(
      amount,
      currency,
      cardNumber,
      expMonth,
      expYear,
      cvv
    );

    const paymentsResponse = await paymentService.processPayment(paymentData);

    return paymentsResponse;
  }
  async status(id) {
    if (!id) throw new Error("Please provide a transaction id");

    const transaction = await transactionService.getTransactionById(id);

    if (!transaction)
      throw new Error(`Sorry! no transaction found for id: ${id}`);

    const { payment_type } = transaction;

    const paymentService = PaymentServiceFactory.getService(payment_type);

    if (!paymentService)
      throw new Error(
        "Invalid payment type, supported payment type [shift4, aci]"
      );

    const paymentStatus = await paymentService.paymentStatus(transaction);
    return paymentStatus;
  }
}

module.exports = new PaymentCommandHandler();
