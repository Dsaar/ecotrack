import { Router } from "express";
import { verifyJWT, requireAdmin } from "../middleware/auth.js";
import { getMe, updateMe, listUsers, deleteUser, patchMe } from "../controllers/userController.js";

const router = Router();

// self
router.get("/me", verifyJWT, getMe);
router.put("/me", verifyJWT, updateMe);
router.patch("/me", verifyJWT, patchMe); 

// admin
router.get("/", verifyJWT, requireAdmin, listUsers);
router.delete("/:id", verifyJWT, requireAdmin, deleteUser);
router.patch("/:id", verifyJWT, requireAdmin, patchMe);

export default router;
