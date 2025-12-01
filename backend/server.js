// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const paymentRoutes = require("./routes/payment");
const orderRoutes = require("./routes/orders");

const app = express();

app.use(cors());
app.use(express.json());

// Simple health check
app.get("/", (req, res) => {
  res.send("Smart Canteen Backend Running ✅");
});

// Routes
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
