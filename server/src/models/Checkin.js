import mongoose from "mongoose";

const checkinSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},

		// ✅ MUST MATCH mongoose.model("Missions", ...)
		missionId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Missions",
			required: true,
			index: true,
		},

		submissionId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Submission",
			required: true,
			index: true,
		},

		date: { type: Date, default: Date.now },
		notes: { type: String, default: "" },

		impact: {
			co2Kg: { type: Number, default: 0 },
			waterL: { type: Number, default: 0 },
			wasteKg: { type: Number, default: 0 },
		},

		points: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

export default mongoose.model("Checkin", checkinSchema);
