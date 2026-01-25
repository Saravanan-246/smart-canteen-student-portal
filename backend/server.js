import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./auth/auth.routes.js";
import orderRoutes from "./orders/order.routes.js";
import paymentRoutes from "./payments/payment.routes.js";

dotenv.config();
connectDB();

const app = express();

// 🔥 CORS – ALLOW ALL LOCALHOST PORTS (DEV)
app.use(
  cors({
    origin: true,        // ✅ FIX
    credentials: true,
  })
);

// 🔥 PRE-FLIGHT FIX (VERY IMPORTANT)
app.options("*", cors());

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("🔥 Student Backend Running");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Student server running on port ${PORT}`);
});
