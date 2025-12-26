import Submission from "../models/Submission.js";
import Mission from "../models/Missions.js";
import { isObjectId } from "../utils/isObjectId.js";
import { sendSubmissionPendingAdminEmail } from "../service/mailService.js";

export const createSubmission = async (req, res) => {
	try {
		const { missionId, answers, evidenceUrls } = req.body;

		if (!isObjectId(missionId)) {
			return res.status(400).json({ message: "Invalid mission id" });
		}

		// ✅ robust userId extraction (depends on your auth middleware)
		const userId = req.user?.id || req.user?.sub;
		if (!userId) {
			return res.status(401).json({ message: "Not authenticated" });
		}

		const mission = await Mission.findById(missionId);
		if (!mission || !mission.isPublished) {
			return res.status(404).json({ message: "Mission not found" });
		}

		const existing = await Submission.findOne({
			userId,
			missionId,
			status: "pending",
		});

		if (existing) {
			return res
				.status(409)
				.json({ message: "You already have a pending submission for this mission" });
		}

		const sub = await Submission.create({
			userId,
			missionId,
			answers: Array.isArray(answers) ? answers : [],
			evidenceUrls: Array.isArray(evidenceUrls) ? evidenceUrls : [],
			status: "pending",
		});

		/* ============================================================
		   ✅ EMAIL ADMIN: PENDING SUBMISSION (FIRE-AND-FORGET)
		   ============================================================ */
		const adminTo = process.env.MAIL_ADMIN_TO || process.env.ADMIN_EMAIL;

		// don't crash if admin email isn't configured
		if (adminTo) {
			const dashboardUrl = `${process.env.APP_BASE_URL}/dashboard/admin/submissions`;

			sendSubmissionPendingAdminEmail({
				to: adminTo,
				// best-effort: if your auth middleware puts these on req.user
				userEmail: req.user?.email,
				userName: [req.user?.name?.first, req.user?.name?.last].filter(Boolean).join(" "),
				missionTitle: mission?.title,
				submissionId: sub._id.toString(),
				dashboardUrl,
			}).catch((err) => {
				console.error("[MAIL] admin pending email failed:", err);
			});
		} else {
			console.warn(
				"[MAIL] MAIL_ADMIN_TO/ADMIN_EMAIL not set, skipping admin notification email."
			);
		}

		return res.status(201).json(sub);
	} catch (e) {
		console.error("[createSubmission]", e);
		return res.status(500).json({ message: "Failed to create submission" });
	}
};

export const listMySubmissions = async (req, res) => {
	try {
		const userId = req.user?.id || req.user?.sub;
		if (!userId) {
			return res.status(401).json({ message: "Not authenticated" });
		}

		const items = await Submission.find({ userId })
			.populate("missionId", "title slug points category difficulty")
			.sort({ createdAt: -1 });

		return res.json(items);
	} catch (e) {
		console.error("[listMySubmissions]", e);
		return res.status(500).json({ message: "Failed to list submissions" });
	}
};
