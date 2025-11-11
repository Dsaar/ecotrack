import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

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
	console.error("Full error:", error);
	process.exit(1); // Exit the process to avoid hanging in a bad state
}

