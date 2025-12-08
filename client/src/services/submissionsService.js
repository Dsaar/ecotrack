// src/services/submissionsService.js
import apiClient from "./apiClient.js";

export async function getMySubmissions() {
	const res = await apiClient.get("/submissions/mine"); // ✅ matches router.get("/mine", ...)
	return res.data; // array of submissions with missionId populated
}
