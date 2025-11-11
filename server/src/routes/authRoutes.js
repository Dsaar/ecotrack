import { Router } from "express";
import { register, login, me } from "../controllers/authController.js";
import { verifyJWT } from "../middleware/auth.js";
import { registerSchema, loginSchema } from "../validation/authSchemas.js";
import { validate } from "../middleware/validate.js"; 

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", verifyJWT, me);

export default router;
