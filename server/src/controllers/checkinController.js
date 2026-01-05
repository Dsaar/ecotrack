import Checkin from "../models/Checkin.js";

export const listMyCheckins = async (req, res) => {
	try {
		const userId = req.user?.id || req.user?.sub;

		const items = await Checkin.find({ userId })
			.populate({
				path: "missionId",
				model: "Missions", // ✅ explicit model name
				select: "title slug category difficulty points",
			})
			.sort({ createdAt: -1 });

		return res.json(items);
	} catch (e) {
		console.error("[listMyCheckins]", e);
		return res.status(500).json({ message: "Failed to fetch checkins." });
	}
};
