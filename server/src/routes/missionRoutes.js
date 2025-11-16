import express from "express";
import { verifyJWT, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
	listMissions,
	getMissionById,
	createMission,
	updateMission,
	patchMission,
	deleteMission,
} from "../controllers/missionController.js";
import {
	createMissionSchema,
	updateMissionSchema,
} from "../validation/missionSchemas.js";

const router = express.Router();

// Public list + details
router.get("/", listMissions);
router.get("/:id", getMissionById);

// Admin CRUD
router.post("/", verifyJWT, requireAdmin, validate(createMissionSchema), createMission);
router.put("/:id", verifyJWT, requireAdmin, validate(createMissionSchema), updateMission);
router.patch("/:id", verifyJWT, requireAdmin, validate(updateMissionSchema), patchMission);
router.delete("/:id", verifyJWT, requireAdmin, deleteMission);

export default router;
