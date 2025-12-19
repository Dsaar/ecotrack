// src/features/dashboard/pages/admin/AdminSubmissionsPage.jsx
import { useEffect, useMemo, useState } from "react";
import {
	Box,
	Card,
	CardContent,
	Typography,
	Stack,
	ToggleButton,
	ToggleButtonGroup,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Chip,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	CircularProgress,
	Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useSnackbar } from "../../../../app/providers/SnackBarProvider.jsx";
import {
	adminApproveSubmission,
	adminListSubmissions,
	adminRejectSubmission,
} from "../../../../services/adminSubmissionsService.js";
import { useUser } from "../../../../app/providers/UserProvider.jsx";

function StatusChip({ status }) {
	if (status === "approved")
		return <Chip size="small" label="Approved" color="success" variant="outlined" />;
	if (status === "rejected")
		return <Chip size="small" label="Rejected" color="error" variant="outlined" />;
	return <Chip size="small" label="Pending" variant="outlined" />;
}

export default function AdminSubmissionsPage() {
	const { user } = useUser();
	const navigate = useNavigate();
	const { showSuccess, showError } = useSnackbar();

	// If you already use <AdminRoute> in Router, this is optional.
	// Keeping it doesn't hurt, but now it will work (navigate exists).
	useEffect(() => {
		if (user && !user.isAdmin) navigate("/dashboard");
	}, [user, navigate]);

	const [status, setStatus] = useState("pending");
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [actingId, setActingId] = useState(null);

	// reject dialog state
	const [rejectOpen, setRejectOpen] = useState(false);
	const [rejectId, setRejectId] = useState(null);
	const [rejectReason, setRejectReason] = useState("");

	const load = async () => {
		try {
			setLoading(true);
			const res = await adminListSubmissions({ status, page: 1, limit: 30 });
			setItems(res.data?.items || []);
		} catch (err) {
			console.error("[AdminSubmissionsPage] load failed", err);
			showError?.(err?.response?.data?.message || "Failed to load submissions.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [status]);

	const handleApprove = async (id) => {
		try {
			setActingId(id);
			await adminApproveSubmission(id);
			showSuccess?.("Submission approved.");
			await load();
		} catch (err) {
			console.error("[AdminSubmissionsPage] approve failed", err);
			showError?.(err?.response?.data?.message || "Failed to approve submission.");
		} finally {
			setActingId(null);
		}
	};

	const openReject = (id) => {
		setRejectId(id);
		setRejectReason("");
		setRejectOpen(true);
	};

	const closeReject = () => {
		setRejectOpen(false);
		setRejectId(null);
		setRejectReason("");
	};

	const handleReject = async () => {
		if (!rejectId) return;

		try {
			setActingId(rejectId);
			await adminRejectSubmission(rejectId, rejectReason);
			showSuccess?.("Submission rejected.");
			closeReject();
			await load();
		} catch (err) {
			console.error("[AdminSubmissionsPage] reject failed", err);
			showError?.(err?.response?.data?.message || "Failed to reject submission.");
		} finally {
			setActingId(null);
		}
	};

	const rows = useMemo(() => items, [items]);

	return (
		<Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200 }}>
			<Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
				Moderation
			</Typography>
			<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
				Review mission submissions and approve or reject them.
			</Typography>

			<Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center">
				<ToggleButtonGroup
					value={status}
					exclusive
					onChange={(_e, v) => v && setStatus(v)}
					size="small"
				>
					<ToggleButton value="pending">Pending</ToggleButton>
					<ToggleButton value="approved">Approved</ToggleButton>
					<ToggleButton value="rejected">Rejected</ToggleButton>
				</ToggleButtonGroup>

				<Button variant="outlined" size="small" onClick={load} sx={{ textTransform: "none" }}>
					Refresh
				</Button>
			</Stack>

			<Card sx={{ borderRadius: 4 }}>
				<CardContent>
					{loading ? (
						<Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
							<CircularProgress />
						</Box>
					) : rows.length === 0 ? (
						<Typography color="text.secondary">
							No submissions found for this status.
						</Typography>
					) : (
						<Table size="small">
							<TableHead>
								<TableRow>
									<TableCell>Mission</TableCell>
									<TableCell>User</TableCell>
									<TableCell>Status</TableCell>
									<TableCell>Created</TableCell>
									<TableCell>Evidence</TableCell>
									<TableCell align="right">Actions</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{rows.map((sub) => {
									const missionTitle = sub?.missionId?.title || "—";
									const userName =
										[sub?.userId?.name?.first, sub?.userId?.name?.last]
											.filter(Boolean)
											.join(" ") ||
										sub?.userId?.email ||
										"—";

									const created = sub?.createdAt
										? new Date(sub.createdAt).toLocaleString()
										: "—";

									const busy = actingId === sub._id;
									const evidence = Array.isArray(sub?.evidenceUrls) ? sub.evidenceUrls : [];

									return (
										<TableRow key={sub._id} hover sx={{ verticalAlign: "top" }}>
											<TableCell>{missionTitle}</TableCell>
											<TableCell>
												<Stack spacing={0.5}>
													<Typography variant="body2">{userName}</Typography>
													{sub?.userId?.email && (
														<Typography variant="caption" color="text.secondary">
															{sub.userId.email}
														</Typography>
													)}
												</Stack>
											</TableCell>

											<TableCell>
												<Stack spacing={0.5}>
													<StatusChip status={sub.status} />
													{status === "rejected" && sub?.rejectionReason && (
														<Typography variant="caption" color="error">
															Reason: {sub.rejectionReason}
														</Typography>
													)}
												</Stack>
											</TableCell>

											<TableCell>{created}</TableCell>

											<TableCell>
												{evidence.length === 0 ? (
													<Typography variant="body2" color="text.secondary">
														—
													</Typography>
												) : (
													<Stack spacing={0.5}>
														<Typography variant="body2">
															{evidence.length} link{evidence.length > 1 ? "s" : ""}
														</Typography>
														{evidence.slice(0, 2).map((url) => (
															<Link
																key={url}
																href={url}
																target="_blank"
																rel="noreferrer"
																variant="caption"
																sx={{ wordBreak: "break-all" }}
															>
																Open
															</Link>
														))}
														{evidence.length > 2 && (
															<Typography variant="caption" color="text.secondary">
																+{evidence.length - 2} more
															</Typography>
														)}
													</Stack>
												)}
											</TableCell>

											<TableCell align="right">
												{status === "pending" ? (
													<Stack direction="row" spacing={1} justifyContent="flex-end">
														<Button
															size="small"
															variant="contained"
															disabled={busy}
															onClick={() => handleApprove(sub._id)}
															sx={{
																textTransform: "none",
																bgcolor: "#166534",
																"&:hover": { bgcolor: "#14532d" },
															}}
														>
															{busy ? "..." : "Approve"}
														</Button>

														<Button
															size="small"
															variant="outlined"
															color="error"
															disabled={busy}
															onClick={() => openReject(sub._id)}
															sx={{ textTransform: "none" }}
														>
															Reject
														</Button>
													</Stack>
												) : (
													<Typography variant="body2" color="text.secondary">
														—
													</Typography>
												)}
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			{/* Reject dialog */}
			<Dialog open={rejectOpen} onClose={closeReject} fullWidth maxWidth="sm">
				<DialogTitle>Reject submission</DialogTitle>
				<DialogContent>
					<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
						Add an optional reason. (This is saved in <code>rejectionReason</code> and can be shown to the user.)
					</Typography>
					<TextField
						label="Reason (optional)"
						value={rejectReason}
						onChange={(e) => setRejectReason(e.target.value)}
						fullWidth
						multiline
						minRows={3}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeReject} sx={{ textTransform: "none" }}>
						Cancel
					</Button>
					<Button
						onClick={handleReject}
						color="error"
						variant="contained"
						sx={{ textTransform: "none" }}
						disabled={actingId === rejectId}
					>
						{actingId === rejectId ? "Rejecting..." : "Reject"}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}
