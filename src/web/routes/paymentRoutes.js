const express = require("express");
const paymentController = require("../controllers/paymentController");
const validateInput = require("../middlewares/validateInput");
const asyncHandler = require("../../utils/asyncHandler");

const router = express.Router();

router.post(
  "/shift4",
  validateInput,
  asyncHandler(paymentController.processShift4Payment)
);

router.post(
  "/aci",
  validateInput,
  asyncHandler(paymentController.processAciPayment)
);

router.get("/:id", asyncHandler(paymentController.getPaymentStatus));

module.exports = router;
