// server/src/routes/missionRoutes.js
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
	listMissionsAdmin,
} from "../controllers/missionController.js";
import {
	createMissionSchema,
	updateMissionSchema,
} from "../validation/missionSchemas.js";

const router = express.Router();

// Public list
router.get("/", listMissions);

// ✅ Admin list (MUST be before "/:id")
router.get("/admin", verifyJWT, requireAdmin, listMissionsAdmin); 

// Details
router.get("/:id", getMissionById);

// Admin CRUD
router.post("/", verifyJWT, requireAdmin, validate(createMissionSchema), createMission);
router.put("/:id", verifyJWT, requireAdmin, validate(updateMissionSchema), updateMission);
router.patch("/:id", verifyJWT, requireAdmin, validate(updateMissionSchema), patchMission);
router.delete("/:id", verifyJWT, requireAdmin, deleteMission);

export default router;
