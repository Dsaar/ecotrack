// server/src/config/authConfig.js
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the actual file: server/.env  (two levels up from /src/config)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "4h";
export const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "access_token";
export const NODE_ENV = process.env.NODE_ENV || "development";
export const isProd = NODE_ENV === "production";

// Convert "4h", "30m", "7d", or raw seconds ("14400") to milliseconds
const parseDurationToMs = (val) => {
	if (!val) return undefined;
	if (/^\d+$/.test(val)) return Number(val) * 1000; // seconds -> ms
	const m = String(val).trim().match(/^(\d+)\s*([smhd])$/i);
	if (!m) return undefined;
	const num = Number(m[1]);
	const unit = m[2].toLowerCase();
	const mult = unit === "s" ? 1000 : unit === "m" ? 60_000 : unit === "h" ? 3_600_000 : 86_400_000;
	return num * mult;
};

export const COOKIE_MAX_AGE_MS = parseDurationToMs(JWT_EXPIRES_IN) ?? 4 * 60 * 60 * 1000;

if (!JWT_SECRET) {
	console.error("[FATAL] Missing JWT_SECRET in env (expected at server/.env)");
	process.exit(1);
}
