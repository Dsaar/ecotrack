import mongoose from "mongoose";

const communitySettingsSchema = new mongoose.Schema(
	{
		goalPointsTarget: { type: Number, default: 20000, min: 0 },
		// optional future goals:
		// goalCo2KgTarget: { type: Number, default: 0, min: 0 },
		// goalWaterLTarget: { type: Number, default: 0, min: 0 },
	},
	{ timestamps: true }
);

export default mongoose.model("CommunitySettings", communitySettingsSchema);
