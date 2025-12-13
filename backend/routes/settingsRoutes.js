import express from "express";
import { updateUPI, getUPI } from "../controllers/settingsController.js";

const router = express.Router();

router.get("/", getUPI);
router.post("/update", updateUPI);

export default router;
