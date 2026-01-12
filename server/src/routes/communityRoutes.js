import express from "express";
import { requireAdmin, verifyJWT } from "../middleware/auth.js";
import { getCommunityOverview, getCommunityOverviewPublic, getCommunitySettings, updateCommunitySettings } from "../controllers/communityController.js";

const router = express.Router();
// Protected: uses current user for "my rank"
router.get("/overview", verifyJWT, getCommunityOverview);

router.get("/overview-public", getCommunityOverviewPublic);

router.get("/settings", verifyJWT,getCommunitySettings);
router.put("/settings", verifyJWT, requireAdmin, updateCommunitySettings);

export default router;
