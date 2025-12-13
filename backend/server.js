import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import paymentRoutes from "./routes/paymentRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Load env
dotenv.config();

const app = express();

// 🟢 Razorpay webhook (RAW body) — MUST BE FIRST
app.use(
  "/api/payment/webhook",
  express.raw({ type: "application/json" })
);

// 🟢 JSON (after webhook)
app.use(express.json());

// 🟢 CORS
app.use(cors());

// 🟢 Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Error:", err);
    process.exit(1); // 🔥 stop server if DB fails
  });

// 🟢 Routes
app.use("/api/payment", paymentRoutes);
app.use("/api/auth", authRoutes);

// 🟢 Root test
app.get("/", (req, res) => {
  res.send("🔥 Student Backend Running...");
});

// 🟢 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
