import User from "../models/Users.js";
import { isObjectId } from "../utils/isObjectId.js";

export const getMe = async (req, res) => {
	const user = await User.findById(req.user.id);
	if (!user) return res.status(404).json({ message: "User not found" });
	res.json({
		id: user._id, name: user.name, email: user.email,
		isAdmin: user.isAdmin, points: user.points, favorites: user.favorites
	});
};

export const updateMe = async (req, res, next) => {
	try {
		const allowedFields = ["name", "avatarUrl", "phone", "address"];

		const updateData = {};
		for (const field of allowedFields) {
			if (req.body[field] !== undefined) {
				updateData[field] = req.body[field];
			}
		}

		const updated = await User.findByIdAndUpdate(
			req.user.id,
			updateData,
			{ new: true }
		);

		if (!updated) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json(updated);
	} catch (err) {
		next(err);
	}
};



export const patchMe = async (req, res) => {
	try {
		const allowed = ["name", "avatarUrl"]; // extend as needed
		const updates = Object.fromEntries(
			Object.entries(req.body).filter(([k]) => allowed.includes(k))
		);
		if (!Object.keys(updates).length) {
			return res.status(400).json({ message: "No updatable fields provided" });
		}
		const user = await User.findByIdAndUpdate(
			req.user.id,
			{ $set: updates },
			{ new: true, runValidators: true }
		);
		if (!user) return res.status(404).json({ message: "User not found" });
		const { _id, name, email, isAdmin, points, favorites, avatarUrl } = user;
		return res.json({ id: _id, name, email, isAdmin, points, favorites, avatarUrl });
	} catch (err) {
		console.error("[patchMe]", err);
		return res.status(500).json({ message: "Failed to update user" });
	}
};

export const getUserById = async (req, res) => {
	const { id } = req.params;

	if (!isObjectId(id)) {
		return res.status(400).json({ message: "Invalid user id" });
	}

	const user = await User.findById(id).select("-passwordHash");

	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}

	return res.json(user);
};


// ---- Admin only ----
export const listUsers = async (_req, res) => {
	const users = await User.find().select("name email isAdmin points");
	res.json(users);
};

export const deleteUser = async (req, res) => {
	const { id } = req.params;
	await User.findByIdAndDelete(id);
	res.status(204).end();
};

export const adminUpdateUser = async (req, res) => {
	try {
		const allowed = ["name", "avatarUrl", "isAdmin"]; // admin may toggle role
		const updates = Object.fromEntries(
			Object.entries(req.body).filter(([k]) => allowed.includes(k))
		);
		if (!Object.keys(updates).length) {
			return res.status(400).json({ message: "No updatable fields provided" });
		}

		const user = await User.findByIdAndUpdate(
			req.params.id,
			{ $set: updates },
			{ new: true, runValidators: true }
		);

		if (!user) return res.status(404).json({ message: "User not found" });

		const { _id, name, email, isAdmin, points, favorites, avatarUrl } = user;
		return res.json({
			id: _id,
			name,
			email,
			isAdmin,
			points,
			favorites,
			avatarUrl,
		});
	} catch (err) {
		console.error("[adminUpdateUser]", err);
		return res.status(500).json({ message: "Failed to update user" });
	}
};
