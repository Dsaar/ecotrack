import mongoose from "mongoose";
import dotenv from "dotenv";
import config from "config";

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
			Checkin.deleteMany({})
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

		console.log("🌱 Seed Complete!");
	} catch (err) {
		console.error("❌ Seed failed:", err);
		process.exitCode = 1;
	} finally {
		await disconnect();
	}
})();
