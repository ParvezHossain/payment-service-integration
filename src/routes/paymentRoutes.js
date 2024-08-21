const express = require("express");
const paymentController = require("../controllers/paymentController");
const validateInput = require("../middlewares/validateInput");

const router = express.Router();

router.post("/shift4", validateInput, paymentController.processShift4Payment);

router.post("/aci", validateInput, paymentController.processAciPayment);

router.get("/:id", paymentController.getPaymentStatus);

module.exports = router;
