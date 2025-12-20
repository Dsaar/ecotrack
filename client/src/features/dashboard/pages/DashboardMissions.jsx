// src/features/dashboard/pages/DashboardMissions.jsx
import { useEffect, useState, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import FavoriteButton from "../../missions/components/FavoriteButton.jsx";
import { useUser } from "../../../app/providers/UserProvider.jsx";
import { useSnackbar } from "../../../app/providers/SnackBarProvider.jsx";

import {
	getMissions,
	getMissionsAdmin,
	patchMission,
} from "../../../services/missionsService.js";

import DashboardMissionsGrid from "../components/DashboardMissionsGrid.jsx";
import AdminMissionEditDialog from "../components/AdminMissionsEditDialog.jsx";

const CATEGORY_OPTIONS = [
	"Home",
	"Transport",
	"Food",
	"Energy",
	"Waste",
	"Water",
	"Community",
];
const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];

function DashboardMissions() {
	const [missions, setMissions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const navigate = useNavigate();
	const { user } = useUser();
	const { showSuccess, showError } = useSnackbar();

	const isAdmin = !!user?.isAdmin;

	// --- Edit dialog state ---
	const [editOpen, setEditOpen] = useState(false);
	const [editId, setEditId] = useState(null);
	const [editForm, setEditForm] = useState({
		title: "",
		summary: "",
		category: "Home",
		difficulty: "Easy",
		points: 10,
		// imageUrl: "",
	});
	const [saving, setSaving] = useState(false);

	const loadMissions = useCallback(async () => {
		try {
			setLoading(true);
			setError("");

			const data = isAdmin ? await getMissionsAdmin() : await getMissions();
			const items = Array.isArray(data) ? data : data?.missions || [];
			setMissions(items);
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
		let cancelled = false;

		(async () => {
			try {
				setLoading(true);
				setError("");

				const data = isAdmin ? await getMissionsAdmin() : await getMissions();
				if (!cancelled) {
					const items = Array.isArray(data) ? data : data?.missions || [];
					setMissions(items);
				}
			} catch (err) {
				console.error("Failed to load dashboard missions:", err);
				if (!cancelled) {
					const msg =
						err?.response?.data?.message || "Could not load missions. Please try again.";
					setError(msg);
					showError?.(msg);
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [isAdmin, showError]);

	const handleTogglePublish = async (mission) => {
		try {
			const next = !mission.isPublished;

			// optimistic UI
			setMissions((prev) =>
				prev.map((m) => (m._id === mission._id ? { ...m, isPublished: next } : m))
			);

			await patchMission(mission._id, { isPublished: next });

			showSuccess?.(next ? "Mission published." : "Mission unpublished.");
		} catch (err) {
			console.error("Toggle publish failed:", err);

			// rollback
			setMissions((prev) =>
				prev.map((m) =>
					m._id === mission._id ? { ...m, isPublished: mission.isPublished } : m
				)
			);

			showError?.(
				err?.response?.data?.message || "Failed to update publish status."
			);
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
			// imageUrl: mission.imageUrl || "",
		});
		setEditOpen(true);
	};

	const closeEdit = () => {
		if (saving) return;
		setEditOpen(false);
		setEditId(null);
	};

	const handleSaveEdit = async () => {
		if (!editId) return;

		if (!editForm.title.trim()) return showError?.("Title is required.");
		if (!editForm.summary.trim()) return showError?.("Summary is required.");
		if (!CATEGORY_OPTIONS.includes(editForm.category))
			return showError?.("Invalid category.");
		if (!DIFFICULTY_OPTIONS.includes(editForm.difficulty))
			return showError?.("Invalid difficulty.");

		const pointsNum = Number(editForm.points);
		if (!Number.isFinite(pointsNum) || pointsNum < 0)
			return showError?.("Points must be 0 or more.");

		try {
			setSaving(true);

			const payload = {
				title: editForm.title.trim(),
				summary: editForm.summary.trim(),
				category: editForm.category,
				difficulty: editForm.difficulty,
				points: pointsNum,
				// imageUrl: editForm.imageUrl?.trim() || "",
			};

			const updated = await patchMission(editId, payload);

			setMissions((prev) => prev.map((m) => (m._id === editId ? updated : m)));

			showSuccess?.("Mission updated.");
			setEditOpen(false);
			setEditId(null);
		} catch (err) {
			console.error("[DashboardMissions] edit save failed", err);
			showError?.(err?.response?.data?.message || "Failed to update mission.");
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<Box sx={{ p: { xs: 2, md: 3 } }}>
				<Typography variant="body2" color="text.secondary">
					Loading missions...
				</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ p: { xs: 2, md: 3 } }}>
			<Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
				{isAdmin ? "Missions (Admin)" : "My missions"}
			</Typography>

			<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
				{isAdmin
					? "View all missions, toggle publish status, and edit mission details."
					: "Pick a mission, complete it, and watch your eco points grow."}
			</Typography>

			{error && (
				<Typography color="error" sx={{ mb: 2 }}>
					{error}
				</Typography>
			)}

			<DashboardMissionsGrid
				missions={missions}
				isAdmin={isAdmin}
				onOpenDetails={(id) => navigate(`/dashboard/missions/${id}`)}
				onEdit={(mission) => openEdit(mission)}
				onEditPage={(id) => navigate(`/dashboard/admin/missions/${id}/edit`)}
				onTogglePublish={(mission) => handleTogglePublish(mission)}
				FavoriteButtonComponent={FavoriteButton}
			/>

			<AdminMissionEditDialog
				open={editOpen}
				saving={saving}
				form={editForm}
				setForm={setEditForm}
				onClose={closeEdit}
				onSave={handleSaveEdit}
			/>
		</Box>
	);
}

export default DashboardMissions;
