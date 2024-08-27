module.exports = class PaymentResponseDTO {
  constructor(custom_tnx_id, tnx_id, amount, currency, card_bin, created_at) {
    this.custom_tnx_id = custom_tnx_id;
    this.tnx_id = tnx_id;
    this.amount = amount;
    this.currency = currency;
    this.card_bin = card_bin;
    this.created_at = created_at;
  }
};
