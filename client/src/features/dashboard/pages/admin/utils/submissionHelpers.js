// src/features/dashboard/pages/admin/utils/submissionHelpers.js

export function isLikelyImageUrl(url = "") {
	return /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(url) || url.includes("picsum.photos");
}
