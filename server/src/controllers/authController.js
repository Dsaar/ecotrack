import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/Users.js";

const {
	JWT_SECRET = "dev_secret_change_me",
	JWT_EXPIRES_IN = "7d",
} = process.env;

const signToken = (user) =>
	jwt.sign(
		{ sub: user._id.toString(), email: user.email, isAdmin: user.isAdmin },
		JWT_SECRET,
		{ expiresIn: JWT_EXPIRES_IN }
	);

export const register = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		const exists = await User.findOne({ email });
		if (exists) return res.status(409).json({ message: "Email already in use" });

		const passwordHash = await bcrypt.hash(password, 12);
		const user = await User.create({ name, email, passwordHash });

		const token = signToken(user);
		return res.status(201).json({
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				isAdmin: user.isAdmin,
				points: user.points,
				favorites: user.favorites,
			},
		});
	} catch (err) {
		return res.status(500).json({ message: "Registration failed" });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// explicitly select passwordHash
		const user = await User.findOne({ email }).select("+passwordHash");
		if (!user) return res.status(401).json({ message: "Invalid credentials" });

		const ok = await bcrypt.compare(password, user.passwordHash);
		if (!ok) return res.status(401).json({ message: "Invalid credentials" });

		const token = signToken(user);
		return res.json({
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				isAdmin: user.isAdmin,
				points: user.points,
				favorites: user.favorites,
			},
		});
	} catch (err) {
		return res.status(500).json({ message: "Login failed" });
	}
};

export const me = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		if (!user) return res.status(404).json({ message: "User not found" });

		return res.json({
			id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			points: user.points,
			favorites: user.favorites,
		});
	} catch (err) {
		return res.status(500).json({ message: "Failed to fetch profile" });
	}
};
