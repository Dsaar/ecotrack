// src/features/dashboard/pages/admin/components/SubmissionsMobileList.jsx
import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import SubmissionStatusChip from "./SubmissionsStatusChip.jsx";

export default function SubmissionsMobileList({
	rows,
	status,
	actingId,
	onApprove,
	onReject,
	onView,
}) {
	return (
		<Stack spacing={1.25}>
			{rows.map((sub) => {
				const missionTitle = sub?.missionId?.title || "—";
				const userName =
					[sub?.userId?.name?.first, sub?.userId?.name?.last]
						.filter(Boolean)
						.join(" ") ||
					sub?.userId?.email ||
					"—";

				const created = sub?.createdAt ? new Date(sub.createdAt).toLocaleString() : "—";

				const busy = actingId === sub._id;
				const evidence = Array.isArray(sub?.evidenceUrls) ? sub.evidenceUrls : [];

				return (
					<Card key={sub._id} variant="outlined" sx={{ borderRadius: 2 }}>
						<CardContent sx={{ p: 1.5 }}>
							<Stack spacing={1}>
								<Stack
									direction="row"
									alignItems="flex-start"
									justifyContent="space-between"
									spacing={1}
								>
									<Box sx={{ minWidth: 0 }}>
										<Typography sx={{ fontWeight: 800 }} noWrap>
											{missionTitle}
										</Typography>
										<Typography variant="body2" color="text.secondary" noWrap>
											{userName}
										</Typography>
									</Box>

									<SubmissionStatusChip status={sub.status} />
								</Stack>

								<Typography variant="caption" color="text.secondary">
									Created: {created}
								</Typography>

								<Typography variant="body2" color="text.secondary">
									Evidence: {evidence.length || 0} link{evidence.length === 1 ? "" : "s"}
								</Typography>

								<Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap">
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
									) : null}
								</Stack>

								{status === "rejected" && sub?.rejectionReason ? (
									<Typography variant="caption" color="error">
										Reason: {sub.rejectionReason}
									</Typography>
								) : null}
							</Stack>
						</CardContent>
					</Card>
				);
			})}
		</Stack>
	);
}
