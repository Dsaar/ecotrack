import dotenv from "dotenv";
dotenv.config(); // loads from server/.env by default

import { connectDB } from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 5050;

try {
	console.log("[BOOT] Starting server...");

	await connectDB();
	console.log("✅ MongoDB connected successfully");

	app.listen(PORT, () => {
		console.log(`🚀 API running on http://localhost:${PORT}`);
	});
} catch (error) {
	console.error("❌ Failed to start server:");
	console.error("Reason:", error.message);
	process.exit(1);
}
