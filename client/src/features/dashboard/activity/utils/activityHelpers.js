// client/src/features/dashboard/activity/utils/activityHelpers.js

export function normalizeArrayResponse(res) {
	if (Array.isArray(res)) return res;
	return res?.items || res?.data || [];
}

export function getSubmissionsArray(submissionsRes) {
	const raw = submissionsRes?.data ?? submissionsRes?.items ?? submissionsRes;
	if (Array.isArray(raw)) return raw;
	return raw?.items || [];
}

export function getRejectionReason(s) {
	return (
		s?.rejectionReason ||
		s?.adminNote ||
		s?.moderation?.reason ||
		s?.moderationReason ||
		s?.reason ||
		s?.reviewNote ||
		""
	);
}

export function sumCheckins(checkins) {
	return (checkins || []).reduce(
		(acc, c) => {
			acc.points += Number(c?.points || 0);
			acc.co2Kg += Number(c?.impact?.co2Kg || 0);
			acc.waterL += Number(c?.impact?.waterL || 0);
			acc.wasteKg += Number(c?.impact?.wasteKg || 0);
			return acc;
		},
		{ points: 0, co2Kg: 0, waterL: 0, wasteKg: 0 }
	);
}

export function statusLower(x) {
	return String(x || "").toLowerCase();
}

export function formatDateTime(dt) {
	try {
		return dt ? new Date(dt).toLocaleString() : "Unknown date";
	} catch {
		return "Unknown date";
	}
}

export function missionFromItem(item) {
	return item?.missionId || {};
}
