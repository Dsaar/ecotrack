// src/features/dashboard/pages/admin/utils/missionFormHelpers.js

export const CATEGORY_OPTIONS = ["Home", "Transport", "Food", "Energy", "Waste", "Water", "Community"];
export const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];
export const FIELD_TYPES = ["text", "number", "select", "url", "file"];

export function slugify(str = "") {
	return str
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
}

export const emptyField = () => ({
	key: "",
	label: "",
	type: "text",
	required: true,
	options: [],
});

// ---- helpers for nested form errors ----
export function getErr(errors, path) {
	return errors?.[path] || "";
}

export function clearErr(setErrors, path) {
	setErrors((prev) => {
		if (!prev?.[path]) return prev;
		const next = { ...prev };
		delete next[path];
		return next;
	});
}

export function optionsTextToArray(text = "") {
	return text
		.split(",")
		.map((x) => x.trim()) // ✅ bugfix: dot added
		.filter(Boolean);
}

export function optionsArrayToText(field) {
	return Array.isArray(field?.options) ? field.options.join(", ") : "";
}
