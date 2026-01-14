// src/features/dashboard/pages/admin/hooks/useMissionEditForm.js
import { useEffect, useState } from "react";
import { getMissionById, updateMission } from "../../../../../services/missionsService.js";
import { editFormToPayload, ensureFieldId, missionToEditForm } from "../utils/missionEditHelpers.js";

const emptyField = () =>
	ensureFieldId({
		key: "",
		label: "",
		type: "text",
		required: true,
		options: [],
	});

export default function useMissionEditForm({ id, showSuccess, showError, navigate }) {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	const [form, setForm] = useState(missionToEditForm(null));

	useEffect(() => {
		let cancelled = false;

		(async () => {
			try {
				setLoading(true);
				const m = await getMissionById(id);
				if (cancelled) return;
				setForm(missionToEditForm(m));
			} catch (err) {
				console.error("[AdminMissionEditPage] load failed", err);
				showError?.(err?.response?.data?.message || "Failed to load mission.");
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [id, showError]);

	const setField = (key, value) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	const setImpact = (key, value) => {
		setForm((p) => ({ ...p, estImpact: { ...p.estImpact, [key]: value } }));
	};

	// ----- submission schema helpers -----
	const addSubmissionField = () => {
		setForm((p) => ({ ...p, submissionSchema: [...(p.submissionSchema || []), emptyField()] }));
	};

	const removeSubmissionField = (index) => {
		setForm((p) => ({
			...p,
			submissionSchema: (p.submissionSchema || []).filter((_, i) => i !== index),
		}));
	};

	const updateSubmissionField = (index, key, value) => {
		setForm((p) => {
			const next = [...(p.submissionSchema || [])];
			next[index] = { ...next[index], [key]: value };
			return { ...p, submissionSchema: next };
		});
	};

	const handleSave = async () => {
		try {
			setSaving(true);
			await updateMission(id, editFormToPayload(form));
			showSuccess?.("Mission updated.");
			navigate("/dashboard/missions");
		} catch (err) {
			console.error("[AdminMissionEditPage] save failed", err);
			showError?.(err?.response?.data?.message || "Failed to update mission.");
		} finally {
			setSaving(false);
		}
	};

	return {
		loading,
		saving,
		form,
		setField,
		setImpact,
		addSubmissionField,
		removeSubmissionField,
		updateSubmissionField,
		handleSave,
	};
}
