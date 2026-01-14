// src/features/dashboard/pages/admin/hooks/useMissionCreateForm.js
import { useMemo, useState } from "react";
import { createMission } from "../../../../../services/missionsService.js";
import { clearErr, emptyField, slugify } from "../utils/missionFormHelpers.js";

export default function useMissionCreateForm({ showSuccess, showError, navigate }) {
	const [saving, setSaving] = useState(false);
	const [errors, setErrors] = useState({});

	const [form, setForm] = useState({
		title: "",
		slug: "",
		summary: "",
		description: "",
		category: "Home",
		difficulty: "Easy",
		duration: "15 min",
		points: 10,
		imageUrl: "",
		isPublished: true,

		tagsText: "",
		requiresSubmission: true,
		estImpact: { co2Kg: 0, waterL: 0, wasteKg: 0 },
		submissionSchema: [],
	});

	const autoSlug = useMemo(() => slugify(form.title), [form.title]);

	const setField = (key, value) => {
		setForm((p) => ({ ...p, [key]: value }));
		clearErr(setErrors, key);
	};

	const setImpact = (key, value) => {
		setForm((p) => ({ ...p, estImpact: { ...p.estImpact, [key]: value } }));
		clearErr(setErrors, `estImpact.${key}`);
	};

	const addSubmissionField = () => {
		setForm((p) => ({ ...p, submissionSchema: [...p.submissionSchema, emptyField()] }));
	};

	const removeSubmissionField = (index) => {
		setForm((p) => ({
			...p,
			submissionSchema: p.submissionSchema.filter((_, i) => i !== index),
		}));

		// clear index errors
		setErrors((prev) => {
			const next = { ...prev };
			Object.keys(next).forEach((k) => {
				if (k.startsWith(`submissionSchema.${index}.`)) delete next[k];
			});
			return next;
		});
	};

	const updateSubmissionField = (index, key, value) => {
		setForm((p) => {
			const next = [...p.submissionSchema];
			next[index] = { ...next[index], [key]: value };
			return { ...p, submissionSchema: next };
		});
		clearErr(setErrors, `submissionSchema.${index}.${key}`);
	};

	const buildPayload = () => ({
		title: form.title.trim(),
		slug: (form.slug || autoSlug).trim(),
		summary: form.summary.trim(),
		description: form.description.trim(),
		category: form.category,
		difficulty: form.difficulty,
		duration: form.duration.trim(),
		points: Number(form.points) || 0,
		imageUrl: form.imageUrl.trim(),
		isPublished: !!form.isPublished,

		requiresSubmission: !!form.requiresSubmission,
		tags: form.tagsText
			.split(",")
			.map((t) => t.trim())
			.filter(Boolean),

		estImpact: {
			co2Kg: Number(form.estImpact.co2Kg) || 0,
			waterL: Number(form.estImpact.waterL) || 0,
			wasteKg: Number(form.estImpact.wasteKg) || 0,
		},

		submissionSchema: (form.submissionSchema || [])
			.filter((f) => f.key?.trim() && f.label?.trim())
			.map((f) => ({
				key: f.key.trim(),
				label: f.label.trim(),
				type: f.type || "text",
				required: !!f.required,
				options: f.type === "select" ? f.options || [] : [],
			})),
	});

	const submit = async () => {
		setErrors({});

		// same minimal client checks
		if (!form.title.trim()) return showError?.("Title is required.");
		if (!form.summary.trim()) return showError?.("Summary is required.");
		if (!form.description.trim()) return showError?.("Description is required.");

		try {
			setSaving(true);
			const created = await createMission(buildPayload());
			showSuccess?.("Mission created.");
			navigate(`/dashboard/missions/${created._id}`);
		} catch (err) {
			console.error("[AdminMissionCreatePage] create failed", err);

			if (err.fieldErrors) setErrors(err.fieldErrors);

			showError?.(err.userMessage || err?.response?.data?.message || "Failed to create mission.");
		} finally {
			setSaving(false);
		}
	};

	return {
		form,
		errors,
		saving,
		autoSlug,

		setField,
		setImpact,

		addSubmissionField,
		removeSubmissionField,
		updateSubmissionField,

		submit,
	};
}
