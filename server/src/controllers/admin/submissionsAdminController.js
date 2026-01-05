import Submission from "../../models/Submission.js";
import Mission from "../../models/Missions.js";
import User from "../../models/Users.js";
import Checkin from "../../models/Checkin.js";
import {
	sendSubmissionApprovedEmail,
	sendSubmissionRejectedEmail,
} from "../../service/mailService.js";

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
			.skip((Number(page) - 1) * Number(limit))
			.limit(Number(limit));

		const total = await Submission.countDocuments(q);
		return res.json({
			items,
			total,
			page: Number(page),
			pages: Math.ceil(total / Number(limit)),
		});
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
		if (sub.status !== "pending")
			return res.status(409).json({ message: "Submission is not pending" });

		const mission = await Mission.findById(sub.missionId);
		if (!mission) return res.status(404).json({ message: "Mission not found" });

		// 1) Mark submission approved
		sub.status = "approved";
		sub.reviewerId = req.user.id;
		sub.reviewedAt = new Date();
		sub.pointsAwarded = Number(mission.points || 0);
		await sub.save();

		// 2) Award points to user
		await User.findByIdAndUpdate(sub.userId, { $inc: { points: sub.pointsAwarded } });

		// 3) Create checkin ONCE (idempotent)
		const existingCheckin = await Checkin.findOne({ submissionId: sub._id });
		if (!existingCheckin) {
			await Checkin.create({
				userId: sub.userId,
				missionId: sub.missionId,
				submissionId: sub._id,
				points: sub.pointsAwarded,
				impact: {
					co2Kg: Number(mission?.estImpact?.co2Kg || 0),
					waterL: Number(mission?.estImpact?.waterL || 0),
					wasteKg: Number(mission?.estImpact?.wasteKg || 0),
				},
				notes: "", // optional admin/user notes later
			});
		}

		// 4) Email user (fire-and-forget)
		try {
			const u = await User.findById(sub.userId).select("email name");
			if (u?.email) {
				sendSubmissionApprovedEmail({
					to: u.email,
					firstName: u?.name?.first,
					missionTitle: mission?.title,
					pointsAwarded: sub.pointsAwarded,
					dashboardUrl: `${process.env.APP_BASE_URL}/dashboard/activity`,
				}).catch((err) => console.error("[MAIL] approval email failed:", err));
			}
		} catch (err) {
			console.error("[MAIL] approval email lookup failed:", err);
		}

		return res.json({
			message: existingCheckin ? "Approved (checkin already existed)" : "Approved",
			pointsAwarded: sub.pointsAwarded,
		});
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
		if (sub.status !== "pending")
			return res.status(409).json({ message: "Submission is not pending" });

		sub.status = "rejected";
		sub.reviewerId = req.user.id;
		sub.reviewedAt = new Date();
		sub.rejectionReason = reason || "";
		await sub.save();

		// email user (fire-and-forget)
		try {
			const u = await User.findById(sub.userId).select("email name");
			const mission = await Mission.findById(sub.missionId).select("title");
			if (u?.email) {
				sendSubmissionRejectedEmail({
					to: u.email,
					firstName: u?.name?.first,
					missionTitle: mission?.title,
					reason: sub.rejectionReason || "",
					dashboardUrl: `${process.env.APP_BASE_URL}/dashboard/activity`,
				}).catch((err) => console.error("[MAIL] rejection email failed:", err));
			}
		} catch (err) {
			console.error("[MAIL] rejection email lookup failed:", err);
		}

		return res.json({ message: "Rejected" });
	} catch (e) {
		console.error("[rejectSubmission]", e);
		return res.status(500).json({ message: "Failed to reject submission" });
	}
};
