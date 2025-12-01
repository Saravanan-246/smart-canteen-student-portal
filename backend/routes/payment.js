// routes/payment.js
const express = require("express");
const {
  createPaymentOrder,
  verifyPayment,
} = require("../controllers/paymentController");

const router = express.Router();

// POST /api/payment/create-order
router.post("/create-order", createPaymentOrder);

// POST /api/payment/verify
router.post("/verify", verifyPayment);

module.exports = router;
