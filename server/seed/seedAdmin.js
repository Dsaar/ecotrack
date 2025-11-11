// Tiny seeder to insert one admin user (idempotent)
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../src/models/Users.js";

const {
	MONGODB_URI = "mongodb://127.0.0.1:27017/ecotrack",
	ADMIN_NAME = "Admin",
	ADMIN_EMAIL = "admin@example.com",
	ADMIN_PASSWORD = "Admin#1234",
} = process.env;

(async () => {
	try {
		await mongoose.connect(MONGODB_URI);
		const existing = await User.findOne({ email: ADMIN_EMAIL }).select("_id");
		if (existing) {
			console.log(`[seed] Admin already exists: ${ADMIN_EMAIL}`);
			process.exit(0);
		}

		const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
		const admin = await User.create({
			name: ADMIN_NAME,
			email: ADMIN_EMAIL,
			passwordHash,
			isAdmin: true,
		});

		console.log(`[seed] Admin created (${admin.email})`);
		process.exit(0);
	} catch (err) {
		console.error("[seed] Failed:", err?.message || err);
		process.exit(1);
	}
})();
