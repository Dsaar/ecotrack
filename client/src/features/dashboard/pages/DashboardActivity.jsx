// src/features/dashboard/pages/DashboardActivity.jsx
import { useEffect, useState } from "react";
import {
	Box,
	Card,
	CardContent,
	Chip,
	Divider,
	Stack,
	Typography,
	List,
	ListItem,
	ListItemText,
} from "@mui/material";
import { useUser } from "../../../app/providers/UserProvider.jsx";
import LoadingSpinner from "../../../components/common/LoadingSpinner.jsx";
import { getMySubmissions } from "../../../services/submissionsService.js";

function DashboardActivity() {
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
					// backend returns a plain array
					setSubmissions(Array.isArray(data) ? data : data.submissions || []);
				}
			} catch (err) {
				console.error("Failed to load submissions:", err);
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

	// simple derived stats
	const ecoPoints = user?.points ?? 0;
	const missionsStarted = user?.missions?.length ?? 0;
	const favoritesCount = user?.favorites?.missions?.length ?? 0;
	const submissionsCount = submissions.length;

	if (loading) {
		return <LoadingSpinner fullScreen={false} />;
	}

	return (
		<Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100 }}>
			<Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
				My missions & activity
			</Typography>
			<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
				See your missions, submissions and overall EcoTrack progress.
			</Typography>

			{error && (
				<Typography color="error" sx={{ mb: 2 }}>
					{error}
				</Typography>
			)}

			<Stack
				direction={{ xs: "column", lg: "row" }}
				spacing={3}
				alignItems="stretch"
			>
				{/* Left: summary stats */}
				<Card sx={{ flex: { xs: "unset", lg: 1 }, borderRadius: 4 }}>
					<CardContent>
						<Typography variant="h6" sx={{ mb: 2 }}>
							Summary
						</Typography>

						<Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
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
									{missionsStarted}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Missions started
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

							<Box>
								<Typography variant="h5" sx={{ fontWeight: 600 }}>
									{submissionsCount}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Submissions
								</Typography>
							</Box>
						</Stack>

						<Divider sx={{ my: 2 }} />

						<Typography variant="body2" color="text.secondary">
							As you complete more missions, you&apos;ll see your activity and
							impact grow here. Later we can add charts and detailed impact
							breakdowns (CO₂, water and waste) over time.
						</Typography>
					</CardContent>
				</Card>

				{/* Right: recent submissions list */}
				<Card sx={{ flex: { xs: "unset", lg: 1.4 }, borderRadius: 4 }}>
					<CardContent>
						<Typography variant="h6" sx={{ mb: 2 }}>
							Recent submissions
						</Typography>

						{submissions.length === 0 ? (
							<Typography variant="body2" color="text.secondary">
								You haven&apos;t submitted any missions yet. Complete a mission
								from the Missions tab to see your history here.
							</Typography>
						) : (
							<List dense>
								{submissions.slice(0, 10).map((sub) => {
									const mission = sub.missionId || sub.mission; // 👈 backend uses missionId
									const missionTitle =
										mission?.title || sub.missionTitle || "Mission";
									const category = mission?.category || sub.category || "General";
									const createdAt = sub.createdAt
										? new Date(sub.createdAt).toLocaleString()
										: "Unknown date";

									// you might add pointsAwarded to submissions later
									const points =
										sub.pointsAwarded ?? sub.points ?? mission?.points ?? null;

									return (
										<ListItem
											key={sub._id}
											sx={{
												px: 0,
												alignItems: "flex-start",
											}}
										>
											<ListItemText
												primary={
													<Stack direction="row" spacing={1} alignItems="center">
														<Typography
															variant="body1"
															sx={{ fontWeight: 500 }}
														>
															{missionTitle}
														</Typography>
														<Chip
															label={category}
															size="small"
															sx={{ fontSize: 10 }}
														/>
														{points != null && (
															<Chip
																label={`+${points} pts`}
																size="small"
																sx={{
																	fontSize: 10,
																	bgcolor: "#ecfdf3",
																	color: "#166534",
																}}
															/>
														)}
														{sub.status && (
															<Chip
																label={sub.status}
																size="small"
																sx={{ fontSize: 10 }}
															/>
														)}
													</Stack>
												}
												secondary={
													<>
														<Typography
															variant="body2"
															color="text.secondary"
														>
															{createdAt}
														</Typography>
														{sub.note && (
															<Typography
																variant="body2"
																color="text.secondary"
																sx={{ mt: 0.5 }}
															>
																{sub.note}
															</Typography>
														)}
													</>
												}
											/>
										</ListItem>
									);
								})}
							</List>
						)}
					</CardContent>
				</Card>
			</Stack>
		</Box>
	);
}

export default DashboardActivity;
