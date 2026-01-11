import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import jwt from "jsonwebtoken";

// === ROUTES ===
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import userExtrasRoutes from "./routes/userExtrasRoutes.js"; // favorites + points
import submissionRoutes from "./routes/submissionRoutes.js";
import adminSubmissionsRoutes from "./routes/admin/submissionAdminRoutes.js";
import missionRoutes from "./routes/missionRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import favoritesRoutes from "./routes/favoriteRoutes.js";
import checkinRoutes from "./routes/checkinRoutes.js";

const app = express();

// === BASIC SETUP ===
console.log("[BOOT] app.js loaded", import.meta.url, "pid:", process.pid);

// If you're behind a proxy (Render/Netlify), this helps Express get correct IPs.
// (Safe even in dev)
app.set("trust proxy", 1);

// Security, parsing, logging
app.use(helmet());
app.use(
	cors({
		origin: ["http://localhost:5173", "https://ecotrack-app.netlify.app"],
		credentials: true,
	})
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// === HEALTHCHECK ===
app.get("/health", (_req, res) => res.json({ ok: true }));

// Disable ETag so Express won't return 304 for API JSON
app.set("etag", false);

// =====================
// ✅ RATE LIMITING
// =====================
const DAY_MS = 24 * 60 * 60 * 1000;

// Helper: get raw IP in a stable way
function getClientIp(req) {
	// Express will set req.ip using trust proxy
	// Normalize ipv6 loopback or ipv4-mapped ipv6 into something consistent
	const ip = req.ip || "";
	if (ip === "::1") return "127.0.0.1";
	if (ip.startsWith("::ffff:")) return ip.replace("::ffff:", "");
	return ip;
}

// 1) 2000/day per IP
const ipLimiter = rateLimit({
	windowMs: DAY_MS,
	limit: 2000,
	standardHeaders: "draft-8",
	legacyHeaders: false,

	keyGenerator: (req) => `ip:${getClientIp(req)}`,

	handler: (req, res) => {
		// Helpful debug
		console.warn("[RL] IP LIMIT HIT", {
			key: `ip:${getClientIp(req)}`,
			path: req.originalUrl,
			ip: req.ip,
			rateLimit: req.rateLimit,
		});

		return res.status(429).json({
			message: "Too many requests (IP daily limit). Try again later.",
		});
	},
});

// Helper: extract user id from Bearer token (ONLY for rate limiting keying)
function attachUserIdFromBearer(req, _res, next) {
	try {
		const auth = req.headers.authorization || "";
		const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
		if (!token) return next();

		const secret = process.env.JWT_SECRET;
		if (!secret) return next();

		const payload = jwt.verify(token, secret);
		const id = payload?.id || payload?._id || payload?.userId || payload?.sub;

		if (id) {
			req.user = req.user || {};
			req.user.id = String(id);
		}
	} catch {
		// ignore
	}
	next();
}

// 2) 500/day per USER (only if authed)
const userLimiter = rateLimit({
	windowMs: DAY_MS,
	limit: 500,
	standardHeaders: "draft-8",
	legacyHeaders: false,
	

	keyGenerator: (req) => `user:${req.user.id}`,

	handler: (req, res) => {
		console.warn("[RL] USER LIMIT HIT", {
			key: `user:${req.user?.id}`,
			path: req.originalUrl,
			rateLimit: req.rateLimit,
		});

		return res.status(429).json({
			message: "Daily user request limit reached. Try again later.",
		});
	},
});

function userLimiterIfAuthed(req, res, next) {
	if (!req.user?.id) return next();
	return userLimiter(req, res, next);
}

// Apply early
app.use("/api", ipLimiter);
app.use("/api", attachUserIdFromBearer);
app.use("/api", userLimiterIfAuthed);

// =====================
// ✅ NO-CACHE FOR API
// =====================
app.use("/api", (req, res, next) => {
	res.setHeader(
		"Cache-Control",
		"no-store, no-cache, must-revalidate, proxy-revalidate"
	);
	res.setHeader("Pragma", "no-cache");
	res.setHeader("Expires", "0");
	res.setHeader("Surrogate-Control", "no-store");
	next();
});

// === MAIN API ROUTES ===
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users", userExtrasRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/admin/submissions", adminSubmissionsRoutes);
app.use("/api/missions", missionRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/checkins", checkinRoutes);

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
