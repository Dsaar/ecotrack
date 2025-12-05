// src/services/authService.js
import apiClient from "./apiClient";

// Adjust field names if your backend expects different ones

export async function login({ email, password }) {
	const res = await apiClient.post("/auth/login", { email, password });
	// Expecting: { token, user }
	return res.data;
}

export async function register(payload) {
	const res = await apiClient.post("/auth/register", payload);
	// Expecting: { token, user }
	return res.data;
}

export async function getCurrentUser() {
	const res = await apiClient.get("/auth/me");
	// Expecting: { user } or just user
	return res.data;
}
