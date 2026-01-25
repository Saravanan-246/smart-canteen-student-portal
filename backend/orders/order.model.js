import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // MUST match student model name
      required: true,
      index: true, // 🔥 important for fast student-wise queries
    },

    items: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["paid", "preparing", "ready", "completed"],
      default: "paid",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
