// controllers/paymentController.js
const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const { createOrder } = require("../models/orderModel");

const createPaymentOrder = async (req, res) => {
  try {
    const { amount, items, paymentMethod } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const rpOrder = await razorpay.orders.create({
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    });

    // Store order locally (status = "created")
    const order = createOrder({
      amount,
      items: items || [],
      paymentMethod,
      razorpayOrderId: rpOrder.id,
      status: "created",
    });

    res.json({
      success: true,
      razorpayOrder: rpOrder,
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Create payment error:", err.message);
    res.status(500).json({ message: "Payment order create failed" });
  }
};

const verifyPayment = (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const signData = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(signData.toString())
      .digest("hex");

    const isValid = expectedSign === razorpay_signature;

    res.json({ success: isValid });
  } catch (err) {
    console.error("Verify payment error:", err.message);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
};
