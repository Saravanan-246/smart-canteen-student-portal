// controllers/orderController.js
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
} = require("../models/orderModel");

const createNewOrder = (req, res) => {
  try {
    const { items, amount, paymentMethod, status, razorpayOrderId } = req.body;

    const order = createOrder({
      items: items || [],
      amount,
      paymentMethod,
      status: status || "pending",
      razorpayOrderId: razorpayOrderId || null,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Create order error:", err.message);
    res.status(500).json({ message: "Create order failed" });
  }
};

const getOrder = (req, res) => {
  const { id } = req.params;
  const order = getOrderById(id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
};

const listOrders = (req, res) => {
  res.json(getAllOrders());
};

const changeStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = updateOrderStatus(id, status);
  if (!updated) return res.status(404).json({ message: "Order not found" });
  res.json(updated);
};

module.exports = {
  createNewOrder,
  getOrder,
  listOrders,
  changeStatus,
};
