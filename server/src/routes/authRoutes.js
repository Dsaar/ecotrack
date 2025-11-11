import { Router } from "express";
import { register, login, me } from "../controllers/authController.js";
import { verifyJWT } from "../middleware/auth.js";
import { registerSchema, loginSchema } from "../validation/authSchemas.js";
import Joi from "joi";

const router = Router();

// helper to wrap Joi validation per-route
const validate =
	(schema) =>
		(req, res, next) => {
			const { error, value } = schema.validate(req.body, {
				abortEarly: false,
				stripUnknown: true,
			});
			if (error) {
				return res.status(400).json({
					message: "Validation error",
					details: error.details.map((d) => d.message),
				});
			}
			req.body = value;
			next();
		};

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", verifyJWT, me);

export default router;
