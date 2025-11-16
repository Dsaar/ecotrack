import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";

// === ROUTES ===
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import userExtrasRoutes from "./routes/userExtrasRoutes.js"; // favorites + points
import submissionRoutes from "./routes/submissionRoutes.js";
import adminSubmissionsRoutes from "./routes/admin/submissionAdminRoutes.js";
import missionRoutes from "./routes/missionRoutes.js";


const app = express();

// === BASIC SETUP ===
console.log("[BOOT] app.js loaded", import.meta.url, "pid:", process.pid);

// Security, parsing, logging
app.use(helmet());
app.use(
	cors({
		origin: ["http://localhost:5173"], // allow your frontend
		credentials: true,
	})
);
app.use(express.json());
app.use(cookieParser())
app.use(morgan("dev"));

// === HEALTHCHECK ===
app.get("/health", (_req, res) => res.json({ ok: true }));

// === MAIN API ROUTES ===
app.use("/api/auth", authRoutes);          // register, login, me (auth)
app.use("/api/users", userRoutes);         // user self & admin routes
app.use("/api/users", userExtrasRoutes);   // favorites + points management
app.use("/api/submissions", submissionRoutes);
app.use("/api/admin/submissions", adminSubmissionsRoutes)
app.use("/api/missions", missionRoutes);   



// Health / root ping (place before the 404 handler)
app.get("/", (req, res) => {
	res.status(200).json({
		status: "ok",
		uptime: process.uptime(),
		env: process.env.NODE_ENV || "development",
		time: new Date().toISOString(),
	});
});

// === 404 HANDLER ===
app.use((req, res) => {
	console.warn(`[404] ${req.method} ${req.originalUrl}`);
	res.status(404).json({ message: "Not found" });
});

// === GLOBAL ERROR HANDLER ===
app.use((err, req, res, _next) => {
	console.error("[ERROR]", err);
	if (!res.headersSent) {
		res.status(err.status || 500).json({
			message: err.message || "Server error",
			stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
		});
	}
});

export default app;
