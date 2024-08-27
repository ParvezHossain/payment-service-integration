const database = require("../../config/database");

module.exports = class Transaction {
  static db = database;
  static table = "records";

  constructor(custom_tnx_id, tnx_id, payment_type, tnx_details) {
    this.custom_tnx_id = custom_tnx_id;
    this.tnx_id = tnx_id;
    this.payment_type = payment_type;
    this.tnx_details = tnx_details;
  }

  async save() {
    return new Promise((resovle, reject) => {
      this.constructor.db.run(
        `INSERT INTO ${this.constructor.table} (custom_tnx_id, tnx_id, payment_type, tnx_details) VALUES (?, ?, ?, ?)`,
        [this.custom_tnx_id, this.tnx_id, this.payment_type, this.tnx_details],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resovle(true);
          }
        }
      );
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      this.constructor.db.get(
        `SELECT * FROM ${this.constructor.table} WHERE custom_tnx_id = ?;`,
        [id],
        function (err, row) {
          if (err) {
            reject(err);
          } else if (row) {
            const transaction = new Transaction(
              row.custom_tnx_id,
              row.tnx_id,
              row.payment_type,
              row.tnx_details
            );
            resolve(transaction);
          } else {
            resolve(null);
          }
        }
      );
    });
  }
};
