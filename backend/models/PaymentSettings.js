import mongoose from "mongoose";

const paymentSettingsSchema = new mongoose.Schema({
  upiId: { type: String, required: true },
  upiName: { type: String, default: "Canteen" },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("PaymentSettings", paymentSettingsSchema);
