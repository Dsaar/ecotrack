// client/src/features/dashboard/missions/utils/missionsHelpers.js

export const CATEGORY_OPTIONS = [
	"Home",
	"Transport",
	"Food",
	"Energy",
	"Waste",
	"Water",
	"Community",
];

export const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];
export const PAGE_SIZE_OPTIONS = [6, 12, 24];

export function normalizeMissionsResponse(data) {
	if (Array.isArray(data)) return data;
	return data?.missions || [];
}

export function filterMissions(missions, query) {
	const q = (query || "").trim().toLowerCase();
	if (!q) return missions;

	return missions.filter((m) => {
		const title = (m?.title || "").toLowerCase();
		const summary = (m?.summary || "").toLowerCase();
		const category = (m?.category || "").toLowerCase();
		const difficulty = (m?.difficulty || "").toLowerCase();
		const tags = Array.isArray(m?.tags) ? m.tags.join(" ").toLowerCase() : "";

		return (
			title.includes(q) ||
			summary.includes(q) ||
			category.includes(q) ||
			difficulty.includes(q) ||
			tags.includes(q)
		);
	});
}

export function paginate(items, page, pageSize) {
	const total = items.length;
	const pageCount = Math.max(1, Math.ceil(total / pageSize));
	const safePage = Math.min(page, pageCount);

	const startIndex = (safePage - 1) * pageSize;
	const endIndex = Math.min(startIndex + pageSize, total);
	const pagedItems = items.slice(startIndex, endIndex);

	return { total, pageCount, safePage, startIndex, endIndex, pagedItems };
}

export function validateEditForm(editForm) {
	if (!editForm.title?.trim()) return "Title is required.";
	if (!editForm.summary?.trim()) return "Summary is required.";
	if (!CATEGORY_OPTIONS.includes(editForm.category)) return "Invalid category.";
	if (!DIFFICULTY_OPTIONS.includes(editForm.difficulty)) return "Invalid difficulty.";

	const pointsNum = Number(editForm.points);
	if (!Number.isFinite(pointsNum) || pointsNum < 0) return "Points must be 0 or more.";

	return null;
}
