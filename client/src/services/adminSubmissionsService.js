import apiClient from "./apiClient.js";

export function adminListSubmissions({
	status = "pending",
	missionId,
	userId,
	page = 1,
	limit = 20,
} = {}) {
	return apiClient.get("/admin/submissions", {
		params: { status, missionId, userId, page, limit },
	});
}

export function adminApproveSubmission(id) {
	return apiClient.patch(`/admin/submissions/${id}/approve`);
}

export function adminRejectSubmission(id, reason = "") {
	return apiClient.patch(`/admin/submissions/${id}/reject`, { reason });
}
