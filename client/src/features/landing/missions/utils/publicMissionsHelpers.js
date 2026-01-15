// client/src/features/landing/missions/utils/publicMissionsHelpers.js

export const PAGE_SIZE_OPTIONS = [6, 12, 24];

export function normalizeMissions(res) {
	const data = res?.data ?? res?.items ?? res;
	if (Array.isArray(data)) return data;
	if (Array.isArray(data?.missions)) return data.missions;
	return [];
}

export function clamp(lines) {
	return {
		display: "-webkit-box",
		WebkitBoxOrient: "vertical",
		WebkitLineClamp: lines,
		overflow: "hidden",
	};
}

export function difficultyColor(difficulty) {
	if (difficulty === "Easy") return "success";
	if (difficulty === "Hard") return "error";
	if (difficulty) return "warning";
	return "default";
}
