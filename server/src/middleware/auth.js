import jwt from "jsonwebtoken";
import User from "../models/Users.js";

const { JWT_SECRET } = process.env;

export const verifyJWT = async (req, res, next) => {
	try {
		const auth = req.headers.authorization || "";
		const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
		if (!token) return res.status(401).json({ message: "Missing token" });

		const payload = jwt.verify(token, JWT_SECRET);
		// pull user (without passwordHash)
		const user = await User.findById(payload.sub);
		if (!user) return res.status(401).json({ message: "User not found" });

		req.user = {
			id: user._id.toString(),
			email: user.email,
			isAdmin: user.isAdmin,
			name: user.name,
		};
		next();
	} catch (err) {
		return res.status(401).json({ message: "Invalid or expired token" });
	}
};

export const requireAdmin = (req, res, next) => {
	if (!req.user?.isAdmin) {
		return res.status(403).json({ message: "Admin privileges required" });
	}
	next();
};
