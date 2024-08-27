module.exports = class PaymentDTO {
    constructor(amount, currency, cardNumber, expMonth, expYear, cvv) {
      this.amount = amount;
      this.currency = currency;
      this.cardNumber = cardNumber;
      this.expMonth = expMonth;
      this.expYear = expYear;
      this.cvv = cvv;
    }
  };
  