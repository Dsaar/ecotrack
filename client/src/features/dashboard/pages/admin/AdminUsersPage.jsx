// src/features/dashboard/pages/admin/AdminUsersPage.jsx
import { Box, Card, CardContent, Typography, Stack, useMediaQuery, useTheme } from "@mui/material";

import { useSnackbar } from "../../../../app/providers/SnackBarProvider.jsx";
import { useUser } from "../../../../app/providers/UserProvider.jsx";
import { useSearch } from "../../../../app/providers/SearchProvider.jsx";

import useAdminUsers from "./hooks/useAdminUsers.js";
import UsersHeader from "./components/UsersHeader.jsx";
import UsersPaginationBar from "./components/UsersPaginationBar.jsx";
import UsersMobileList from "./components/UsersMobileList.jsx";
import UsersTable from "./components/UsersTable.jsx";
import DeleteUserDialog from "./components/DeleteUserDialog.jsx";

export default function AdminUsersPage() {
	const { user } = useUser();
	const isAdmin = !!user?.isAdmin;

	const { showSuccess, showError } = useSnackbar();

	// ✅ SearchProvider (TopBar search)
	const { query, setQuery } = useSearch();

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const {
		users,
		loading,

		q,
		filteredUsers,
		pagedUsers,

		pageSize,
		pageCount,
		safePage,
		startIndex,
		endIndex,
		total,

		setPage,
		setPageSize,

		toggleAdmin,

		deleteOpen,
		deleteTarget,
		deleting,
		openDelete,
		closeDelete,
		confirmDelete,
	} = useAdminUsers({ query, showSuccess, showError, setQuery });

	if (!isAdmin) {
		return (
			<Box sx={{ p: { xs: 2, md: 3 } }}>
				<Typography>You don’t have access to this page.</Typography>
			</Box>
		);
	}

	return (
		<Box
			sx={{
				position: "relative",
				p: { xs: 2, md: 3 },
				maxWidth: 1100,
				"&:before": {
					content: '""',
					position: "absolute",
					borderRadius: 2,
					top: 0,
					left: 0,
					right: 0,
					height: { xs: 180, md: 220 },
					background: `linear-gradient(
						180deg,
						${theme.palette.tones?.blue?.bg ?? "rgba(59,130,246,0.12)"} 0%,
						${theme.palette.tones?.green?.bg ?? "rgba(22,101,52,0.10)"} 45%,
						transparent 85%
					)`,
					maskImage:
						"linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
					WebkitMaskImage:
						"linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
					pointerEvents: "none",
					zIndex: 0,
				},
				"& > *": { position: "relative", zIndex: 1 },
			}}
		>
			<UsersHeader
				loading={loading}
				filteredCount={filteredUsers.length}
				totalCount={users.length}
				q={q}
				query={query}
			/>

			<UsersPaginationBar
				loading={loading}
				total={total}
				startIndex={startIndex}
				endIndex={endIndex}
				q={q}
				query={query}
				pageSize={pageSize}
				setPageSize={setPageSize}
				pageCount={pageCount}
				safePage={safePage}
				setPage={setPage}
			/>

			<Card sx={{ borderRadius: 4 }}>
				<CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
					{loading ? (
						<Typography color="text.secondary">Loading users...</Typography>
					) : filteredUsers.length === 0 ? (
						<Typography color="text.secondary">
							{q ? "No users match your search." : "No users found."}
						</Typography>
					) : isMobile ? (
						<UsersMobileList
							rows={pagedUsers}
							currentUser={user}
							onToggleAdmin={toggleAdmin}
							onDelete={openDelete}
						/>
					) : (
						<UsersTable
							rows={pagedUsers}
							currentUser={user}
							onToggleAdmin={toggleAdmin}
							onDelete={openDelete}
						/>
					)}
				</CardContent>
			</Card>

			<DeleteUserDialog
				open={deleteOpen}
				onClose={closeDelete}
				onConfirm={confirmDelete}
				deleting={deleting}
				targetEmail={deleteTarget?.email}
			/>
		</Box>
	);
}
