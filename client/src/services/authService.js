// src/services/authService.js
import apiClient from "./apiClient.js";

/**
 * POST /api/auth/login
 * body: { email, password }
 */
export async function login(credentials) {
	const res = await apiClient.post("/auth/login", credentials);
	return res.data;
}

/**
 * POST /api/auth/register
 * body: full user object (we'll build it in RegisterForm)
 */
export async function register(payload) {
	const res = await apiClient.post("/auth/register", payload);
	return res.data;
}

/**
 * GET /api/auth/me
 * returns current user based on token
 */
export async function getCurrentUser() {
	// This hits /api/users/me (full profile from userController.getMe)
	const res = await apiClient.get("/users/me");
	return res.data;
}

/* export async function getCurrentUser() {
	const res = await apiClient.get("/users/me");
	return res.data; // expect full user: name, phone, address, points, missions, submissions...
} */