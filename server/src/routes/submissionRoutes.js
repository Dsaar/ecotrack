import express from "express";
import { verifyJWT } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createSubmissionSchema } from "../validation/submissionSchemas.js";
import { createSubmission, listMySubmissions } from "../controllers/submissionController.js";

const router = express.Router();

router.post("/", verifyJWT, validate(createSubmissionSchema), createSubmission);
router.get("/mine", verifyJWT, listMySubmissions);

export default router;
