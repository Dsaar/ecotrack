import mongoose from "mongoose";
import User from "../models/Users.js";

export const addFavorite = async (req, res) => {
	const { itemId } = req.params;
	// optionally validate itemId shape if it's an ObjectId
	const user = await User.findByIdAndUpdate(
		req.user.id,
		{ $addToSet: { favorites: itemId } },
		{ new: true }
	);
	if (!user) return res.status(404).json({ message: "User not found" });
	return res.json({ favorites: user.favorites });
};

export const removeFavorite = async (req, res) => {
	const { itemId } = req.params;
	const user = await User.findByIdAndUpdate(
		req.user.id,
		{ $pull: { favorites: itemId } },
		{ new: true }
	);
	if (!user) return res.status(404).json({ message: "User not found" });
	return res.json({ favorites: user.favorites });
};

export const awardPoints = async (req, res) => {
	try {
		const { id } = req.params;
		const deltaRaw = req.body?.delta;

		// 1) validate params/body
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid user id" });
		}
		const delta = Number(deltaRaw);
		if (!Number.isFinite(delta)) {
			return res.status(400).json({ message: "delta must be a number" });
		}

		// 2) update
		const user = await User.findByIdAndUpdate(
			id,
			{ $inc: { points: delta } },
			{ new: true }
		);

		// 3) handle not found
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// 4) success
		return res.json({ id: user._id, points: user.points });
	} catch (err) {
		console.error("[awardPoints] error:", err);
		return res.status(500).json({ message: "Failed to award points" });
	}
};
