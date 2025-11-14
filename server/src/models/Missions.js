import mongoose from "mongoose";

const submissionFieldSchema = new mongoose.Schema(
	{
		key: { type: String, required: true },
		label: { type: String, required: true },
		type: { type: String, enum: ["text", "number", "select", "url", "file"], default: "text" },
		required: { type: Boolean, default: true },
		options: [{ type: String }],
	},
	{ _id: false }
);

const missionSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		slug: { type: String, unique: true, index: true },
		summary: { type: String, required: true },
		description: { type: String, required: true },
		category: {
			type: String,
			enum: ["Home", "Transport", "Food", "Energy", "Waste", "Water", "Community"],
			default: "Home",
		},
		difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Easy" },
		estImpact: {
			co2Kg: { type: Number, default: 0 },
			waterL: { type: Number, default: 0 },
			wasteKg: { type: Number, default: 0 },
		},
		duration: { type: String, default: "15 min" },
		imageUrl: { type: String, default: "" },
		requiresSubmission: { type: Boolean, default: true },
		submissionSchema: [submissionFieldSchema],
		points: { type: Number, default: 10 },
		tags: [{ type: String }],
		isPublished: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

export default mongoose.model("Mission", missionSchema);
