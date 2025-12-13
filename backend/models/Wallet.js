import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  balance: { type: Number, default: 0 }
});

export default mongoose.model("Wallet", walletSchema);
