import express from "express";
import { verifyJWT } from "../middleware/auth.js";
import { listMyCheckins } from "../controllers/checkinController.js";

const router = express.Router();

// ✅ User activity history (approved completions)
router.get("/mine", verifyJWT, listMyCheckins);

export default router;
