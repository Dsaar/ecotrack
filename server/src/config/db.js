import mongoose from "mongoose";
import dotenv from "dotenv";
import config from "config";

dotenv.config();

export const connectDB = async () => {
	const dbEnv = config.get("DB_ENVIRONMENT") || "local";

	const localUri = process.env.LOCAL_DB;
	const atlasUri = process.env.ATLAS_DB || process.env.MONGODB_URI;

	const connectionString = dbEnv === "local" ? localUri : atlasUri;

	if (!connectionString) {
		throw new Error(
			`No MongoDB connection string defined for DB_ENVIRONMENT="${dbEnv}".` +
			` Check LOCAL_DB / ATLAS_DB / MONGODB_URI in your .env`
		);
	}

	const prettyEnvName =
		dbEnv === "local" ? "MongoDB Local" : "MongoDB Atlas / Remote";

	try {
		console.log(`[DB] Connecting to ${prettyEnvName}...`);
		await mongoose.connect(connectionString);
		console.log(`[DB] Connected to ${prettyEnvName}`);
	} catch (err) {
		console.error("[DB] Connection error:", err.message);
		// Optional: exit so nodemon restarts
		process.exit(1);
	}
};
