// server/src/controllers/favoritesController.js
import User from "../models/Users.js";
import { isObjectId } from "../utils/isObjectId.js";

export const toggleFavoriteMission = async (req, res) => {
	try {
		const { missionId } = req.params;

		if (!isObjectId(missionId)) {
			return res.status(400).json({ message: "Invalid mission id" });
		}

		const user = await User.findById(req.user.id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (!user.favorites) {
			user.favorites = { missions: [], submissions: [] };
		}

		const missions = user.favorites.missions || [];
		const idx = missions.findIndex((m) => String(m) === String(missionId));

		if (idx === -1) {
			// Not yet favorited → add
			missions.push(missionId);
		} else {
			// Already favorited → remove
			missions.splice(idx, 1);
		}

		user.favorites.missions = missions;
		await user.save();

		return res.json({
			message: "Favorites updated",
			favorites: user.favorites,
		});
	} catch (err) {
		console.error("[toggleFavoriteMission]", err);
		return res
			.status(500)
			.json({ message: "Failed to update favorites" });
	}
};

export const listFavoriteMissions = async (req, res) => {
	try {
		const user = await User.findById(req.user.id)
			.populate(
				"favorites.missions",
				"title summary description category difficulty estImpact points slug"
			)
			.select("favorites");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const missions = user.favorites?.missions || [];
		return res.json(missions); // array of mission docs
	} catch (err) {
		console.error("[listFavoriteMissions]", err);
		return res
			.status(500)
			.json({ message: "Failed to load favorite missions" });
	}
};