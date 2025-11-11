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
			match:
				// RFC2822-ish. Joi will also validate.
				[/^\S+@\S+\.\S+$/, "Invalid email format"],
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
		favorites: [
			{
				type: Schema.Types.ObjectId,
				ref: "Item", // adjust if your favorites are another entity
			},
		],
		points: {
			type: Number,
			default: 0,
			min: 0,
		},
	},
	{ timestamps: true }
);

const User = model("User", userSchema);
export default User;
