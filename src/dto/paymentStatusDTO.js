module.exports = class PyamentStatusDTO {
  constructor(status, transaction_id, amount, currency, card_bin) {
    this.status = status;
    this.transaction_id = transaction_id;
    this.amount = amount;
    this.card_bin = card_bin;
    this.currency = currency;
  }
};
