import mongoose from "mongoose";
import dotenv from "dotenv";
import config from "config";
import ChatMessage from "../src/models/ChatMessage.js";


// --------------------------------------------
// 1) Always load ONLY .env
// --------------------------------------------
dotenv.config();
console.log("📦 Loaded .env");

// --------------------------------------------
// Models
// --------------------------------------------
import User from "../src/models/Users.js";
import Mission from "../src/models/Missions.js";
import Submission from "../src/models/Submission.js";
import Checkin from "../src/models/Checkin.js";

import { usersSeed } from "./data/userSeed.js";
import { missionsSeed } from "./data/missionSeed.js";

// --------------------------------------------
// 2) SAFETY GATE — Don't seed prod by default
// --------------------------------------------
const nodeEnv = process.env.NODE_ENV || "development";
const dbEnv =
	(config.has("DB_ENVIRONMENT") && config.get("DB_ENVIRONMENT")) || "local";

if ((nodeEnv === "production" || dbEnv !== "local") && !process.env.ALLOW_SEED_ANYWAY) {
	console.error(`❌ Refusing to seed. NODE_ENV=${nodeEnv}, DB_ENV=${dbEnv}`);
	console.error("   Add ALLOW_SEED_ANYWAY=true to override.");
	process.exit(1);
}

// --------------------------------------------
// 3) Determine MongoDB URI exactly like the server
// --------------------------------------------
function pickMongoUri() {
	if (process.env.MONGODB_URI) return process.env.MONGODB_URI;

	const localDB = process.env.LOCAL_DB;
	const atlasDB = process.env.ATLAS_DB;
	return dbEnv === "local" ? localDB : atlasDB;
}

function mask(uri) {
	return uri?.replace(/(mongodb(\+srv)?:\/\/[^:]+:)[^@]+@/, "$1****@");
}

// --------------------------------------------
// 4) Connect
// --------------------------------------------
async function connect() {
	const uri = pickMongoUri();

	if (!uri) {
		console.error("❌ No MongoDB URI found.");
		console.error("   Set MONGODB_URI or LOCAL_DB/ATLAS_DB in .env");
		process.exit(1);
	}

	// prevent accidental Atlas wipe
	if (uri.startsWith("mongodb+srv://") && !process.env.ALLOW_SEED_ANYWAY) {
		console.error(`❌ Blocking Atlas seed → ${mask(uri)}`);
		console.error("   Add ALLOW_SEED_ANYWAY=true to override.");
		process.exit(1);
	}

	console.log(`🔌 Connecting to DB: ${mask(uri)}`);
	await mongoose.connect(uri);

	const { name, host } = mongoose.connection;
	console.log(`✅ Connected to "${name}" on host "${host}"`);
}

// --------------------------------------------
// 5) Disconnect
// --------------------------------------------
async function disconnect() {
	await mongoose.disconnect();
	console.log("👋 Disconnected");
}

// --------------------------------------------
// 6) MAIN SEED LOGIC
// --------------------------------------------
(async function main() {
	try {
		await connect();

		console.log("🌱 Clearing collections...");
		await Promise.all([
			User.deleteMany({}),
			Mission.deleteMany({}),
			Submission.deleteMany({}),
			Checkin.deleteMany({}),
			ChatMessage.deleteMany({}),
		]);
		console.log("🧹 Collections cleared.");

		console.log("👤 Seeding users...");
		const users = await usersSeed();
		await User.insertMany(users);
		console.log(`   → Inserted ${users.length} users`);

		console.log("🚀 Seeding missions...");
		const missions = missionsSeed();
		await Mission.insertMany(missions);
		console.log(`   → Inserted ${missions.length} missions`);
		// --------------------------------------------
		// 7) Rich seed: favorites + submissions + checkins + chats
		// --------------------------------------------
		console.log("✨ Creating favorites, submissions, checkins, chats...");

		const dbUsers = await User.find({});
		const dbMissions = await Mission.find({});

		// split admins + regular users
		const admins = dbUsers.filter((u) => u.isAdmin);
		const regularUsers = dbUsers.filter((u) => !u.isAdmin);

		const pickN = (arr, n) => {
			const copy = [...arr];
			const out = [];
			while (copy.length && out.length < n) {
				const idx = Math.floor(Math.random() * copy.length);
				out.push(copy.splice(idx, 1)[0]);
			}
			return out;
		};

		const evidenceSamples = [
			"https://picsum.photos/900/600?evidence=1",
			"https://picsum.photos/900/600?evidence=2",
			"https://picsum.photos/900/600?evidence=3",
			"https://picsum.photos/900/600?evidence=4",
			"https://picsum.photos/900/600?evidence=5",
		];

		const rejectionReasons = [
			"Evidence is unclear (image too dark). Please re-upload with better lighting.",
			"The submission does not match the mission requirements.",
			"Missing proof (receipt/screenshot). Please attach the required evidence.",
			"Duplicate submission for the same mission.",
		];

		// 7.1 Favorites (missions)
		for (const u of dbUsers) {
			const favCount = 2 + Math.floor(Math.random() * 4); // 2..5
			const favMissions = pickN(dbMissions, Math.min(favCount, dbMissions.length)).map((m) => m._id);
			await User.updateOne(
				{ _id: u._id },
				{ $set: { "favorites.missions": favMissions } }
			);
		}

		// 7.2 Submissions (ensure each user has approved + rejected + pending)
		// plus: approvedCount varies (so "completed missions" varies)
		const submissionsToInsert = [];

		for (const u of regularUsers) {
			const approvedCount = 1 + Math.floor(Math.random() * 5); // 1..5 (varies per user)

			const pool = pickN(dbMissions, Math.min(approvedCount + 2, dbMissions.length));
			const approvedMissions = pool.slice(0, approvedCount);
			const rejectedMission = pool[approvedCount] || dbMissions[0];
			const pendingMission = pool[approvedCount + 1] || dbMissions[1] || dbMissions[0];

			// Approved submissions
			for (const m of approvedMissions) {
				submissionsToInsert.push({
					userId: u._id,
					missionId: m._id,
					status: "approved",
					evidenceUrls: pickN(evidenceSamples, 2), // ✅ evidence on every submission
					reviewerId: admins[Math.floor(Math.random() * admins.length)]._id,
					reviewedAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 86400000),
					pointsAwarded: m.points || 0,
				});
			}

			// Rejected
			submissionsToInsert.push({
				userId: u._id,
				missionId: rejectedMission._id,
				status: "rejected",
				evidenceUrls: pickN(evidenceSamples, 2),
				reviewerId: admins[Math.floor(Math.random() * admins.length)]._id,
				reviewedAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 86400000),
				rejectionReason: rejectionReasons[Math.floor(Math.random() * rejectionReasons.length)],
				pointsAwarded: 0,
			});

			// Pending
			submissionsToInsert.push({
				userId: u._id,
				missionId: pendingMission._id,
				status: "pending",
				evidenceUrls: pickN(evidenceSamples, 2),
				// no reviewer fields yet
				pointsAwarded: 0,
			});
		}

		const insertedSubs = await Submission.insertMany(submissionsToInsert);

		// 7.3 Checkins + points for APPROVED submissions
		const approvedSubs = insertedSubs.filter((s) => s.status === "approved");

		const checkinsToInsert = [];
		const pointsByUser = new Map(); // userId -> total points

		for (const s of approvedSubs) {
			const m = dbMissions.find((x) => String(x._id) === String(s.missionId));
			const pts = s.pointsAwarded || m?.points || 0;

			checkinsToInsert.push({
				userId: s.userId,
				missionId: s.missionId,
				submissionId: s._id,
				points: pts,
				impact: m?.estImpact || { co2Kg: 0, waterL: 0, wasteKg: 0 },
			});

			const key = String(s.userId);
			pointsByUser.set(key, (pointsByUser.get(key) || 0) + pts);
		}

		if (checkinsToInsert.length) {
			await Checkin.insertMany(checkinsToInsert);
		}

		for (const [userId, sumPoints] of pointsByUser.entries()) {
			await User.updateOne({ _id: userId }, { $inc: { points: sumPoints } });
		}

		// 7.4 Chat messages (at least 2 messages per user)
		const chatDocs = [];
		const chatUsers = [...regularUsers]; // keep chats between regular users

		for (let i = 0; i < chatUsers.length; i++) {
			const a = chatUsers[i];
			const b = chatUsers[(i + 1) % chatUsers.length];

			// 2 messages each (A->B and B->A)
			chatDocs.push({
				senderId: a._id,
				receiverId: b._id,
				content: `Hey ${b?.name?.first || "there"}! Which mission are you doing this week?`,
				seenAt: null,
			});
			chatDocs.push({
				senderId: b._id,
				receiverId: a._id,
				content: `Not sure yet 😄 maybe something in ${["Home", "Transport", "Food", "Energy"][i % 4]}. You?`,
				seenAt: new Date(),
			});
		}

		await ChatMessage.insertMany(chatDocs);

		console.log("✅ Rich seed done.");

		console.log("🌱 Seed Complete!");
	} catch (err) {
		console.error("❌ Seed failed:", err);
		process.exitCode = 1;
	} finally {
		await disconnect();
	}
})();
