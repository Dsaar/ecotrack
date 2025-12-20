import Mission from "../models/Missions.js";

// GET /api/missions?q=&category=&difficulty=
export const listMissions = async (req, res) => {
	try {
		const { q, category, difficulty } = req.query;

		// ✅ Public route should only return published missions
		const filter = { isPublished: true };

		if (q) {
			filter.$or = [
				{ title: new RegExp(q, "i") },
				{ summary: new RegExp(q, "i") },
				{ description: new RegExp(q, "i") },
			];
		}
		if (category) filter.category = category;
		if (difficulty) filter.difficulty = difficulty;

		const items = await Mission.find(filter).sort({ createdAt: -1 });
		return res.json(items);
	} catch (e) {
		console.error("[listMissions]", e);
		return res.status(500).json({ message: "Failed to list missions" });
	}
};

// GET /api/missions/admin?q=&category=&difficulty=&isPublished=
export const listMissionsAdmin = async (req, res) => {
	try {
		const { q, category, difficulty } = req.query;
		const filter = {};

		if (q) {
			filter.$or = [
				{ title: new RegExp(q, "i") },
				{ summary: new RegExp(q, "i") },
				{ description: new RegExp(q, "i") },
			];
		}
		if (category) filter.category = category;
		if (difficulty) filter.difficulty = difficulty;

		// 🔥 NO isPublished filter
		const items = await Mission.find(filter).sort({ createdAt: -1 });
		return res.json(items);
	} catch (e) {
		console.error("[listMissionsAdmin]", e);
		return res.status(500).json({ message: "Failed to list missions (admin)" });
	}
};


// GET /api/missions/:id
export const getMissionById = async (req, res) => {
	try {
		const mission = await Mission.findById(req.params.id);
		if (!mission) return res.status(404).json({ message: "Mission not found" });
		return res.json(mission);
	} catch (e) {
		console.error("[getMissionById]", e);
		return res.status(500).json({ message: "Failed to fetch mission" });
	}
};

// POST /api/missions  (admin)
export const createMission = async (req, res) => {
	try {
		const mission = await Mission.create(req.body);
		return res.status(201).json(mission);
	} catch (e) {
		console.error("[createMission]", e);
		return res.status(500).json({ message: "Failed to create mission" });
	}
};

// PUT /api/missions/:id  (admin – full replace)
export const updateMission = async (req, res) => {
	try {
		const mission = await Mission.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!mission) return res.status(404).json({ message: "Mission not found" });
		return res.json(mission);
	} catch (e) {
		console.error("[updateMission]", e);
		return res.status(500).json({ message: "Failed to update mission" });
	}
};

// PATCH /api/missions/:id  (admin – partial)
export const patchMission = async (req, res) => {
	try {
		const mission = await Mission.findByIdAndUpdate(
			req.params.id,
			{ $set: req.body },
			{ new: true, runValidators: true }
		);
		if (!mission) return res.status(404).json({ message: "Mission not found" });
		return res.json(mission);
	} catch (e) {
		console.error("[patchMission]", e);
		return res.status(500).json({ message: "Failed to patch mission" });
	}
};

// DELETE /api/missions/:id  (admin)
export const deleteMission = async (req, res) => {
	try {
		const mission = await Mission.findByIdAndDelete(req.params.id);
		if (!mission) return res.status(404).json({ message: "Mission not found" });
		return res.json({ message: "Mission deleted" });
	} catch (e) {
		console.error("[deleteMission]", e);
		return res.status(500).json({ message: "Failed to delete mission" });
	}
};
