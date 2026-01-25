import express from "express";
import {
  createOrder,
  getMyOrders,
} from "./order.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// STUDENT ONLY ROUTES
router.post("/create", authMiddleware, createOrder);
router.get("/my-orders", authMiddleware, getMyOrders);

export default router;
