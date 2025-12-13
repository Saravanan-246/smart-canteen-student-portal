import express from "express";
import {
  createOrder,
  verifyWebhook
} from "../controllers/paymentController.js";

const router = express.Router();

// Create payment order
router.post("/create", createOrder);

// Razorpay webhook callback
router.post("/webhook", verifyWebhook);

export default router;
