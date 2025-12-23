// src/services/userService.js
import apiClient from "./apiClient.js";

export async function updateMe(payload) {
	const res = await apiClient.put("/users/me", payload);
	return res.data;
}

// ✅ Admin CRM
export async function getAllUsersAdmin() {
	const res = await apiClient.get("/users"); // GET /api/users
	return res.data;
}

export async function setUserAdminStatus(id, patch) {
	const res = await apiClient.patch(`/users/${id}`, patch); // PATCH /api/users/:id
	return res.data;
}

export async function deleteUserAdmin(id) {
	const res = await apiClient.delete(`/users/${id}`); // DELETE /api/users/:id
	return res.data; // likely empty (204)
}
