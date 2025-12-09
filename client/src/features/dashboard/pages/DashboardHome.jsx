// src/features/dashboard/pages/DashboardHome.jsx
import { useEffect, useState } from "react";
import {
	Box,
	Card,
	CardContent,
	Chip,
	CircularProgress,
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
	const pendingSubmissions = submissions.filter(
		(s) => s.status === "pending"
	).length;
	const approvedSubmissions = submissions.filter(
		(s) => s.status === "approved"
	).length;

	const lastSubmission =
		submissions.length > 0
			? submissions[0]
			: null; // because listMySubmissions sorts by createdAt: -1

	if (loading) {
		return <LoadingSpinner fullScreen={false} />;
	}

	return (
		<Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100 }}>
			<Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
				Overview
			</Typography>
			<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
				Welcome back to your EcoTrack dashboard. Here&apos;s a quick look at your
				progress.
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
				{/* Summary stats card */}
				<Card sx={{ flex: 1, borderRadius: 4 }}>
					<CardContent>
						<Typography variant="h6" sx={{ mb: 2 }}>
							Summary
						</Typography>

						<Stack
							direction={{ xs: "column", sm: "row" }}
							spacing={3}
							sx={{ mb: 2 }}
						>
							<Box>
								<Typography
									variant="h5"
									sx={{ fontWeight: 600, color: "#166534" }}
								>
									{ecoPoints}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Eco points
								</Typography>
							</Box>

							<Box>
								<Typography variant="h5" sx={{ fontWeight: 600 }}>
									{totalSubmissions}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Submissions
								</Typography>
							</Box>

							<Box>
								<Typography variant="h5" sx={{ fontWeight: 600 }}>
									{pendingSubmissions}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Pending review
								</Typography>
							</Box>

							<Box>
								<Typography variant="h5" sx={{ fontWeight: 600 }}>
									{favoritesCount}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Saved missions
								</Typography>
							</Box>
						</Stack>

						<Divider sx={{ my: 2 }} />

						<Typography variant="body2" color="text.secondary">
							As you complete more missions and your submissions are approved,
							your eco points and impact will grow here. Later we can add charts
							and detailed CO₂ / water / waste breakdowns over time.
						</Typography>
					</CardContent>
				</Card>

				{/* Highlight last submission, if any */}
				<Card sx={{ flex: 1, borderRadius: 4 }}>
					<CardContent>
						<Typography variant="h6" sx={{ mb: 2 }}>
							Latest activity
						</Typography>

						{!lastSubmission ? (
							<Typography variant="body2" color="text.secondary">
								You haven&apos;t submitted any missions yet. Start with a mission
								from the Missions tab to see your activity here.
							</Typography>
						) : (
							<>
								<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
									Here&apos;s your most recent mission submission:
								</Typography>

								<Box sx={{ mb: 2 }}>
									<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
										{lastSubmission.missionId?.title ||
											lastSubmission.missionTitle ||
											"Mission"}
									</Typography>
									<Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
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

									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ mt: 0.5 }}
									>
										{submissions[0].createdAt
											? new Date(
												submissions[0].createdAt
											).toLocaleString()
											: "Unknown date"}
									</Typography>
								</Box>

								<Divider sx={{ my: 1.5 }} />

								<Typography variant="body2" color="text.secondary">
									You can see more details and your complete history in the{" "}
									<strong>Missions</strong> and <strong>Activity</strong> tabs.
								</Typography>
							</>
						)}
					</CardContent>
				</Card>
			</Stack>

			{/* Optional: mini recent submissions list under the cards */}
			<Card sx={{ borderRadius: 4 }}>
				<CardContent>
					<Typography variant="h6" sx={{ mb: 2 }}>
						Recent submissions
					</Typography>

					{submissions.length === 0 ? (
						<Typography variant="body2" color="text.secondary">
							No submissions yet.
						</Typography>
					) : (
						<List dense>
							{submissions.slice(0, 5).map((sub) => {
								const missionTitle =
									sub.missionId?.title || sub.missionTitle || "Mission";
								const createdAt = sub.createdAt
									? new Date(sub.createdAt).toLocaleString()
									: "Unknown date";

								return (
									<ListItem
										key={sub._id}
										sx={{ px: 0, alignItems: "flex-start" }}
									>
										<ListItemText
											primary={
												<Stack
													direction="row"
													spacing={1}
													alignItems="center"
												>
													<Typography
														variant="body1"
														sx={{ fontWeight: 500 }}
													>
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
												<Typography
													variant="body2"
													color="text.secondary"
												>
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
	);
}

export default DashboardHome;
