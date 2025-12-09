import express from "express";
import { verifyJWT } from "../middleware/auth.js";
import { getCommunityOverview } from "../controllers/communityController.js";

const router = express.Router();

// Protected: uses current user for "my rank"
router.get("/overview", verifyJWT, getCommunityOverview);

export default router;
