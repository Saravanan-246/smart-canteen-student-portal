// models/orderModel.js
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const DATA_PATH = path.join(__dirname, "..", "data", "orders.json");

function readOrders() {
  if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, "[]", "utf8");
  }
  const raw = fs.readFileSync(DATA_PATH, "utf8");
  return JSON.parse(raw || "[]");
}

function writeOrders(orders) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(orders, null, 2), "utf8");
}

function getAllOrders() {
  return readOrders();
}

function getOrderById(id) {
  return readOrders().find((o) => o.id === id);
}

function createOrder(data) {
  const orders = readOrders();
  const order = {
    id: uuid(),
    ...data,
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  writeOrders(orders);
  return order;
}

function updateOrderStatus(id, status) {
  const orders = readOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;
  orders[index].status = status;
  orders[index].updatedAt = new Date().toISOString();
  writeOrders(orders);
  return orders[index];
}

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
};
