import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			minlength: 2,
			maxlength: 100,
		},

		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			match: [/^\S+@\S+\.\S+$/, "Invalid email format"], // RFC2822-ish
		},

		passwordHash: {
			type: String,
			required: true,
			select: false, // don’t return by default
		},

		isAdmin: {
			type: Boolean,
			default: false,
		},

		avatarUrl: {
			type: String,
			default: "",
		},

		points: {
			type: Number,
			default: 0,
			min: 0,
		},

		favorites: {
			missions: [
				{
					type: Schema.Types.ObjectId,
					ref: "Mission", // ✅ matches your new structure
					default: [],
				},
			],
		},
	},
	{ timestamps: true }
);

const User = model("User", userSchema);
export default User;
