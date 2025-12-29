import dotenv from "dotenv";
dotenv.config(); // loads from server/.env by default

import http from "http";
import { Server } from "socket.io";

import { connectDB } from "./config/db.js";
import app from "./app.js";
import { registerChatSockets } from "./realtime/chatSocket.js";


const PORT = process.env.PORT || 5050;

try {
	console.log("[BOOT] Starting server...");

	await connectDB();
	console.log("✅ MongoDB connected successfully");

	// 👇 Create http server from express app
	const httpServer = http.createServer(app);

	// 👇 Attach socket.io to same server/port
	const io = new Server(httpServer, {
		cors: {
			origin: ["http://localhost:5173"],
			credentials: true,
		},
	});

	// 👇 Register chat + presence handlers
	registerChatSockets(io);

	httpServer.listen(PORT, () => {
		console.log(`🚀 API + Socket.IO running on http://localhost:${PORT}`);
	});
} catch (error) {
	console.error("❌ Failed to start server:");
	console.error("Reason:", error.message);
	process.exit(1);
}