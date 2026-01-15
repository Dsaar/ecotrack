// client/src/features/dashboard/pages/DashboardMissions.jsx
import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import FavoriteButton from "../../missions/components/FavoriteButton.jsx";
import { useUser } from "../../../app/providers/UserProvider.jsx";
import { useSnackbar } from "../../../app/providers/SnackBarProvider.jsx";
import { useSearch } from "../../../app/providers/SearchProvider.jsx";

import DashboardMissionsGrid from "../components/DashboardMissionsGrid.jsx";
import AdminMissionEditDialog from "../components/AdminMissionsEditDialog.jsx";

import useDashboardMissions from "../missions/hooks/useDashboardMissions.js";
import MissionsHeader from "../missions/components/MissionsHeader.jsx";
import MissionsPaginationBar from "../missions/components/MissionsPaginationBar.jsx";
import DeleteMissionDialog from "../missions/components/DeleteMissionDialog.jsx";

export default function DashboardMissions() {
	const navigate = useNavigate();
	const { user } = useUser();
	const { showSuccess, showError } = useSnackbar();
	const { query, setQuery } = useSearch();

	const isAdmin = !!user?.isAdmin;

	// ✅ Clear search when leaving this page (same as your original behavior)
	useEffect(() => {
		return () => setQuery("");
	}, [setQuery]);

	const {
		loading,
		error,

		pageSize,
		setPageSize,
		paging,
		setPage,

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
	} = useDashboardMissions({
		isAdmin,
		query,
		showError,
		showSuccess,
	});

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
			<Box sx={{ position: "relative" }}>
				<MissionsHeader
					isAdmin={isAdmin}
					onCreate={() => navigate("/dashboard/admin/missions/new")}
				/>

				{error && (
					<Typography color="error" sx={{ mb: 2 }}>
						{error}
					</Typography>
				)}

				<MissionsPaginationBar
					total={paging.total}
					startIndex={paging.startIndex}
					endIndex={paging.endIndex}
					pageCount={paging.pageCount}
					safePage={paging.safePage}
					pageSize={pageSize}
					setPageSize={setPageSize}
					setPage={setPage}
				/>

				<DashboardMissionsGrid
					missions={paging.pagedItems}
					isAdmin={isAdmin}
					onOpenDetails={(id) => navigate(`/dashboard/missions/${id}`)}
					onEdit={(mission) => openEdit(mission)}
					onEditPage={(id) => navigate(`/dashboard/admin/missions/${id}/edit`)}
					onTogglePublish={(mission) => togglePublish(mission)}
					onDelete={(mission) => openDelete(mission)}
					FavoriteButtonComponent={FavoriteButton}
				/>

				<AdminMissionEditDialog
					open={editOpen}
					saving={saving}
					form={editForm}
					setForm={setEditForm}
					onClose={closeEdit}
					onSave={saveEdit}
				/>

				<DeleteMissionDialog
					open={deleteOpen}
					deleting={deleting}
					missionTitle={deleteTarget?.title}
					onClose={closeDelete}
					onConfirm={confirmDelete}
				/>
			</Box>
		</Box>
	);
}
