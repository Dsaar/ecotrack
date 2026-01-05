// src/services/checkinsService.js
import apiClient from "./apiClient.js";

export async function getMyCheckins() {
	return apiClient.get("/checkins/mine");
}
