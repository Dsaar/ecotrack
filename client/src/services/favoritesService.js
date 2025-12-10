import apiClient from "./apiClient.js";

export function toggleFavoriteMission(missionId) {
	return apiClient.put(`/favorites/missions/${missionId}`);
}

export function getFavoriteMissions() {
	return apiClient.get("/favorites/missions");
}
