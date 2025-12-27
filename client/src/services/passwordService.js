import apiClient from "./apiClient.js";

// POST /api/auth/forgot-password
export async function requestPasswordReset(email) {
	const res = await apiClient.post("/auth/forgot-password", { email });
	return res.data;
}

// POST /api/auth/reset-password
export async function resetPassword({ email, token, password }) {
	const res = await apiClient.post("/auth/reset-password", { email, token, password });
	return res.data;
}
