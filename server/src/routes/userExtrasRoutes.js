import { Router } from "express";
import { verifyJWT, requireAdmin } from "../middleware/auth.js";
import { addFavorite, removeFavorite, awardPoints } from "../controllers/userExtrasController.js";

const router = Router();
router.post("/favorites/:itemId", verifyJWT, addFavorite);
router.delete("/favorites/:itemId", verifyJWT, removeFavorite);
router.post("/:id/points", verifyJWT, requireAdmin, awardPoints);
export default router;
