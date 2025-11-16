import mongoose from "mongoose";
import User from "../models/Users.js";
import { isObjectId } from "../utils/isObjectId.js";
import "../models/Missions.js";


// Add a mission to user favorites
export const addMissionFavorite = async (req, res) => {
	const { id } = req.params;

	if (!isObjectId(id)) {
		return res.status(400).json({ message: "Invalid mission id" });
	}

	try {
		const user = await User.findByIdAndUpdate(
			req.user.id,
			{
				$addToSet: {
					"favorites.missions": new mongoose.Types.ObjectId(id),
				},
			},
			{ new: true }
		);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		return res.json({
			missions: user.favorites?.missions || [],
		});
	} catch (e) {
		console.error("[addMissionFavorite]", e);
		return res.status(500).json({ message: "Failed to add favorite" });
	}
};

// Remove a mission from user favorites
export const removeMissionFavorite = async (req, res) => {
	const { id } = req.params;

	if (!isObjectId(id)) {
		return res.status(400).json({ message: "Invalid mission id" });
	}

	try {
		const user = await User.findByIdAndUpdate(
			req.user.id,
			{
				$pull: {
					"favorites.missions": new mongoose.Types.ObjectId(id),
				},
			},
			{ new: true }
		);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		return res.json({
			missions: user.favorites?.missions || [],
		});
	} catch (e) {
		console.error("[removeMissionFavorite]", e);
		return res.status(500).json({ message: "Failed to remove favorite" });
	}
};

// List all mission favorites for current user
export const listMissionFavorites = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).populate("favorites.missions");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		return res.json({
			missions: user.favorites?.missions || [],
		});
	} catch (e) {
		console.error("[listMissionFavorites]", e);
		return res.status(500).json({ message: "Failed to list favorites" });
	}
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
