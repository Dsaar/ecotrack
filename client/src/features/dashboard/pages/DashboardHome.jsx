// src/features/dashboard/pages/DashboardHome.jsx
import { useEffect, useState } from "react";
import {
	Box,
	Card,
	CardContent,
	Chip,
	Stack,
	Typography,
	Divider,
	List,
	ListItem,
	ListItemText,
} from "@mui/material";
import { useUser } from "../../../app/providers/UserProvider.jsx";
import { getMySubmissions } from "../../../services/submissionsService.js";
import LoadingSpinner from "../../../components/common/LoadingSpinner.jsx";
import TonePanel from "../components/TonePanel.jsx";

function DashboardHome() {
	const { user } = useUser();
	const [submissions, setSubmissions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		let cancelled = false;

		async function load() {
			try {
				setLoading(true);
				setError("");
				const data = await getMySubmissions();
				if (!cancelled) {
					setSubmissions(Array.isArray(data) ? data : data.submissions || []);
				}
			} catch (err) {
				console.error("Failed to load submissions for dashboard:", err);
				if (!cancelled) {
					setError(
						err?.response?.data?.message ||
						"Failed to load your activity. Please try again."
					);
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		load();
		return () => {
			cancelled = true;
		};
	}, []);

	// ---- Derived stats ----
	const ecoPoints = user?.points ?? 0;
	const favoritesCount = user?.favorites?.missions?.length ?? 0;

	const totalSubmissions = submissions.length;
	const pendingSubmissions = submissions.filter((s) => s.status === "pending").length;
	const approvedSubmissions = submissions.filter((s) => s.status === "approved").length;

	const lastSubmission = submissions.length > 0 ? submissions[0] : null;

	if (loading) {
		return <LoadingSpinner fullScreen={false} />;
	}

	return (
		<Box
			sx={(theme) => ({
				p: { xs: 2, md: 3 },
				maxWidth: 1100,
				position: "relative",

				// ✅ subtle top gradient (global dashboard vibe)
				"&:before": {
					content: '""',
					position: "absolute",
					left: 0,
					right: 0,
					top: 0,
					height: 180,
					borderRadius: 2,
					background: `linear-gradient(180deg, ${theme.palette.tones.green.bg} 0%, transparent 75%)`,
					pointerEvents: "none",
				},
			})}
		>
			<Box sx={{ position: "relative" }}>
				<Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
					Overview
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
					Welcome back to your EcoTrack dashboard. Here's a quick look at your progress.
				</Typography>

				{error && (
					<Typography color="error" sx={{ mb: 2 }}>
						{error}
					</Typography>
				)}

				<Stack
					direction={{ xs: "column", md: "row" }}
					spacing={3}
					alignItems="stretch"
					sx={{ mb: 3 }}
				>
					{/* Summary */}
					<Card sx={{ flex: 1, borderRadius: 2 }}>
						<CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
							<Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
								Summary
							</Typography>

							{/* ✅ Tone tiles */}
							<Stack
								direction={{ xs: "column", sm: "row" }}
								spacing={2}
								sx={{ mb: 2 }}
							>
								<TonePanel tone="green" sx={{ flex: 1 }}>
									<Typography variant="caption" sx={{ opacity: 0.9 }}>
										Eco points
									</Typography>
									<Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
										{ecoPoints}
									</Typography>
								</TonePanel>

								<TonePanel tone="blue" sx={{ flex: 1 }}>
									<Typography variant="caption" sx={{ opacity: 0.9 }}>
										Submissions
									</Typography>
									<Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
										{totalSubmissions}
									</Typography>
									{/* small extra context */}
									<Typography variant="caption" sx={{ opacity: 0.85 }}>
										{approvedSubmissions} approved
									</Typography>
								</TonePanel>

								<TonePanel tone="amber" sx={{ flex: 1 }}>
									<Typography variant="caption" sx={{ opacity: 0.9 }}>
										Pending review
									</Typography>
									<Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
										{pendingSubmissions}
									</Typography>
								</TonePanel>

								<TonePanel tone="indigo" sx={{ flex: 1, opacity: 0.95 }}>
									<Typography variant="caption" sx={{ opacity: 0.9 }}>
										Saved missions
									</Typography>
									<Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
										{favoritesCount}
									</Typography>
								</TonePanel>
							</Stack>

							<Divider sx={{ my: 2 }} />

							<Typography variant="body2" color="text.secondary">
								As you complete more missions and your submissions are approved, your eco points
								and impact will grow here. Later we can add charts and detailed CO₂ / water / waste
								breakdowns over time.
							</Typography>
						</CardContent>
					</Card>

					{/* Latest activity */}
					<Card sx={{ flex: 1, borderRadius: 2 }}>
						<CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
							<Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
								Latest activity
							</Typography>

							{!lastSubmission ? (
								<TonePanel tone="blue">
									<Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
										No submissions yet
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Start with a mission from the Missions tab to see your activity here.
									</Typography>
								</TonePanel>
							) : (
								<>
									<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
										Here&apos;s your most recent mission submission:
									</Typography>

									<TonePanel tone="green" sx={{ mb: 2, color: "inherit" }}>
										<Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
											{lastSubmission.missionId?.title ||
												lastSubmission.missionTitle ||
												"Mission"}
										</Typography>

										<Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
											<Chip
												size="small"
												label={lastSubmission.status || "pending"}
												color={
													lastSubmission.status === "approved"
														? "success"
														: lastSubmission.status === "rejected"
															? "error"
															: "warning"
												}
												variant="outlined"
											/>
											{typeof lastSubmission.pointsAwarded === "number" && (
												<Chip
													size="small"
													label={`+${lastSubmission.pointsAwarded} pts`}
													variant="outlined"
												/>
											)}
										</Stack>

										<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
											{submissions[0].createdAt
												? new Date(submissions[0].createdAt).toLocaleString()
												: "Unknown date"}
										</Typography>
									</TonePanel>

									<Typography variant="body2" color="text.secondary">
										You can see more details and your complete history in the{" "}
										<strong>Missions</strong> and <strong>Activity</strong> tabs.
									</Typography>
								</>
							)}
						</CardContent>
					</Card>
				</Stack>

				{/* Recent submissions */}
				<Card sx={{ borderRadius: 2 }}>
					<CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
						<Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
							Recent submissions
						</Typography>

						{submissions.length === 0 ? (
							<TonePanel tone="blue">
								<Typography variant="body2" sx={{ fontWeight: 700 }}>
									No submissions yet
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Complete a mission and submit proof to see your history here.
								</Typography>
							</TonePanel>
						) : (
							<List dense>
								{submissions.slice(0, 5).map((sub) => {
									const missionTitle = sub.missionId?.title || sub.missionTitle || "Mission";
									const createdAt = sub.createdAt
										? new Date(sub.createdAt).toLocaleString()
										: "Unknown date";

									return (
										<ListItem key={sub._id} sx={{ px: 0, alignItems: "flex-start" }}>
											<ListItemText
												primary={
													<Stack direction="row" spacing={1} alignItems="center">
														<Typography variant="body1" sx={{ fontWeight: 600 }}>
															{missionTitle}
														</Typography>
														<Chip
															label={sub.status || "pending"}
															size="small"
															variant="outlined"
															color={
																sub.status === "approved"
																	? "success"
																	: sub.status === "rejected"
																		? "error"
																		: "warning"
															}
															sx={{ fontSize: 10 }}
														/>
													</Stack>
												}
												secondary={
													<Typography variant="body2" color="text.secondary">
														{createdAt}
													</Typography>
												}
											/>
										</ListItem>
									);
								})}
							</List>
						)}
					</CardContent>
				</Card>
			</Box>
		</Box>
	);
}

export default DashboardHome;
