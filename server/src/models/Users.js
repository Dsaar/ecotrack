import mongoose from "mongoose";
import { Name } from "../helpers/submodels/Name.js";
import { Address } from "../helpers/submodels/Address.js";
import { Image } from "../helpers/submodels/Image.js";

const { Schema, model } = mongoose;

const userSchema = new Schema(
	{
		// submodel: { first, middle, last }
		name: {
			type: Name,
			required: true,
		},

		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
		},

		passwordHash: {
			type: String,
			required: true,
			select: false,
		},

		phone: {
			type: String,
			trim: true,
		},

		// submodel: { country, city, street, houseNumber, zip, state }
		address: {
			type: Address,
		},

		// keep name "avatarUrl" for controller compatibility
		// submodel: { url, alt }
		avatarUrl: {
			type: Image,
			default: undefined,
		},

		// keep isAdmin for current auth + admin logic
		isAdmin: {
			type: Boolean,
			default: false,
		},

		// optional role (nice to have, not used yet)
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
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
					ref: "Missions", // must match mission model name
					default: [],
				},
			],
			submissions: [
				{
					type: Schema.Types.ObjectId,
					ref: "Submission",
					default: [],
				},
			],
		},
	},
	{ timestamps: true }
);

const User = model("User", userSchema);
export default User;
