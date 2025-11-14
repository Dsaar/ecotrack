import mongoose from "mongoose";

const checkinSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
		missionId: { type: mongoose.Schema.Types.ObjectId, ref: "Mission", required: true, index: true },
		submissionId: { type: mongoose.Schema.Types.ObjectId, ref: "Submission", required: true },
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
