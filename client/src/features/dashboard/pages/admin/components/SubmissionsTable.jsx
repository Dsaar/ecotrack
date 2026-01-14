// src/features/dashboard/pages/admin/components/SubmissionsTable.jsx
import {
	Button,
	Link,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import SubmissionStatusChip from "./SubmissionsStatusChip.jsx";

export default function SubmissionsTable({
	rows,
	status,
	actingId,
	onApprove,
	onReject,
	onView,
}) {
	return (
		<TableContainer sx={{ overflowX: "auto" }}>
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
										<SubmissionStatusChip status={sub.status} />

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

											{evidence.slice(0, 1).map((url) => (
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

											{evidence.length > 1 && (
												<Typography variant="caption" color="text.secondary">
													+{evidence.length - 1} more
												</Typography>
											)}
										</Stack>
									)}
								</TableCell>

								<TableCell align="right">
									<Stack direction="row" spacing={1} justifyContent="flex-end">
										<Button
											size="small"
											variant="outlined"
											onClick={() => onView(sub)}
											sx={{ textTransform: "none" }}
										>
											View
										</Button>

										{status === "pending" ? (
											<>
												<Button
													size="small"
													variant="contained"
													disabled={busy}
													onClick={() => onApprove(sub._id)}
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
													onClick={() => onReject(sub._id)}
													sx={{ textTransform: "none" }}
												>
													Reject
												</Button>
											</>
										) : (
											<Typography variant="body2" color="text.secondary">
												—
											</Typography>
										)}
									</Stack>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
