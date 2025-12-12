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
	ListItemButton,
	ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useUser } from "../../../app/providers/UserProvider.jsx";
import LoadingSpinner from "../../../components/common/LoadingSpinner.jsx";
import { getMySubmissions } from "../../../services/submissionsService.js";
import { useCommunity } from "../../../app/providers/CommunityProvider.jsx";


function statusChipProps(status) {
	switch (status) {
		case "approved":
			return { label: "Approved", color: "success", variant: "outlined" };
		case "rejected":
			return { label: "Rejected", color: "error", variant: "outlined" };
		case "pending":
		default:
			return { label: "Pending review", color: "default", variant: "outlined" };
	}
}

function DashboardActivity() {
	const { user } = useUser();
	const navigate = useNavigate();

	const [submissions, setSubmissions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const { communityData } = useCommunity();
	const myRank = communityData?.myRank?.byPoints;


	useEffect(() => {
		let cancelled = false;

		async function load() {
			try {
				setLoading(true);
				setError("");
				const data = await getMySubmissions();
				if (!cancelled) {
					setSubmissions(Array.isArray(data) ? data : []);
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

	// derived stats
	const ecoPoints = user?.points ?? 0;
	const missionsStarted = user?.missions?.length ?? 0;
	const favoritesCount = user?.favorites?.missions?.length ?? 0;
	const submissionsCount = submissions.length;

	if (loading) {
		return <LoadingSpinner fullScreen={false} />;
	}

	return (
		<Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1130 }}>
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
							<Box
								onClick={() => navigate("/dashboard/community")}
								sx={{
									cursor: "pointer",
									borderRadius: 2,
									px: 1.5,
									py: 0.5,
									"&:hover": { bgcolor: "action.hover" },
								}}
							>
								<Typography variant="h5" sx={{ fontWeight: 600 }}>
									{myRank?.rank ? `#${myRank.rank}` : "—"}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Community rank of {myRank?.totalUsers ?? "—"}
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
							<List dense sx={{ pt: 0 }}>
								{submissions.slice(0, 10).map((sub) => {
									const mission = sub.missionId || {};
									const missionTitle = mission.title || "Mission";
									const category = mission.category || "General";
									const createdAt = sub.createdAt
										? new Date(sub.createdAt).toLocaleString()
										: "Unknown date";

									const points =
										sub.pointsAwarded ?? mission.points ?? null;

									const chip = statusChipProps(sub.status);

									const handleClick = () => {
										if (mission._id) {
											navigate(`/dashboard/missions/${mission._id}`);
										}
									};

									return (
										<ListItemButton
											key={sub._id}
											onClick={handleClick}
											sx={{ px: 1, py: 0.5, borderRadius: 2 }}
										>
											<ListItemText
												primaryTypographyProps={{
													variant: "body2",
													sx: { display: "flex", justifyContent: "space-between" },
												}}
												primary={
													<>
														<span>
															{missionTitle}
															{"  "}
															<Chip
																label={category}
																size="small"
																sx={{ ml: 1, fontSize: 10 }}
															/>
														</span>
														<span style={{ display: "flex", gap: 8 }}>
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
															<Chip
																size="small"
																{...chip}
																sx={{ fontSize: 10, ml: 1 }}
															/>
														</span>
													</>
												}
												secondary={
													<Typography
														variant="body2"
														color="text.secondary"
														sx={{ mt: 0.3 }}
													>
														{createdAt}
													</Typography>
												}
											/>
										</ListItemButton>
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
