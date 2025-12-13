import Razorpay from "razorpay";
import crypto from "crypto";
import PaymentRequest from "../models/PaymentRequest.js";
import Wallet from "../models/Wallet.js";

/**
 * ----------------------------------
 * 1️⃣ CREATE Razorpay Order
 * ----------------------------------
 */
export const createOrder = async (req, res) => {
  try {
    const { studentId, amount } = req.body;

    if (!studentId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid student or amount.",
      });
    }

    // 🔥 Initialize Razorpay HERE (after env loaded)
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    console.log("KEY ID:", process.env.RAZORPAY_KEY_ID);

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `ORDER_${Date.now()}`,
    });

    await PaymentRequest.create({
      studentId,
      orderId: order.id,
      amount,
      status: "PENDING",
    });

    res.json({ success: true, order });
  } catch (error) {
    console.error("❌ Order Creation Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * ----------------------------------
 * 2️⃣ VERIFY Razorpay Webhook
 * ----------------------------------
 */
export const verifyWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.log("⚠️ INVALID WEBHOOK SIGNATURE");
      return res.status(400).json({ success: false, message: "Invalid Signature" });
    }

    const event = req.body.event;

    if (event === "payment.captured") {
      const payment = req.body.payload.payment.entity;
      const orderId = payment.order_id;
      const amount = payment.amount / 100;

      const updatedPayment = await PaymentRequest.findOneAndUpdate(
        { orderId },
        { status: "SUCCESS", paymentId: payment.id },
        { new: true }
      );

      if (updatedPayment) {
        await Wallet.findOneAndUpdate(
          { studentId: updatedPayment.studentId },
          { $inc: { balance: amount } },
          { new: true, upsert: true }
        );
      }

      console.log("✅ Payment Verified & Wallet Updated");
    }

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    res.status(500).json({ success: false });
  }
};

/**
 * ----------------------------------
 * 3️⃣ GET Payment Status
 * ----------------------------------
 */
export const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const payment = await PaymentRequest.findOne({ orderId });

    if (!payment) {
      return res.status(404).json({ status: "NOT_FOUND" });
    }

    res.json({
      status: payment.status,
      amount: payment.amount,
      studentId: payment.studentId,
    });
  } catch (error) {
    console.error("❌ Status Check Error:", error);
    res.status(500).json({ status: "ERROR" });
  }
};
