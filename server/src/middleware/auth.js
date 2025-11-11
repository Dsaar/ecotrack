import jwt from "jsonwebtoken";
import User from "../models/Users.js";
import { JWT_SECRET, AUTH_COOKIE_NAME } from "../config/authConfig.js";

export const verifyJWT = async (req, res, next) => {
	try {
		// Check both header and cookie for token
		const authHeader = req.headers.authorization || "";
		let token = null;

		if (authHeader.startsWith("Bearer ")) {
			token = authHeader.slice(7);
		} else if (req.cookies && req.cookies[AUTH_COOKIE_NAME]) {
			token = req.cookies[AUTH_COOKIE_NAME];
		}

		if (!token) {
			return res.status(401).json({ message: "Missing token" });
		}

		const payload = jwt.verify(token, JWT_SECRET);

		const user = await User.findById(payload.sub);
		if (!user) {
			return res.status(401).json({ message: "User not found" });
		}

		req.user = {
			id: user._id.toString(),
			email: user.email,
			isAdmin: user.isAdmin,
			name: user.name,
		};

		next();
	} catch (err) {
		console.error("[verifyJWT] error:", err?.message);
		return res.status(401).json({ message: "Invalid or expired token" });
	}
};

export const requireAdmin = (req, res, next) => {
	if (!req.user?.isAdmin) {
		return res.status(403).json({ message: "Admin privileges required" });
	}
	next();
};
