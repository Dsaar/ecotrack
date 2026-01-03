// src/features/dashboard/pages/admin/AdminUsersPage.jsx
import { useEffect, useMemo, useState } from "react";
import {
	Box,
	Card,
	CardContent,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Switch,
	IconButton,
	Tooltip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Stack,
	TableContainer,
	useMediaQuery,
	useTheme,
	Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { useSnackbar } from "../../../../app/providers/SnackBarProvider.jsx";
import { useUser } from "../../../../app/providers/UserProvider.jsx";
import { useSearch } from "../../../../app/providers/SearchProvider.jsx";
import {
	getAllUsersAdmin,
	setUserAdminStatus,
	deleteUserAdmin,
} from "../../../../services/userService.js";

export default function AdminUsersPage() {
	const { user } = useUser();
	const isAdmin = !!user?.isAdmin;

	const { showSuccess, showError } = useSnackbar();

	// ✅ SearchProvider (TopBar search)
	const { query, setQuery } = useSearch();

	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);

	const [deleteOpen, setDeleteOpen] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [deleting, setDeleting] = useState(false);

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	// ✅ Clear search when leaving this page
	useEffect(() => {
		return () => setQuery("");
	}, [setQuery]);

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

		return () => {
			cancelled = true;
		};
	}, [showError]);

	const handleToggleAdmin = async (u) => {
		const next = !u.isAdmin;

		// optimistic UI
		setUsers((prev) =>
			prev.map((x) => (x._id === u._id ? { ...x, isAdmin: next } : x))
		);

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

	// ✅ Filtering (driven by TopBar search query)
	const q = (query || "").trim().toLowerCase();

	const filteredUsers = useMemo(() => {
		if (!q) return users;

		return users.filter((u) => {
			const first = (u?.name?.first || "").toLowerCase();
			const last = (u?.name?.last || "").toLowerCase();
			const email = (u?.email || "").toLowerCase();
			const phone = (u?.phone || "").toLowerCase();
			const roleText = u?.isAdmin ? "admin" : "user";
			const fullName = `${first} ${last}`.trim();

			return (
				fullName.includes(q) ||
				first.includes(q) ||
				last.includes(q) ||
				email.includes(q) ||
				phone.includes(q) ||
				roleText.includes(q)
			);
		});
	}, [users, q]);

	if (!isAdmin) {
		return (
			<Box sx={{ p: { xs: 2, md: 3 } }}>
				<Typography>You don’t have access to this page.</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100 }}>
			<Stack spacing={0.5} sx={{ mb: 2 }}>
				<Typography variant="h4" sx={{ fontWeight: 700 }}>
					Admin CRM
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Search by name, email, phone, or “admin”.
				</Typography>

				{!loading && (
					<Typography variant="caption" color="text.secondary">
						Showing {filteredUsers.length} of {users.length} users
						{q ? ` for “${query}”` : ""}
					</Typography>
				)}
			</Stack>

			<Card sx={{ borderRadius: 4 }}>
				<CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
					{loading ? (
						<Typography color="text.secondary">Loading users...</Typography>
					) : filteredUsers.length === 0 ? (
						<Typography color="text.secondary">
							{q ? "No users match your search." : "No users found."}
						</Typography>
					) : isMobile ? (
						// ✅ Mobile: cards
						<Stack spacing={1.25}>
							{filteredUsers.map((u) => {
								const name = u?.name?.first
									? `${u.name.first} ${u.name.last || ""}`
									: "—";
								const isSelf = String(user?._id) === String(u._id);

								return (
									<Card
										key={u._id}
										variant="outlined"
										sx={{ borderRadius: 3, overflow: "hidden" }}
									>
										<CardContent sx={{ p: 1.5 }}>
											<Stack spacing={1}>
												<Stack direction="row" alignItems="center" justifyContent="space-between">
													<Box sx={{ minWidth: 0 }}>
														<Typography sx={{ fontWeight: 800 }} noWrap>
															{name}
														</Typography>
														<Typography variant="body2" color="text.secondary" noWrap>
															{u.email}
														</Typography>
													</Box>

													<Tooltip title={isSelf ? "You can’t delete yourself" : "Delete user"}>
														<span>
															<IconButton
																onClick={() => openDelete(u)}
																disabled={isSelf}
																size="small"
															>
																<DeleteIcon fontSize="small" />
															</IconButton>
														</span>
													</Tooltip>
												</Stack>

												{u.phone ? (
													<Typography variant="body2" color="text.secondary">
														Phone: {u.phone}
													</Typography>
												) : null}

												<Divider />

												<Stack direction="row" alignItems="center" justifyContent="space-between">
													<Typography variant="body2" sx={{ fontWeight: 700 }}>
														Admin
													</Typography>
													<Switch checked={!!u.isAdmin} onChange={() => handleToggleAdmin(u)} />
												</Stack>
											</Stack>
										</CardContent>
									</Card>
								);
							})}
						</Stack>
					) : (
						// ✅ Desktop/tablet: table (with safe overflow)
						<TableContainer sx={{ overflowX: "auto" }}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>
											<b>Name</b>
										</TableCell>
										<TableCell>
											<b>Email</b>
										</TableCell>
										<TableCell>
											<b>Phone</b>
										</TableCell>
										<TableCell>
											<b>Admin</b>
										</TableCell>
										<TableCell align="right">
											<b>Delete</b>
										</TableCell>
									</TableRow>
								</TableHead>

								<TableBody>
									{filteredUsers.map((u) => (
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
														<IconButton
															onClick={() => openDelete(u)}
															disabled={String(user?._id) === String(u._id)}
														>
															<DeleteIcon />
														</IconButton>
													</span>
												</Tooltip>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
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
					<Button
						onClick={confirmDelete}
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
	);
}
