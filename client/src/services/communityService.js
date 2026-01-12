// src/services/communityService.js
import apiClient from "./apiClient.js";

export async function getCommunityOverview() {
	const res = await apiClient.get("/community/overview");
	return res.data;
}

export async function getCommunityOverviewPublic() {
	const { data } = await apiClient.get("/community/overview-public");
	return data;
}

export async function getCommunitySettings() {
	const { data } = await apiClient.get("/community/settings");
	return data.settings;
}

export async function updateCommunitySettings(payload) {
	const { data } = await apiClient.put("/community/settings", payload);
	return data.settings;
}