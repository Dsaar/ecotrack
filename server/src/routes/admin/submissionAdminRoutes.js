import express from "express";
import { verifyJWT, requireAdmin } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { listAdminSubmissionsQuery } from "../../validation/submissionSchemas.js";
import {
  listAdminSubmissions,
  approveSubmission,
  rejectSubmission,
} from "../../controllers/admin/submissionsAdminController.js";

const router = express.Router();

router.get("/", verifyJWT, requireAdmin, validate(listAdminSubmissionsQuery, "query"), listAdminSubmissions);
router.patch("/:id/approve", verifyJWT, requireAdmin, approveSubmission);
router.patch("/:id/reject", verifyJWT, requireAdmin, rejectSubmission);

export default router;
