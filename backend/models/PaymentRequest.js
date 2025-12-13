import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    studentId: String,
    orderId: String,
    amount: Number,
    status: { type: String, default: "PENDING" },
  },
  { timestamps: true }
);

export default mongoose.model("PaymentRequest", paymentSchema);
