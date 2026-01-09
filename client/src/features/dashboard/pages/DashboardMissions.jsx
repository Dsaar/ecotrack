// src/features/dashboard/pages/DashboardMissions.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Stack,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import FavoriteButton from "../../missions/components/FavoriteButton.jsx";
import { useUser } from "../../../app/providers/UserProvider.jsx";
import { useSnackbar } from "../../../app/providers/SnackBarProvider.jsx";

import {
	getMissions,
	getMissionsAdmin,
	patchMission,
	deleteMission,
} from "../../../services/missionsService.js";

import DashboardMissionsGrid from "../components/DashboardMissionsGrid.jsx";
import AdminMissionEditDialog from "../components/AdminMissionsEditDialog.jsx";
import { useSearch } from "../../../app/providers/SearchProvider.jsx";

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
const PAGE_SIZE_OPTIONS = [6, 12, 24];

function DashboardMissions() {
	const navigate = useNavigate();
	const { user } = useUser();
	const { showSuccess, showError } = useSnackbar();
	const { query, setQuery } = useSearch();

	const isAdmin = !!user?.isAdmin;

	const [missions, setMissions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	// --- Pagination state ---
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(6);

	// --- Edit dialog state ---
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

	// --- Delete dialog state ---
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [deleting, setDeleting] = useState(false);

	useEffect(() => {
		return () => setQuery("");
	}, [setQuery]);

	const openDelete = (mission) => {
		setDeleteTarget(mission);
		setDeleteOpen(true);
	};

	const closeDelete = () => {
		if (deleting) return;
		setDeleteOpen(false);
		setDeleteTarget(null);
	};

	const handleConfirmDelete = async () => {
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
				err?.response?.data?.message ||
				"Could not load missions. Please try again.";
			setError(msg);
			showError?.(msg);
		} finally {
			setLoading(false);
		}
	}, [isAdmin, showError]);

	useEffect(() => {
		loadMissions();
	}, [loadMissions]);

	const handleTogglePublish = async (mission) => {
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
					m._id === mission._id
						? { ...m, isPublished: mission.isPublished }
						: m
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

	const q = (query || "").trim().toLowerCase();

	const filteredMissions = useMemo(() => {
		if (!q) return missions;

		return missions.filter((m) => {
			const title = (m.title || "").toLowerCase();
			const summary = (m.summary || "").toLowerCase();
			const category = (m.category || "").toLowerCase();
			const difficulty = (m.difficulty || "").toLowerCase();
			const tags = Array.isArray(m.tags) ? m.tags.join(" ").toLowerCase() : "";

			return (
				title.includes(q) ||
				summary.includes(q) ||
				category.includes(q) ||
				difficulty.includes(q) ||
				tags.includes(q)
			);
		});
	}, [missions, q]);

	useEffect(() => {
		setPage(1);
	}, [q, pageSize]);

	const total = filteredMissions.length;
	const pageCount = Math.max(1, Math.ceil(total / pageSize));
	const safePage = Math.min(page, pageCount);

	const startIndex = (safePage - 1) * pageSize;
	const endIndex = Math.min(startIndex + pageSize, total);
	const pagedMissions = filteredMissions.slice(startIndex, endIndex);

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
		<Box
			sx={(theme) => ({
				p: { xs: 2, md: 3 },
				maxWidth: 1200,
				position: "relative",

				// ✅ top gradient only (no TonePanel wrappers)
				"&:before": {
					content: '""',
					position: "absolute",
					left: 0,
					right: 0,
					top: 0,
					height: 190,
					borderRadius: 2,
					background: `linear-gradient(180deg, ${theme.palette.tones.green.bg} 0%, transparent 75%)`,
					pointerEvents: "none",
				},
			})}
		>
			{/* keep all content above the gradient */}
			<Box sx={{ position: "relative" }}>
				<Stack
					direction="row"
					alignItems="center"
					justifyContent="space-between"
					sx={{ mb: 1 }}
				>
					<Typography variant="h4" sx={{ fontWeight: 600 }}>
						{isAdmin ? "Missions (Admin)" : "My missions"}
					</Typography>

					{isAdmin && (
						<Button
							variant="contained"
							onClick={() => navigate("/dashboard/admin/missions/new")}
							sx={{
								textTransform: "none",
								bgcolor: "#166534",
								"&:hover": { bgcolor: "#14532d" },
							}}
						>
							Create mission
						</Button>
					)}
				</Stack>

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

				{/* Pagination controls */}
				<Stack
					direction={{ xs: "column", sm: "row" }}
					spacing={2}
					alignItems={{ xs: "stretch", sm: "center" }}
					justifyContent="space-between"
					sx={{ mb: 2 }}
				>
					<Typography variant="body2" color="text.secondary">
						{total === 0
							? "No missions to show."
							: `Showing ${startIndex + 1}-${endIndex} of ${total}`}
					</Typography>

					<Stack
						direction={{ xs: "column", sm: "row" }}
						spacing={1.5}
						alignItems={{ xs: "stretch", sm: "center" }}
						justifyContent="flex-end"
						sx={{ width: { xs: "100%", sm: "auto" } }}
					>
						<FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 160 } }}>
							<InputLabel id="page-size-label">Per page</InputLabel>
							<Select
								labelId="page-size-label"
								value={pageSize}
								label="Per page"
								onChange={(e) => setPageSize(Number(e.target.value))}
							>
								{PAGE_SIZE_OPTIONS.map((n) => (
									<MenuItem key={n} value={n}>
										{n}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<Box
							sx={{
								display: "flex",
								justifyContent: { xs: "center", sm: "flex-end" },
								width: { xs: "100%", sm: "auto" },
							}}
						>
							<Pagination
								count={pageCount}
								page={safePage}
								onChange={(_, value) => setPage(value)}
								color="primary"
								shape="rounded"
							/>
						</Box>
					</Stack>
				</Stack>

				{/* IMPORTANT: paged missions */}
				<DashboardMissionsGrid
					missions={pagedMissions}
					isAdmin={isAdmin}
					onOpenDetails={(id) => navigate(`/dashboard/missions/${id}`)}
					onEdit={(mission) => openEdit(mission)}
					onEditPage={(id) => navigate(`/dashboard/admin/missions/${id}/edit`)}
					onTogglePublish={(mission) => handleTogglePublish(mission)}
					onDelete={(mission) => openDelete(mission)}
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

				{/* Delete confirmation dialog */}
				<Dialog open={deleteOpen} onClose={closeDelete} fullWidth maxWidth="xs">
					<DialogTitle>Delete mission?</DialogTitle>
					<DialogContent>
						<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
							This will permanently delete{" "}
							<b>{deleteTarget?.title || "this mission"}</b>.
						</Typography>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={closeDelete}
							disabled={deleting}
							sx={{ textTransform: "none" }}
						>
							Cancel
						</Button>
						<Button
							onClick={handleConfirmDelete}
							disabled={deleting}
							variant="contained"
							color="error"
							sx={{ textTransform: "none" }}
						>
							{deleting ? "Deleting..." : "Delete"}
						</Button>
					</DialogActions>
				</Dialog>
			</Box>
		</Box>
	);
}

export default DashboardMissions;
