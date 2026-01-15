// client/src/features/dashboard/home/utils/dashboardHomeHelpers.js

export function normalizeSubmissions(res) {
	// supports array, { submissions }, { data }, { items }, etc.
	const data = res?.data ?? res?.items ?? res;
	if (Array.isArray(data)) return data;
	if (Array.isArray(data?.submissions)) return data.submissions;
	return [];
}

export function getToneFromStatus(status) {
	switch (status) {
		case "approved":
			return "green";
		case "pending":
			return "amber";
		case "rejected":
			return "rejected";
		default:
			return "blue";
	}
}

export function formatWhen(dateStr) {
	if (!dateStr) return "Unknown date";
	try {
		return new Date(dateStr).toLocaleString();
	} catch {
		return "Unknown date";
	}
}
