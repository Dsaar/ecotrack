import apiClient from "./apiClient.js";

export function adminListSubmissions(params = {}) {
	// params: { status, missionId, userId, page, limit }
	return apiClient.get("/admin/submissions", { params });
}

export function adminApproveSubmission(id) {
	return apiClient.patch(`/admin/submissions/${id}/approve`);
}

export function adminRejectSubmission(id, reason = "") {
	return apiClient.patch(`/admin/submissions/${id}/reject`, { reason });
}
