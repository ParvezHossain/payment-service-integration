const shift4Service = require("../services/shift4Service");
const aciService = require("../services/aciService");
const apiResponse = require("../utils/apiResponse");
const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");
const Joi = require('joi');

class PaymentController {
  async processShift4Payment(req, res) {
    try {
      const paymentData = req.body;
      const result = await shift4Service.processPayment(paymentData);
      const payment_type = "SHIFT4";
      let details = {};
      if (result) {
        details = {
          tnx_id: result.id,
          created_at: result.created,
          amount: result.amount,
          currency: result.currency,
          card_bin: result.card.first6,
        };
      }

      // Generate a unique custom_tnx_id using uuid
      const custom_tnx_id = uuidv4();
      db.run(
        "INSERT INTO records (custom_tnx_id, tnx_id, payment_type) VALUES (?, ?, ?)",
        [custom_tnx_id, details.tnx_id, payment_type],
        function (err) {
          if (err) {
            console.log("Failed to insert");
          } else {
            console.log("Inserted new records into database");
          }
        }
      );

      res.json(apiResponse.success("Payment processed successfully", details));
    } catch (error) {
      res.status(500).json(apiResponse.error(error.message));
    }
  }

  async processAciPayment(req, res) {
    try {
      const paymentData = req.body;
      const result = await aciService.processPayment(paymentData);

      // Generate a unique custom_tnx_id using uuid
      const custom_tnx_id = uuidv4();
      db.run(
        "INSERT INTO records (custom_tnx_id, tnx_id, payment_type) VALUES (?, ?, ?)",
        [custom_tnx_id, details.tnx_id, payment_type],
        function (err) {
          if (err) {
            console.log("Failed to insert");
          } else {
            console.log("Inserted new records into database");
          }
        }
      );

      res.json(apiResponse.success("Payment processed successfully", result));
    } catch (error) {
      res.status(500).json(apiResponse.error(error.message));
    }
  }

  async getPaymentStatus(req, res) {
    try {
      const testTnxId = req.params.id;

      // Validate the testTnxId parameter
      const schema = Joi.object({
        id: Joi.string().trim().required().messages({
          "string.empty": "Transaction ID cannot be empty",
          "any.required": "Transaction ID is required",
        }),
      });

      const { error, value } = schema.validate({ id: req.params.id });

      if (error) {
        return res
          .status(400)
          .json(apiResponse.error(error.details[0].message));
      }

      // Wrap the database call in a Promise to handle async/await
      const record = await new Promise((resolve, reject) => {
        db.get(
          "SELECT * FROM records WHERE custom_tnx_id = ?;",
          [testTnxId],
          function (err, row) {
            if (err) {
              console.log("Database error:", err.message);
              reject(err);
            } else if (row) {
              console.log("Record found:", row);
              resolve(row);
            } else {
              console.log("No record found.");
              resolve(null);
            }
          }
        );
      });

      // If no record found, return a 404 response
      if (!record) {
        return res.status(404).json(apiResponse.error("Record not found"));
      }
      const paymentType = record.payment_type;
      const transactionId = record.tnx_id;

      // Call the appropriate paymentStatus function based on paymentType
      let result;
      if (paymentType === "SHIFT4") {
        result = await shift4Service.paymentStatus({ transactionId });
      } else if (paymentType === "ACI") {
        result = await aciService.paymentStatus({ transactionId });
      } else {
        return res
          .status(400)
          .json(apiResponse.error("Unsupported payment type"));
      }

      // Return the result from the payment status service
      res.json(
        apiResponse.success("Payment status retrieved successfully", result)
      );
    } catch (error) {
      res.status(500).json(apiResponse.error(error.message));
    }
  }
}

module.exports = new PaymentController();
