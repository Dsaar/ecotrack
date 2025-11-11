// config/db.js
import mongoose from "mongoose";

export const connectDB = async () => {
	const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/app";
	mongoose.set("strictQuery", true);
	await mongoose.connect(uri);
	console.log("✅ MongoDB connected");
};
