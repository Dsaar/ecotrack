import Submission from "../../models/Submission.js";
import Mission from "../../models/Mission.js";
import User from "../../models/Users.js";
import Checkin from "../../models/Checkin.js";

export const listAdminSubmissions = async (req, res) => {
	try {
		const { status = "pending", missionId, userId, page = 1, limit = 20 } = req.query;
		const q = { status };
		if (missionId) q.missionId = missionId;
		if (userId) q.userId = userId;

		const items = await Submission.find(q)
			.populate("userId", "name email")
			.populate("missionId", "title slug points")
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(Number(limit));

		const total = await Submission.countDocuments(q);
		return res.json({ items, total, page: Number(page), pages: Math.ceil(total / limit) });
	} catch (e) {
		console.error("[listAdminSubmissions]", e);
		return res.status(500).json({ message: "Failed to fetch submissions" });
	}
};

export const approveSubmission = async (req, res) => {
	try {
		const id = req.params.id;
		const sub = await Submission.findById(id);
		if (!sub) return res.status(404).json({ message: "Submission not found" });
		if (sub.status !== "pending") return res.status(409).json({ message: "Submission is not pending" });

		const mission = await Mission.findById(sub.missionId);
		if (!mission) return res.status(404).json({ message: "Mission not found" });

		sub.status = "approved";
		sub.reviewerId = req.user.id;
		sub.reviewedAt = new Date();
		sub.pointsAwarded = mission.points || 0;
		await sub.save();

		await User.findByIdAndUpdate(sub.userId, { $inc: { points: sub.pointsAwarded } });

		await Checkin.create({
			userId: sub.userId,
			missionId: sub.missionId,
			submissionId: sub._id,
			points: sub.pointsAwarded,
			impact: mission.estImpact || { co2Kg: 0, waterL: 0, wasteKg: 0 },
		});

		return res.json({ message: "Approved", pointsAwarded: sub.pointsAwarded });
	} catch (e) {
		console.error("[approveSubmission]", e);
		return res.status(500).json({ message: "Failed to approve submission" });
	}
};

export const rejectSubmission = async (req, res) => {
	try {
		const id = req.params.id;
		const { reason } = req.body || {};
		const sub = await Submission.findById(id);
		if (!sub) return res.status(404).json({ message: "Submission not found" });
		if (sub.status !== "pending") return res.status(409).json({ message: "Submission is not pending" });

		sub.status = "rejected";
		sub.reviewerId = req.user.id;
		sub.reviewedAt = new Date();
		sub.rejectionReason = reason || "";
		await sub.save();

		return res.json({ message: "Rejected" });
	} catch (e) {
		console.error("[rejectSubmission]", e);
		return res.status(500).json({ message: "Failed to reject submission" });
	}
};
