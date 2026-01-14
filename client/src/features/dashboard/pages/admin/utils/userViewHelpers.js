// src/features/dashboard/pages/admin/utils/userViewHelpers.js

export function getAvatarSrc(u) {
	if (!u) return "";
	if (typeof u.avatarUrl === "string") return u.avatarUrl;
	return u.avatarUrl?.url || "";
}

export function getDisplayName(u) {
	const first = u?.name?.first || "";
	const last = u?.name?.last || "";
	const full = `${first} ${last}`.trim();
	return full || "—";
}

export function isSelfUser(currentUser, rowUser) {
	return String(currentUser?._id) === String(rowUser?._id);
}

export function normalizeQuery(query) {
	return (query || "").trim().toLowerCase();
}

export function userMatchesQuery(u, q) {
	if (!q) return true;

	const first = (u?.name?.first || "").toLowerCase();
	const last = (u?.name?.last || "").toLowerCase();
	const email = (u?.email || "").toLowerCase();
	const phone = (u?.phone || "").toLowerCase();
	const roleText = u?.isAdmin ? "admin" : "user";
	const fullName = `${first} ${last}`.trim();

	return (
		fullName.includes(q) ||
		first.includes(q) ||
		last.includes(q) ||
		email.includes(q) ||
		phone.includes(q) ||
		roleText.includes(q)
	);
}

export const PAGE_SIZE_OPTIONS = [6, 12, 24];
