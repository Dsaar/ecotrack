// client/src/features/dashboard/missions/hooks/useDashboardMissions.js
import { useCallback, useEffect, useMemo, useState } from "react";

import {
	getMissions,
	getMissionsAdmin,
	patchMission,
	deleteMission,
} from "../../../../services/missionsService.js";

import {
	filterMissions,
	normalizeMissionsResponse,
	paginate,
	validateEditForm,
} from "../utils/missionsHelpers.js";

export default function useDashboardMissions({ isAdmin, query, showError, showSuccess }) {
	const [missions, setMissions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	// pagination
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(6);

	// edit dialog
	const [editOpen, setEditOpen] = useState(false);
	const [editId, setEditId] = useState(null);
	const [editForm, setEditForm] = useState({
		title: "",
		summary: "",
		category: "Home",
		difficulty: "Easy",
		points: 10,
	});
	const [saving, setSaving] = useState(false);

	// delete dialog
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [deleting, setDeleting] = useState(false);

	const loadMissions = useCallback(async () => {
		try {
			setLoading(true);
			setError("");

			const data = isAdmin ? await getMissionsAdmin() : await getMissions();
			setMissions(normalizeMissionsResponse(data));
		} catch (err) {
			console.error("Failed to load dashboard missions:", err);
			const msg =
				err?.response?.data?.message || "Could not load missions. Please try again.";
			setError(msg);
			showError?.(msg);
		} finally {
			setLoading(false);
		}
	}, [isAdmin, showError]);

	useEffect(() => {
		loadMissions();
	}, [loadMissions]);

	const filteredMissions = useMemo(
		() => filterMissions(missions, query),
		[missions, query]
	);

	useEffect(() => {
		setPage(1);
	}, [query, pageSize]);

	const paging = useMemo(
		() => paginate(filteredMissions, page, pageSize),
		[filteredMissions, page, pageSize]
	);

	// actions
	const openDelete = (mission) => {
		setDeleteTarget(mission);
		setDeleteOpen(true);
	};

	const closeDelete = () => {
		if (deleting) return;
		setDeleteOpen(false);
		setDeleteTarget(null);
	};

	const confirmDelete = async () => {
		if (!deleteTarget?._id) return;

		const id = deleteTarget._id;
		const prev = missions;

		setMissions((cur) => cur.filter((m) => m._id !== id));

		try {
			setDeleting(true);
			await deleteMission(id);
			showSuccess?.("Mission deleted.");
			closeDelete();
		} catch (err) {
			console.error("Delete mission failed:", err);
			setMissions(prev);
			showError?.(err?.response?.data?.message || "Failed to delete mission.");
		} finally {
			setDeleting(false);
		}
	};

	const togglePublish = async (mission) => {
		try {
			const next = !mission.isPublished;

			setMissions((prev) =>
				prev.map((m) => (m._id === mission._id ? { ...m, isPublished: next } : m))
			);

			await patchMission(mission._id, { isPublished: next });
			showSuccess?.(next ? "Mission published." : "Mission unpublished.");
		} catch (err) {
			console.error("Toggle publish failed:", err);

			setMissions((prev) =>
				prev.map((m) =>
					m._id === mission._id ? { ...m, isPublished: mission.isPublished } : m
				)
			);

			showError?.(err?.response?.data?.message || "Failed to update publish status.");
		}
	};

	const openEdit = (mission) => {
		setEditId(mission._id);
		setEditForm({
			title: mission.title || "",
			summary: mission.summary || "",
			category: mission.category || "Home",
			difficulty: mission.difficulty || "Easy",
			points: Number.isFinite(mission.points) ? mission.points : 10,
		});
		setEditOpen(true);
	};

	const closeEdit = () => {
		if (saving) return;
		setEditOpen(false);
		setEditId(null);
	};

	const saveEdit = async () => {
		if (!editId) return;

		const errMsg = validateEditForm(editForm);
		if (errMsg) return showError?.(errMsg);

		const pointsNum = Number(editForm.points);

		try {
			setSaving(true);

			const payload = {
				title: editForm.title.trim(),
				summary: editForm.summary.trim(),
				category: editForm.category,
				difficulty: editForm.difficulty,
				points: pointsNum,
			};

			const updated = await patchMission(editId, payload);
			setMissions((prev) => prev.map((m) => (m._id === editId ? updated : m)));

			showSuccess?.("Mission updated.");
			closeEdit();
		} catch (err) {
			console.error("[DashboardMissions] edit save failed", err);
			showError?.(err?.response?.data?.message || "Failed to update mission.");
		} finally {
			setSaving(false);
		}
	};

	return {
		missions,
		loading,
		error,

		page,
		setPage,
		pageSize,
		setPageSize,
		paging,

		editOpen,
		editForm,
		setEditForm,
		openEdit,
		closeEdit,
		saveEdit,
		saving,

		deleteOpen,
		deleteTarget,
		openDelete,
		closeDelete,
		confirmDelete,
		deleting,

		togglePublish,
		reload: loadMissions,
	};
}
