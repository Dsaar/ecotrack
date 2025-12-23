import User from "../models/Users.js";
import { isObjectId } from "../utils/isObjectId.js";

export const getMe = async (req, res, next) => {
	try {
		// Exclude passwordHash, return everything else
		const user = await User.findById(req.user.id).select("-passwordHash");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Shape the object exactly how the frontend expects it
		const {
			_id,
			name,
			email,
			phone,
			address,
			isAdmin,
			points,
			favorites,
			missions,
			submissions,
			avatarUrl,
		} = user;

		return res.json({
			id: _id,
			name,
			email,
			phone,
			address,
			isAdmin,
			points,
			favorites,
			missions,
			submissions,
			avatarUrl,
		});
	} catch (err) {
		console.error("[getMe]", err);
		return next(err);
	}
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
	const users = await User.find().select("name email phone isAdmin points");
	res.json(users);
};

export const deleteUser = async (req, res) => {
	try {
		const { id } = req.params;

		if (!isObjectId(id)) {
			return res.status(400).json({ message: "Invalid user id" });
		}

		const deleted = await User.findByIdAndDelete(id);
		if (!deleted) return res.status(404).json({ message: "User not found" });

		return res.status(204).end();
	} catch (err) {
		console.error("[deleteUser]", err);
		return res.status(500).json({ message: "Failed to delete user" });
	}
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

		const { _id, name, email, phone, isAdmin, points, favorites, avatarUrl } = user;

		return res.json({
			_id,
			name,
			email,
			phone,
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
