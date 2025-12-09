import User from "../models/Users.js";
import Mission from "../models/Missions.js";
import Submission from "../models/Submission.js";

export const getCommunityOverview = async (req, res) => {
	try {
		const currentUserId = String(req.user.id);

		// 1) All users (for points + rank)
		const users = await User.find({}, "points name").lean();
		const membersCount = users.length || 0;

		const totalEcoPoints = users.reduce(
			(sum, u) => sum + (u.points || 0),
			0
		);

		// current user points
		const me = users.find((u) => String(u._id) === currentUserId);
		const myPoints = me?.points || 0;

		// Rank by points
		const usersByPoints = [...users].sort(
			(a, b) => (b.points || 0) - (a.points || 0)
		);
		const myPointsRankIndex = usersByPoints.findIndex(
			(u) => String(u._id) === currentUserId
		);
		const myPointsRank =
			myPointsRankIndex === -1 ? null : myPointsRankIndex + 1;

		// 2) Completed submissions (status = "approved")
		const completedSubs = await Submission.find({ status: "approved" })
			.populate("missionId", "category estImpact points")
			.lean();

		const totalMissionsCompleted = completedSubs.length;

		// Aggregate impact
		let co2SavedKg = 0;
		let waterSavedL = 0;
		let wasteDivertedKg = 0;

		completedSubs.forEach((sub) => {
			const impact = sub.missionId?.estImpact || {};
			co2SavedKg += impact.co2Kg || 0;
			waterSavedL += impact.waterL || 0;
			wasteDivertedKg += impact.wasteKg || 0;
		});

		// 3) Impact over time (simple monthly points)
		const impactByMonth = {};
		completedSubs.forEach((sub) => {
			const date = sub.createdAt || sub.updatedAt;
			if (!date) return;
			const d = new Date(date);
			const ym = `${d.getFullYear()}-${String(
				d.getMonth() + 1
			).padStart(2, "0")}`;

			// use mission points or default 10
			const pts = sub.missionId?.points || 10;

			if (!impactByMonth[ym]) {
				impactByMonth[ym] = { key: ym, points: 0 };
			}
			impactByMonth[ym].points += pts;
		});

		const impactOverTime = Object.values(impactByMonth)
			.sort((a, b) => a.key.localeCompare(b.key))
			.map((item) => {
				const [year, month] = item.key.split("-");
				const date = new Date(Number(year), Number(month) - 1, 1);
				const label = date.toLocaleString("default", { month: "short" });
				return { month: label, points: item.points };
			});

		// 4) Category distribution
		const categoryCounts = {};
		completedSubs.forEach((sub) => {
			const cat = sub.missionId?.category || "Other";
			categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
		});

		const categoryDistribution = Object.entries(categoryCounts).map(
			([name, value]) => ({ name, value })
		);

		// 5) Leaders by missions completed
		const missionsByUser = {};
		completedSubs.forEach((sub) => {
			const uid = String(sub.userId);
			missionsByUser[uid] = (missionsByUser[uid] || 0) + 1;
		});

		const usersWithMissionCounts = users.map((u) => ({
			userId: String(u._id),
			name: u.name?.first || "EcoTracker",
			missions: missionsByUser[String(u._id)] || 0,
		}));

		const leadersByMissions = [...usersWithMissionCounts]
			.sort((a, b) => b.missions - a.missions)
			.slice(0, 10);

		const myMissionsCompleted =
			missionsByUser[currentUserId] !== undefined
				? missionsByUser[currentUserId]
				: 0;

		const usersSortedByMissions = [...usersWithMissionCounts].sort(
			(a, b) => b.missions - a.missions
		);
		const myMissionsRankIndex = usersSortedByMissions.findIndex(
			(u) => u.userId === currentUserId
		);
		const myMissionsRank =
			myMissionsRankIndex === -1 ? null : myMissionsRankIndex + 1;

		// 6) Leaders by points (top 10)
		const leadersByPoints = usersByPoints.slice(0, 10).map((u) => ({
			name: u.name?.first || "EcoTracker",
			points: u.points || 0,
		}));

		// 7) My rank summaries
		const communityStats = {
			membersCount,
			totalEcoPoints,
			totalMissionsCompleted,
			co2SavedKg,
			waterSavedL,
			wasteDivertedKg,
			goalPointsTarget: 20000, // can be made configurable later
		};

		const myRank = {
			byPoints: {
				rank: myPointsRank,
				totalUsers: membersCount,
				points: myPoints,
				aheadOfPercent:
					myPointsRank && membersCount
						? Number(
							(
								((membersCount - myPointsRank) / membersCount) *
								100
							).toFixed(1)
						)
						: null,
			},
			byMissions: {
				rank: myMissionsRank,
				totalUsers: membersCount,
				missionsCompleted: myMissionsCompleted,
				aheadOfPercent:
					myMissionsRank && membersCount
						? Number(
							(
								((membersCount - myMissionsRank) / membersCount) *
								100
							).toFixed(1)
						)
						: null,
			},
		};

		return res.json({
			communityStats,
			impactOverTime,
			categoryDistribution,
			leadersByPoints,
			leadersByMissions,
			myRank,
		});
	} catch (err) {
		console.error("[getCommunityOverview]", err);
		return res
			.status(500)
			.json({ message: "Failed to load community overview" });
	}
};
