// routes/orders.js
const express = require("express");
const {
  createNewOrder,
  getOrder,
  listOrders,
  changeStatus,
} = require("../controllers/orderController");

const router = express.Router();

// POST /api/orders
router.post("/", createNewOrder);

// GET /api/orders
router.get("/", listOrders);

// GET /api/orders/:id
router.get("/:id", getOrder);

// PATCH /api/orders/:id/status
router.patch("/:id/status", changeStatus);

module.exports = router;
