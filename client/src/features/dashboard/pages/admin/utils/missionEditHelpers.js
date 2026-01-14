// src/features/dashboard/pages/admin/utils/missionEditHelpers.js

export const CATEGORIES = ["Home", "Transport", "Food", "Energy", "Waste", "Water", "Community"];
export const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export function ensureFieldId(field) {
	// keeps existing _id if it exists; otherwise adds a stable one for React keys
	return {
		_id: field?._id || crypto.randomUUID(),
		key: field?.key || "",
		label: field?.label || "",
		type: field?.type || "text",
		required: field?.required ?? true,
		options: Array.isArray(field?.options) ? field.options : [],
	};
}

export function missionToEditForm(m) {
	return {
		title: m?.title || "",
		slug: m?.slug || "",
		summary: m?.summary || "",
		description: m?.description || "",
		category: m?.category || "Home",
		difficulty: m?.difficulty || "Easy",
		duration: m?.duration || "15 min",
		points: m?.points ?? 10,
		tagsText: Array.isArray(m?.tags) ? m.tags.join(", ") : "",
		imageUrl: m?.imageUrl || "",
		requiresSubmission: m?.requiresSubmission ?? true,
		isPublished: m?.isPublished ?? true,
		estImpact: {
			co2Kg: m?.estImpact?.co2Kg ?? 0,
			waterL: m?.estImpact?.waterL ?? 0,
			wasteKg: m?.estImpact?.wasteKg ?? 0,
		},
		submissionSchema: Array.isArray(m?.submissionSchema)
			? m.submissionSchema.map(ensureFieldId)
			: [],
	};
}

export function editFormToPayload(form) {
	return {
		title: form.title.trim(),
		slug: form.slug.trim(),
		summary: form.summary.trim(),
		description: form.description.trim(),
		category: form.category,
		difficulty: form.difficulty,
		duration: form.duration.trim(),
		points: Number(form.points) || 0,
		imageUrl: form.imageUrl.trim(),
		requiresSubmission: !!form.requiresSubmission,
		isPublished: !!form.isPublished,

		tags: form.tagsText
			.split(",")
			.map((t) => t.trim())
			.filter(Boolean),

		estImpact: {
			co2Kg: Number(form.estImpact.co2Kg) || 0,
			waterL: Number(form.estImpact.waterL) || 0,
			wasteKg: Number(form.estImpact.wasteKg) || 0,
		},

		// strip _id so backend never sees it
		submissionSchema: (form.submissionSchema || [])
			.filter((f) => f.key?.trim() && f.label?.trim())
			.map((f) => ({
				key: f.key.trim(),
				label: f.label.trim(),
				type: f.type || "text",
				required: !!f.required,
				options: f.type === "select" ? f.options || [] : [],
			})),
	};
}
