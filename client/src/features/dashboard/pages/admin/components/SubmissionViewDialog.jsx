// src/features/dashboard/pages/admin/components/SubmissionViewDialog.jsx
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Link, Stack, Typography } from "@mui/material";
import { isLikelyImageUrl } from "../utils/submissionHelpers.js";

export default function SubmissionViewDialog({ open, onClose, submission }) {
	// derived data (same logic as before)
	const missionTitle = submission?.missionId?.title || "—";
	const userName =
		[submission?.userId?.name?.first, submission?.userId?.name?.last]
			.filter(Boolean)
			.join(" ") ||
		submission?.userId?.email ||
		"—";

	const answers = Array.isArray(submission?.answers) ? submission.answers : [];
	const evidence = Array.isArray(submission?.evidenceUrls) ? submission.evidenceUrls : [];

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
			<DialogTitle>Submission details</DialogTitle>
			<DialogContent>
				<Stack spacing={2} sx={{ mt: 1 }}>
					<Stack spacing={0.5}>
						<Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
							{missionTitle}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Submitted by: {userName}
						</Typography>
						{submission?.createdAt && (
							<Typography variant="caption" color="text.secondary">
								Created: {new Date(submission.createdAt).toLocaleString()}
							</Typography>
						)}
					</Stack>

					<Divider />

					<Box>
						<Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
							Answers
						</Typography>

						{answers.length === 0 ? (
							<Typography variant="body2" color="text.secondary">
								No answers provided.
							</Typography>
						) : (
							<Stack spacing={1}>
								{answers.map((a, idx) => (
									<Box
										key={`${a.key}-${idx}`}
										sx={{
											border: "1px solid",
											borderColor: "divider",
											borderRadius: 2,
											p: 1.5,
										}}
									>
										<Typography variant="caption" color="text.secondary">
											{a.key}
										</Typography>
										<Typography variant="body2" sx={{ fontWeight: 600 }}>
											{String(a.value)}
										</Typography>
									</Box>
								))}
							</Stack>
						)}
					</Box>

					<Divider />

					<Box>
						<Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
							Evidence
						</Typography>

						{evidence.length === 0 ? (
							<Typography variant="body2" color="text.secondary">
								No evidence URLs provided.
							</Typography>
						) : (
							<Stack spacing={2}>
								{evidence.map((url) => (
									<Box
										key={url}
										sx={{
											border: "1px solid",
											borderColor: "divider",
											borderRadius: 2,
											overflow: "hidden",
										}}
									>
										{isLikelyImageUrl(url) ? (
											<Box
												component="img"
												src={url}
												alt="Evidence"
												sx={{
													width: "100%",
													maxHeight: 360,
													objectFit: "cover",
													display: "block",
													bgcolor: "action.hover",
												}}
												onError={(e) => {
													e.currentTarget.style.display = "none";
												}}
											/>
										) : null}

										<Box sx={{ p: 1.5 }}>
											<Link
												href={url}
												target="_blank"
												rel="noreferrer"
												variant="body2"
												sx={{ wordBreak: "break-all" }}
											>
												{url}
											</Link>
										</Box>
									</Box>
								))}
							</Stack>
						)}
					</Box>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} sx={{ textTransform: "none" }}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
}
