// src/services/communityService.js
import apiClient from "./apiClient.js";

export async function getCommunityOverview() {
	const res = await apiClient.get("/community/overview");
	return res.data;
}
