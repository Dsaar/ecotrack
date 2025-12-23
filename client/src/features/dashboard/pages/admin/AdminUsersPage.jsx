// src/features/dashboard/pages/admin/AdminUsersPage.jsx
import { useEffect, useState } from "react";
import {
	Box, Card, CardContent, Typography, Stack,
	Table, TableBody, TableCell, TableHead, TableRow,
	Switch, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "../../../../app/providers/SnackBarProvider.jsx";
import { useUser } from "../../../../app/providers/UserProvider.jsx";
import { getAllUsersAdmin, setUserAdminStatus, deleteUserAdmin } from "../../../../services/userService.js";

export default function AdminUsersPage() {
	const { user } = useUser();
	const isAdmin = !!user?.isAdmin;

	const { showSuccess, showError } = useSnackbar();

	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);

	const [deleteOpen, setDeleteOpen] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [deleting, setDeleting] = useState(false);

	useEffect(() => {
		let cancelled = false;

		(async () => {
			try {
				setLoading(true);
				const data = await getAllUsersAdmin();
				if (!cancelled) setUsers(Array.isArray(data) ? data : []);
			} catch (err) {
				showError?.(err?.response?.data?.message || "Failed to load users.");
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();

		return () => { cancelled = true; };
	}, [showError]);

	const handleToggleAdmin = async (u) => {
		const next = !u.isAdmin;

		// optimistic UI
		setUsers((prev) => prev.map((x) => (x._id === u._id ? { ...x, isAdmin: next } : x)));

		try {
			const updated = await setUserAdminStatus(u._id, { isAdmin: next });
			setUsers((prev) => prev.map((x) => (x._id === u._id ? updated : x)));
			showSuccess?.(next ? "User promoted to admin." : "Admin rights removed.");
		} catch (err) {
			// rollback
			setUsers((prev) => prev.map((x) => (x._id === u._id ? u : x)));
			showError?.(err?.response?.data?.message || "Failed to update user.");
		}
	};

	const openDelete = (u) => {
		setDeleteTarget(u);
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
		const prev = users;

		// optimistic remove
		setUsers((cur) => cur.filter((u) => u._id !== id));

		try {
			setDeleting(true);
			await deleteUserAdmin(id);
			showSuccess?.("User deleted.");
			closeDelete();
		} catch (err) {
			setUsers(prev); // rollback
			showError?.(err?.response?.data?.message || "Failed to delete user.");
		} finally {
			setDeleting(false);
		}
	};

	if (!isAdmin) {
		return (
			<Box sx={{ p: { xs: 2, md: 3 } }}>
				<Typography>You don’t have access to this page.</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100 }}>
			<Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
				Admin CRM
			</Typography>

			<Card sx={{ borderRadius: 4 }}>
				<CardContent>
					{loading ? (
						<Typography color="text.secondary">Loading users...</Typography>
					) : (
						<Table>
							<TableHead>
								<TableRow>
									<TableCell><b>Name</b></TableCell>
									<TableCell><b>Email</b></TableCell>
									<TableCell><b>Phone</b></TableCell>
									<TableCell><b>Admin</b></TableCell>
									<TableCell align="right"><b>Actions</b></TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{users.map((u) => (
									<TableRow key={u._id}>
										<TableCell>
											{u?.name?.first ? `${u.name.first} ${u.name.last || ""}` : "—"}
										</TableCell>
										<TableCell>{u.email}</TableCell>
										<TableCell>{u.phone || "—"}</TableCell>
										<TableCell>
											<Switch checked={!!u.isAdmin} onChange={() => handleToggleAdmin(u)} />
										</TableCell>
										<TableCell align="right">
											<Tooltip title="Delete user">
												<span>
													<IconButton onClick={() => openDelete(u)} disabled={String(user?._id) === String(u._id)}>
														<DeleteIcon />
													</IconButton>
												</span>
											</Tooltip>
										</TableCell>
									</TableRow>
								))}

								{users.length === 0 && (
									<TableRow>
										<TableCell colSpan={5}>
											<Typography color="text.secondary">No users found.</Typography>
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			<Dialog open={deleteOpen} onClose={closeDelete} fullWidth maxWidth="xs">
				<DialogTitle>Delete user?</DialogTitle>
				<DialogContent>
					<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
						This will permanently delete <b>{deleteTarget?.email}</b>.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeDelete} disabled={deleting} sx={{ textTransform: "none" }}>
						Cancel
					</Button>
					<Button onClick={confirmDelete} disabled={deleting} variant="contained" color="error" sx={{ textTransform: "none" }}>
						{deleting ? "Deleting..." : "Delete"}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}
