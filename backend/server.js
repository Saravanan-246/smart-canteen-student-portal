import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./auth/auth.routes.js";
import orderRoutes from "./orders/order.routes.js";
import paymentRoutes from "./payments/payment.routes.js";

// Load env first
dotenv.config();

// Connect DB (safe)
connectDB();

const app = express();

/* ======================
   MIDDLEWARE
====================== */

// ✅ CORS (DEV + PROD SAFE)
app.use(
  cors({
    origin: true,        // allow all origins (Vercel, localhost, etc.)
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Preflight (important for POST / PUT)
app.options("*", cors());

app.use(express.json());

/* ======================
   ROUTES
====================== */
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

/* ======================
   HEALTH CHECK
====================== */
app.get("/", (req, res) => {
  res.status(200).send("🔥 Student Backend Running");
});

/* ======================
   404 HANDLER
====================== */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ======================
   SERVER
====================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Student server running on port ${PORT}`);
});
