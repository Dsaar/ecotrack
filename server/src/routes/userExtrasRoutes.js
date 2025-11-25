import { Router } from "express";
import { verifyJWT, requireAdmin } from "../middleware/auth.js";
import {
	addMissionFavorite,
	removeMissionFavorite,
	listMissionFavorites,
	awardPoints,
} from "../controllers/userExtrasController.js";

const router = Router();

// Mission Favorites (user-scoped)
router.post("/favorites/missions/:id", verifyJWT, addMissionFavorite);
router.delete("/favorites/missions/:id", verifyJWT, removeMissionFavorite);
router.get("/favorites/missions", verifyJWT, listMissionFavorites);

// Points (admin tool)
router.post("/points/:id", verifyJWT, requireAdmin, awardPoints);

export default router;
