import express from "express";
import { verifyJWT } from "../middleware/auth.js";
import { toggleFavoriteMission, listFavoriteMissions } from "../controllers/favoritesController.js";

const router = express.Router();

// toggles add/remove
router.put("/missions/:missionId", verifyJWT, toggleFavoriteMission);

// get all user's favorites populated
router.get("/missions", verifyJWT, listFavoriteMissions);

export default router;
