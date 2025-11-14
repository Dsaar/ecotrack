import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
	{
		key: { type: String, required: true },
		value: { type: mongoose.Schema.Types.Mixed, required: true },
	},
	{ _id: false }
);

const submissionSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
		missionId: { type: mongoose.Schema.Types.ObjectId, ref: "Mission", required: true, index: true },
		answers: [answerSchema],
		evidenceUrls: [{ type: String }],
		status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
		reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		reviewedAt: { type: Date },
		rejectionReason: { type: String },
		pointsAwarded: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

submissionSchema.index({ userId: 1, missionId: 1, status: 1 });

export default mongoose.model("Submission", submissionSchema);
