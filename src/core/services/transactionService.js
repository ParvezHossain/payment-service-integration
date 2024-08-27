const Transaction = require("../models/transaction");

class TransactionService {
  async saveTransaction(payment, payment_type) {
    const transaction = new Transaction(
      payment.custom_tnx_id,
      payment.tnx_id,
      payment_type,
      JSON.stringify(payment)
    );
    await transaction.save();
    return transaction;
  }

  async getTransactionById(id) {
    const tx = new Transaction();
    let transaction = await tx.getById(id);
    return transaction;
  }
}

module.exports = new TransactionService();
