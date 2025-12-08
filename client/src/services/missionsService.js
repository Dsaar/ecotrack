// src/services/missionsService.js
import apiClient from "./apiClient";

/**
 * Fetch missions list.
 * Optional filters: { category, difficulty, search, completed }
 */
export async function getMissions(params = {}) {
	const response = await apiClient.get("/missions", { params });
	return response.data;
}

/**
 * Fetch a single mission by id
 */
export async function getMissionById(id) {
	const response = await apiClient.get(`/missions/${id}`);
	return response.data;
}

/**
 * Create a new mission (admin / seeding use)
 */
export async function createMission(missionData) {
	const response = await apiClient.post("/missions", missionData);
	return response.data;
}

/**
 * Update an existing mission
 */
export async function updateMission(id, updates) {
	const response = await apiClient.put(`/missions/${id}`, updates);
	return response.data;
}

/**
 * Delete a mission
 */
export async function deleteMission(id) {
	const response = await apiClient.delete(`/missions/${id}`);
	return response.data;
}

/**
 * Mark a mission as completed for the current user
 * (adjust the URL if your backend uses a different route)
 */
export async function completeMission(missionId) {
	const payload = {
		missionId,
		answers: [],       // or add real answers later
		evidenceUrls: [],  // or a photo / link list later
	};

	const res = await apiClient.post("/submissions", payload);
	return res.data; // this is the created Submission document
}