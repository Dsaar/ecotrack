import User from "../models/Users.js";

export const getMe = async (req, res) => {
	const user = await User.findById(req.user.id);
	if (!user) return res.status(404).json({ message: "User not found" });
	res.json({
		id: user._id, name: user.name, email: user.email,
		isAdmin: user.isAdmin, points: user.points, favorites: user.favorites
	});
};

export const updateMe = async (req, res) => {
	const { name } = req.body; // keep minimal; add more fields if you like
	const user = await User.findByIdAndUpdate(
		req.user.id,
		{ $set: { name } },
		{ new: true, runValidators: true }
	);
	res.json({
		id: user._id, name: user.name, email: user.email,
		isAdmin: user.isAdmin, points: user.points, favorites: user.favorites
	});
};

export const patchMe = async (req, res) => {
	try {
		const updates = req.body;
		if (!updates || Object.keys(updates).length === 0) {
			return res.status(400).json({ message: "No fields provided to update" });
		}

		const user = await User.findByIdAndUpdate(
			req.user.id,
			{ $set: updates },
			{ new: true, runValidators: true }
		);

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
		console.error("[patchMe] error:", err);
		return res.status(500).json({ message: "Failed to update user" });
	}
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
