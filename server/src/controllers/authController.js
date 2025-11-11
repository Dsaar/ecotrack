import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/Users.js";
import {
	JWT_SECRET,
	JWT_EXPIRES_IN,
	AUTH_COOKIE_NAME,
	isProd,
	COOKIE_MAX_AGE_MS,
} from "../config/authConfig.js";

const cookieOpts = {
	httpOnly: true,
	sameSite: "lax",
	secure: isProd,
	maxAge: COOKIE_MAX_AGE_MS, // matches JWT_EXPIRES_IN
	path: "/",
};

const serializeUser = (u) => ({
	id: u._id,
	name: u.name,
	email: u.email,
	isAdmin: u.isAdmin,
	role: u.role || (u.isAdmin ? "admin" : "user"),
	avatarUrl: u.avatarUrl || null,
	points: u.points,
	favorites: u.favorites,
	createdAt: u.createdAt,
	updatedAt: u.updatedAt,
	lastLogin: u.lastLogin || null,
});

const signToken = (user) =>
	jwt.sign(
		{
			sub: user._id.toString(),
			email: user.email,
			isAdmin: user.isAdmin,
			role: user.role || (user.isAdmin ? "admin" : "user"),
		},
		JWT_SECRET,
		{ expiresIn: JWT_EXPIRES_IN } // e.g., "4h"
	);

const sendAuth = (res, user, status = 200) => {
	const token = signToken(user);
	res.cookie(AUTH_COOKIE_NAME, token, cookieOpts);
	return res.status(status).json({
		token,
		user: serializeUser(user),
	});
};

export const register = async (req, res) => {
	try {
		let { name, email, password, avatarUrl } = req.body;

		if (typeof name === "string") name = name.trim();
		if (typeof email === "string") email = email.trim().toLowerCase();
		if (!name || !email || !password) {
			return res
				.status(400)
				.json({ message: "Name, email and password are required" });
		}

		const exists = await User.findOne({ email });
		if (exists) return res.status(409).json({ message: "Email already in use" });

		const passwordHash = await bcrypt.hash(password, 12);
		const user = await User.create({
			name,
			email,
			passwordHash,
			avatarUrl: avatarUrl || undefined,
		});

		return sendAuth(res, user, 201);
	} catch (err) {
		console.error("[authController.register] error:", err?.message);
		return res.status(500).json({ message: "Registration failed" });
	}
};

export const login = async (req, res) => {
	try {
		let { email, password } = req.body;

		if (typeof email === "string") email = email.trim().toLowerCase();
		if (!email || !password) {
			return res
				.status(400)
				.json({ message: "Email and password are required" });
		}

		const user = await User.findOne({ email }).select("+passwordHash");
		if (!user) return res.status(401).json({ message: "Invalid credentials" });

		const ok = await bcrypt.compare(password, user.passwordHash);
		if (!ok) return res.status(401).json({ message: "Invalid credentials" });

		user.lastLogin = new Date();
		await user.save({ validateBeforeSave: false });

		return sendAuth(res, user, 200);
	} catch (err) {
		console.error("[authController.login] error:", err?.message);
		return res.status(500).json({ message: "Login failed" });
	}
};

export const me = async (req, res) => {
	try {
		const userId = req.user?.id || req.user?.sub;
		if (!userId) return res.status(401).json({ message: "Not authenticated" });

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		return res.json(serializeUser(user));
	} catch (err) {
		console.error("[authController.me] error:", err?.message);
		return res.status(500).json({ message: "Failed to fetch profile" });
	}
};

export const logout = async (_req, res) => {
	try {
		res.clearCookie(AUTH_COOKIE_NAME, { ...cookieOpts, maxAge: undefined });
		return res.status(200).json({ message: "Logged out" });
	} catch (err) {
		console.error("[authController.logout] error:", err?.message);
		return res.status(500).json({ message: "Failed to logout" });
	}
};
