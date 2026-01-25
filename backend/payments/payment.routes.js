import express from "express";
import { createPaymentOrder } from "./payment.controller.js";

const router = express.Router();

router.post("/orders", createPaymentOrder);

export default router;
