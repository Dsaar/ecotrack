import Submission from "../models/Submission.js";
import Mission from "../models/Missions.js";
import { isObjectId } from "../utils/isObjectId.js";

export const createSubmission = async (req, res) => {
	try {
		const { missionId, answers, evidenceUrls } = req.body;
		if (!isObjectId(missionId)) return res.status(400).json({ message: "Invalid mission id" });

		const mission = await Mission.findById(missionId);
		if (!mission || !mission.isPublished) return res.status(404).json({ message: "Mission not found" });

		const existing = await Submission.findOne({ userId: req.user.id, missionId, status: "pending" });
		if (existing) return res.status(409).json({ message: "You already have a pending submission for this mission" });

		const sub = await Submission.create({ userId: req.user.id, missionId, answers, evidenceUrls, status: "pending" });
		return res.status(201).json(sub);
	} catch (e) {
		console.error("[createSubmission]", e);
		return res.status(500).json({ message: "Failed to create submission" });
	}
};

export const listMySubmissions = async (req, res) => {
	try {
		const items = await Submission.find({ userId: req.user.id })
			.populate(
				"missionId",
				"title slug points category difficulty" // 👈 added category + difficulty
			)
			.sort({ createdAt: -1 });

		return res.json(items);
	} catch (e) {
		console.error("[listMySubmissions]", e);
		return res.status(500).json({ message: "Failed to list submissions" });
	}
};