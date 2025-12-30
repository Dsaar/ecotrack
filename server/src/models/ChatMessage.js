import mongoose from "mongoose";

const { Schema, model } = mongoose;

const chatMessageSchema = new Schema(
	{
		senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		content: { type: String, required: true, trim: true, maxlength: 2000 },
		seenAt: { type: Date, default: null },

	},
	{ timestamps: true }
);

export default model("ChatMessage", chatMessageSchema);
