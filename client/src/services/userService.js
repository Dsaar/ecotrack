// src/services/userService.js
import apiClient from "./apiClient.js";

// PUT /api/users/me  (matches your backend userController.updateMe)
export async function updateMe(payload) {
	const res = await apiClient.put("/users/me", payload);
	return res.data; // updated user document
}
